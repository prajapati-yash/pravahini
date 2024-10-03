import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import img from "../../assets/dataset/filter.png";
import img1 from "../../assets/home/security.png";
import "../../styles/dataset/DatasetDashboard.css";
import { ethers } from "ethers";
import { AiAgentInstance } from "../Contract";
import axios from "axios";
import Cookies from "js-cookie";
import { ClipLoader } from "react-spinners";
import { useAccount } from "wagmi";
import { authorizationInstance } from "../Contract";

function AiAgentComponent() {
  const [activeComponent, setActiveComponent] = useState("allDatasets");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredDatasets, setFilteredDatasets] = useState([]);
  const navigate = useNavigate();
  const datasetDivRef = React.useRef(null);
  const [allDatasets, setAllDatasets] = useState([]);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const { address } = useAccount();

  useEffect(() => {
    const verifyUserAccount = async () => {
      try {
        const { ethereum } = window;
        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const messageBytes = ethers.utils.toUtf8Bytes(
            process.env.REACT_APP_MSG_TO_SIGN
          );
          if (address) {
            if (!Cookies.get("jwtToken")) {
              const sign = await signer.signMessage(messageBytes);
              const res = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/de-computation`,
                {
                  address,
                  sign,
                }
              );
              const token = res.data.jwtToken;
              Cookies.set("jwtToken", token, { expires: 1 });
            }
            const con = await authorizationInstance();
            const verifyTx = await con.isRegistered(address);
            // result = verifyTx
            console.log("verify", verifyTx);
            // console.log(con);
            return verifyTx;
          }
        } else {
          console.log("Metamask is not installed, please install!");
        }
      } catch (error) {
        console.log(error);
      }
    };
    verifyUserAccount();
  }, [navigate, address]);

  const handleAllDatasetClick = (e) => {
    e.preventDefault();
    setActiveComponent("allDatasets");
    setFilteredDatasets(allDatasets);

    if (datasetDivRef.current) {
      datasetDivRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handlePaidDatasetClick = (e) => {
    e.preventDefault();
    setActiveComponent("paidDatasets");

    const filtered = allDatasets.filter((AIAgent) => {
      if(parseInt(AIAgent[10]._hex,16)==2){
        return null;
      }
      return AIAgent.isForSale;
    });

    setFilteredDatasets(filtered);
  };

  const handlePublicDatasetClick = (e) => {
    e.preventDefault();
    setActiveComponent("publicDatasets");

    const filtered = allDatasets.filter((AIAgent) => {
      return AIAgent.isPublic;
    });

    setFilteredDatasets(filtered);
  };

  const handlebuisnessAIAgent = (e) => {
    e.preventDefault();
    setActiveComponent("b&p");

    const filtered = allDatasets.filter((AIAgent) => {
      // console.log(parseInt(dataset[11]._hex,16));
      if(parseInt(AIAgent[10]._hex,16)==2){
        return null;
      }
      return AIAgent.category === "Business & Productivity";
    });
    setFilteredDatasets(filtered);
  };

  const handleCreativeAIAgent = (e) => {
    e.preventDefault();
    setActiveComponent("c&c");

    const filtered = allDatasets.filter((AIAgent) => {
      return AIAgent.category === "Creative & Content Solutions";
    });
    setFilteredDatasets(filtered);
  };

  const handleTechnicalAIAgent = (e) => {
    e.preventDefault();
    setActiveComponent("t&i");

    const filtered = allDatasets.filter((AIAgent) => {
      return AIAgent.category === "Technical & IT Services";
    });
    setFilteredDatasets(filtered);
  };

  const handlePersonalAIAgent = (e) => {
    e.preventDefault();
    setActiveComponent("p&p");

    const filtered = allDatasets.filter((AIAgent) => {
      return AIAgent.category === "Personal & Professional Assistance";
    });
    setFilteredDatasets(filtered);
  };

  const handleSearchChange = (query) => {
    setActiveComponent("allDatasets");
    setSearchQuery(query);

    const filtered = allDatasets.filter((item) =>
      item.title.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredDatasets(filtered);
  };

  const allData = async () => {
    try {
      const con = await AiAgentInstance();
      console.log(con);
      const getAIAgentsDetails = await con.getAllAIAgents();
console.log(getAIAgentsDetails);  
      const filteredAIAgents = getAIAgentsDetails.filter((AIAgent) => {
        return AIAgent.isPublic || AIAgent.isForSale;
      });
      setAllDatasets(filteredAIAgents);
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
            <div className="dataset-dash-head">AI Agents
            </div>
            <div className="pb-sm-3 pb-1 dataset-dash-subhead">
            Discover, explore and connect with the best AI Agents for your benefits
            </div>
          </div>

          {/* Create and search */}

          <div>
            <button
              type="submit"
              className="btn rounded-pill my-1 py-sm-2 px-sm-3 dash-create-dataset-btn"
              onClick={() => navigate("/ai-agents-marketplace/create-ai-agent")}
            >
              Upload AI Agent
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
                      activeComponent === "publicDatasets"
                        ? "active-button"
                        : ""
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
            All AI Agents
          </button>
          <button
            type="button"
            className={`mx-sm-3 mx-2 med-dataset-dash-btn ${
              activeComponent === "b&p" ? "active-button" : ""
            }`}
            onClick={handlebuisnessAIAgent}
          >
             Business & Productivity
          </button>
          <button
            type="button"
            className={`mx-sm-3 mx-2 edu-dataset-dash-btn ${
              activeComponent === "c&c" ? "active-button" : ""
            }`}
            onClick={handleCreativeAIAgent}
          >
            Creative & Content Solutions
          </button>
          <button
            type="button"
            className={`mx-sm-3 mx-2 ear-dataset-dash-btn ${
              activeComponent === "earth&nature" ? "active-button" : ""
            }`}
            onClick={handleTechnicalAIAgent}
          >
            Technical & IT Services
          </button>
          <button
            type="button"
            className={`mx-sm-3 mx-2 sci-dataset-dash-btn ${
              activeComponent === "p&p" ? "active-button" : ""
            }`}
            onClick={handlePersonalAIAgent}
          >
            Personal & Professional Assistance
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
                    activeComponent === "b&p" ? "active-button" : ""
                  }`}
                  onClick={handlebuisnessAIAgent}
                >
                  Business & Productivity
                </a>
              </li>
              <li>
                <a
                  className={`dropdown-item  ${
                    activeComponent === "c&c" ? "active-button" : ""
                  }`}
                  onClick={handleCreativeAIAgent}
                >
                  Creative & Content Solutions
                </a>
              </li>
              <li>
                <a
                  className={`dropdown-item ${
                    activeComponent === "t&i" ? "active-button" : ""
                  }`}
                  onClick={handleTechnicalAIAgent}
                >
                  Technical & IT Services
                </a>
              </li>
              <li>
                <a
                  className={`dropdown-item ${
                    activeComponent === "p&p" ? "active-button" : ""
                  }`}
                  onClick={handlePersonalAIAgent}
                >
                  Personal & Professional Assistance
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
              filteredDatasets.map((item, key) => { 
                console.log(item);
                // Skip rendering when key is 2
                if (parseInt(item[10]._hex,16) === 2) {
                  return null;
                }

                return (
                  <div
                    className="col-xxl-3 col-md-5 col-sm-7 col-11 mx-1 mb-5 all-datasets-component"
                    key={key}
                  >
                    <div className="all-dataset-img-div">
                      <img
                        src={`https://gateway.lighthouse.storage/ipfs/${item.uploadImage}`}
                        className="all-dataset-img"
                        alt="Dataset"
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
                        onClick={() => {
                          navigate("/ai-agents-marketplace/single-ai-agent", {
                            state: { data: item },
                          });
                        }}
                      >
                        View More &gt;
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div>No Datasets Available</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AiAgentComponent;
