import React from "react";
import "../../styles/visualization/VisualizationAbout.css";

function VisualizationAbout() {
  return (
    <div className="py-4 px-4">
      <div className="py-3 visualization-about-heading-container">
        <div className="px-md-5 px-sm-4 px-3 py-1 d-flex visualization-about-head">
          Advanced Visualization and Computation
        </div>
        <div className="px-md-5 px-sm-4 px-3 py-1 d-flex visualization-about-subhead">
          Advanced Visualization and Computation empowers you to create
          insightful and engaging visual representations of your data and model
          outputs. Whether you need to plot graphs, generate heatmaps, or
          visualize complex relationships, it has you covered. By utilizing it,
          you can seamlessly leverage the capabilities of (Numpy, Scipy,
          Scikit-learn, Theano, TensorFlow, Keras, PyTorch, Pandas, Matplotlib)
          these libraries to enhance your understanding of your machine learning
          models. Simply ensure that your model includes the above-mentioned
          libraries, and it will handle the rest. It eliminates the need for
          high-end laptop or computer configurations, enabling you to work with
          large datasets and complex visualization computations effortlessly.
        </div>
      </div>
      <div className="px-1 py-4 visualization-about-instruction-container">
        <div>
          <div className="visualization-instruction-heading">
            Instructions to Compute your Model are as follow
          </div>
          <div className="py-4">
            <div
              className="my-3 accordion accordion-box-border"
              id="accordionExample"
            >
              <div className="accordion-item mb-3 accordion-box-border">
                <h2 className="accordion-header" id="headingOne">
                  <button
                    className="accordion-button collapsed btn rounded-pill shadow-none"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseOne"
                    aria-expanded="true"
                    aria-controls="collapseOne"
                  >
                    1. Dataset URLs
                  </button>
                </h2>
                <div
                  id="collapseOne"
                  className="accordion-collapse collapse"
                  aria-labelledby="headingOne"
                  data-bs-parent="#accordionExample"
                >
                  <div className="accordion-body">
                    <li className="accordion-list-item">
                      Ensure that your dataset URLs are in the raw GitHub URL
                      format.
                    </li>
                    <li className="accordion-list-item">
                      The datasets should be publicly accessible on GitHub.
                    </li>
                    <li className="accordion-list-item">
                      The datasets must be in CSV file format.
                    </li>
                    <li className="accordion-list-item">
                      To add multiple datasets, click on the "Add" button and
                      provide the additional URLs.
                    </li>
                    <div className="accordian-div">
                      <p className="accordion-list-item">
                        Example Dataset URLs:
                      </p>
                      <div className="visualization-url-container">
                        <li className="visualization-url-text pb-1 accordion-list-item">
                          https://raw.githubusercontent.com/username/repo/master/dataset1.csv
                        </li>
                        <li className="visualization-url-text pt-2 pb-1 accordion-list-item">
                          https://raw.githubusercontent.com/username/repo/master/dataset2.csv
                        </li>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="accordion-item mb-3 accordion-box-border">
                <h2 className="accordion-header" id="headingTwo">
                  <button
                    className="accordion-button collapsed btn rounded-pill shadow-none"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseTwo"
                    aria-expanded="false"
                    aria-controls="collapseTwo"
                  >
                    2. Model URL
                  </button>
                </h2>
                <div
                  id="collapseTwo"
                  className="accordion-collapse collapse"
                  aria-labelledby="headingTwo"
                  data-bs-parent="#accordionExample"
                >
                  <div className="accordion-body">
                    <li className="accordion-list-item">
                      The model URL should also be in the raw GitHub URL format.
                    </li>
                    <li className="accordion-list-item">
                      The model repository must be public.
                    </li>
                    <li className="accordion-list-item">
                      Provide the URL of the main model file.
                    </li>
                    <div className="accordian-div">
                      <p className="accordion-list-item">Example Model URL:</p>
                      <div className="visualization-url-container">
                      <li className="visualization-url-text pb-1 accordion-list-item">
                        https://raw.githubusercontent.com/username/repo/master/model.ipynb
                      </li>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="accordion-item mb-3 accordion-box-border">
                <h2 className="accordion-header" id="headingThree">
                  <button
                    className="accordion-button collapsed btn rounded-pill shadow-none"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseThree"
                    aria-expanded="false"
                    aria-controls="collapseThree"
                  >
                    3. Model Implementation
                  </button>
                </h2>
                <div
                  id="collapseThree"
                  className="accordion-collapse collapse"
                  aria-labelledby="headingThree"
                  data-bs-parent="#accordionExample"
                >
                  <div className="accordion-body">
                    <li className="accordion-list-item">
                      Inside your model implementation, make sure to give the
                      file paths of the datasets as follows:
                    </li>
                    <div className="visualization-url-container accordian-div">
                      <li className="visualization-url-text pb-1 accordion-list-item">
                        abc = pd.read_csv("/inputs/abc.csv")
                      </li>
                      <li className="visualization-url-text pt-2 pb-1 accordion-list-item">
                        xyz = pd.read_csv("/inputs/xyz.csv")
                      </li>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VisualizationAbout;
