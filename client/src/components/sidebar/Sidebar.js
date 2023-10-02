import React, { useState, useEffect } from "react";
import "../../styles/sidebar/Sidebar.css";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import create1 from "../../assets/sidebar/create-black.png";
import create2 from "../../assets/sidebar/create-white.png";
import dashboard1 from "../../assets/sidebar/dashboard-black.png";
import dashboard2 from "../../assets/sidebar/dashboard-white.png";
import dataset1 from "../../assets/sidebar/dataset-black.png";
import dataset2 from "../../assets/sidebar/dataset-white.png";
import model1 from "../../assets/sidebar/model-black.png";
import model2 from "../../assets/sidebar/model-white.png";
import computation1 from "../../assets/sidebar/computation-black.png";
import computation2 from "../../assets/sidebar/computation-white.png";
import { authorizationInstance } from "../Contract";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import { useConnectModal } from "@rainbow-me/rainbowkit";

function Sidebar() {
  const [activeComponent, setActiveComponent] = useState("/");
  const [createDropDown, setCreateDropDown] = useState(false);
  const navigate = useNavigate();
  const { address } = useAccount();
  const { openConnectModal } = useConnectModal();
  const location = useLocation();
  const currentPath = location.pathname;

  const handleItemClick = (componentName) => {
    setActiveComponent(componentName);
  };

  const showCreateDropDown = () => {
    setCreateDropDown(!createDropDown);
  };

  const verifyUserAccount = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        if (!provider) {
          console.log("Metamask is not installed, please install!");
        }
        const con = await authorizationInstance();
        const verifyTx = await con.isRegistered(address);
        // result = verifyTx
        console.log(verifyTx);
        // console.log(con);
        return verifyTx;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDatasetClick = async () => {
    if (address) {
      const test = await verifyUserAccount();
      console.log("Test", test);
      if (test) {
        navigate("/dataset-marketplace/create-dataset");
      } else {
        navigate("/register");
      }
    } else {
      openConnectModal();
    }
  };

  const handleModelClick = async () => {
    if (address) {
      const test = await verifyUserAccount();
      console.log("Test", test);
      if (test) {
        navigate("/model-marketplace/create-model");
      } else {
        navigate("/register");
      }
    } else {
      openConnectModal();
    }
  };


  const handleDashboardClick = async () => {
    // window.location.reload();
    if (address) {
      const test = await verifyUserAccount();
      console.log("Test", test);
      if (test) {
        // window.location.reload();
        navigate("/user-dashboard");
        window.location.reload();
      } else {
        navigate("/register");
      }
    } else {
      openConnectModal();
    }
  };

  const handleCompClick = async () => {
    if (address) {
      const test = await verifyUserAccount();
      console.log("Test", test);
      if (test) {
        navigate("/de-computation");
      } else {
        navigate("/register");
      }
    } else {
      openConnectModal();
    }
  };

  return (
    <div className="sidebar pt-4 sidebar-container position-fixed">
      <div className="collapse show" id="sidebarContent">
        <ul className="nav flex-column">
          <li
            className="nav-item dropdown-center py-2 sidebar-items"
            onClick={showCreateDropDown}
            style={{ cursor: "pointer" }}
          >
            <a
              className={`nav-link sidebar-content align-items-center ${
                activeComponent === "create" && createDropDown
                  ? "activeStyle"
                  : ""
              }`}
              onClick={() => handleItemClick("create")}
            >
              <img
                className="sidebar-create sidebar-image"
                src={create1}
                height={20}
                width={20}
              />
              <img
                className="sidebar-image-hover"
                src={create2}
                height={20}
                width={20}
              />
              Create
              <div className="px-2">
                <i
                  className="fas fa-angle-down"
                  style={{
                    transform: createDropDown ? "rotate(-180deg)" : "rotate(0)",
                    transition: "transform 0.5s ease-in-out",
                  }}
                ></i>
              </div>
            </a>
            {createDropDown && (
              <div
                className="create-dropdown p-3 text-center"
                onClick={showCreateDropDown}
              >
                <div className={`d-flex py-1 submenu-div`}>
                  <a
                    // href="/dataset-marketplace/create-dataset"
                    className="link-style"
                    onClick={handleDatasetClick}
                  >
                    Create Dataset
                  </a>
                </div>
                <div className={`d-flex py-1 submenu-div`}>
                  <a
                    // href="/model-marketplace/create-model"
                    className="link-style"
                    onClick={handleModelClick}
                  >
                    Create Model
                  </a>
                </div>
              </div>
            )}
          </li>
          <li className="nav-item py-2 sidebar-items">
            <NavLink
              className={`nav-link sidebar-content align-items-center ${
                currentPath.includes("/user-dashboard") ? "activeStyle" : ""
              }`}
              onClick={() => {
                handleDashboardClick();
              }}
            >
              <img
                className="sidebar-image"
                src={dashboard1}
                height={18}
                width={18}
              />
              <img
                className="sidebar-image-hover"
                src={dashboard2}
                height={18}
                width={18}
              />
              Dashboard
            </NavLink>
          </li>
          <li className="nav-item py-2">
            <NavLink
              className={`nav-link sidebar-content align-items-center ${
                currentPath.includes("/dataset-marketplace")
                  ? "activeStyle"
                  : ""
              }`}
              to="/dataset-marketplace"
              onClick={() => handleItemClick()}
            >
              <img
                className="sidebar-image"
                src={dataset1}
                height={20}
                width={20}
              />
              <img
                className="sidebar-image-hover"
                src={dataset2}
                height={20}
                width={20}
              />
              Dataset Marketplace
            </NavLink>
          </li>
          <li className="nav-item py-2">
            <NavLink
              className={`nav-link sidebar-content align-items-center ${
                currentPath.includes("/model-marketplace") ? "activeStyle" : ""
              }`}
              to="/model-marketplace"
              onClick={() => handleItemClick("model")}
            >
              <img
                className="sidebar-image"
                src={model1}
                height={20}
                width={20}
              />
              <img
                className="sidebar-image-hover"
                src={model2}
                height={20}
                width={20}
              />
              Model Marketplace
            </NavLink>
          </li>
          <li className="nav-item py-2">
            <NavLink
              className={`nav-link sidebar-content align-items-center ${
                currentPath.includes("/de-computation") ? "activeStyle" : ""
              }`}
              onClick={handleCompClick}
            >
              <img
                className="sidebar-image"
                src={computation1}
                height={20}
                width={20}
              />
              <img
                className="sidebar-image-hover"
                src={computation2}
                height={20}
                width={20}
              />
              Decentralized computation
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
