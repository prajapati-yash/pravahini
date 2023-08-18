import React from "react";
import { useState } from "react";
import "../../styles/dashboard/UserDatasets.css";
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

function UserDatasets() {
  //   const [img, setImg] = useState();
  const [userName, setUserName] = useState();
  const [occupation, setOccupation] = useState();

  return (
    <div className="row px-0 user-dataset-main mt-4 py-3 px-sm-3 container-fluid justify-content-around">
      {blocks.map((item, key) => (
        <div
          className="col-xxl-3 col-md-5 col-sm-7 col-11 mx-1 mb-5 user-dataset-component"
          index={key}
        >
          <div className="user-dataset-img-div">
            <img src={img} className="user-dataset-img"></img>
          </div>
          <div className="user-dataset-details">
            <div className="user-dataset-title">{item.title}</div>
            <div className="user-dataset-desc">{item.description}</div>
            <div className="user-dataset-badge">Free</div>
            <div className="user-dataset-btn">View More &gt;</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default UserDatasets;
