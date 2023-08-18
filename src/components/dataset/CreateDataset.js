import React, { useState, useRef } from "react";
import "../../styles/dataset/CreateDataset.css";
import upload from "../../assets/registration/upload.png";
import Navbar from "../navbar/Navbar";
import Sidebar from "../sidebar/Sidebar";
import Footer from "../footer/Footer";

function CreateDataset() {
  const [createDataset, setCreateDataset] = useState({
    datasetTitle: "",
    datasetDescription: "",
    datasetCategory: "",
    datasetPrice: "",
    datasetLicence: "",
    datasetUpload: "",
    datasetImage: "",
  });

  const fileInputRefDataset = useRef(null);
  const [selectedFileNameDataset, setSelectedFileNameDataset] = useState("");

  const fileInputRefDatasetImg = useRef(null);
  const [selectedFileNameDatasetImg, setSelectedFileNameDatasetImg] =
    useState("");

  const fileInputRefLicence = useRef(null);
  const [selectedFileNameLicence, setSelectedFileNameLicence] = useState("");

  const handleDatasetClick = () => {
    fileInputRefDataset.current.click();
  };

  const handleDatasetImgClick = () => {
    fileInputRefDatasetImg.current.click();
  };

  const handleLicenceClick = () => {
    fileInputRefLicence.current.click();
  };

  const handleFileChangeDataset = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();

      reader.onloadend = () => {
        const fileData = reader.result;
        console.log("File Data:", fileData);
        setCreateDataset({
          ...createDataset,
          datasetUpload: fileData,
        });
      };

      reader.readAsDataURL(selectedFile);
      setSelectedFileNameDataset(selectedFile.name);
    }
  };

  const handleFileChangeDatasetImg = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();

      reader.onloadend = () => {
        const fileData = reader.result;
        console.log("File Data:", fileData);
        setCreateDataset({
          ...createDataset,
          datasetImage: fileData,
        });
      };

      reader.readAsDataURL(selectedFile);
      setSelectedFileNameDatasetImg(selectedFile.name);
    }
  };

  const handleLicenceFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();

      reader.onloadend = () => {
        const fileData = reader.result;
        console.log("File Data:", fileData);
        setCreateDataset({
          ...createDataset,
          datasetLicence: fileData,
        });
      };

      reader.readAsDataURL(selectedFile);
      setSelectedFileNameLicence(selectedFile.name);
    }
  };

  return (
    <div>
      <div className="d-flex py-3 px-md-5 px-sm-4 px-sm-3 justify-content-center">
        <div className="col-lg-11 col-10 py-4 create-dataset-main-container">
          <div className="py-sm-4 py-3 create-dataset-heading">
            Create Dataset
          </div>
          <div className="create-dataset-content py-2">
            <div className="py-2">
              <div className="d-flex justify-content-flex-start create-dataset-head">
                Dataset Title *
              </div>
              <div className="">
                <input
                  type="text"
                  id="datasetTitle"
                  name="datasetTitle"
                  className="py-md-1 py-sm-1 dataset-input-form-data"
                  placeholder="Enter Dataset title"
                  value={createDataset.datasetTitle}
                  onChange={(e) => {
                    setCreateDataset({
                      ...createDataset,
                      datasetTitle: e.target.value,
                    });
                  }}
                  required
                />
              </div>
            </div>

            <div className="py-3">
              <div className="d-flex justify-content-flex-start create-dataset-head">
                Description *
              </div>
              <div className="">
                <input
                  type="text"
                  id="datasetDescription"
                  name="datasetDescription"
                  className="py-md-1 py-sm-1 dataset-input-form-data"
                  placeholder="Enter Dataset Description"
                  value={createDataset.datasetDescription}
                  onChange={(e) => {
                    setCreateDataset({
                      ...createDataset,
                      datasetDescription: e.target.value,
                    });
                  }}
                  required
                />
              </div>
            </div>

            <div className="py-3">
              <div className="d-flex justify-content-flex-start create-dataset-head">
                Categories *
              </div>
              <div className="">
                <select
                  id="category"
                  name="category"
                  className="py-md-1 py-sm-1 dataset-input-form-data"
                  value={createDataset.datasetCategory}
                  onChange={(e) => {
                    setCreateDataset({
                      ...createDataset,
                      datasetCategory: e.target.value,
                    });
                  }}
                  required
                >
                  <option value="" disabled selected>
                    Select Category
                  </option>
                  <option value="1" className="dataset-dropdown">
                    Drugs and Medicine
                  </option>
                  <option value="2" className="dataset-dropdown">
                    Education
                  </option>
                  <option value="3" className="dataset-dropdown">
                    Earth and Nature
                  </option>
                  <option value="4" className="dataset-dropdown">
                    Science and Technology
                  </option>
                </select>
              </div>
            </div>

            <div className="py-3">
              <div className="d-flex justify-content-flex-start create-dataset-head">
                Price Per Data *
              </div>
              <div className="">
                <input
                  type="number"
                  id="datasetPrice"
                  name="datasetPrice"
                  className="py-md-1 py-sm-1 dataset-input-form-data"
                  placeholder="Enter Dataset Price"
                  value={createDataset.datasetPrice}
                  onChange={(e) => {
                    setCreateDataset({
                      ...createDataset,
                      datasetPrice: e.target.value,
                    });
                  }}
                  required
                />
              </div>
            </div>

            <div
              className="d-flex py-2 flex-column"
              onClick={handleDatasetClick}
            >
              <div className="d-flex upload-dataset">
                <div className="col-1 ">
                  <img
                    className="upload-dataset-icon"
                    src={upload}
                    id="upload-dataset"
                  ></img>
                </div>
                <div className="upload-dataset-text">Upload Dataset *</div>
                <input
                  type="file"
                  ref={fileInputRefDataset}
                  style={{ display: "none" }}
                  onChange={handleFileChangeDataset}
                  required
                ></input>
              </div>
              <div className="d-flex upload-dataset-selected-file">
                <div className="col-1"></div>
                {selectedFileNameDataset && (
                  <div className="dataset-selected-file-text">
                    File: {selectedFileNameDataset}
                  </div>
                )}
              </div>
            </div>

            <div
              className="d-flex py-2 flex-column"
              onClick={handleDatasetImgClick}
            >
              <div className="d-flex dataset-upload-image">
                <div className="col-1">
                  <img
                    className="dataset-upload-image-icon"
                    src={upload}
                    id="dataset-upload-image"
                  ></img>
                </div>
                <div className="dataset-image-text">Upload Dataset Image *</div>
                <input
                  type="file"
                  ref={fileInputRefDatasetImg}
                  style={{ display: "none" }}
                  onChange={handleFileChangeDatasetImg}
                  required
                ></input>
              </div>
              <div className="d-flex dataset-image-selected-file">
                <div className="col-1"></div>
                {selectedFileNameDatasetImg && (
                  <div className="dataset-selected-file-text">
                    File: {selectedFileNameDatasetImg}
                  </div>
                )}
              </div>
            </div>

            <div
              className="d-flex py-2 flex-column"
              onClick={handleLicenceClick}
            >
              <div className="d-flex dataset-upload-licence">
                <div className="col-1">
                  <img
                    className="dataset-upload-licence-icon"
                    src={upload}
                    id="dataset-upload-licence"
                  ></img>
                </div>
                <div className="dataset-licence-text">Upload Licence *</div>
                <input
                  type="file"
                  ref={fileInputRefLicence}
                  style={{ display: "none" }}
                  onChange={handleLicenceFileChange}
                  required
                ></input>
              </div>
              <div className="d-flex dataset-licence-selected-file">
                <div className="col-1"></div>
                {selectedFileNameLicence && (
                  <div className="dataset-selected-file-text">
                    File: {selectedFileNameLicence}
                  </div>
                )}
              </div>
            </div>

            <div class="py-3 btn-group">
              <div className="px-sm-3 px-1">
                <input
                  class="dataset-button"
                  type="radio"
                  name="dataset-btn"
                  value="free"
                  required
                />
                <label className="px-1 dataset-btn-text">Public(free)</label>
              </div>
              <div className="px-sm-3 px-1">
                <input
                  class="dataset-button"
                  type="radio"
                  name="dataset-btn"
                  value="private"
                  required
                />
                <label className="px-1 dataset-btn-text">Private</label>
              </div>
              <div className="px-sm-3 px-1">
                <input
                  class="dataset-button"
                  type="radio"
                  name="dataset-btn"
                  value="sell"
                  required
                />
                <label className="px-1 dataset-btn-text">Sell</label>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="btn rounded-pill my-2 py-sm-2 px-sm-5 px-4 create-dataset-btn"
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

export default CreateDataset;
