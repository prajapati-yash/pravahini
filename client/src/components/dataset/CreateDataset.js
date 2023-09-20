import React, { useState, useRef } from "react";
import "../../styles/dataset/CreateDataset.css";
import upload from "../../assets/registration/upload.png";
import Navbar from "../navbar/Navbar";
import Sidebar from "../sidebar/Sidebar";
import Footer from "../footer/Footer";
import { ethers } from "ethers";
import { datasetInstance } from "../Contract";
import lighthouse from "@lighthouse-web3/sdk";
import { useNavigate } from "react-router-dom";
import { PulseLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DATASET_ADDRESS } from "../Contract";

function CreateDataset() {
  const navigate = useNavigate();
  const [btnloading, setbtnloading] = useState(false);

  const [selectedOption, setSelectedOption] = useState("free");

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
    if (e.target.value === "free" || e.target.value === "private") {
      setCreateDataset({
        ...createDataset,
        datasetPrice: 0,
      });
    }
  };

  // Define boolean variables based on the selected option
  const isPublic = selectedOption === "free";
  const isPrivate = selectedOption === "private";
  const isForSale = selectedOption === "sell";

  const [createDataset, setCreateDataset] = useState({
    datasetTitle: "",
    datasetDescription: "",
    datasetCategory: "",
    datasetPrice: 0,
    datasetLicense: "",
    datasetUpload: "",
    demoDatasetUpload: "",
    datasetImage: "",
  });

  const fileInputRefDataset = useRef(null);
  const [selectedFileNameDataset, setSelectedFileNameDataset] = useState("");

  const fileInputRefDemoDataset = useRef(null);
  const [selectedDemoDataset, setSelectedDemoDataset] = useState("");

  const fileInputRefDatasetImg = useRef(null);
  const [selectedFileNameDatasetImg, setSelectedFileNameDatasetImg] =
    useState("");

  const fileInputRefLicense = useRef(null);
  const [selectedFileNameLicense, setSelectedFileNameLicense] = useState("");

  const handleDatasetClick = () => {
    fileInputRefDataset.current.click();
  };

  const handleDemoDatasetClick = () => {
    fileInputRefDemoDataset.current.click();
  };

  const handleDatasetImgClick = () => {
    fileInputRefDatasetImg.current.click();
  };

  const handleLicenseClick = () => {
    fileInputRefLicense.current.click();
  };

  const handleFileChangeDataset = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();

      reader.onloadend = () => {
        const fileData = reader.result;
        setCreateDataset({
          ...createDataset,
          datasetUpload: fileData,
        });
      };

      reader.readAsDataURL(selectedFile);
      setSelectedFileNameDataset(selectedFile.name);
    }
  };

  const handleFileChangeDemoDataset = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();

      reader.onloadend = () => {
        const fileData = reader.result;
        setCreateDataset({
          ...createDataset,
          demoDatasetUpload: fileData,
        });
      };

      reader.readAsDataURL(selectedFile);
      setSelectedDemoDataset(selectedFile.name);
    }
  };

  const handleFileChangeDatasetImg = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();

      reader.onloadend = () => {
        const fileData = reader.result;
        setCreateDataset({
          ...createDataset,
          datasetImage: fileData,
        });
      };

      reader.readAsDataURL(selectedFile);
      setSelectedFileNameDatasetImg(selectedFile.name);
    }
  };

  const handleLicenseFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();

      reader.onloadend = () => {
        const fileData = reader.result;
        setCreateDataset({
          ...createDataset,
          datasetLicense: fileData,
        });
      };

      reader.readAsDataURL(selectedFile);
      setSelectedFileNameLicense(selectedFile.name);
    }
  };

  const encryptionSignature = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    const messageRequested = (await lighthouse.getAuthMessage(address)).data
      .message;
    const signedMessage = await signer.signMessage(messageRequested);
    return {
      signedMessage: signedMessage,
      publicKey: address,
    };
  };

  const progressCallback = (progressData) => {
    let percentageDone =
      100 - (progressData?.total / progressData?.uploaded)?.toFixed(2);
    console.log(percentageDone);
  };

  const uploadData = async () => {
    try {
      const uploadImage = document.getElementById("dataset-image-file");
      const uploadDataset = document.getElementById("upload-dataset-file");
      const uploadDemoDataset = document.getElementById(
        "upload-demo-dataset-file"
      );
      const uploadLicense = document.getElementById("dataset-license-file");
      // console.log("File: ", uploadImage.files);

      console.log(isForSale);
      let datasetCid = "";

      if (isForSale) {
        console.log("Paid Dataset....");

        const sig = await encryptionSignature();
        const outputDataset = await lighthouse.uploadEncrypted(
          uploadDataset.files,
          process.env.REACT_APP_LIGHTHOUSE_API_KEY,
          sig.publicKey,
          sig.signedMessage,
          null,
          progressCallback
        );

        datasetCid = outputDataset.data[0].Hash;

        // Conditions to add
        const conditions = [
          {
            id: 1,
            chain: "BTTC_Testnet",
            method: "getPurchaseStatus",
            standardContractType: "Custom",
            contractAddress: DATASET_ADDRESS,
            returnValueTest: {
              comparator: "==",
              value: "1",
            },
            parameters: [":datasetId", ":userAddress"],
            inputArrayType: ["uint256", "address"],
            outputType: "uint256",
          },
        ];

        const aggregator = "([1])";
        const { publicKey, signedMessage } = await encryptionSignature();
        const responseCondition = await lighthouse.applyAccessCondition(
          publicKey,
          datasetCid,
          signedMessage,
          conditions,
          aggregator
        );

        console.log(responseCondition);
      } else {
        console.log("Public Dataset....");

        const outputDataset = await lighthouse.upload(
          uploadDataset.files,
          process.env.REACT_APP_LIGHTHOUSE_API_KEY,
          false,
          progressCallback
        );
        datasetCid = outputDataset.data.Hash;
      }

      const outputImage = await lighthouse.upload(
        uploadImage.files,
        process.env.REACT_APP_LIGHTHOUSE_API_KEY,
        false,
        progressCallback
      );

      const outputDemoDataset = await lighthouse.upload(
        uploadDemoDataset.files,
        process.env.REACT_APP_LIGHTHOUSE_API_KEY,
        false,
        progressCallback
      );

      const outputLicense = await lighthouse.upload(
        uploadLicense.files,
        process.env.REACT_APP_LIGHTHOUSE_API_KEY,
        false,
        progressCallback
      );
      // console.log("File Status:", output);

      console.log("Dataset CID: ", datasetCid);

      return {
        image: outputImage.data.Hash,
        dataset: datasetCid,
        demoDataset: outputDemoDataset.data.Hash,
        license: outputLicense.data.Hash,
      };
    } catch (e) {
      setbtnloading(false);
      console.log(e);
    }
  };

  const createUserDataset = async () => {
    try {
      toast.info("Process is in Progress", {
        position: "top-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setbtnloading(true);

      console.log(isPublic);
      console.log(isPrivate);
      console.log(isForSale);

      console.log("Create Dataset data: ", createDataset);

      const { image,dataset, demoDataset, license } = await uploadData();
      console.log("cid image: ", image);
      console.log("cid dataset: ", demoDataset);
      console.log("cid license: ", license);

      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        if (!provider) {
          console.log("Metamask is not installed, please install!");
        }
        const con = await datasetInstance();

        const tx = await con.createDataset(
          createDataset.datasetTitle,
          createDataset.datasetDescription,
          createDataset.datasetPrice,
          license,
          dataset,
          demoDataset,
          image,
          createDataset.datasetCategory,
          isPublic,
          isPrivate,
          isForSale
          // {
          //   gasLimit: 20000000,
          // }
        );

        console.log(tx);
        await tx.wait();
        setbtnloading(false);
        navigate("/dataset-marketplace");
      }
    } catch (e) {
      setbtnloading(false);
      toast.info(e.reason, {
        position: "top-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      console.log("Error in creating a dataset: ", e);
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
                {/* <input
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
                /> */}
                 <textarea
                  type="text"
                  id="datasetDescription"
                  name="datasetDescription"
                  className="py-md-1 py-sm-1 dataset-input-form-data"
                  placeholder="Enter Dataset Description"
                  // value={createDataset.datasetDescription}
                  onChange={(e) => {
                    setCreateDataset({
                      ...createDataset,
                      datasetDescription: e.target.value,
                    });
                  }}
                  required
                >{createDataset.datasetDescription}</textarea>
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
                  <option
                    value="Drugs and Medicine"
                    className="dataset-dropdown"
                  >
                    Drugs and Medicine
                  </option>
                  <option value="Education" className="dataset-dropdown">
                    Education
                  </option>
                  <option value="Earth and Nature" className="dataset-dropdown">
                    Earth and Nature
                  </option>
                  <option
                    value="Science and Technology"
                    className="dataset-dropdown"
                  >
                    Science and Technology
                  </option>
                </select>
              </div>
            </div>

            <div className="py-3">
              <div className="d-flex justify-content-flex-start create-dataset-head">
                Price of Dataset *
              </div>
              <div className="">
                <input
                  type="number"
                  id="datasetPrice"
                  name="datasetPrice"
                  className="py-md-1 py-sm-1 dataset-input-form-data"
                  placeholder="Enter Dataset Price"
                  min={0}
                  value={isForSale ? createDataset.datasetPrice : 0}
                  onChange={(e) => {
                    setCreateDataset({
                      ...createDataset,
                      datasetPrice: e.target.value,
                    });
                  }}
                  disabled={!isForSale}
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
                  id="upload-dataset-file"
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
              onClick={handleDemoDatasetClick}
            >
              <div className="d-flex upload-demo-dataset">
                <div className="col-1 ">
                  <img
                    className="upload-demo-dataset-icon"
                    src={upload}
                    id="upload-demo-dataset"
                  ></img>
                </div>
                <div className="upload-demo-dataset-text">
                  Upload Demo Dataset *
                </div>
                <input
                  type="file"
                  id="upload-demo-dataset-file"
                  ref={fileInputRefDemoDataset}
                  style={{ display: "none" }}
                  onChange={handleFileChangeDemoDataset}
                  required
                ></input>
              </div>
              <div className="d-flex upload-demo-dataset-selected-file">
                <div className="col-1"></div>
                {selectedDemoDataset && (
                  <div className="dataset-selected-file-text">
                    File: {selectedDemoDataset}
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
                  id="dataset-image-file"
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
              onClick={handleLicenseClick}
            >
              <div className="d-flex dataset-upload-license">
                <div className="col-1">
                  <img
                    className="dataset-upload-license-icon"
                    src={upload}
                    id="dataset-upload-license"
                  ></img>
                </div>
                <div className="dataset-license-text">Upload License *</div>
                <input
                  type="file"
                  id="dataset-license-file"
                  ref={fileInputRefLicense}
                  style={{ display: "none" }}
                  onChange={handleLicenseFileChange}
                  required
                ></input>
              </div>
              <div className="d-flex dataset-license-selected-file">
                <div className="col-1"></div>
                {selectedFileNameLicense && (
                  <div className="dataset-selected-file-text">
                    File: {selectedFileNameLicense}
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
                  checked={isPublic}
                  onChange={handleOptionChange}
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
                  checked={isPrivate}
                  onChange={handleOptionChange}
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
                  checked={isForSale}
                  onChange={handleOptionChange}
                  required
                />
                <label className="px-1 dataset-btn-text">Sell</label>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="btn rounded-pill my-2 py-sm-2 px-sm-5 px-4 create-dataset-btn"
                onClick={createUserDataset}
              >
                {btnloading ? (
                  <>
                    <PulseLoader color="#fff" size={12} />
                  </>
                ) : (
                  <>Create</>
                )}
              </button>
            </div>
            <ToastContainer />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateDataset;
