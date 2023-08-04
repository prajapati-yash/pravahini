import { React, useEffect, useState } from "react";
import "../../styles/navbar/Navbar.css";
// import logo from "../../assets/navbar/pravahini-logo1.png";
import logo from "../../assets/navbar/logo.png";
import { ConnectKitButton } from "connectkit";
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

import styled from "styled-components";
const StyledButton = styled.button`
  cursor: pointer;
  position: relative;
  display: inline-block;
  padding: 14px 24px;
  color: #ffffff;
  background: #ffb800;
  font-size: 16px;
  font-weight: 600;
  border: 2px solid white;
  border-radius: 10rem;
  box-shadow: 0 4px 24px -6px #1a88f8;

  transition: 200ms ease;
  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 6px 40px -6px #1a88f8;
  }
  &:active {
    transform: translateY(-3px);
    box-shadow: 0 6px 32px -6px #1a88f8;
  }
`;

const navigation = [
  {
    title: "About Us",
    link: "/",
  },
  {
    title: "Connect Wallet",
    link: "/",
  },
];


export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
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

  const [activeComponent, setActiveComponent] = useState("dashboard");

  const handleItemClick = (componentName) => {
    setActiveComponent(componentName);
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
              <li className="nav-item py-2 d-lg-none">
                <a
                  className={`nav-link navbar-content px-1 p-0 active d-flex align-items-center ${
                    activeComponent === "create" ? "activeState" : ""
                  }`}
                  aria-current="page"
                  href="#"
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
                </a>
              </li>
              <li className="nav-item py-2 d-lg-none">
                <a
                  className={`nav-link navbar-content px-1 p-0 active d-flex align-items-center ${
                    activeComponent === "dashboard" ? "activeState" : ""
                  }`}
                  aria-current="page"
                  href="#"
                  onClick={() => handleItemClick("dashboard")}
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
                </a>
              </li>
              <li className="nav-item py-2 d-lg-none">
                <a
                  className={`nav-link navbar-content px-1 p-0 active d-flex align-items-center ${
                    activeComponent === "dataset" ? "activeState" : ""
                  }`}
                  aria-current="page"
                  href="#"
                  onClick={() => handleItemClick("dataset")}
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
                </a>
              </li>
              <li className="nav-item py-2 d-lg-none">
                <a
                  className={`nav-link navbar-content px-1 p-0 active d-flex align-items-center ${
                    activeComponent === "model" ? "activeState" : ""
                  }`}
                  aria-current="page"
                  href="#"
                  onClick={() => handleItemClick("model")}
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
                </a>
              </li>
              <li className="nav-item py-2 d-lg-none">
                <a
                  className={`nav-link navbar-content px-1 p-0 active d-flex align-items-center ${
                    activeComponent === "code" ? "activeState" : ""
                  }`}
                  aria-current="page"
                  href="#"
                  onClick={() => handleItemClick("code")}
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
                </a>
              </li>
              <li className="nav-item py-2 d-lg-none">
                <a
                  className={`nav-link navbar-content px-1 p-0 active d-flex align-items-center ${
                    activeComponent === "computation" ? "activeState" : ""
                  }`}
                  aria-current="page"
                  href="#"
                  onClick={() => handleItemClick("computation")}
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
                </a>
              </li>

              <div className="py-3 py-lg-none d-flex">
                <ConnectKitButton.Custom>
                  {({ isConnected, show, truncatedAddress, ensName }) => {
                    return (
                      <StyledButton onClick={show}>
                        {isConnected
                          ? ensName ?? truncatedAddress
                          : "Connect Wallet"}
                      </StyledButton>
                    );
                  }}
                </ConnectKitButton.Custom>
              </div>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
function NavLink({ body }) {
  return (
    <li className="nav-item px-2">
      <a className="nav-link p-0 active" aria-current="page" href={body.link}>
        {body.title}
      </a>
    </li>
  );
}
