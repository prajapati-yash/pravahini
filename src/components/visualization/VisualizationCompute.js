import React from "react";
import "../../styles/visualization/VisualizationCompute.css";
import hero from "../../assets/computation/visualization2.png";
import add from "../../assets/computation/add.png";

function VisualizationCompute() {
  return (
    <div>
      <div className="py-4 visualization-compute-container">
        <div>
          <img src={hero} className="visualization-compute-img" />
        </div>
        <div className="py-3 visualization-compute-details">
          <div className="py-3 d-flex visualization-compute-head">
            Compute Your Model
          </div>
          <div className="visualization-compute-data">
            <div className="py-2">
              <div className="d-flex visualization-compute-dataset-text">
                Enter Dataset URL
              </div>
              <div className="d-flex align-items-center">
                <div className="py-2">
                  <input
                    type="text"
                    className="visualization-compute-dataset-input"
                    placeholder="Enter Dataset URL"
                  />
                </div>
                <div className="d-flex">
                  <img
                    className="visualization-compute-dataset-img"
                    src={add}
                  />
                </div>
              </div>
            </div>

            <div className="py-2">
              <div className="d-flex visualization-compute-model-text">
                Enter Model URL
              </div>
              <div className="d-xl-flex align-items-center">
                <div className="py-2">
                  <input
                    type="text"
                    className="visualization-compute-model-input"
                    placeholder="Enter Model URL"
                  />
                </div>
                <div>
                  <button className="rounded-pill visualization-compute-model-btn">
                    Compute
                  </button>
                </div>
              </div>
            </div>

            <div className="py-2">
              <div className="visualization-compute-job-id">Job id:</div>
            </div>

            <div className="d-flex py-2 align-items-center">
              <div className="visualization-compute-cid">cid:</div>
              <div className="px-3">
                <button className="rounded-pill visualization-compute-cid-btn">
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

export default VisualizationCompute;
