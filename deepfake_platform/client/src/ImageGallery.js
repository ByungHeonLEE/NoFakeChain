import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ImageGallery.css"; // For additional styling if needed

function ImageGallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fullHeightStyle = {
    display: "flex",
    flexDirection: "column",
    minHeight: "70vh",
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("http://127.0.0.1:5000/api/images");
        setImages(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div>Loading....</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={fullHeightStyle}>
      <div className="container mt-5">
        <h2 className="mb-4">Image Gallery</h2>
        <div className="row">
          {images.map((image) => (
            <div key={image._id} className="col-md-4 mb-4">
              <div className="card">
                <img
                  src={`http://127.0.0.1:5000/${image.path}`}
                  alt={image.title}
                  className="card-img-top"
                />
                <div>The path is: {image.path}</div>
                <div className="card-body">
                  <h5 className="card-title">{image.title}</h5>
                  <p className="card-text">{image.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ImageGallery;
