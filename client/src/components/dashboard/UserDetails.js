import React, { useState, useEffect } from "react";
import "../../styles/dashboard/UserDetails.css";
import { useNavigate } from "react-router-dom";
import UserDatasets from "./UserDatasets";
import UserModels from "./UserModels";
import SubscribedDatasets from "./SubscribedDatasets";
import SubscribedModels from "./SubscribedModels";
import { ethers } from "ethers";
import { authorizationInstance } from "../Contract";
import { useAccount } from "wagmi";
import { ClipLoader } from "react-spinners";

function UserDetails() {
  const [img, setImg] = useState();
  const [userName, setUserName] = useState();
  const [occupation, setOccupation] = useState();
  const [organization, setOrganization] = useState();
  const [location, setLocation] = useState();
  const [showButtons, setShowButtons] = useState(false);
  const [activeComponent, setActiveComponent] = useState("userDatasets");
  const { address } = useAccount();
  const navigate = useNavigate();
  const [isPageLoading, setIsPageLoading] = useState(true);

  const handleDatasetClick = (e) => {
    setShowButtons(false);
    e.preventDefault();
    navigate("/user-dashboard");
    setActiveComponent("userDatasets");
  };

  const handleModelClick = (e) => {
    setShowButtons(false);
    e.preventDefault();
    navigate("/user-dashboard/user-dashboard-models");
    setActiveComponent("userModels");
  };

  const handleSubscribedDatasets = (e) => {
    e.preventDefault();
    navigate("/user-dashboard/subscription/user-datasets");
    setShowButtons(true);
    setActiveComponent("subscribedDatasets");
  };

  const handleSubscribedModels = (e) => {
    e.preventDefault();
    navigate("/user-dashboard/subscription/user-models");
    setActiveComponent("subscribedModels");
  };

  const getUserAccountDetails = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        if (!provider) {
          console.log("Metamask is not installed, please install!");
        }
        const con = await authorizationInstance();
        const userData = await con.getUser(address);

        console.log(userData);
        setUserName(userData[0]);
        setOccupation(userData[1]);
        setOrganization(userData[2]);
        setLocation(userData[3]);
        setImg(userData[4]);

        return userData;
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserAccountDetails();
    setIsPageLoading(false);
  }, []);

  const renderComponent = () => {
    switch (activeComponent) {
      case "userDatasets":
        return <UserDatasets />;
      case "userModels":
        return <UserModels />;
      case "subscribedDatasets":
        return <SubscribedDatasets />;
      case "subscribedModels":
        return <SubscribedModels />;
      default:
        return <UserDatasets />;
    }
  };

  return (
    <div className="dashboard-main-component">
      <div className="d-flex flex-md-row flex-column user-details-component py-4 px-1">
        <div className="col-md-4 d-flex align-items-center justify-content-center">
          <img
            src={"https://gateway.lighthouse.storage/ipfs/" + img}
            alt="logo"
            className="dash-image"
          />
        </div>
        <div className="py-sm-4 col-md-8 user-details-content">
          <div className="user-main-content">
            Welcome, <span>{userName}</span>
          </div>
          <div className="platform-content">
            Pravahini facilitates the assessment and sharing of datasets and ML
            models while also enabling decentralized computing capabilities.
          </div>
          <div className="pt-2">
            <div className="d-flex py-1 details-content">
              <div className="col-sm-3 px-3 px-sm-0 col-5 d-flex justify-content-flex-start user-details-head">
                Occupation
              </div>
              <div className="d-flex col-md-4 col-sm-7 col-6 user-details-div">
                {occupation}
              </div>
            </div>
            <div className="d-flex py-1 details-content">
              <div className="col-sm-3 px-3 px-sm-0 col-5 d-flex justify-content-flex-start user-details-head">
                Organization
              </div>
              <div className="d-flex col-md-4 col-sm-7 col-6 user-details-div">
                {organization}
              </div>
            </div>
            <div className="d-flex py-1 details-content">
              <div className="col-sm-3 px-3 px-sm-0 col-5 d-flex justify-content-flex-start user-details-head">
                Location
              </div>
              <div className="d-flex col-md-4 col-sm-7 col-6 user-details-div">
                {location}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="d-flex py-4 justify-content-center dashboard-btns">
          <button
            type="button"
            className={`mx-sm-3 mx-2 dashboard-dataset-btn ${
              activeComponent === "userDatasets" ? "active-button" : ""
            }`}
            onClick={handleDatasetClick}
          >
            All Datasets
          </button>
          <button
            type="button"
            className={`mx-sm-3 mx-2 dashboard-model-btn ${
              activeComponent === "userModels" ? "active-button" : ""
            }`}
            onClick={handleModelClick}
          >
            All Models
          </button>
          <button
            type="button"
            className={`mx-sm-3 mx-2 dashboard-subscription-btn ${
              showButtons === true ? "active-button" : ""
            }`}
            onClick={handleSubscribedDatasets}
          >
            Subscription
          </button>
        </div>
        <div>
          {showButtons && (
            <div>
              <button
                className={`my-sm-4 mx-sm-3 my-3 mx-2 px-4 py-2 subscription-dataset-btn ${
                  activeComponent === "subscribedDatasets"
                    ? "active-button"
                    : ""
                }`}
                onClick={handleSubscribedDatasets}
              >
                Datasets
              </button>
              <button
                className={`my-sm-4 mx-sm-3 my-3 mx-2 px-4 py-2 subscription-model-btn ${
                  activeComponent === "subscribedModels" ? "active-button" : ""
                }`}
                onClick={handleSubscribedModels}
              >
                Models
              </button>
            </div>
          )}
        </div>
        <>{renderComponent()}</>
      </div>
    </div>
  );
}

export default UserDetails;
