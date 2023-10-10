from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS

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

    # Save the Image directly in MongoDB
    images = mongo.db.images
    image_data = {"content": image_file.read()}
    image_id = images.insert_one(image_data).inserted_id

    # # Save the Video to a file system or cloud and store only the reference in MongoDB
    # video_path = f"videos/{video_file.filename}"  # Update this path as needed
    # video_file.save(video_path)

    # # Save video reference to MongoDB
    # videos = mongo.db.videos
    # video_data = {"path": video_path}
    # video_id = videos.insert_one(video_data).inserted_id
    
    return jsonify(str(image_id))

if __name__ == '__main__':
    app.run(debug=True)