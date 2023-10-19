import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Buffer } from "buffer";
global.Buffer = Buffer;

function ImageUpload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [showDeepfakeModal, setShowDeepfakeModal] = useState(false);
  const [deepfakeResult, setDeepfakeResult] = useState(null);

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const onUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://3.141.243.153:5000/upload-to-ipfs", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.ipfs_hash) {
        console.log("Successfully uploaded to IPFS: ", data.ipfs_hash);
        return data.ipfs_hash;
      }

      // Show the deepfake detection modal with spinner
      setShowDeepfakeModal(true);

      //simulate deepfake detection
      setTimeout(() => {
        setDeepfakeResult("detected");
        setShowDeepfakeModal(false);
      }, 2000);
    } catch (error) {
      setMessage("Error uploading Image. Please try again.");
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log("Error", error.message);
      }
      console.error("Error uploading Image:", error);
    }
  };

  const fullHeightStyle = {
    display: "flex",
    flexDirection: "column",
    minHeight: "70vh",
  };

  return (
    <div style={fullHeightStyle}>
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
                  <input
                    type="file"
                    accept="image/*, video/*"
                    className="form-control"
                    onChange={onFileChange}
                  />
                </div>
                <button className="btn btn-primary" onClick={onUpload}>
                  Upload
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className={showDeepfakeModal ? "modal d-block" : "modal"}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Deepfake Detection</h5>
              </div>
              <div className="modal-body">
                {true ? (
                  <div className="d-flex justify-content-center">
                    <div className="spinner-border" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                ) : deepfakeResult !== null ? (
                  deepfakeResult ? (
                    <div className="alert alert-danger">
                      Deepfake detected!{" "}
                      <span className="badge badge-danger">X</span>
                    </div>
                  ) : (
                    <div className="alert alert-success">
                      No deepfake detected.{" "}
                      <span className="badge badge-success">O</span>
                    </div>
                  )
                ) : null}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowDeepfakeModal(false)}
                >
                  Close
                </button>
                {deepfakeResult === null && (
                  <button type="button" className="btn btn-primary">
                    Integrate with Blockchain
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImageUpload;
