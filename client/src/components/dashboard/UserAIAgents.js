import React from "react";
import { useState, useEffect } from "react";
import "../../styles/dashboard/UserModels.css";
import { AiAgentInstance } from "../Contract";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { ClipLoader } from "react-spinners";

function UserAIAgents() {
  const navigate = useNavigate();
  const [allUserAIAgents, setAllUserAIAgents] = useState([]);
  const [isPageLoading, setIsPageLoading] = useState(true);

  const allAIAgentData = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        if (!provider) {
          console.log("Metamask is not installed, please install!");
        }
        const con = await AiAgentInstance();
        const getDatasetDetails = await con.getAllAIAgentsOfUser();
        setAllUserAIAgents(getDatasetDetails);
        // console.log(allUserAIAgents);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    async function fetchUserModels() {
      await allAIAgentData();
      setIsPageLoading(false);
    }
    fetchUserModels();
  }, []);

  return (
    <div className="row mt-4 py-3 px-3 container-fluid  justify-content-around ">
      {isPageLoading ? (
        <div className="d-flex justify-content-center">
          <ClipLoader color="#4250ff" />
        </div>
      ) : allUserAIAgents.length > 0 ? (
        allUserAIAgents.map((item, key) => (
          <div
            className="col-xl-3 col-md-5 col-sm-7 col-11 mx-1 mb-4 user-model-component"
            index={key}
          >
              <img
                src={`https://gateway.lighthouse.storage/ipfs/${item.uploadImage}`}
                className="user-dataset-img"
              ></img>
            <div className="user-model-details">
              <div className="user-model-title">{item.title}</div>
              <div className="user-model-desc">{item.description}</div>
              <div className="user-model-badge">
                {item.isPublic ? "Free" : item.isForSale ? "Paid" : "Private"}
              </div>
              <div
                className="user-model-btn"
                onClick={() =>
                  navigate("/ai-agents-marketplace/single-ai-agent", {
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
        <div>No AI Agent Available</div>
      )}
    </div>
  );
}

export default UserAIAgents;
