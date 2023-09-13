import React from "react";
import { useState, useEffect } from "react";
import "../../styles/dashboard/SubscribedDatasets.css";
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

function SubscribedDatasets() {
  //   const [img, setImg] = useState();
  const [userName, setUserName] = useState();
  const [occupation, setOccupation] = useState();
  const navigate = useNavigate();
  const datasetDivRef = React.useRef(null);
  const [filterDropdown, setFilterDropdown] = useState(false);
  const [allSubscribedDatasets, setAllSubscribedDatasets] = useState([]);

  const allSubscribedData = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        if (!provider) {
          console.log("Metamask is not installed, please install!");
        }
        const con = await datasetInstance();
        const getDatasetDetails = await con.getAllDatasetsSubscriptionOfUser();
        setAllSubscribedDatasets(getDatasetDetails);
        console.log(allSubscribedDatasets);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    async function fetchSubscribedDatasets() {
      await allSubscribedData();
    }
    console.log("hello");
    fetchSubscribedDatasets();
  }, []);

  return (
    <div className="row mt-4 subscribed-dataset-main py-3 px-sm-3 container-fluid justify-content-around ">
      {allSubscribedDatasets.length > 0 ? (
        allSubscribedDatasets.map((item, key) => (
          <div
            className="col-xxl-3 col-md-5 col-sm-7 col-11 mx-1 mb-5 subscribed-dataset-component"
            index={key}
          >
            <div className="subscribed-dataset-img-div">
              <img src={img} className="subscribed-dataset-img"></img>
            </div>
            <div className="subscribed-dataset-details">
              <div className="subscribed-dataset-title">{item.title}</div>
              <div className="subscribed-dataset-desc">{item.description}</div>
              <div className="subscribed-dataset-badge">Free</div>
              <div className="subscribed-dataset-btn">View More &gt;</div>
            </div>
          </div>
        ))
      ) : (
        <div>No Subscribed Datasets Available</div>
      )}
    </div>
  );
}

export default SubscribedDatasets;
