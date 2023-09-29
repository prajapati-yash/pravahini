import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import img from "../../assets/dataset/filter.png";
import img1 from "../../assets/home/security.png";
import "../../styles/dataset/DatasetDashboard.css";
import { ethers } from "ethers";
import { datasetInstance } from "../Contract";
import { ClipLoader } from "react-spinners";

function DatasetDashboard() {
  const [activeComponent, setActiveComponent] = useState("allDatasets");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredDatasets, setFilteredDatasets] = useState([]);
  const navigate = useNavigate();
  const datasetDivRef = React.useRef(null);
  const [allDatasets, setAllDatasets] = useState([]);
  const [isPageLoading, setIsPageLoading] = useState(true);

  const handleAllDatasetClick = (e) => {
    e.preventDefault();
    setActiveComponent("allDatasets");
    setFilteredDatasets(allDatasets);

    if (datasetDivRef.current) {
      datasetDivRef.current.scrollIntoView({
        behavior: "smooth", // You can change this to "auto" if you prefer instant scrolling
        block: "start", // Scroll to the start of the section
      });
    }
  };

  const handlePaidDatasetClick = (e) => {
    e.preventDefault();
    setActiveComponent("paidDatasets");

    const filtered = allDatasets.filter((dataset) => {
      return dataset.isForSale;
    });

    setFilteredDatasets(filtered);

    if (datasetDivRef.current) {
      datasetDivRef.current.scrollIntoView({
        behavior: "smooth", // You can change this to "auto" if you prefer instant scrolling
        block: "start", // Scroll to the start of the section
      });
    }
  };

  const handlePublicDatasetClick = (e) => {
    e.preventDefault();
    setActiveComponent("publicDatasets");

    const filtered = allDatasets.filter((dataset) => {
      return dataset.isPublic;
    });

    setFilteredDatasets(filtered);

    if (datasetDivRef.current) {
      datasetDivRef.current.scrollIntoView({
        behavior: "smooth", // You can change this to "auto" if you prefer instant scrolling
        block: "start", // Scroll to the start of the section
      });
    }
  };

  const handleMedicineDatasets = (e) => {
    e.preventDefault();
    setActiveComponent("drugs&med");

    const filtered = allDatasets.filter((dataset) => {
      return dataset.category === "Drugs and Medicine";
    });
    setFilteredDatasets(filtered);
  };

  const handleEducationDatasets = (e) => {
    e.preventDefault();
    setActiveComponent("education");

    const filtered = allDatasets.filter((dataset) => {
      return dataset.category === "Education";
    });
    setFilteredDatasets(filtered);
  };

  const handleNatureDatasets = (e) => {
    e.preventDefault();
    setActiveComponent("earth&nature");

    const filtered = allDatasets.filter((dataset) => {
      return dataset.category === "Earth and Nature";
    });
    setFilteredDatasets(filtered);
  };

  const handleTechDatasets = (e) => {
    e.preventDefault();
    setActiveComponent("sci&tech");

    const filtered = allDatasets.filter((dataset) => {
      return dataset.category === "Science and Technology";
    });
    setFilteredDatasets(filtered);
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);

    const filtered = allDatasets.filter((item) =>
      item.title.toLowerCase().includes(query.toLowerCase())
    );

    // console.log("Filtered items: ",filtered);
    setFilteredDatasets(filtered);
  };

  const allData = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        if (!provider) {
          console.log("Metamask is not installed, please install!");
        }
        const con = await datasetInstance();
        const getDatasetDetails = await con.getAllDatasets();

        const filteredDatasets = getDatasetDetails.filter((dataset) => {
          return dataset.isPublic || dataset.isForSale;
        });
        console.log("Filter: ", filteredDatasets);
        setAllDatasets(filteredDatasets);

        console.log("All datasets", allDatasets);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    async function fetchDatasets() {
      setActiveComponent("allDatasets");
      await allData();
      setIsPageLoading(false);
    }
    console.log("hello");
    fetchDatasets();
  }, []);

  useEffect(() => {
    setFilteredDatasets(allDatasets);
  }, [allDatasets]);

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

          {/* Create and search */}

          <div>
            <button
              type="submit"
              className="btn rounded-pill my-1 py-sm-2 px-sm-3 dash-create-dataset-btn"
              onClick={() => navigate("/dataset-marketplace/create-dataset")}
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
              <div class="dropdown dataset-dropdown-container">
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
                      activeComponent === "allDatasets" ? "active-button" : ""
                    }`}
                    onClick={handleAllDatasetClick}
                  >
                    All
                  </a>
                  <a
                    className={`dropdown-item ${
                      activeComponent === "paidDatasets" ? "active-button" : ""
                    }`}
                    onClick={handlePaidDatasetClick}
                  >
                    Paid
                  </a>
                  <a
                    className={`dropdown-item ${
                      activeComponent === "publicDatasets" ? "active-button" : ""
                    }`}
                    onClick={handlePublicDatasetClick}
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
            onClick={handleMedicineDatasets}
          >
            Drugs and Medicine
          </button>
          <button
            type="button"
            className={`mx-sm-3 mx-2 edu-dataset-dash-btn ${
              activeComponent === "education" ? "active-button" : ""
            }`}
            onClick={handleEducationDatasets}
          >
            Education
          </button>
          <button
            type="button"
            className={`mx-sm-3 mx-2 ear-dataset-dash-btn ${
              activeComponent === "earth&nature" ? "active-button" : ""
            }`}
            onClick={handleNatureDatasets}
          >
            Earth & Nature
          </button>
          <button
            type="button"
            className={`mx-sm-3 mx-2 sci-dataset-dash-btn ${
              activeComponent === "sci&tech" ? "active-button" : ""
            }`}
            onClick={handleTechDatasets}
          >
            Science & Technology
          </button>
        </div>

        {/* Filter categories dropdown */}

        <div className="py-3 px-md-5 px-sm-4 px-3 d-lg-none dataset-dash-btns">
          <div className="d-flex justify-content-end dropdown">
            <button
              type="button"
              className="dataset-dropdown-btn dropdown-toggle"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Filter category
            </button>
            <ul class="dropdown-menu">
              <li>
                <a
                  className={`dropdown-item ${
                    activeComponent === "allDatasets" ? "active-button" : ""
                  }`}
                  onClick={handleAllDatasetClick}
                >
                  All Datasets
                </a>
              </li>
              <li>
                <a
                  className={`dropdown-item ${
                    activeComponent === "drugs&med" ? "active-button" : ""
                  }`}
                  onClick={handleMedicineDatasets}
                >
                  Drugs and Medicines
                </a>
              </li>
              <li>
                <a
                  className={`dropdown-item  ${
                    activeComponent === "education" ? "active-button" : ""
                  }`}
                  onClick={handleEducationDatasets}
                >
                  Education
                </a>
              </li>
              <li>
                <a
                  className={`dropdown-item ${
                    activeComponent === "earth&nature" ? "active-button" : ""
                  }`}
                  onClick={handleNatureDatasets}
                >
                  Earth and Nature
                </a>
              </li>
              <li>
                <a
                  className={`dropdown-item ${
                    activeComponent === "sci&tech" ? "active-button" : ""
                  }`}
                  onClick={handleTechDatasets}
                >
                  Science and Technology
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* All dataset component */}

        <div ref={datasetDivRef}>
          <div className="row px-0 all-datasets-main mt-4 py-3 px-sm-3 container-fluid justify-content-around">
            {isPageLoading ? (
              <div className="d-flex justify-content-center">
                <ClipLoader color="#4250ff" />
              </div>
            ) : filteredDatasets.length > 0 ? (
              filteredDatasets.map((item, key) => (
                <div
                  className="col-xxl-3 col-md-5 col-sm-7 col-11 mx-1 mb-5 all-datasets-component"
                  index={key}
                >
                  <div className="all-dataset-img-div">
                    <img
                      src={`https://gateway.lighthouse.storage/ipfs/${item.uploadImage}`}
                      className="all-dataset-img"
                    ></img>
                  </div>
                  <div className="all-dataset-details">
                    <div className="all-dataset-title">{item.title}</div>
                    <div className="all-dataset-desc">{item.description}</div>
                    <div className="all-dataset-badge">
                      {item.isPublic
                        ? "Free"
                        : item.isForSale
                        ? "Paid"
                        : "Private"}
                    </div>
                    <div
                      className="all-dataset-btn"
                      onClick={() =>
                        navigate("/dataset-marketplace/single-dataset", {
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
              <div>No Datasets Available</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DatasetDashboard;
