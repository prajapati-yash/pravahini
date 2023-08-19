import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import img from "../../assets/dataset/filter.png";
import img1 from "../../assets/home/security.png";
import "../../styles/model/ModelDashboard.css";

const blocks = [
  {
    title: "Model1",
    description:
      "Description of model 1 involves analysing quality data Description of dataset 1 involves analysing quality data",
  },
  {
    title: "Model 2",
    description: "Description of model 2 involves analysing quality data",
  },
  {
    title: "Model 3",
    description: "Description of model 3 involves analysing quality data",
  },
  {
    title: "Model4",
    description: "Description of model 4 involves analysing quality data",
  },
  {
    title: "Model5",
    description: "Description of model 5 involves analysing quality data",
  },
  {
    title: "Model 6",
    description: "Description of model 6 involves analysing quality data",
  },
];

function ModelDashboard() {
  const [activeComponent, setActiveComponent] = useState("allModels");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredModels, setFilteredModels] = useState(blocks);
  const navigate = useNavigate();
  const modelDivRef = React.useRef(null);
  const [filterDropdown, setFilterDropdown] = useState(false);

  const showFilterDropdown = () => {
    setFilterDropdown(!filterDropdown);
  };

  const handleAllModelClick = (e) => {
    e.preventDefault();
    setActiveComponent("allModels");
    setFilteredModels(blocks);

    if (modelDivRef.current) {
      modelDivRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);

    const filtered = blocks.filter((item) =>
      item.title.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredModels(filtered);
  };

  return (
    <div className="model-dashboard-main">
      <div className="d-flex flex-column model-dash-component py-2 px-1">
        <div className="py-2 px-sm-4 px-3 model-dash-content">
          <div className="py-2">
            <div className="model-dash-head">Models</div>
            <div className="pb-sm-3 pb-1 model-dash-subhead">
              Search and discover hundreds of trained, ready-to-deploy machine
              learning models in one place.
            </div>
          </div>

          {/* Create and search */}
          <div>
            <button
              type="submit"
              className="btn rounded-pill my-1 py-sm-2 px-sm-3 dash-create-model-btn"
              onClick={() => navigate("/model-marketplace/create-model")}
            >
              Create Model
            </button>
          </div>
          <div>
            <div className="py-sm-3 py-2 model-search-div">
              <input
                type="text"
                placeholder="Search here"
                className="model-search-bar"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
              <div class="dropdown model-dropdown-container">
                <img
                  src={img}
                  alt="Image"
                  class="dropdown-toggle"
                  id="dropdownMenuButton"
                  data-bs-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                />
                <div
                  className="dropdown-menu"
                  aria-labelledby="dropdownMenuButton"
                >
                  <a className="dropdown-item" href="#">

                    All
                  </a>
                  <a className="dropdown-item" href="#">

                    Paid
                  </a>
                  <a className="dropdown-item" href="#">
                    Free
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div>
        <div className="d-lg-flex py-4 justify-content-center model-dash-btns d-none">
          <button
            type="button"
            className={`mx-sm-3 mx-2 all-model-dash-btn ${
              activeComponent === "allModels" ? "active-button" : ""
            }`}
            onClick={handleAllModelClick}
          >
            All Models
          </button>
          <button
            type="button"
            className={`mx-sm-3 mx-2 med-model-dash-btn ${
              activeComponent === "drugs&med" ? "active-button" : ""
            }`}
            // onClick={handleModelClick}
          >
            Drugs and Medicine
          </button>
          <button
            type="button"
            className={`mx-sm-3 mx-2 edu-model-dash-btn ${
              activeComponent === "education" ? "active-button" : ""
            }`}
            // onClick={handleSubscribedDatasets}
          >
            Education
          </button>
          <button
            type="button"
            className={`mx-sm-3 mx-2 ear-model-dash-btn ${
              activeComponent === "earth&nature" ? "active-button" : ""
            }`}
            // onClick={handleSubscribedDatasets}
          >
            Earth & Nature
          </button>
          <button
            type="button"
            className={`mx-sm-3 mx-2 sci-model-dash-btn ${
              activeComponent === "sci&tech" ? "active-button" : ""
            }`}
            // onClick={handleSubscribedDatasets}
          >
            Science & Technology
          </button>
        </div>

        {/* Filter category dropdown */}

        <div className="py-3 px-md-5 px-sm-4 px-3 d-lg-none model-dash-btns">
          <div className="d-flex justify-content-end dropdown">
            <button
              type="button"
              className="model-dropdown-btn dropdown-toggle"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Filter category
            </button>
            <ul class="dropdown-menu">
              <li>
                <a
                  className={`dropdown-item ${
                    activeComponent === "allModels" ? "active-button" : ""
                  }`}
                  href="#"
                >
                  All Models
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Drugs and Medicines
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Education
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Earth and Nature
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Science and Technology
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* All Models component */}

        <div ref={modelDivRef}>
          <div className="row px-0 all-model-main mt-4 py-3 px-sm-3 container-fluid justify-content-around">
            {filteredModels.map((item, key) => (
              <div
                className="col-xxl-3 col-md-5 col-sm-7 col-11 mx-1 mb-5 all-model-component"
                index={key}
              >
                <div className="all-model-img-div">
                  <img src={img1} className="all-model-img"></img>
                </div>
                <div className="all-model-details">
                  <div className="all-model-title">{item.title}</div>
                  <div className="all-model-desc">{item.description}</div>
                  <div className="all-model-badge">Free</div>
                  <div
                    className="all-model-btn"
                    onClick={() => navigate("/model-marketplace/single-model")}
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

export default ModelDashboard;
