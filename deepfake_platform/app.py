import requests
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
from dotenv import load_dotenv
from deepfake_detection.azimuthal import azimuthalAverage

from server import interactor as db
from deepfake_detection import image_detector
import ipfshttpclient

import numpy as np
import cv2

load_dotenv()

allowed_origins = os.environ.get("ALLOWED_ORIGINS", "").split(",")

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": allowed_origins}})


def get_deepfake_result(file_path):
    return False
    # img = image_detector.read_image(file_path)
    # is_deepfake = image_detector.classify_image(img)
    # return is_deepfake


@app.route('/upload-to-ipfs', methods=['POST'])
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
        result = client.add(file.read())
        image_data = {
            "ipfs_hash": result['Hash'],
            "is_deepfaked": "true",
            "title": title
        }
        image_id = db.insert(image_data).inserted_id
        return jsonify(str(image_id))

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/upload', methods=['POST'])
def upload_image():
    # name = image
    data_key = "image"
    if data_key not in request.files:
        return jsonify({"error": "No Image file provided"}), 400

    file = request.files[data_key]
    if request.files[data_key].filename == '':
        return jsonify({"error": "No Image file selected"}), 400

    mimetype = file.mimetype.split("/")[0]
    if not mimetype in ["image", "video"]:
        return jsonify({"error": "No Image file selected"}), 400

    # save on local storage
    rel_path = db.get_relative_path(file.filename)
    file_path = os.path.join(db.get_store_path(), rel_path)
    file.save(file_path)

    # assign data info
    title = request.form.get('title', 'Untitled')
    description = request.form.get('description', 'Untitled')

    # Call the deepfake detection function
    is_deepfake = get_deepfake_result(file_path)

    # Save Image reference to MongoDB
    image_data = {
        "title": title,
        "description": description,
        "path": os.path.join(db.ARTICLE_PATH, rel_path),
        "image_or_video": mimetype,
        "is_deepfake": is_deepfake
    }
    image_id = db.insert(image_data).inserted_id

    return jsonify(str(image_id))


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


@app.route(f'/classify/<ipfshash>', methods=['POST'])
def classify(ipfshash):
    image_data = get_image_from_ipfs(ipfshash)

    if not image_data:
        return jsonify({"error": "Failed to fetch image from IPFS."}), 400

    encoded_img = np.fromstring(image_data, dtype=np.uint8)
    img = cv2.imdecode(encoded_img, cv2.IMREAD_COLOR)
    img_gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    refined_image = image_detector.refine_image(img_gray)
    
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
