import React from "react";
import "../../styles/computation/ComputationDetails.css";
import efficient from "../../assets/computation/efficient1.png";
import advanced from "../../assets/computation/visualization1.png";
import { useNavigate } from "react-router-dom";

function ComputationDetails() {
  const navigate = useNavigate();
  return (
    <div className="container-fluid">
      <div className="d-flex py-3 computation-details-title">
        Introducing our two powerful containers tailored to your specific needs:
      </div>
      <div className="d-flex flex-md-row flex-column py-4 px-md-0 px-sm-4 justify-content-around">
        <div className="col-md-5 mb-3 computation-details-container1">
          <div className="py-3 px-3 computation-details-container1-head">
            Efficient Computing
          </div>
          <div className="py-3 computation-details-container1-content">
            <div className="py-2">
              <img className="computation-details-img1" src={efficient} />
            </div>
            <div className="pb-md-5">
              <div className="py-2 px-3 computation-efficient-lib">
                <div className="computation-details-lib">Libraries: </div>
                <div className="computation-details-lib-text">
                  Numpy, Pandas, Scikit-learn, Matplotlib, Seaborn
                </div>
              </div>
              <div className="py-2 px-3 computation-efficient-purpose">
                <div className="computation-details-purpose">Purpose: </div>
                <div className="computation-details-purpose-text">
                  Designed for general-purpose computing tasks, this container
                  is equipped with essential libraries for data manipulation,
                  machine learning, and visualization.
                </div>
              </div>
            </div>
            <div className="py-2">
              <button
                className="py-2 px-4 btn rounded-pill computation-details-btn1"
                onClick={() => navigate("/de-computation/efficient-computing")}
              >
                Use Now
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-5 mb-3  computation-details-container2">
          <div className="py-3 px-3 computation-details-container2-head">
            Advanced Visualization and Computation
          </div>
          <div className="py-3 computation-details-container2-content">
            <div className="py-2">
              <img className="computation-details-img2" src={advanced} />
            </div>
            <div className="pb-md-5">
              <div className="py-2 px-3 computation-visual-lib">
                <div className="computation-details-lib">Libraries: </div>
                <div className="computation-details-lib-text">
                  Numpy, Scipy, Scikit-learn, Theano, TensorFlow, Keras,
                  PyTorch, Pandas, Matplotlib, Seaborn, Plotly
                </div>
              </div>
              <div className="py-2 px-3 computation-visual-purpose">
                <div className="computation-details-purpose">Purpose: </div>
                <div className="computation-details-purpose-text">
                  Tailored for demanding computation and advanced visualization,
                  this container houses a comprehensive suite of libraries,
                  enabling you to tackle complex ML models and generate visually
                  compelling outputs
                </div>
              </div>
            </div>
            <div className="py-2 mt-auto">
              <button
                className="py-2 px-4 btn rounded-pill computation-details-btn2"
                onClick={() =>
                  navigate("/de-computation/advanced-visualization-computing")
                }
              >
                Use Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ComputationDetails;
