import React from "react";
import { useState } from "react";
import "../../styles/dashboard/SubscribedModels.css";
import img from "../../assets/home/security.png";

const blocks = [
  {
    title: "Model 1",
    description: "Description of model 1 involves analysing quality data",
  },
  {
    title: "Model 2",
    description: "Description of model 1 involves analysing quality data",
  },
  {
    title: "Model 3",
    description: "Description of model 1 involves analysing quality data",
  },
  {
    title: "Model 4",
    description: "Description of model 1 involves analysing quality data",
  },
  {
    title: "Model 5",
    description: "Description of model 1 involves analysing quality data",
  },
  {
    title: "Model 6",
    description: "Description of model 1 involves analysing quality data",
  },
];

function SubscribedModels() {
  return (
    <div className="row mt-4 py-3 px-3 container-fluid  justify-content-around ">
      {blocks.map((item, key) => (
        <div
          className="col-xl-3 col-lg-5 col-sm-5  mx-1  mb-4 subscribed-model-component"
          index={key}
        >
          <div className="subscribed-model-details">
            <div className="subscribed-model-title">{item.title}</div>
            <div className="subscribed-model-desc">{item.description}</div>
            <div className="subscribed-model-badge">Free</div>
            <div className="subscribed-model-btn">View More &gt;</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SubscribedModels;
