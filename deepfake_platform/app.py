import requests
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
from dotenv import load_dotenv
from deepfake_detection.azimuthal import azimuthalAverage

from server import interactor as db
from deepfake_detection import image_detector
import ipfshttpclient

load_dotenv()

allowed_origins = os.environ.get("ALLOWED_ORIGINS", "").split(",")

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": allowed_origins}})

@app.route('/api/upload-to-ipfs', methods=['POST'])
def upload_to_ipfs():
    file = request.files.get('file')
    if not file:
        return jsonify({"error": "No file provided"}), 400

    title = request.form.get('title', 'Untitled')

    client = ipfshttpclient.connect(
        '/dns/ipfs.infura.io/tcp/5001/https',
        auth=(os.environ.get("INFURA_ID"), os.environ.get("INFURA_SECRET_KEY"))
    )
    
    try:
        rel_path = db.get_relative_path(file.filename)
        file_path = os.path.join(db.get_store_path(), rel_path)
        custom_path = os.path.join("data/articles/"+ rel_path)
        file.save(file_path)
        result = client.add(custom_path)
        print(result)
        image_data = {
            "ipfs_hash": result['Hash'],
            "is_deepfaked": "true",
            "title": title
        }
        print(image_data)
        image_id = db.insert(image_data).inserted_id
        print(image_id)
        return jsonify(str(image_id))
    
    except Exception as e:
        print (e)
        return jsonify({"error": str(e)}), 500


@app.route('/api/images', methods=['GET'])
def get_images():
    try:
        images = db.get()
        image_list = []
        for image in images:
            image['_id'] = str(image['_id'])  # Convert ObjectId to string
            image_list.append(image)
        return jsonify(image_list)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route(f'/{db.ARTICLE_PATH}/<filename>')
def serve_images(filename):
    return send_from_directory(db.get_store_path(), filename)


@app.route(f'/api/classify/<ipfshash>', methods=['POST'])
def classify(ipfshash):
    image_data = get_image_from_ipfs(ipfshash)

    if not image_data:
        return jsonify({"error": "Failed to fetch image from IPFS."}), 400

    refined_image = image_detector.refine_image(image_data)
    result = image_detector.classify_image(refined_image)
    query = {"ipfs_hash": ipfshash}
    update = {
        "$set": {
            "is_deepfaked": str(result)
        }
    }

    db_result = db.update(query, update)

    return jsonify({"result": result})


def get_image_from_ipfs(hash):
    """Fetch image from IPFS given its hash."""
    IPFS_GATEWAY = "https://ipfs.io/ipfs/"

    try:
        response = requests.get(IPFS_GATEWAY + hash, timeout=10)
        response.raise_for_status()
        return response.content
    except requests.RequestException:
        return None


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
