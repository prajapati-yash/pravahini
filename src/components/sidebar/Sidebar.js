import React, { useState } from "react";
import "../../styles/sidebar/Sidebar.css";
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
  const [activeComponent, setActiveComponent] = useState("dashboard");

  const handleItemClick = (componentName) => {
    setActiveComponent(componentName);
  };

  return (
    <div className="sidebar pt-4 sidebar-container">
      <div className="collapse show" id="sidebarContent">
        <ul className="nav flex-column">
          <li className="nav-item dropdown-center py-2 sidebar-items">
            <a
              className={`nav-link dropdown-toggle sidebar-content align-items-center ${
                activeComponent === "create" ? "active" : ""
              }`}
              href="#"
              role="button" 
              data-bs-toggle="dropdown"
              aria-expanded="false"
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
            </a>
            <ul class="dropdown-menu">
              <li><a class="dropdown-item" href="#">Create Dataset</a></li>
              <li><a class="dropdown-item" href="#">Create Model</a></li>
            </ul>
          </li>
          <li className="nav-item py-2 sidebar-items">
            <a
              className={`nav-link sidebar-content align-items-center ${
                activeComponent === "dashboard" ? "active" : ""
              }`}
              href="/user-dashboard"
              onClick={() => handleItemClick("dashboard")}
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
            </a>
          </li>
          <li className="nav-item py-2">
            <a
              className={`nav-link sidebar-content align-items-center ${
                activeComponent === "dataset" ? "active" : ""
              }`}
              href="#"
              onClick={() => handleItemClick("dataset")}
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
            </a>
          </li>
          <li className="nav-item py-2">
            <a
              className={`nav-link sidebar-content align-items-center ${
                activeComponent === "model" ? "active" : ""
              }`}
              href="#"
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
            </a>
          </li>
          <li className="nav-item py-2">
            <a
              className={`nav-link sidebar-content align-items-center ${
                activeComponent === "code" ? "active" : ""
              }`}
              href="#"
              onClick={() => handleItemClick("code")}
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
            </a>
          </li>
          <li className="nav-item py-2">
            <a
              className={`nav-link sidebar-content align-items-center ${
                activeComponent === "computation" ? "active" : ""
              }`}
              href="#"
              onClick={() => handleItemClick("computation")}
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
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
