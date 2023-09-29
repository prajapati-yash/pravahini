import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authorizationInstance } from "../Contract";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import "../../styles/home/HomeHero.css";
import arrow from "../../assets/home/arrow.png";
import union from "../../assets/home/union-2.png";
import heroimg from "../../assets/home/heroImage.png";
import security from "../../assets/home/security.png";
import unioncopy from "../../assets/home/union-copy.png";

function HomeHero() {
  const navigate = useNavigate();
  const { address } = useAccount();
  const { openConnectModal } = useConnectModal();

  const [isShaking, setShaking] = useState(false);;

  useEffect(() => {
    const interval = setInterval(() => {
      setShaking(!isShaking);
    }, 1500);

    return () => {
      clearInterval(interval);
    };
  }, [isShaking]);

  const startBtnStyle = {
    animation: isShaking ? "shake 1.5s ease-in-out" : "none",
    transformOrigin: "center",
    boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.3)",
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

  const connectWallet = async () => {
    if (address) {
      const test = await verifyUserAccount();
      console.log(test);
      if (test) {
        navigate("/user-dashboard");
        window.location.reload();
      } else {
        navigate("/register");
      }
    } else {
      openConnectModal();
    }
  };

  return (
    <div className="d-flex flex-lg-row flex-column hero-main-container px-4 px-sm-5 my-xl-4 mx-2">
      <div className="container-fluid hero-container px-4 py-3 px-sm-5 py-sm-4 col-lg-6">
        <div>
          <p className="hero-text">Welcome to Pravahini (प्रवाहिनी)</p>
          <p className="hero-sub-text ">
          Discover and access datasets for your machine learning models, purchase pre-trained ML models, list your own datasets and ML models for sale, and harness decentralized computing for your machine learning tasks.
          </p>
        </div>

        <div className="get-started-container justify-content-center">
          <div
            className="hero-button ps-3 d-flex align-items-center "
            onClick={() => connectWallet()}
            style={startBtnStyle}
          >
            <span className="py-3 hero-button-text ">Get Started</span>

            <span className="d-end hero-arrow mx-2 ">
              <img className="img-arrow" src={arrow} alt="" srcset="" />
            </span>
          </div>
        </div>
      </div>
      <div className="col-lg-6 hero-img-container">
        <img className="img-union" src={union} />
        <img className="img-security " src={security} />
        <img className="img-hero" src={heroimg} />
        <img className="img-union1" src={unioncopy} />
        {/* <img className="img-search" src={search} />
        <img className="img-link" src={link} /> */}
      </div>
    </div>
  );
}

export default HomeHero;
