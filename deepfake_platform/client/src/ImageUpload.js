import React, { useState } from 'react';
import axios from 'axios';

function ImageUpload() {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');

    const onFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const onUpload = async () => {
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await axios.post('http://127.0.0.1:5000/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Image uploaded:', response.data);
            setMessage('Image uploaded successfully!');
        } catch (error) {
            setMessage('Error uploading Image. Please try again.');
            if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log("Error", error.message)
            }
            console.error('Error uploading Image:', error);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <div className="card">
                        <div className="card-header">
                            <h5>Upload Image</h5>
                        </div>
                        <div className="card-body">
                            {message && <div className="alert alert-info">{message}</div>}
                            <div className="mb-3">
                                <label className="form-label">Select Image</label>
                                <input type="file" accept="image/*" className="form-control" onChange={onFileChange} />
                            </div>
                            <button className="btn btn-primary" onClick={onUpload}>Upload</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ImageUpload;
