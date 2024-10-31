import React from "react";
import { useState, useEffect } from "react";
import "../../styles/dashboard/SubscribedDatasets.css";
import img from "../../assets/home/security.png";
import { ethers } from "ethers";
import { AiAgentInstance } from "../Contract";
import { ClipLoader } from "react-spinners";

function SubscribedAIAgents() {
  const [allSubscribedDatasets, setAllSubscribedDatasets] = useState([]);
  const [isPageLoading, setIsPageLoading] = useState(true);

  
  const allSubscribedData = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        if (!provider) {
          console.log("Metamask is not installed, please install!");
        }
        const con = await AiAgentInstance();
        // console.log("con",con);
        const getDatasetDetails = await con.getAllAIAgentsSubscriptionOfUser();
        // console.log("detailsss",getDatasetDetails);
        setAllSubscribedDatasets(getDatasetDetails);
        // console.log(allSubscribedDatasets);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    async function fetchSubscribedDatasets() {
      await allSubscribedData();
      setIsPageLoading(false);
    }
    fetchSubscribedDatasets();
  }, []);

  return (
    <div className="row mt-4 subscribed-dataset-main py-3 px-sm-3 container-fluid justify-content-around ">
      {isPageLoading ? (
        <div className="d-flex justify-content-center">
          <ClipLoader color="#4250ff" />
        </div>
      ) : allSubscribedDatasets.length > 0 ? (
        allSubscribedDatasets.map((item, key) => (
          <div
            className="col-xxl-3 col-md-5 col-sm-7 col-11 mx-1 mb-5 subscribed-dataset-component"
            index={key}
          >
            <div className="subscribed-dataset-img-div">
              <img
                src={`https://gateway.lighthouse.storage/ipfs/${item.uploadImage}`}
                className="subscribed-dataset-img"
              ></img>
            </div>
            <div className="subscribed-dataset-details">
              <div className="subscribed-dataset-title">{item.title}</div>
              <div className="subscribed-dataset-desc">{item.description}</div>
              <div className="subscribed-dataset-badge">
                {item.isPublic ? "Free" : item.isForSale ? "Paid" : "Private"}
              </div>
              <div className="subscribed-dataset-btn">View More &gt;</div>
            </div>
          </div>
        ))
      ) : (
        <div>No Subscribed AI Agent Available</div>
      )}
    </div>
  );
}

export default SubscribedAIAgents;
