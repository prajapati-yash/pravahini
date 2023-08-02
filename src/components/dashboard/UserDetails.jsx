import React, { useState } from "react";
import "../../styles/dashboard/UserDetails.css";
import img from "../../assets/home/link.png";
import { useNavigate } from "react-router-dom";
import UserDatasets from "./UserDatasets";
import UserModels from "./UserModels";
import SubscribedDatasets from "./SubscribedDatasets";
import SubscribedModels from "./SubscribedModels";

function UserDetails() {
  // const [img, setImg] = useState();
  const [userName, setUserName] = useState();
  const [occupation, setOccupation] = useState();
  const [organization, setOrganization] = useState();
  const [location, setLocation] = useState();
  const [showButtons, setShowButtons] = useState(false);
  const [activeComponent, setActiveComponent] = useState("userDatasets");
  const navigate = useNavigate();

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
      <div className="d-flex flex-sm-row flex-column user-details-component py-4 px-1">
        <div className="d-flex align-items-center justify-content-center">
          <img src={img} className="dash-image " />
        </div>
        <div className="py-4 col-md-8 col-sm-9 user-details-content">
          <div className="user-main-content">
            Welcome, <span>userName</span>
          </div>
          <div className="platform-content">
            This Platform evaluation and sharing of datasets as well as ML
            Models.
          </div>
          <div>
            <div className="d-flex py-1 details-content">
              <div className="col-md-3 px-3 px-sm-0 col-sm-4 col-5 d-flex justify-content-flex-start user-details-head">Occupation</div>
              <div className="col-md-4 col-6 user-details-div">{occupation}</div>
            </div>
            <div className="d-flex py-1 details-content">
              <div className="col-md-3 px-3 px-sm-0 col-sm-4 col-5 d-flex justify-content-flex-start user-details-head">Organization</div>
              <div className="col-md-4 col-6 user-details-div">{organization}</div>
            </div>
            <div className="d-flex py-1 details-content">
              <div className="col-md-3 px-3 px-sm-0 col-sm-4 col-5 d-flex justify-content-flex-start user-details-head">Location</div>
              <div className="col-md-4 col-6 user-details-div">{location}</div>
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
                  activeComponent === "subscribedModels"
                    ? "active-button"
                    : ""
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
