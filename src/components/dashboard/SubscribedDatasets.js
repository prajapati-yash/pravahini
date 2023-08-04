import React from "react";
import { useState } from "react";
import "../../styles/dashboard/SubscribedDatasets.css";
import img from "../../assets/home/security.png";

const blocks = [
  {
    title: "Dataset1",
    description: "Description of dataset 1 involves analysing quality data",
  },
  {
    title: "Dataset2",
    description: "Description of dataset 1 involves analysing quality data",
  },
  {
    title: "Dataset3",
    description: "Description of dataset 1 involves analysing quality data",
  },
  {
    title: "Dataset4",
    description: "Description of dataset 1 involves analysing quality data",
  },
  {
    title: "Dataset5",
    description: "Description of dataset 1 involves analysing quality data",
  },
  {
    title: "Dataset6",
    description: "Description of dataset 1 involves analysing quality data",
  },
];

function SubscribedDatasets() {
  //   const [img, setImg] = useState();
  const [userName, setUserName] = useState();
  const [occupation, setOccupation] = useState();

  return (
    <div className="row mt-4 subscribed-dataset-main py-3 px-sm-3 container-fluid justify-content-around ">
      {blocks.map((item, key) => (
        <div
          className="col-xxl-3 col-md-5 col-sm-7 col-11 mx-1 mb-5 subscribed-dataset-component"
          index={key}
        >
          <div className="subscribed-dataset-img-div">
            <img src={img} className="subscribed-dataset-img"></img>
          </div>
          <div className="subscribed-dataset-details">
            <div className="subscribed-dataset-title">{item.title}</div>
            <div className="subscribed-dataset-desc">{item.description}</div>
            <div className="subscribed-dataset-badge">Free</div>
            <div className="subscribed-dataset-btn">View More &gt;</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SubscribedDatasets;
