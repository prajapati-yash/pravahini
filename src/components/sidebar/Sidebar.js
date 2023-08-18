import React, { useState, useEffect } from "react";
import "../../styles/sidebar/Sidebar.css";
import { NavLink } from "react-router-dom";
import create1 from "../../assets/sidebar/create-black.png";
import create2 from "../../assets/sidebar/create-white.png";
import dashboard1 from "../../assets/sidebar/dashboard-black.png";
import dashboard2 from "../../assets/sidebar/dashboard-white.png";
import dataset1 from "../../assets/sidebar/dataset-black.png";
import dataset2 from "../../assets/sidebar/dataset-white.png";
import model1 from "../../assets/sidebar/model-black.png";
import model2 from "../../assets/sidebar/model-white.png";
import code1 from "../../assets/sidebar/code-black.png";
import code2 from "../../assets/sidebar/code-white.png";
import computation1 from "../../assets/sidebar/computation-black.png";
import computation2 from "../../assets/sidebar/computation-white.png";

function Sidebar() {
  const [activeComponent, setActiveComponent] = useState("/");
  const [createDropDown, setCreateDropDown] = useState(false);

  const handleItemClick = (componentName) => {
    setActiveComponent(componentName);
  };

  const showCreateDropDown = () => {
    setCreateDropDown(!createDropDown);
  };

  return (
    <div className="sidebar pt-4 sidebar-container position-fixed">
      <div className="collapse show" id="sidebarContent">
        <ul className="nav flex-column">
          <li
            className="nav-item dropdown-center py-2 sidebar-items"
            onClick={showCreateDropDown}
          >
            <a
              className={`nav-link sidebar-content align-items-center ${
                activeComponent === "create" && createDropDown ? "active" : ""
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
                <div className={`d-flex py-1`}>
                  <a href="/dataset/create-dataset" className="link-style">
                    Create Dataset
                  </a>
                </div>
                <div className={`d-flex py-1`}>
                  <a href="/model/create-model" className="link-style">
                    Create Model
                  </a>
                </div>
              </div>
            )}
          </li>
          <li className="nav-item py-2 sidebar-items">
            <NavLink
              className="nav-link sidebar-content align-items-center"
              to="/user-dashboard"
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
              className="nav-link sidebar-content align-items-center"
              to="/dataset-marketplace"
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
              className={`nav-link sidebar-content align-items-center `}
              to="/model-marketplace"
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
              className={`nav-link sidebar-content align-items-center`}
              to="/user-dashboard"
            >
              <img
                className="sidebar-image"
                src={code1}
                height={20}
                width={20}
              />
              <img
                className="sidebar-image-hover"
                src={code2}
                height={20}
                width={20}
              />
              Code
            </NavLink>
          </li>
          <li className="nav-item py-2">
            <NavLink
              className={`nav-link sidebar-content align-items-center`}
              to="/de-computation"
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
