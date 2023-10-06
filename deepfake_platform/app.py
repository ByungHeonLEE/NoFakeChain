from flask import Flask, render_template, request, redirect, url_for
from werkzeug.utils import secure_filename
import os

# Importing our custom modules
# from deepfake_detection import is_deepfake
# from blockchain_integration import upload_to_ipfs, create_nft
from deepfake_detection.detector import is_deepfake

app = Flask(__name__)
UPLOAD_FOLDER = 'static/uploads'
ALLOWED_EXTENSIONS = {'mp4', 'avi', 'mov', 'flv', 'mkv'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def index():
    return render_template('upload.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return redirect(request.url)
    file = request.files['file']
    if file.filename == '':
        return redirect(request.url)
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        
        # Check if video is a deepfake
        if is_deepfake(file_path):
            ipfs_hash = upload_to_ipfs(file_path)
            nft_id = create_nft(ipfs_hash)
            return f"Video is a deepfake! NFT created with ID: {nft_id}"
        else:
            return "Video is genuine!"

    return redirect(url_for('index'))

@app.route('/view/<video_id>')
def view_video(video_id):
    # Fetch video details from database or blockchain using video_id
    video_url = get_video_url(video_id)
    video_status = get_video_status(video_id)  # Returns 'Genuine' or 'Deepfake'
    return render_template('view_video.html', video_url=video_url, video_status=video_status)

if __name__ == '__main__':
    app.run(debug=True)
