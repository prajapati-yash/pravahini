import React from "react";
import "../../styles/computation/ComputationAbout.css";

const introduction = [
  {
    head: "Experience Decentralized Computing",
    desc: "Welcome to our platform, where you can harness the power of decentralized computing for your ML model computations.",
  },
  {
    head: "No Worries about Low Laptop Configuration",
    desc: "Don't let low laptop configurations hinder your progress. With our platform, you can run and train your ML models without the need for high-end hardware.",
  },
  {
    head: "Handling Huge Datasets and Models",
    desc: "Bid farewell to concerns about running huge datasets and complex ML models. Our platform can handle the computational demands, allowing you to focus on your work.",
  },
  {
    head: "Easy Execution Process",
    desc: "It's as simple as providing the dataset URLs and model URL, and clicking the execute button. Once initiated, you can close the tab and attend to other tasks while your execution progresses.",
  },
  {
    head: "Check Execution Status",
    desc: "After some time, you can return to the platform and conveniently check the status of your execution. No need to constantly monitor the process or stay tied to your computer.",
  },
  {
    head: "Embrace Decentralized Computation",
    desc: "Our platform empowers you to embrace the benefits of decentralized computation, enabling efficient and flexible ML model computations.",
  },
  {
    head: "Let's Get Started",
    desc: "Take the first step towards unlocking the potential of decentralized computing.",
  },
];

function ComputationAbout() {
  return (
    <div className="container-fluid">
      <div className="d-md-flex pt-2 computation-about-title">
        Decentralized Computation of ML Model
      </div>
      <div className="py-4">
        <div className="px-0 mt-4 px-sm-3">
          {introduction.map((item, key) => (
            <div className="mx-1 mb-2 computation-about-component" index={key}>
              <div className="computation-about-details">
                <div className="computation-about-head">{item.head}</div>
                <hr />
                <div className="computation-about-desc">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ComputationAbout;
