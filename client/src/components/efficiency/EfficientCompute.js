import React, { useState } from "react";
import hero from "../../assets/computation/efficient2.png";
import add from "../../assets/computation/add.png";
import "../../styles/efficiency/EfficientCompute.css";

function EfficientCompute() {
  const [urls, setUrls] = useState([]);
  const [currentUrl, setCurrentUrl] = useState("");

  const handleDatasetUrlChange = (event) => {
    setCurrentUrl(event.target.value);
  };

  const handleAddUrl = () => {
    if (currentUrl.trim() !== "") {
      setUrls([...urls, currentUrl]);
      setCurrentUrl("");
    }
  };

  const handleRemoveUrl = (index) => {
    const newUrls = urls.filter((_, i) => i !== index);
    setUrls(newUrls);
  };

  return (
    <div>
      <div className="pt-4 efficient-compute-container">
        <div>
          <img src={hero} className="efficient-compute-img" />
        </div>
        <div className="py-3 efficient-compute-details">
          <div className="py-3 d-flex efficient-compute-head">
            Compute Your Model
          </div>
          <div className="efficient-compute-data">
            <div className="py-2">
              <div className="d-flex efficient-compute-dataset-text">
                Enter Dataset URL
              </div>
              <div className="d-flex align-items-center">
                <div className="py-2">
                  <input
                    type="text"
                    className="efficient-compute-dataset-input"
                    placeholder="Enter Dataset URL"
                    onChange={handleDatasetUrlChange}
                  />
                </div>
                <div className="d-flex">
                  <img
                    className="efficient-compute-dataset-img"
                    src={add}
                    onClick={handleAddUrl}
                  />
                </div>
              </div>
              <div>
                {urls.map((url, index) => (
                  <div
                    key={index}
                    className="d-flex align-items-center mb-2 bg-white efficient-display-url-container"
                  >
                    <div className="flex-grow-1 efficient-display-urls">{url}</div>
                    <button
                      className="btn btn-danger efficient-display-urls-btn"
                      onClick={() => handleRemoveUrl(index)}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="py-2">
              <div className="d-flex efficient-compute-model-text">
                Enter Model URL
              </div>
              <div className="d-xl-flex align-items-center">
                <div className="py-2">
                  <input
                    type="text"
                    className="efficient-compute-model-input"
                    placeholder="Enter Model URL"
                  />
                </div>
                <div>
                  <button className="rounded-pill efficient-compute-model-btn">
                    Compute
                  </button>
                </div>
              </div>
            </div>

            <div className="py-2">
              <div className="efficient-compute-job-id">Job id:</div>
            </div>

            <div className="d-flex py-2 align-items-center">
              <div className="efficient-compute-cid">cid:</div>
              <div className="px-3">
                <button className="rounded-pill efficient-compute-cid-btn">
                  Get cid
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EfficientCompute;
