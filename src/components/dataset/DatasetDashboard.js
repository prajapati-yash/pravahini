import React from 'react'
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import img from "../../assets/dataset/filter.png";
import AllDatasets from './AllDatasets';
import "../../styles/dataset/DatasetDashboard.css";

function DatasetDashboard() {
  const [activeComponent, setActiveComponent] = useState("userDatasets");
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleCreateDatasetButton = (e) => {
    navigate("/dataset/create-dataset");
  }

  const handleAllDatasetClick = (e) => {
    e.preventDefault();
    navigate("/dataset/all-datasets");
    setActiveComponent("allDatasets");
  };

  const SearchBar = ({ onChange }) => {
    return (
      <div>
        <input
          type="text"
          placeholder="Search..."
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    );
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case "allDatasets":
        return <AllDatasets />;
      default:
        return <AllDatasets />;
    }
  };

  return (
    <div className="dataset-dashboard-main">
      <div className="d-flex flex-column dataset-dash-component py-2 px-1">
        <div className="py-2 px-sm-4 px-3 dataset-dash-content">
            <div className='py-2'>
          <div className="dataset-dash-head">
            Datasets
          </div>
          <div className="pb-sm-3 pb-1 dataset-dash-subhead">
            Explore, analyze and share quality data
          </div>
          </div>
          <div>
            <button
              type="submit"
              className="btn rounded-pill my-1 py-sm-2 px-sm-3 dash-create-dataset-btn"
              onClick={handleCreateDatasetButton}
            >
              Create Dataset
            </button>
          </div>
          <div>
            <div className='py-sm-3 py-2 dataset-search-div'>  
              <input type='text' placeholder='Search here' className='dataset-search-bar' onChange={(e) => e.target.value}/>
              <img src={img} alt='search icon'/>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="d-lg-flex py-4 justify-content-center dataset-dash-btns d-none">
            <button
              type="button"
              className={`mx-sm-3 mx-2 all-dataset-dash-btn ${
                activeComponent === "allDatasets" ? "active-button" : ""
              }`}
              onClick={handleAllDatasetClick}
            >
              All Datasets
            </button>
            <button
              type="button"
              className={`mx-sm-3 mx-2 med-dataset-dash-btn ${
                activeComponent === "drugs&med" ? "active-button" : ""
              }`}
              // onClick={handleModelClick}
            >
              Drugs and Medicine
            </button>
            <button
              type="button"
              className={`mx-sm-3 mx-2 edu-dataset-dash-btn ${
                activeComponent === "education" ? "active-button" : ""
              }`}
              // onClick={handleSubscribedDatasets}
            >
              Education
            </button>
            <button
              type="button"
              className={`mx-sm-3 mx-2 ear-dataset-dash-btn ${
                activeComponent === "earth&nature" ? "active-button" : ""
              }`}
              // onClick={handleSubscribedDatasets}
            >
              Earth & Nature
            </button>
            <button
              type="button"
              className={`mx-sm-3 mx-2 sci-dataset-dash-btn ${
                activeComponent === "sci&tech" ? "active-button" : ""
              }`}
              // onClick={handleSubscribedDatasets}
            >
              Science & Technology
            </button>
        </div>
        <div className="dropdown py-3 px-md-5 px-sm-4 px-3 d-flex d-lg-none justify-content-end dataset-dash-btns">
          <button type="button" class="dataset-dropdown-btn dropdown-toggle" data-bs-toggle="dropdown">
            Filter category
          </button>
          <ul class="dropdown-menu">
            <li><a class={`dropdown-item ${
                activeComponent === "allDatasets" ? "active-button" : ""
              }`} href="#">All Datasets</a></li>
            <li><a class="dropdown-item" href="#">Drugs and Medicine</a></li>
            <li><a class="dropdown-item" href="#">Education</a></li>
            <li><a class="dropdown-item" href="#">Earth & Nature</a></li>
            <li><a class="dropdown-item" href="#">Science & Technology</a></li>
          </ul>
        </div>
        <>{renderComponent()}</>
      </div> 
    </div>
  )
}

export default DatasetDashboard