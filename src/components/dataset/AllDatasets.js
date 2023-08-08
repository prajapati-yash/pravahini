import React from 'react'
import { useState } from "react";
import "../../styles/dataset/AllDataset.css";
import img from "../../assets/home/security.png";

const blocks = [
  {
    title: "Dataset1",
    description: "Description of dataset 1 involves analysing quality data Description of dataset 1 involves analysing quality data",
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

function AllDatasets() {
  return (
    <div className="row px-0 all-datasets-main mt-4 py-3 px-sm-3 container-fluid justify-content-around">
      {blocks.map((item, key) => (
        <div className="col-xxl-3 col-md-5 col-sm-7 col-11 mx-1 mb-5 all-datasets-component" index={key}>
          <div className="all-dataset-img-div">
            <img src={img} className="all-dataset-img"></img>
          </div>
          <div className="all-dataset-details">
            <div className="all-dataset-title">{item.title}</div>
            <div className="all-dataset-desc">{item.description}</div>
            <div className="all-dataset-badge">Free</div>
            <div className="all-dataset-btn">View More &gt;</div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AllDatasets