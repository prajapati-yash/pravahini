import React from "react";
import { useState, useEffect } from "react";
import "../../styles/dashboard/SubscribedModels.css";
import img from "../../assets/home/security.png";
import { modelInstance } from "../Contract";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { ClipLoader } from "react-spinners";

function SubscribedModels() {
  const navigate = useNavigate();
  const [allSubscribedModels, setAllSubscribedModels] = useState([]);
  const [isPageLoading, setIsPageLoading] = useState(true);

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
        const getDatasetDetails = await con.getAllModelsSubscriptionOfUser();
        setAllSubscribedModels(getDatasetDetails);
        console.log(allSubscribedModels);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    async function fetchSubscribedModels() {
      await allModelData();
      setIsPageLoading(false);
    }
    console.log("hello");
    fetchSubscribedModels();
  }, []);

  return (
    <div className="row mt-4 py-3 px-3 container-fluid  justify-content-around ">
      {isPageLoading ? (
        <div className="d-flex justify-content-center">
          <ClipLoader color="#4250ff" />
        </div>
      ) : allSubscribedModels.length > 0 ? (
        allSubscribedModels.map((item, key) => (
          <div
            className="col-xxl-3 col-md-5 col-sm-7 col-11 mx-1 mb-4 subscribed-model-component"
            index={key}
          >
            <div className="subscribed-model-details">
              <div className="subscribed-model-title">{item.title}</div>
              <div className="subscribed-model-desc">{item.description}</div>
              <div className="subscribed-model-badge">Free</div>
              <div
                className="subscribed-model-btn"
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
        <div>No Subscribed Models Available</div>
      )}
    </div>
  );
}

export default SubscribedModels;
