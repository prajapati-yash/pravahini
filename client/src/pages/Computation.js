import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import ComputationAbout from "../components/computation/ComputationAbout";
import ComputationDetails from "../components/computation/ComputationDetails";
import Navbar from "../components/navbar/Navbar";
import Sidebar from "../components/sidebar/Sidebar";
import Footer from "../components/footer/Footer";
import { ethers } from "ethers";
import axios from "axios";
import { useAccount } from "wagmi";
import Cookies from "js-cookie";
import "../styles/computation/ComputationPopup.css";

function Computation() {
  const { address } = useAccount();
  const [signature, setSignature] = useState("");
  const [isPopupVisible, setPopupVisible] = useState(false); // Initialize to true to always show initially
  const popupRef = useRef(null);
  const location = useLocation();

  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL,
  });

  const signMessage = async () => {
    try {
      if (window.ethereum) {
        await window.ethereum.request({ method: "eth_requestAccounts" }); // Prompt user to connect their wallet
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        const messageBytes = ethers.utils.toUtf8Bytes(
          process.env.REACT_APP_MSG_TO_SIGN
        );
        const sig = await signer.signMessage(messageBytes);
        setSignature(sig);
        const res = await axiosInstance.post("/de-computation", {
          address,
          signature,
        });
        const token = res.data.jwtToken;
        Cookies.set("jwtToken", token, { expires: 1 });
        setPopupVisible(false)
      } else {
        console.error("No Ethereum wallet detected");
      }
    } catch (error) {
      console.error("Error signing the message:", error);
    }
  };

  useEffect(() => {
    const prevAddress = Cookies.get("prevAddress");
    if (!prevAddress) {
      Cookies.set("prevAddress", address);
    } else if (address !== prevAddress) {
      Cookies.remove("jwtToken");
      Cookies.set("prevAddress", address);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        hidePopup();
      }
    };
    if (isPopupVisible) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isPopupVisible]);

  useEffect(() => {
    if (location.pathname === "/de-computation") {
      const jwtToken = Cookies.get('jwtToken');
      if (!jwtToken) {
        setPopupVisible(true);
      }
    } else {
      setPopupVisible(false);
    }
  }, [location]);

  const hidePopup = () => {
    setPopupVisible(false);
  };

  const popupClassName = isPopupVisible
    ? "computation-popup-div"
    : "computation-popup-div";
  const popupBg = isPopupVisible ? "popup-background" : "";

  return (
    <div style={{ background: "linear-gradient(to right, #E9F1FF, #B5D2FE)" }}>
      <Navbar />
      <div className="app">
        <div className="container-fluid">
          <div className={`row ${popupBg}`}>
            <div className="col-lg-3">
              <Sidebar />
            </div>
            <div className="col-lg-9">
              <ComputationAbout />
              <ComputationDetails />
            </div>
          </div>
          {isPopupVisible && (
            <div className={popupClassName} ref={popupRef}>
              <div>
                <div className="d-flex justify-content-between">
                  <div className="">Sign the below message</div>
                  <div
                    className=""
                    onClick={hidePopup}
                    style={{ cursor: "pointer" }}
                  >
                    <i class="fa-solid fa-xmark"></i>
                  </div>
                </div>

                <hr />
                <button
                  className="popup-btn"
                  onClick={() => signMessage()}
                >
                  Click ME to sign in for performing the computation
                </button>
              </div>
            </div>
          )} 
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Computation;
