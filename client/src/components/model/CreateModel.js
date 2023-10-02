import React, { useState, useRef } from "react";
import upload from "../../assets/registration/upload.png";
import "../../styles/model/CreateModel.css";
import Navbar from "../navbar/Navbar";
import Sidebar from "../sidebar/Sidebar";
import Footer from "../footer/Footer";
import { ethers } from "ethers";
import { MODEL_ADDRESS, modelInstance } from "../Contract";
import lighthouse from "@lighthouse-web3/sdk";
import { useNavigate } from "react-router-dom";
import { PulseLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function CreateModel() {
  const navigate = useNavigate();
  const [btnloading, setbtnloading] = useState(false);

  const [selectedOption, setSelectedOption] = useState("free");

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
    if (e.target.value === "free" || e.target.value === "private") {
      setCreateModel({
        ...createModel,
        modelPrice: 0,
      });
    }
  };

  // Define boolean variables based on the selected option
  const isPublic = selectedOption === "free";
  const isPrivate = selectedOption === "private";
  const isForSale = selectedOption === "sell";

  const [createModel, setCreateModel] = useState({
    modelTitle: "",
    modelDescription: "",
    modelCategory: "",
    modelPrice: 0,
    modelTags: "",
    modelUpload: "",
    modelLicense: "",
    modelDocumentation: "",
  });

  const fileInputRefModel = useRef(null);
  const [selectedFileNameModel, setSelectedFileNameModel] = useState("");

  const fileInputRefLicense = useRef(null);
  const [selectedFileNameLicense, setSelectedFileNameLicense] = useState("");

  const fileInputRefModelDoc = useRef(null);
  const [selectedFileNameModelDoc, setSelectedFileNameModelDoc] = useState("");

  const handleModelClick = () => {
    fileInputRefModel.current.click();
  };

  const handleLicenseClick = () => {
    fileInputRefLicense.current.click();
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
        setCreateModel({
          ...createModel,
          modelUpload: fileData,
        });
      };

      reader.readAsDataURL(selectedFile);
      setSelectedFileNameModel(selectedFile.name);
    }
  };

  const handleFileChangeLicense = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();

      reader.onloadend = () => {
        const fileData = reader.result;
        setCreateModel({
          ...createModel,
          modelLicense: fileData,
        });
      };

      reader.readAsDataURL(selectedFile);
      setSelectedFileNameLicense(selectedFile.name);
    }
  };

  const handleFileChangeModelDoc = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();

      reader.onloadend = () => {
        const fileData = reader.result;
        setCreateModel({
          ...createModel,
          modelDocumentation: fileData,
        });
      };

      reader.readAsDataURL(selectedFile);
      setSelectedFileNameModelDoc(selectedFile.name);
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
      const uploadModel = document.getElementById("upload-model-file");
      const uploadLicense = document.getElementById("model-license-file");
      const uploadDocument = document.getElementById("model-doc-file");
      // console.log("File: ", uploadImage.files);

      console.log(isForSale);
      let modelCid = "";

      if (isForSale) {
        console.log("Paid Dataset....");

        const sig = await encryptionSignature();
        const outputModel = await lighthouse.uploadEncrypted(
          uploadModel.files,
          process.env.REACT_APP_LIGHTHOUSE_API_KEY,
          sig.publicKey,
          sig.signedMessage,
          null,
          progressCallback
        );

        modelCid = outputModel.data[0].Hash;

        // Conditions to add
        const conditions = [
          {
            id: 1,
            chain: "BTTC_Testnet",
            method: "getPurchaseStatus",
            standardContractType: "Custom",
            contractAddress: MODEL_ADDRESS,
            returnValueTest: {
              comparator: "==",
              value: "1",
            },
            parameters: [":modelId", ":userAddress"],
            inputArrayType: ["uint256", "address"],
            outputType: "uint256",
          },
        ];

        const aggregator = "([1])";
        const { publicKey, signedMessage } = await encryptionSignature();
        const responseCondition = await lighthouse.applyAccessCondition(
          publicKey,
          modelCid,
          signedMessage,
          conditions,
          aggregator
        );

        console.log(responseCondition);
      } else {
        console.log("Public Dataset....");

        const outputModel = await lighthouse.upload(
          uploadModel.files,
          process.env.REACT_APP_LIGHTHOUSE_API_KEY,
          false,
          progressCallback
        );
        modelCid = outputModel.data.Hash;
      }     

      const outputLicense = await lighthouse.upload(
        uploadLicense.files,
        process.env.REACT_APP_LIGHTHOUSE_API_KEY,
        false,
        progressCallback
      );

      const outputDocument = await lighthouse.upload(
        uploadDocument.files,
        process.env.REACT_APP_LIGHTHOUSE_API_KEY,
        false,
        progressCallback
      );
      // console.log("File Status:", output);
      return {
        model: modelCid,
        license: outputLicense.data.Hash,
        document: outputDocument.data.Hash,
      };
    } catch (e) {
      console.log(e);
    }
  };

  const createUserModel = async () => {
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

      console.log("Create Dataset data: ", createModel);

      const { model, license, document } = await uploadData();
      console.log("cid model: ", model);
      console.log("cid license: ", license);
      console.log("cid document: ", document);

      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        if (!provider) {
          console.log("Metamask is not installed, please install!");
        }
        const con = await modelInstance();

        const tx = await con.createModel(
          createModel.modelTitle,
          createModel.modelDescription,
          createModel.modelCategory,
          createModel.modelTags,
          createModel.modelPrice,
          license,
          model,
          document,
          isPublic,
          isPrivate,
          isForSale
        );

        console.log(tx);
        await tx.wait();
        setbtnloading(false);
        navigate("/model-marketplace");
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
                <textarea
                  type="text"
                  id="modelDescription"
                  name="modelDescription"
                  className="py-md-1 py-sm-1 model-input-form-data"
                  placeholder="Enter Model Description"
                  // value={createModel.modelDescription}
                  onChange={(e) => {
                    setCreateModel({
                      ...createModel,
                      modelDescription: e.target.value,
                    });
                  }}
                  required
                >
                  {createModel.modelDescription}
                </textarea>
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
                  <option value="Drugs and Medicine" className="model-dropdown">
                    Drugs and Medicine
                  </option>
                  <option value="Education" className="model-dropdown">
                    Education
                  </option>
                  <option value="Earth and Nature" className="model-dropdown">
                    Earth and Nature
                  </option>
                  <option
                    value="Science and Technology"
                    className="model-dropdown"
                  >
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
                  min={0}
                  name="modelPrice"
                  className="py-md-1 py-sm-1 model-input-form-data"
                  placeholder="Enter Model Price"
                  value={isForSale ? createModel.modelPrice : 0}
                  onChange={(e) => {
                    setCreateModel({
                      ...createModel,
                      modelPrice: e.target.value,
                    });
                  }}
                  disabled={!isForSale}
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
                  id="upload-model-file"
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
              onClick={handleLicenseClick}
            >
              <div className="d-flex model-upload-license">
                <div className="col-1">
                  <img
                    className="model-upload-license-icon"
                    src={upload}
                    id="model-upload-license"
                  ></img>
                </div>
                <div className="model-license-text">Upload Model License *</div>
                <input
                  type="file"
                  id="model-license-file"
                  ref={fileInputRefLicense}
                  style={{ display: "none" }}
                  onChange={handleFileChangeLicense}
                  required
                ></input>
              </div>
              <div className="d-flex model-license-selected-file">
                <div className="col-1"></div>
                {selectedFileNameLicense && (
                  <div className="model-selected-file-text">
                    File: {selectedFileNameLicense}
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
                  id="model-doc-file"
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
                  checked={isPublic}
                  onChange={handleOptionChange}
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
                  checked={isPrivate}
                  onChange={handleOptionChange}
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
                  checked={isForSale}
                  onChange={handleOptionChange}
                  required
                />
                <label className="px-1 model-btn-text">Sell</label>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="btn rounded-pill my-2 py-sm-2 px-sm-5 px-4 create-model-btn"
                onClick={createUserModel}
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

export default CreateModel;
