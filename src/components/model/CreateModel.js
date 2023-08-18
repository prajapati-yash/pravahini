import React, { useState, useRef } from "react";
import upload from "../../assets/registration/upload.png";
import "../../styles/model/CreateModel.css";
import Navbar from "../navbar/Navbar";
import Sidebar from "../sidebar/Sidebar";
import Footer from "../footer/Footer";

function CreateModel() {
  const [createModel, setCreateModel] = useState({
    modelTitle: "",
    modelDescription: "",
    modelCategory: "",
    modelPrice: "",
    modelTags: "",
    modelUpload: "",
    modelLicence: "",
    modelDocumentation: "",
  });

  const fileInputRefModel = useRef(null);
  const [selectedFileNameModel, setSelectedFileNameModel] = useState("");

  const fileInputRefLicence = useRef(null);
  const [selectedFileNameLicence, setSelectedFileNameLicence] = useState("");

  const fileInputRefModelDoc = useRef(null);
  const [selectedFileNameModelDoc, setSelectedFileNameModelDoc] = useState("");

  const handleModelClick = () => {
    fileInputRefModel.current.click();
  };

  const handleLicenceClick = () => {
    fileInputRefLicence.current.click();
  };

  const handleModelDocClick = () => {
    fileInputRefModelDoc.current.click();
  };

  const handleFileChangeModel = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();

      reader.onloadend = () => {
        const fileData = reader.result;
        console.log("File Data:", fileData);
        setCreateModel({
          ...createModel,
          modelUpload: fileData,
        });
      };

      reader.readAsDataURL(selectedFile);
      setSelectedFileNameModel(selectedFile.name);
    }
  };

  const handleFileChangeLicence = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();

      reader.onloadend = () => {
        const fileData = reader.result;
        console.log("File Data:", fileData);
        setCreateModel({
          ...createModel,
          modelLicence: fileData,
        });
      };

      reader.readAsDataURL(selectedFile);
      setSelectedFileNameLicence(selectedFile.name);
    }
  };

  const handleFileChangeModelDoc = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();

      reader.onloadend = () => {
        const fileData = reader.result;
        console.log("File Data:", fileData);
        setCreateModel({
          ...createModel,
          modelDocumentation: fileData,
        });
      };

      reader.readAsDataURL(selectedFile);
      setSelectedFileNameModelDoc(selectedFile.name);
    }
  };

  return (
    <div>
      <div className="d-flex py-3 px-md-5 px-sm-4 px-sm-3 justify-content-center">
        <div className="col-lg-11 col-10 py-4 create-model-main-container">
          <div className="py-sm-4 py-3 create-model-heading">Create Model</div>
          <div className="create-model-content py-2">
            <div className="py-2">
              <div className="d-flex justify-content-flex-start create-model-head">
                Model Title *
              </div>
              <div className="">
                <input
                  type="text"
                  id="modelTitle"
                  name="modelTitle"
                  className="py-md-1 py-sm-1 model-input-form-data"
                  placeholder="Enter Model title"
                  value={createModel.modelTitle}
                  onChange={(e) => {
                    setCreateModel({
                      ...createModel,
                      modelTitle: e.target.value,
                    });
                  }}
                  required
                />
              </div>
            </div>

            <div className="py-3">
              <div className="d-flex justify-content-flex-start create-model-head">
                Description *
              </div>
              <div className="">
                <input
                  type="text"
                  id="modelDescription"
                  name="modelDescription"
                  className="py-md-1 py-sm-1 model-input-form-data"
                  placeholder="Enter Model Description"
                  value={createModel.modelDescription}
                  onChange={(e) => {
                    setCreateModel({
                      ...createModel,
                      modelDescription: e.target.value,
                    });
                  }}
                  required
                />
              </div>
            </div>

            <div className="py-3">
              <div className="d-flex justify-content-flex-start create-model-head">
                Categories *
              </div>
              <div className="">
                <select
                  id="category"
                  name="category"
                  className="py-md-1 py-sm-1 model-input-form-data"
                  placeholder="Select Category"
                  value={createModel.modelCategory}
                  onChange={(e) => {
                    setCreateModel({
                      ...createModel,
                      modelCategory: e.target.value,
                    });
                  }}
                  defaultValue=""
                  required
                >
                  <option value="" disabled>
                    Select Category
                  </option>
                  <option value="1" className="model-dropdown">
                    Drugs and Medicine
                  </option>
                  <option value="2" className="model-dropdown">
                    Education
                  </option>
                  <option value="3" className="model-dropdown">
                    Earth and Nature
                  </option>
                  <option value="4" className="model-dropdown">
                    Science and Technology
                  </option>
                </select>
              </div>
            </div>

            <div className="py-3">
              <div className="d-flex justify-content-flex-start create-model-head">
                Tags/keywords *
              </div>
              <div className="">
                <input
                  type="text"
                  id="modelTags"
                  name="modelTags"
                  className="py-md-1 py-sm-1 model-input-form-data"
                  placeholder="Enter tags or keywords here"
                  value={createModel.modelTags}
                  onChange={(e) => {
                    setCreateModel({
                      ...createModel,
                      modelTags: e.target.value,
                    });
                  }}
                  required
                />
              </div>
            </div>

            <div className="py-3">
              <div className="d-flex justify-content-flex-start create-model-head">
                Model Price *
              </div>
              <div className="">
                <input
                  type="number"
                  id="modelPrice"
                  name="modelPrice"
                  className="py-md-1 py-sm-1 model-input-form-data"
                  placeholder="Enter Model Price"
                  value={createModel.modelPrice}
                  onChange={(e) => {
                    setCreateModel({
                      ...createModel,
                      modelPrice: e.target.value,
                    });
                  }}
                  required
                />
              </div>
            </div>

            <div className="d-flex py-2 flex-column" onClick={handleModelClick}>
              <div className="d-flex upload-model">
                <div className="col-1 ">
                  <img
                    className="upload-model-icon"
                    src={upload}
                    id="upload-model"
                  ></img>
                </div>
                <div className="upload-model-text">Upload Model *</div>
                <input
                  type="file"
                  ref={fileInputRefModel}
                  style={{ display: "none" }}
                  onChange={handleFileChangeModel}
                  required
                ></input>
              </div>
              <div className="d-flex upload-model-selected-file">
                <div className="col-1"></div>
                {selectedFileNameModel && (
                  <div className="model-selected-file-text">
                    File: {selectedFileNameModel}
                  </div>
                )}
              </div>
            </div>

            <div
              className="d-flex py-2 flex-column "
              onClick={handleLicenceClick}
            >
              <div className="d-flex model-upload-licence">
                <div className="col-1">
                  <img
                    className="model-upload-licence-icon"
                    src={upload}
                    id="model-upload-licence"
                  ></img>
                </div>
                <div className="model-licence-text">Upload Model Licence *</div>
                <input
                  type="file"
                  ref={fileInputRefLicence}
                  style={{ display: "none" }}
                  onChange={handleFileChangeLicence}
                  required
                ></input>
              </div>
              <div className="d-flex model-licence-selected-file">
                <div className="col-1"></div>
                {selectedFileNameLicence && (
                  <div className="model-selected-file-text">
                    File: {selectedFileNameLicence}
                  </div>
                )}
              </div>
            </div>

            <div
              className="d-flex py-2 flex-column"
              onClick={handleModelDocClick}
            >
              <div className="d-flex model-upload-doc">
                <div className="col-1">
                  <img
                    className="model-upload-doc-icon"
                    src={upload}
                    id="model-upload-doc"
                  ></img>
                </div>
                <div className="model-doc-text">
                  Upload Usage documentation *
                </div>
                <input
                  type="file"
                  ref={fileInputRefModelDoc}
                  style={{ display: "none" }}
                  onChange={handleFileChangeModelDoc}
                  required
                ></input>
              </div>
              <div className="d-flex model-doc-selected-file">
                <div className="col-1"></div>
                {selectedFileNameModelDoc && (
                  <div className="model-selected-file-text">
                    File: {selectedFileNameModelDoc}
                  </div>
                )}
              </div>
            </div>

            <div class="py-3 btn-group">
              <div className="px-sm-3 px-1">
                <input
                  class="model-button"
                  type="radio"
                  name="model-btn"
                  value="free"
                  required
                />
                <label className="px-1 model-btn-text">Public(free)</label>
              </div>
              <div className="px-sm-3 px-1">
                <input
                  class="model-button"
                  type="radio"
                  name="model-btn"
                  value="private"
                  required
                />
                <label className="px-1 model-btn-text">Private</label>
              </div>
              <div className="px-sm-3 px-1">
                <input
                  class="model-button"
                  type="radio"
                  name="model-btn"
                  value="sell"
                  required
                />
                <label className="px-1 model-btn-text">Sell</label>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="btn rounded-pill my-2 py-sm-2 px-sm-5 px-4 create-model-btn"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateModel;
