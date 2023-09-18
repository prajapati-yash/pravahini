import React from "react";
import { useState, useRef } from "react";
import { ethers } from "ethers";
import { authorizationInstance } from "../Contract";
import lighthouse from "@lighthouse-web3/sdk";
import { useNavigate } from "react-router-dom";
import "../../styles/registration/RegistrationPage.css";
import upload from "../../assets/registration/upload.png";
import name from "../../assets/registration/name.png";
import occupation from "../../assets/registration/occupation.png";
import organization from "../../assets/registration/organization.png";
import location from "../../assets/registration/location.png";
import registerImg from "../../assets/registration/registration-bg.png";

function RegistrationPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userName: "",
    userOccupation: "",
    userOrganization: "",
    userLocation: "",
    userImage: "",
  });

  const fileInputRef = useRef(null);
  const [selectedFileName, setSelectedFileName] = useState("");

  const handleLogoClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      setFormData({ ...formData, userImage: selectedFile });
      setSelectedFileName(selectedFile.name); 
    }
  };

  const progressCallback = (progressData) => {
    let percentageDone =
      100 - (progressData?.total / progressData?.uploaded)?.toFixed(2);
    console.log(percentageDone);
  };

  const uploadImage = async () => {
    try {
      console.log("API Key",process.env.REACT_APP_LIGHTHOUSE_API_KEY)
      const fileInput = document.querySelector('input[type="file"]');
      console.log("File: ", fileInput.files);

      const output = await lighthouse.upload(
        fileInput.files,
        process.env.REACT_APP_LIGHTHOUSE_API_KEY,
        false,
        progressCallback
      );
      
      console.log("File Status:", output);
      return output.data.Hash;
    } catch (e) {
      console.log(e);
    }
  };

  const createUserAccount = async () => {
    try {
      console.log("Form data: ", formData);
      const cid = await uploadImage();
      console.log("cid: ", cid);

      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        if (!provider) {
          console.log("Metamask is not installed, please install!");
        }
        const con = await authorizationInstance();
        console.log("Hello");
        const tx = await con.setUser(
          formData.userName,
          formData.userOccupation,
          formData.userOrganization,
          formData.userLocation,
          cid
        );

        console.log(tx);
        await tx.wait();
        navigate("/user-dashboard");
      }
    } catch (e) {
      console.log("Error in creating user account: ", e);
    }
  };

  return (
    <div className="register-main-container">
      <div className="register-heading">Register Here!</div>
      <div className="d-flex flex-lg-row flex-column-reverse align-items-center">
        <div className="col-lg-5">
          <img className="register-hero-img" src={registerImg} />
        </div>
        <div className="content-component col-lg-5">
          <div
            className="d-flex pb-3 upload-container"
            onClick={handleLogoClick}
          >
            <img className="img-upload" src={upload} id="img-upload"></img>
            <div className="upload-text">Upload Image</div>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            ></input>
          </div>

          <div className="selected-image">
            {selectedFileName && <p>Selected Image: {selectedFileName}</p>}
          </div>

          {/* Registration Details */}

          <div className="">
            <div className="d-flex flex-column flex-lg-row py-2 py-sm-2 py-md-3 register-input-component">
              <div className="d-flex col-6 col-xl-4 register-input-text-component">
                <img className="col-2 register-input-img" src={name} />
                <div className="col-lg-5 col-xl-4 px-sm-4 px-3 register-input-text">
                  Name*
                </div>
              </div>
              <div className="d-flex col-6 register-input-field">
                <input
                  type="text"
                  id="form-data"
                  name="form-data"
                  className="py-md-1 py-sm-1 input-form-data"
                  placeholder="Enter your name"
                  value={formData.userName}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      userName: e.target.value,
                    });
                  }}
                  required
                />
              </div>
            </div>

            <div className="d-flex flex-column flex-lg-row py-2 py-sm-2 py-md-3 register-input-component">
              <div className="d-flex col-6 col-xl-4 register-input-text-component">
                <img className="col-2 register-input-img" src={occupation} />
                <div className="col-lg-5 col-xl-4 px-sm-4 px-3 register-input-text">
                  Occupation
                </div>
              </div>
              <div className="d-flex col-6 register-input-field">
                <input
                  type="text"
                  id="form-data"
                  name="form-data"
                  className="py-md-1 py-sm-1 input-form-data"
                  placeholder="Enter your occupation"
                  value={formData.userOccupation}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      userOccupation: e.target.value,
                    });
                  }}
                />
              </div>
            </div>

            <div className="d-flex flex-column flex-lg-row py-2 py-sm-2 py-md-3 register-input-component">
              <div className="d-flex col-6 col-xl-4 register-input-text-component">
                <img className="col-2 register-input-img" src={organization} />
                <div className="col-lg-5 col-xl-4 px-sm-4 px-3 register-input-text">
                  Organization
                </div>
              </div>
              <div className="d-flex col-6 register-input-field">
                <input
                  type="text"
                  id="form-data"
                  name="form-data"
                  className="py-md-1 py-sm-1 input-form-data"
                  placeholder="Enter your occupation"
                  value={formData.userOrganization}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      userOrganization: e.target.value,
                    });
                  }}
                />
              </div>
            </div>

            <div className="d-flex flex-column flex-lg-row py-2 py-sm-2 py-md-3 register-input-component">
              <div className="d-flex col-6 col-xl-4 register-input-text-component">
                <img className="col-2 register-input-img" src={location} />
                <div className="col-lg-5 col-xl-4 px-sm-4 px-3 register-input-text">
                  Location
                </div>
              </div>
              <div className="d-flex col-6 register-input-field">
                <input
                  type="text"
                  id="form-data"
                  name="form-data"
                  className="py-md-1 py-sm-1 input-form-data"
                  placeholder="Enter your occupation"
                  value={formData.userLocation}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      userLocation: e.target.value,
                    });
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn rounded-pill my-2 py-sm-2 px-sm-5 px-4 register-btn"
              onClick={createUserAccount}
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegistrationPage;
