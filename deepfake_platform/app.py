from flask import Flask, request, jsonify, send_from_directory
from flask_pymongo import PyMongo
from flask_cors import CORS


from deepfake_detection import image_detector


app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

# MongoDB configuration
app.config["MONGO_URI"] = "mongodb://localhost:27017/Hackathon"
mongo = PyMongo(app)


@app.route('/api/upload', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        return jsonify({"error": "No Image file provided"}), 400

    image_file = request.files['image']
    if image_file.filename == '':
        return jsonify({"error": "No Image file selected"}), 400

    title = request.form.get('title', 'Untitled')
    description = request.form.get('description', 'Untitled')

    # Save the Image to a file system or cloud and store only the reference in MongoDB
    image_path = f"static/images/{image_file.filename}"  # Update this path as needed
    image_file.save(image_path)

    # Call the deepfake detection function
    # is_deepfake = deepfake_detect.detect(image_path)

    # Save Image reference to MongoDB
    images = mongo.db.images
    image_data = {
        "title": title,
        "description": description,
        "path": image_path
    }
    image_id = images.insert_one(image_data).inserted_id

    return jsonify(str(image_id))


@app.route('/api/images', methods=['GET'])
def get_images():
    try:
        images = mongo.db.images.find()
        image_list = []
        for image in images:
            image['_id'] = str(image['_id'])  # Convert ObjectId to string
            image_list.append(image)
        return jsonify(image_list)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/static/images/<filename>')
def serve_images(filename):
    return send_from_directory('static/images', filename)


@app.route('/classify', methods=['POST'])
def classify():
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided."}), 400

    image = request.files['image']
    image = image_detector.refine_image(image)
    result = image_detector.classify_image(image)

    return jsonify({"result": result})


if __name__ == '__main__':
    app.run(debug=True)
