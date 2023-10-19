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

    client = ipfshttpclient.connect(
        '/dns/ipfs.infura.io/tcp/5001/https',
        auth=(os.environ.get("INFURA_ID"), os.environ.get("INFURA_SECRET_KEY"))
    )
    
    try:
        result = client.add(file.read())
        image_id = db.insert(result['Hash']).inserted_id
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
    if not mimetype in ["image","video"]:
        return jsonify({"error": "No Image file selected"}), 400

    # save on local storage
    rel_path = db.get_relative_path(file.filename)
    file_path = os.path.join(db.get_store_path(),rel_path)
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
        "path": os.path.join(db.ARTICLE_PATH,rel_path),
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


@app.route('/classify', methods=['POST'])
def classify():
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided."}), 400

    image = request.files['image']
    image = image_detector.refine_image(image)
    result = image_detector.classify_image(image)

    return jsonify({"result": result})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
