import React, { useState, useRef } from "react";
import upload from "../../assets/registration/upload.png";
import "../../styles/model/CreateModel.css";
import { ethers } from "ethers";
// import { MODEL_ADDRESS, modelInstance } from "../Contract";
import { AIAgentMarketplace_address, AiAgentInstance } from "../Contract";
import lighthouse from "@lighthouse-web3/sdk";
import { useNavigate } from "react-router-dom";
import { PulseLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
function CreateAIAgent() {
  const navigate = useNavigate();
  const [btnloading, setbtnloading] = useState(false);

  const [selectedOption, setSelectedOption] = useState("free");
  const [selectedCategory, setSelectedCategory] = useState("");

  const categoryDescriptions = {
    "Business & Productivity": 
      "• Task Automation\n• Data Analysis\n• Project Management\n• Finance & Accounting\n• Marketing & Sales",
    "Creative & Content Solutions": 
      "• Graphic Design\n• Video Editing\n• Writing & Editing\n• Social Media Management\n• Customer Engagement",
    "Technical & IT Services": 
      "• Cybersecurity\n• Software Development\n• Cloud & Infrastructure Management\n• AI & Machine Learning Models\n• Data Management",
    "Personal & Professional Assistance": 
      "• Virtual Assistants\n• Healthcare & Wellness\n• Education & Learning\n• Real Estate & Property\n• Legal & Compliance"
  };
  
  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
    if (e.target.value === "free" || e.target.value === "private") {
      setCreateAIAgent({
        ...createAIAgent,
        AIAgentPrice: 0,
      });
    }
  };

  // Define boolean variables based on the selected option
  const isPublic = selectedOption === "free";
  const isPrivate = selectedOption === "private";
  const isForSale = selectedOption === "sell";

  const [createAIAgent, setCreateAIAgent] = useState({
    AIAgentTitle: "",
    AIAgentDescription: "",
    AIAgentCategory: "",
    AIAgentPrice: 0,
    AIAgentUpload: "",
    AIAgentImage: "",
    AIAgentLicense: "",
    AIAgentDocumentation: "",
    AIAgentKeyFeatures: "",
    AIAgentUseCase: "",
  });
  const saveToDatabase = async (aiAgentId) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/add-data/ai-agents`, {
        aiAgentId,
        keyFeatures: createAIAgent.AIAgentKeyFeatures,
        useCase: createAIAgent.AIAgentUseCase
      });
      console.log('Saved to database:', response.data);
    } catch (error) {
      console.error('Error saving to database:', error);
      toast.error('Failed to save additional data to database');
    }
  };
  const fileInputRefModel = useRef(null);
  const [selectedFileNameModel, setSelectedFileNameModel] = useState("");

  const fileInputRefLicense = useRef(null);
  const [selectedFileNameLicense, setSelectedFileNameLicense] = useState("");

  const fileInputRefAIAgentImg = useRef(null);
  const [selectedFileNameAIAgentImg, setSelectedFileNameAIAgentImg] =
    useState("");
  const handleAIAgentImgClick = () => {
    fileInputRefAIAgentImg.current.click();
  };
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
        setCreateAIAgent({
          ...createAIAgent,
          AiAgentUpload: fileData,
        });
      };

      reader.readAsDataURL(selectedFile);
      setSelectedFileNameModel(selectedFile.name);
    }
  };
  const handleFileChangeAIAgentImg = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();

      reader.onloadend = () => {
        const fileData = reader.result;
        setCreateAIAgent({
          ...createAIAgent,
          AIAgentImage: fileData,
        });
      };

      reader.readAsDataURL(selectedFile);
      setSelectedFileNameAIAgentImg(selectedFile.name);
    }
  };
  const handleFileChangeLicense = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();

      reader.onloadend = () => {
        const fileData = reader.result;
        setCreateAIAgent({
          ...createAIAgent,
          AIAgentLicense: fileData,
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
        setCreateAIAgent({
          ...createAIAgent,
          AIAgentDocumentation: fileData,
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
    // console.log(percentageDone);
  };

  const uploadData = async () => {
    try {
      const uploadAIAgent = document.getElementById("upload-ai-agent-file");
      const uploadAIAgentImage = document.getElementById("aiagent-image-file");
      const uploadLicense = document.getElementById("ai-agent-license-file");
      const uploadDocument = document.getElementById("ai-agent-doc-file");


      let AIAgentCid = "";

      if (isForSale) {
        const sig = await encryptionSignature();
        const outputModel = await lighthouse.uploadEncrypted(
          uploadAIAgent.files,
          process.env.REACT_APP_LIGHTHOUSE_API_KEY,
          sig.publicKey,
          sig.signedMessage,
          null,
          progressCallback
        );

        AIAgentCid = outputModel.data[0].Hash;

        // Conditions to add
        const conditions = [
          {
            id: 1,
            chain: "BTTC",
            method: "getPurchaseStatus",
            standardContractType: "Custom",
            contractAddress: AIAgentMarketplace_address,
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
          AIAgentCid,
          signedMessage,
          conditions,
          aggregator
        );
      } else {
        const outputModel = await lighthouse.upload(
          uploadAIAgent.files,
          process.env.REACT_APP_LIGHTHOUSE_API_KEY,
          false,
          progressCallback
        );
        AIAgentCid = outputModel.data.Hash;
      }
      const outputLicense = await lighthouse.upload(
        uploadLicense.files,
        process.env.REACT_APP_LIGHTHOUSE_API_KEY,
        false,
        progressCallback
      );

      const outputImage = await lighthouse.upload(
        uploadAIAgentImage.files,
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
      return {
        AIAgent: AIAgentCid,
        AIAgentImage: outputImage.data.Hash,
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

      // console.log(isPublic);
      // console.log(isPrivate);
      // console.log(isForSale);


      const { AIAgent, AIAgentImage, license, document } = await uploadData();

      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        if (!provider) {
          console.log("Metamask is not installed, please install!");
        }

        const con = await AiAgentInstance();
        const tx = await con.createAIAgent(
          createAIAgent.AIAgentTitle,
          createAIAgent.AIAgentDescription,
          createAIAgent.AIAgentCategory,
          createAIAgent.AIAgentPrice,
          license,
          AIAgent,
          AIAgentImage,
          document,
          isPublic,
          isPrivate,
          isForSale
        );

        // Get the AI Agent ID from the transaction receipt or event
        const receipt = await tx.wait();
        console.log('Transaction receipt:', receipt);

        const aiAgentCreatedEvent = receipt.events.find(event => event.event === 'AIAgentCreated');
        console.log('AI Agent created event:', aiAgentCreatedEvent);

        if (aiAgentCreatedEvent && aiAgentCreatedEvent.args && aiAgentCreatedEvent.args[0]) {
          const aiAgentId = parseInt(aiAgentCreatedEvent.args[0]._hex,16).toString();
          // Save additional data to the database
            await saveToDatabase(aiAgentId);
            setbtnloading(false);
            navigate("/ai-agents-marketplace");
        } else {
            console.error('AI Agent creation event not found or malformed.');
            setbtnloading(false);  // Stop loading in case of failure
        }

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
      console.log("Error in creating a aiagent: ", e);
    }
  };

  return (
    <div>
      <div className="d-flex py-3 px-md-5 px-sm-4 px-sm-3 justify-content-center">
        <div className="col-lg-11 col-10 py-4 create-model-main-container">
          <div className="py-sm-4 py-3 create-model-heading">
            Create AI Agent
          </div>
          <div className="create-model-content py-2">
            <div className="py-2">
              <div className="d-flex justify-content-flex-start create-model-head">
                AI Agent Title *
              </div>
              <div className="">
                <input
                  type="text"
                  id="modelTitle"
                  name="modelTitle"
                  className="py-md-1 py-sm-1 model-input-form-data"
                  placeholder="Enter AI Agent title"
                  value={createAIAgent.AIAgentTitle}
                  onChange={(e) => {
                    setCreateAIAgent({
                      ...createAIAgent,
                      AIAgentTitle: e.target.value,
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
                  placeholder="Enter AI Agent Description"
                  // value={createModel.modelDescription}
                  onChange={(e) => {
                    setCreateAIAgent({
                      ...createAIAgent,
                      AIAgentDescription: e.target.value,
                    });
                  }}
                  required
                >
                  {createAIAgent.AIAgentDescription}
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
                  value={createAIAgent.AIAgentCategory}
                  onChange={(e) => {
                    setCreateAIAgent({
                      ...createAIAgent,
                      AIAgentCategory: e.target.value,
                    });
                    setSelectedCategory(e.target.value);
                  }}
                  defaultValue=""
                  required
                >
                  <option value="" disabled>
                    Select Category
                  </option>
                  <option
                    value="Business & Productivity"
                    className="model-dropdown"
                  >
                    Business & Productivity
                  </option>
                  <option
                    value="Creative & Content Solutions"
                    className="model-dropdown"
                  >
                    Creative & Content Solutions
                  </option>
                  <option
                    value="Technical & IT Services"
                    className="model-dropdown"
                  >
                    Technical & IT Services
                  </option>
                  <option
                    value="Personal & Professional Assistance"
                    className="model-dropdown"
                  >
                    Personal & Professional Assistance
                  </option>
                </select>
              </div>
              {selectedCategory && (
               <div className="mt-2 text-white" style={{ whiteSpace: 'pre-line', textAlign: 'left' }}>
               {categoryDescriptions[selectedCategory]}
             </div>
             
             
              )}
            </div>
            {/* 
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
            </div> */}

<div className="py-3">
              <div className="d-flex justify-content-flex-start create-model-head">
                Key Features *
              </div>
              <div className="">
                <textarea
                  type="text"
                  id="AIAgentKeyFeatures"
                  name="AIAgentKeyFeatures"
                  className="py-md-1 py-sm-1 model-input-form-data"
                  placeholder="Enter AI Agent Key Features"
                  value={createAIAgent.AIAgentKeyFeatures}
                  onChange={(e) => {
                    setCreateAIAgent({
                      ...createAIAgent,
                      AIAgentKeyFeatures: e.target.value,
                    });
                  }}
                  required
                />
              </div>
            </div>

            <div className="py-3">
              <div className="d-flex justify-content-flex-start create-model-head">
                Use Case *
              </div>
              <div className="">
                <textarea
                  type="text"
                  id="AIAgentUseCase"
                  name="AIAgentUseCase"
                  className="py-md-1 py-sm-1 model-input-form-data"
                  placeholder="Enter AI Agent Use Case"
                  value={createAIAgent.AIAgentUseCase}
                  onChange={(e) => {
                    setCreateAIAgent({
                      ...createAIAgent,
                      AIAgentUseCase: e.target.value,
                    });
                  }}
                  required
                />
              </div>
            </div>
            <div className="py-3">
              <div className="d-flex justify-content-flex-start create-dataset-head">
                AI Agent For*
              </div>

              <div className="btn-group d-flex pt-2">
                <div className="pe-sm-3 pe-1">
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
            </div>

            <div className="py-3">
              <div className="d-flex justify-content-flex-start create-model-head">
                AI Agent Price (in BTT) *
              </div>
              <div className="">
                <input
                  type="number"
                  id="modelPrice"
                  min={0}
                  name="modelPrice"
                  className="py-md-1 py-sm-1 model-input-form-data"
                  placeholder="Enter AI Agent Price"
                  value={isForSale ? createAIAgent.AIAgentPrice : 0}
                  onChange={(e) => {
                    setCreateAIAgent({
                      ...createAIAgent,
                      AIAgentPrice: e.target.value,
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
                <div className="upload-model-text">Upload AI Agent *</div>
                <input
                  type="file"
                  id="upload-ai-agent-file"
                  ref={fileInputRefModel}
                  style={{ display: "none" }}
                  onChange={handleFileChangeModel}
                  //   accept=".tar.gz"
                  required
                ></input>
              </div>
              <div className="d-flex upload-model-selected-file">
                <div className="col-1"></div>
                <div className="row">
                  <span className="info-text">
                    Upload the AI-Agent (.tar.gz).
                  </span>
                  {selectedFileNameModel && (
                    <div className="d-flex model-selected-file-text">
                      File: {selectedFileNameModel}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div
              className="d-flex py-2 flex-column"
              onClick={handleAIAgentImgClick}
            >
              <div className="d-flex dataset-upload-image">
                <div className="col-1">
                  <img
                    className="dataset-upload-image-icon"
                    src={upload}
                    id="dataset-upload-image"
                  ></img>
                </div>
                <div className="dataset-image-text">
                  Upload AI Agent Image *
                </div>
                <input
                  type="file"
                  id="aiagent-image-file"
                  ref={fileInputRefAIAgentImg}
                  style={{ display: "none" }}
                  onChange={handleFileChangeAIAgentImg}
                  accept=".jpeg, .png, .jpg"
                  required
                ></input>
              </div>
              <div className="d-flex dataset-image-selected-file">
                <div className="col-1"></div>
                <div className="row">
                  <span className="info-text">
                    Upload the image (.jpeg, .jpg, .png) of your AI Agent cover.
                  </span>
                  {selectedFileNameAIAgentImg && (
                    <div className="d-flex dataset-selected-file-text">
                      File: {selectedFileNameAIAgentImg}
                    </div>
                  )}
                </div>
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
                <div className="model-license-text">
                  Upload AI Agent License *
                </div>
                <input
                  type="file"
                  id="ai-agent-license-file"
                  ref={fileInputRefLicense}
                  style={{ display: "none" }}
                  onChange={handleFileChangeLicense}
                  accept=".pdf"
                  required
                ></input>
              </div>
              <div className="d-flex model-license-selected-file">
                <div className="col-1"></div>
                <div className="row">
                  <span className="info-text">
                    Upload the license (.pdf) which contains the terms and
                    conditions of the AI Agent.
                  </span>
                  {selectedFileNameLicense && (
                    <div className="d-flex model-selected-file-text">
                      File: {selectedFileNameLicense}
                    </div>
                  )}
                </div>
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
                  id="ai-agent-doc-file"
                  ref={fileInputRefModelDoc}
                  style={{ display: "none" }}
                  onChange={handleFileChangeModelDoc}
                  accept=".pdf"
                  required
                ></input>
              </div>
              <div className="d-flex model-doc-selected-file">
                <div className="col-1"></div>
                <div className="row">
                  <span className="info-text">
                    Upload the documentation (.pdf) which contains guidelines of
                    using your AI Agent.
                  </span>
                  {selectedFileNameModelDoc && (
                    <div className="d-flex model-selected-file-text">
                      File: {selectedFileNameModelDoc}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="py-3">
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

export default CreateAIAgent;
