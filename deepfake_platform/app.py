from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os 

from server import interactor as db

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

def get_deepfake_result(file_path):
    # is_deepfake = deepfake_detect.detect(file_path)
    return False


@app.route('/api/upload', methods=['POST'])
def upload_image():
    # both of them are image
    if 'image' not in request.files:
        return jsonify({"error": "No Image file provided"}), 400
    
    file = request.files["image"]
    if request.files['image'].filename == '':
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

if __name__ == '__main__':
    app.run(debug=True)