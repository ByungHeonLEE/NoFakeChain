import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ImageGallery.css';  // For additional styling if needed

function ImageGallery() {
    const [images, setImages] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get('http://127.0.0.1:5000/api/images');
                setImages(response.data);
            } catch (error) {
                console.error("Error fetching images:", error);
            }
        }
        fetchData();
    }, []);

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Image Gallery</h2>
            <div className="row">
                {images.map(image => (
                    <div key={image._id} className="col-md-4 mb-4">
                        <div className="card">
                            <img src={image.url} alt={image.title} className="card-img-top" />
                            <div className="card-body">
                                <h5 className="card-title">{image.title}</h5>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ImageGallery;
