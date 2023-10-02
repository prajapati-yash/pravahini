import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import img from "../../assets/dataset/filter.png";
import img1 from "../../assets/home/security.png";
import "../../styles/model/ModelDashboard.css";
import { ethers } from "ethers";
import { modelInstance } from "../Contract";
import { ClipLoader } from "react-spinners";

function ModelDashboard() {
  const [activeComponent, setActiveComponent] = useState("allModels");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredModels, setFilteredModels] = useState([]);
  const navigate = useNavigate();
  const modelDivRef = React.useRef(null);
  const [allModels, setAllModels] = useState([]);
  const [isPageLoading, setIsPageLoading] = useState(true);

  const handleAllModelClick = (e) => {
    e.preventDefault();
    setActiveComponent("allModels");
    setFilteredModels(allModels);
  };

  const handlePaidModelClick = (e) => {
    e.preventDefault();
    setActiveComponent("paidModels");

    const filtered = allModels.filter((model) => {
      return model.isForSale;
    });

    setFilteredModels(filtered);
  };

  const handlePublicModelClick = (e) => {
    e.preventDefault();
    setActiveComponent("publicModels");

    const filtered = allModels.filter((model) => {
      return model.isPublic;
    });

    setFilteredModels(filtered);
  };

  const handleMedicineModels = (e) => {
    e.preventDefault();
    setActiveComponent("drugs&med");

    const filtered = allModels.filter((model) => {
      return model.category === "Drugs and Medicine";
    });
    setFilteredModels(filtered);
  };

  const handleEducationModels = (e) => {
    e.preventDefault();
    setActiveComponent("education");

    const filtered = allModels.filter((model) => {
      return model.category === "Education";
    });
    setFilteredModels(filtered);
  };

  const handleNatureModels = (e) => {
    e.preventDefault();
    setActiveComponent("earth&nature");

    const filtered = allModels.filter((model) => {
      return model.category === "Earth and Nature";
    });
    setFilteredModels(filtered);
  };

  const handleTechModels = (e) => {
    e.preventDefault();
    setActiveComponent("sci&tech");

    const filtered = allModels.filter((model) => {
      return model.category === "Science and Technology";
    });
    setFilteredModels(filtered);
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);

    const filtered = allModels.filter((item) =>
      item.title.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredModels(filtered);
  };

  const allModelData = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        if (!provider) {
          console.log("Metamask is not installed, please install!");
        }
        const con = await modelInstance();
        const getModelDetails = await con.getAllModels();

        const filteredModels = getModelDetails.filter((model) => {
          return model.isPublic || model.isForSale;
        });
        console.log("Filter: ", filteredModels);
        setAllModels(filteredModels);

        console.log(allModels);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    async function fetchModels() {
      setActiveComponent("allModels");
      await allModelData();
      setIsPageLoading(false);
    }
    console.log("hello");
    fetchModels();
  }, []);

  useEffect(() => {
    setFilteredModels(allModels);
  }, [allModels]);

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
                  <a
                    className={`dropdown-item ${
                      activeComponent === "allModels" ? "active-button" : ""
                    }`}
                    onClick={handleAllModelClick}
                  >
                    All
                  </a>
                  <a
                    className={`dropdown-item ${
                      activeComponent === "paidModels" ? "active-button" : ""
                    }`}
                    onClick={handlePaidModelClick}
                  >
                    Paid
                  </a>
                  <a
                    className={`dropdown-item ${
                      activeComponent === "publicModels" ? "active-button" : ""
                    }`}
                    onClick={handlePublicModelClick}
                  >
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
            onClick={handleMedicineModels}
          >
            Drugs and Medicine
          </button>
          <button
            type="button"
            className={`mx-sm-3 mx-2 edu-model-dash-btn ${
              activeComponent === "education" ? "active-button" : ""
            }`}
            onClick={handleEducationModels}
          >
            Education
          </button>
          <button
            type="button"
            className={`mx-sm-3 mx-2 ear-model-dash-btn ${
              activeComponent === "earth&nature" ? "active-button" : ""
            }`}
            onClick={handleNatureModels}
          >
            Earth & Nature
          </button>
          <button
            type="button"
            className={`mx-sm-3 mx-2 sci-model-dash-btn ${
              activeComponent === "sci&tech" ? "active-button" : ""
            }`}
            onClick={handleTechModels}
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
                  onClick={handleAllModelClick}
                >
                  All Models
                </a>
              </li>
              <li>
                <a
                  className={`dropdown-item ${
                    activeComponent === "drugs&med" ? "active-button" : ""
                  }`}
                >
                  Drugs and Medicines
                </a>
              </li>
              <li>
                <a
                  className={`dropdown-item ${
                    activeComponent === "education" ? "active-button" : ""
                  }`}
                  onClick={handleEducationModels}
                >
                  Education
                </a>
              </li>
              <li>
                <a
                  className={`dropdown-item ${
                    activeComponent === "earth&nature" ? "active-button" : ""
                  }`}
                  onClick={handleNatureModels}
                >
                  Earth and Nature
                </a>
              </li>
              <li>
                <a
                  className={`dropdown-item ${
                    activeComponent === "sci&tech" ? "active-button" : ""
                  }`}
                  onClick={handleTechModels}
                >
                  Science and Technology
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* All Models component */}

        <div ref={modelDivRef}>
          <div className="row px-0 all-model-main mt-4 py-3 px-sm-3 container-fluid justify-content-around">
            {isPageLoading ? (
              <div className="d-flex justify-content-center">
                <ClipLoader color="#4250ff" />
              </div>
            ) : filteredModels.length > 0 ? (
              filteredModels.map((item, key) => (
                <div
                  className="col-xxl-3 col-md-5 col-sm-7 col-11 mx-1 mb-5 all-model-component"
                  index={key}
                >
                  {/* <div className="all-model-img-div">
                    <img src={img1} className="all-model-img"></img>
                  </div> */}
                  <div className="all-model-details">
                    <div className="all-model-title">{item.title}</div>
                    <div className="all-model-desc">{item.description}</div>
                    <div className="all-model-badge">
                      {item.isPublic
                        ? "Free"
                        : item.isForSale
                        ? "Paid"
                        : "Private"}
                    </div>
                    <div
                      className="all-model-btn"
                      onClick={() =>
                        navigate("/model-marketplace/single-model", {
                          state: { data: item },
                        })
                      }
                    >
                      View More &gt;
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div>No Models Available</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModelDashboard;
