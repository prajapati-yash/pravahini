import React, { useEffect, useState } from "react";
import "../../styles/navbar/Navbar.css";
import "../../styles/navbar/LandingNavbar.css";
import { NavLink } from "react-router-dom";
import logo from "../../assets/navbar/logo.png";
import create1 from "../../assets/sidebar/create-black.png";
import create2 from "../../assets/sidebar/create-white.png";
import { ConnectButton } from "@rainbow-me/rainbowkit";

function LandingNavbar() {
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
            <ul className="d-lg-flex navbar-nav align-items-center mb-2 mb-lg-0 navbar-container">
              <li className="nav-item py-2 px-lg-2">
                <a
                  className="nav-link px-1 p-0 d-flex align-items-center"
                  href="/dataset-marketplace"
                >
                  <span className="landing-navbar">Dataset Marketplace</span>
                </a>
              </li>
              <li className="nav-item py-2 px-lg-2">
                <a
                  className="nav-link px-1 p-0 d-flex align-items-center"
                  href="/model-marketplace"
                >
                  <span className="landing-navbar">Model Marketplace</span>
                </a>
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

export default LandingNavbar;
