import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import img from "../../assets/dataset/filter.png";
import img1 from "../../assets/home/security.png";
import "../../styles/dataset/DatasetDashboard.css";

const blocks = [
  {
    title: "Dataset1",
    description:
      "Description of dataset 1 involves analysing quality data Description of dataset 1 involves analysing quality data",
  },
  {
    title: "Data set2",
    description: "Description of dataset 1 involves analysing quality data",
  },
  {
    title: "Dataset3",
    description: "Description of dataset 1 involves analysing quality data",
  },
  {
    title: "Data set4",
    description: "Description of dataset 1 involves analysing quality data",
  },
  {
    title: "Dataset5",
    description: "Description of dataset 1 involves analysing quality data",
  },
  {
    title: "Data set6",
    description: "Description of dataset 1 involves analysing quality data",
  },
];

function DatasetDashboard() {
  const [activeComponent, setActiveComponent] = useState("allDatasets");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredDatasets, setFilteredDatasets] = useState(blocks);
  const navigate = useNavigate();
  const datasetDivRef = React.useRef(null);
  const [filterDropdown, setFilterDropdown] = useState(false);

  const showFilterDropdown = () => {
    setFilterDropdown(!filterDropdown);
  };

  const handleCreateDatasetButton = (e) => {
    navigate("/dataset/create-dataset");
  };

  const handleAllDatasetClick = (e) => {
    e.preventDefault();
    setActiveComponent("allDatasets");
    setFilteredDatasets(blocks);

    if (datasetDivRef.current) {
      datasetDivRef.current.scrollIntoView({
        behavior: "smooth", // You can change this to "auto" if you prefer instant scrolling
        block: "start", // Scroll to the start of the section
      });
    }
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);

    const filtered = blocks.filter((item) =>
      item.title.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredDatasets(filtered);
  };

  return (
    <div className="dataset-dashboard-main">
      <div className="d-flex flex-column dataset-dash-component py-2 px-1">
        <div className="py-2 px-sm-4 px-3 dataset-dash-content">
          <div className="py-2">
            <div className="dataset-dash-head">Datasets</div>
            <div className="pb-sm-3 pb-1 dataset-dash-subhead">
              Explore, analyze and share quality data
            </div>
          </div>

          {/* Categories */}

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
            <div className="py-sm-3 py-2 dataset-search-div">
              <input
                type="text"
                placeholder="Search here"
                className="dataset-search-bar"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
              <img src={img} alt="search icon" />
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

        {/* Filter categories dropdown */}

        <div className="py-3 px-md-5 px-sm-4 px-3 d-lg-none dataset-dash-btns">
          <div className="d-flex justify-content-end">
            <button
              type="button"
              className="d-flex dataset-dropdown-btn"
              onClick={showFilterDropdown}
            >
              Filter category
              <div className="px-2">
                <i class="fa-solid fa-angle-down"></i>
              </div>
            </button>
          </div>
          {filterDropdown && (
            <div
              className="p-3 text-center dataset-filter-dropdown "
              onClick={showFilterDropdown}
            >
              <div>
                <li
                  className={`d-flex dataset-filter-items justify-content-end py-1 ${
                    activeComponent === "allDatasets" ? "dataset-active-filter" : ""
                  }`}
                  onClick={handleAllDatasetClick}
                >
                  All Datasets
                </li>
                <li
                  className={`d-flex dataset-filter-items justify-content-end py-1 ${
                    activeComponent === "drugs&med" ? "dataset-active-filter" : ""
                  }`}
                >
                  Drugs and Medicines
                </li>
                <li
                  className={`d-flex dataset-filter-items justify-content-end py-1 ${
                    activeComponent === "education" ? "dataset-active-filter" : ""
                  }`}
                  onClick={handleAllDatasetClick}
                >
                  Education
                </li>
                <li
                  className={`d-flex dataset-filter-items justify-content-end py-1 ${
                    activeComponent === "earth&nature" ? "dataset-active-filter" : ""
                  }`}
                >
                  Earth and Nature
                </li>
                <li
                  className={`d-flex dataset-filter-items justify-content-end py-1 ${
                    activeComponent === "sci&tech" ? "dataset-active-filter" : ""
                  }`}
                >
                  Science and Technology
                </li>
              </div>
            </div>
          )}
        </div>

        {/* All dataset component */}

        <div ref={datasetDivRef}>
          <div className="row px-0 all-datasets-main mt-4 py-3 px-sm-3 container-fluid justify-content-around">
            {filteredDatasets.map((item, key) => (
              <div
                className="col-xxl-3 col-md-5 col-sm-7 col-11 mx-1 mb-5 all-datasets-component"
                index={key}
              >
                <div className="all-dataset-img-div">
                  <img src={img1} className="all-dataset-img"></img>
                </div>
                <div className="all-dataset-details">
                  <div className="all-dataset-title">{item.title}</div>
                  <div className="all-dataset-desc">{item.description}</div>
                  <div className="all-dataset-badge">Free</div>
                  <div
                    className="all-dataset-btn"
                    onClick={() => navigate("/dataset/single-dataset")}
                  >
                    View More &gt;
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DatasetDashboard;
