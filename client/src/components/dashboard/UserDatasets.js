import React from "react";
import { useState, useEffect } from "react";
import "../../styles/dashboard/UserDatasets.css";
import img from "../../assets/home/security.png";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { datasetInstance } from "../Contract";

const blocks = [
  {
    title: "Dataset1",
    description: "Description of dataset 1 involves analysing quality data",
  },
  {
    title: "Dataset2",
    description: "Description of dataset 1 involves analysing quality data",
  },
  {
    title: "Dataset3",
    description: "Description of dataset 1 involves analysing quality data",
  },
  {
    title: "Dataset4",
    description: "Description of dataset 1 involves analysing quality data",
  },
  {
    title: "Dataset5",
    description: "Description of dataset 1 involves analysing quality data",
  },
  {
    title: "Dataset6",
    description: "Description of dataset 1 involves analysing quality data",
  },
];

function UserDatasets() {
  //   const [img, setImg] = useState();
  const [userName, setUserName] = useState();
  const [occupation, setOccupation] = useState();
  const navigate = useNavigate();
  const [allUserDatasets, setAllUserDatasets] = useState([]);

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
        const getDatasetDetails = await con.getAllDatasetsOfUser();
        setAllUserDatasets(getDatasetDetails);
        console.log(allUserDatasets);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    async function fetchUserDatasets() {
      await allData();
    }
    console.log("hello");
    fetchUserDatasets();
  }, []);

  return (
    <div className="row px-0 user-dataset-main mt-4 py-3 px-sm-3 container-fluid justify-content-around">
      {allUserDatasets.length > 0 ? (
        allUserDatasets.map((item, key) => (
          <div
            className="col-xxl-3 col-md-5 col-sm-7 col-11 mx-1 mb-5 user-dataset-component"
            index={key}
          >
            <div className="user-dataset-img-div">
              <img
                src={`https://gateway.lighthouse.storage/ipfs/${item.uploadImage}`}
                className="user-dataset-img"
              ></img>
            </div>
            <div className="user-dataset-details">
              <div className="user-dataset-title">{item.title}</div>
              <div className="user-dataset-desc">{item.description}</div>
              <div className="user-dataset-badge">
                {item.isPublic ? "Free" : "Paid"}
              </div>
              <div
                className="user-dataset-btn"
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
  );
}

export default UserDatasets;
