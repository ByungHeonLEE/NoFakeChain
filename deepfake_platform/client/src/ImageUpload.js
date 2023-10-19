import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Buffer } from "buffer";
import { create } from "ipfs-http-client";

global.Buffer = Buffer;
const INFURA_ID2 = "2WxW0dRw04VEBl4LtJ4cxd1Xarm";
const INFURA_SECRET_KEY2 = "7cf9fd2e17a3c657a8cd153af371a724";

const projectId = process.env.REACT_APP_INFURA_ID;
const projectSecret = process.env.REACT_APP_INFURA_SECRET_KEY;
const auth =
  "Basic " + Buffer.from(`${projectId}:${projectSecret}`).toString("base64");

const client = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
});

function ImageUpload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [showDeepfakeModal, setShowDeepfakeModal] = useState(false);
  const [deepfakeResult, setDeepfakeResult] = useState(null);

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadToIPFS = async (file) => {
    try {
      const added = await client.add(file);
      console.log("Successfully uploaded to IPFS: ", added);
      return added.path;
    } catch (error) {
      console.error("Error uploading to IPFS: ", error);
      return null;
    }
  };
  const onUpload = async () => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/api/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Image uploaded:", response.data);
      setMessage("Image uploaded successfully!");

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
    const ipfsHash = await uploadToIPFS(file);
    if (ipfsHash) {
      setMessage(`Image uploaded successfully! IPFS Hash: ${ipfsHash}`);
    } else {
      setMessage(`Image uploaded, but failed to upload to IPFS: `);
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
