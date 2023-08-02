import React from "react";
import { useState, useRef } from "react";
import "../../styles/registration/RegistrationPage.css";
import upload from "../../assets/registration/upload.png";
import name from "../../assets/registration/name.png";
import occupation from "../../assets/registration/occupation.png";
import organization from "../../assets/registration/organization.png";
import location from "../../assets/registration/location.png";
import registerImg from "../../assets/registration/registration-bg.png";

function RegistrationPage() {
  const [formData, setFormData] = useState({
    userName: null,
    userOccupation: null,
    userOrganization: null,
    userLocation: null,
    userImage: null,
  });

  const fileInputRef = useRef(null);
  const [selectedFileName, setSelectedFileName] = useState("");

  const handleLogoClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    // Do whatever you need to do with the selected file
    // For example, you can read the file data using FileReader API
    if (selectedFile) {
      const reader = new FileReader();

      reader.onloadend = () => {
        const fileData = reader.result;
        // Now you can use the file data as needed
        console.log("File Data:", fileData);
      };

      reader.readAsDataURL(selectedFile); // Read file as data URL (you can use other methods depending on your requirements)
      setSelectedFileName(selectedFile.name);
    }
  };

  const howWorksContent = [
    {
      thumbnail: name,
      head: "Name",
      placeholder: "Enter your name",
      value: formData.userName,
    },
    {
      thumbnail: occupation,
      head: "Occupation",
      placeholder: "Enter your occupation",
      value: formData.userOccupation,
    },
    {
      thumbnail: organization,
      head: "Organization",
      placeholder: "Enter your organization",
      value: formData.userOrganization,
    },
    {
      thumbnail: location,
      head: "Location",
      placeholder: "Enter your location",
      value: formData.userLocation,
    },
  ];

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

          <div className="">
            {howWorksContent.map((item, key) => (
              <div className="d-flex flex-column flex-lg-row py-2 py-sm-3 register-input-component">
                <div className="d-flex col-md-6 col-xl-4 register-input-text-component">
                  <img
                    className="col-2 register-input-img"
                    src={item.thumbnail}
                  />
                  <div className="col-lg-5 col-xl-4 px-4 register-input-text">
                    {item.head}
                  </div>
                </div>
                <div className="col-md-6 register-input-field">
                  <input
                    type="text"
                    id="userName"
                    name="userName"
                    className="py-sm-2 py-1 input-form-data"
                    placeholder={item.placeholder}
                    value={item.value}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        [item.value]: e.target.value,
                      });
                    }}
                    required
                  />
                </div>
              </div>
            ))}

            <button
              type="submit"
              className="btn rounded-pill my-2 py-2 px-5 register-btn"
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
