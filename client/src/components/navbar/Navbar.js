import { React, useEffect, useState } from "react";
import "../../styles/navbar/Navbar.css";
// import logo from "../../assets/navbar/pravahini-logo1.png";
import { NavLink } from "react-router-dom";
import logo from "../../assets/navbar/logo.png";
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
import { ConnectButton } from "@rainbow-me/rainbowkit";


function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeComponent, setActiveComponent] = useState("/");
  const [createDropDown, setCreateDropDown] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);


  const handleItemClick = (componentName) => {
    setActiveComponent(componentName);
  };

  const showCreateDropDown = () => {
    setCreateDropDown(!createDropDown);
  };


  return (
    <>
      <nav
        className={`navbar navbar-expand-lg navbar-light sticky-top py-2 ${
          scrolled ? "scrolled" : ""
        } `}
        role="navigation"
      >
        <div className="container-fluid px-4 px-md-5 navbar">
          <a className="d-flex navbar-brand" href="/">
            {/* <h1>LOGO</h1> */}
            <img src={logo} className="img-logo" />
          </a>

          <button
            type="button"
            className="navbar-toggler collapsed d-flex d-lg-none flex-column justify-content-around"
            data-bs-toggle="collapse"
            data-bs-target="#navbarRightAlignExample"
            aria-controls="navbarRightAlignExample"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="toggler-icon top-bar"></span>
            <span className="toggler-icon middle-bar"></span>
            <span className="toggler-icon bottom-bar"></span>
          </button>

          <div
            className="collapse navbar-collapse justify-content-end"
            id="navbarRightAlignExample"
          >
            <ul className="navbar-nav ml-auto align-items-center mb-2 mb-lg-0 navbar-container">
              <li
                className="nav-item py-2 d-lg-none"
                onClick={showCreateDropDown}
              >
                <a
                  className={`nav-link navbar-content px-1 p-0 d-flex align-items-center ${
                    activeComponent === "create" && createDropDown
                      ? "active"
                      : ""
                  }`}
                  onClick={() => handleItemClick("create")}
                >
                  <img
                    className="navbar-image"
                    src={create1}
                    height={20}
                    width={20}
                  />
                  <img
                    className="navbar-image-hover"
                    src={create2}
                    height={20}
                    width={20}
                  />
                  Create

                  <div className="px-2">
                    <i
                      className="fas fa-angle-down"
                      style={{
                        transform: createDropDown
                          ? "rotate(-180deg)"
                          : "rotate(0)",
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
                      <a href="/dataset-marketplace/create-dataset" className="link-style">
                        Create Dataset
                      </a>
                    </div>
                    <div className={`d-flex py-1`}>
                      <a href="/model-marketplace/create-model" className="link-style">
                        Create Model
                      </a>
                    </div>
                  </div>
                )}
              </li>
              <li className="nav-item py-2 d-lg-none">
                <NavLink
                  className="nav-link navbar-content px-1 p-0 d-flex align-items-center"
                  to="/user-dashboard"
                >
                  <img
                    className="navbar-image"
                    src={dashboard1}
                    height={18}
                    width={18}
                  />
                  <img
                    className="navbar-image-hover"
                    src={dashboard2}
                    height={18}
                    width={18}
                  />
                  Dashboard
                </NavLink>
              </li>
              <li className="nav-item py-2 d-lg-none">
                <NavLink
                  className="nav-link navbar-content px-1 p-0 d-flex align-items-center"
                  to="/dataset-marketplace"
                >
                  <img
                    className="navbar-image"
                    src={dataset1}
                    height={20}
                    width={20}
                  />
                  <img
                    className="navbar-image-hover"
                    src={dataset2}
                    height={20}
                    width={20}
                  />
                  Dataset Marketplace
                </NavLink>
              </li>
              <li className="nav-item py-2 d-lg-none">
                <NavLink
                  className="nav-link navbar-content px-1 p-0 d-flex align-items-center"
                  to="/model-marketplace"
                >
                  <img
                    className="navbar-image"
                    src={model1}
                    height={20}
                    width={20}
                  />
                  <img
                    className="navbar-image-hover"
                    src={model2}
                    height={20}
                    width={20}
                  />
                  Model Marketplace
                </NavLink>
              </li>
              {/* <li className="nav-item py-2 d-lg-none">
                <NavLink
                  className="nav-link navbar-content px-1 p-0 d-flex align-items-center"
                  to="/user-dashboard"
                >
                  <img
                    className="navbar-image"
                    src={code1}
                    height={20}
                    width={20}
                  />
                  <img
                    className="navbar-image-hover"
                    src={code2}
                    height={20}
                    width={20}
                  />
                  Code
                </NavLink>
              </li> */}
              <li className="nav-item py-2 d-lg-none">
                <NavLink
                  className="nav-link navbar-content px-1 p-0 d-flex align-items-center"
                  to="/de-computation"
                >
                  <img
                    className="navbar-image"
                    src={computation1}
                    height={20}
                    width={20}
                  />
                  <img
                    className="navbar-image-hover"
                    src={computation2}
                    height={20}
                    width={20}
                  />
                  Decentralized Computation
                </NavLink>
              </li>

              <li className="nav-item py-2">
                <ConnectButton />
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
export default Navbar;