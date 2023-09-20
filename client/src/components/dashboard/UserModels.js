import React from "react";
import { useState, useEffect } from "react";
import "../../styles/dashboard/UserModels.css";
import { modelInstance } from "../Contract";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { ClipLoader } from "react-spinners";

function UserModels() {
  const navigate = useNavigate();
  const [allUserModels, setAllUserModels] = useState([]);
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
        const getDatasetDetails = await con.getAllModelsOfUser();
        setAllUserModels(getDatasetDetails);
        console.log(allUserModels);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    async function fetchUserModels() {
      await allModelData();
      setIsPageLoading(false);
    }
    console.log("hello");
    fetchUserModels();
  }, []);

  return (
    <div className="row mt-4 py-3 px-3 container-fluid  justify-content-around ">
      {isPageLoading ? (
        <div className="d-flex justify-content-center">
          <ClipLoader color="#4250ff" />
        </div>
      ) : allUserModels.length > 0 ? (
        allUserModels.map((item, key) => (
          <div
            className="col-xxl-3 col-md-5 col-sm-7 col-11 mx-1 mb-4 user-model-component"
            index={key}
          >
            <div className="user-model-details">
              <div className="user-model-title">{item.title}</div>
              <div className="user-model-desc">{item.description}</div>
              <div className="user-model-badge">
                {item.isPublic ? "Free" : item.isForSale ? "Paid" : "Private"}
              </div>
              <div
                className="user-model-btn"
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
  );
}

export default UserModels;
