import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

function ImageUpload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [showDeepfakeModal, setShowDeepfakeModal] = useState(false);
  const [deepfakeResult, setDeepfakeResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const onUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        "http://3.141.243.153:5000/api/upload-to-ipfs",
        {
          method: "POST",
          body: formData,
        }
      );
      console.log("Image uploaded successfuly to IPFS", response["ipfs_hash"]);
      setMessage("Image uploaded successfuly", response["ipfs_hash"]);

      // Show the deepfake detection modal with spinner
      setShowDeepfakeModal(true);
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

  const chainlinkFunctions = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:4500/execute", {
        method: "POST",
      });
      console.log(response.data);
      setIsLoading(false);
      alert("API is executing!"); // You can replace this with a more user-friendly notification, e.g. a toast
      setMessage("Chainlink Functions implemented successfully", response.data);
      setTimeout(() => {
        setShowDeepfakeModal(false);
      }, 10000);
    } catch (error) {
      console.error("Error: ", error);
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
                      <span className="sr-only"></span>
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
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={chainlinkFunctions}
                  >
                    {isLoading ? "Executing..." : "Integrate with Blockchain"}
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
