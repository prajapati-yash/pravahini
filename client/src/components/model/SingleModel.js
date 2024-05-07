import React, { useState, useEffect,useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/model/SingleModel.css";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { modelInstance } from "../Contract";
import { ethers } from "ethers";
import lighthouse from "@lighthouse-web3/sdk";
import { useAccount } from "wagmi";
import { PulseLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { recoverShards, recoverKey } from "@lighthouse-web3/kavach";
import Cookies from "js-cookie";
import { authorizationInstance } from "../Contract";
import ComputationPopup from "../../pages/ComputationPopUp";
import "../../styles/computation/ComputationPopup.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeftLong } from '@fortawesome/free-solid-svg-icons';

function SingleModel() {
  const { address } = useAccount();
  const location = useLocation();
  // console.log(location.state.data);
  const model = location.state ? location.state.data : "";

  const [btnloading, setbtnloading] = useState(false);
  const [isPopupVisible, setPopupVisible] = useState(false); // Initialize to true to always show initially
  const popupRef = useRef(null);
  const navigate = useNavigate();
  

  // useEffect(() => {
  //   if(!address){
  //     setPopupVisible(false);
  //   }
  // }, [address]);
// console.log(model);

  const handleDownload = async () => {
    try {
      const response = await axios.get(
        `https://gateway.lighthouse.storage/ipfs/${model.uploadModel}`,
        { responseType: "blob" }
      );
      // console.log(response);

      const blob = new Blob([response.data], {
        type: "application/octet-stream",
      });

      // Get the content-type header from the response
      const contentTypeHeader = response.headers["content-type"];

      // Extract the file extension from the content-type header
      const fileExtension = contentTypeHeader.split("/").pop();

      const blobURL = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobURL;
      link.download = `modelArchive.${fileExtension}`;
      link.style.display = "none";

      document.body.appendChild(link);
      link.click();

      URL.revokeObjectURL(blobURL);
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const handleLicenseDownload = async () => {
    try {
      const response = await axios.get(
        `https://gateway.lighthouse.storage/ipfs/${model.uploadLicense}`,
        { responseType: "blob" }
      );
      // console.log(response);

      const blob = new Blob([response.data], {
        type: "application/octet-stream",
      });

      // Get the content-type header from the response
      const contentTypeHeader = response.headers["content-type"];

      // Extract the file extension from the content-type header
      const fileExtension = contentTypeHeader.split("/").pop();

      const blobURL = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobURL;
      link.download = `licence.${fileExtension}`;
      link.style.display = "none";

      document.body.appendChild(link);
      link.click();

      URL.revokeObjectURL(blobURL);
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const handleUsageDownload = async () => {
    try {
      const response = await axios.get(
        `https://gateway.lighthouse.storage/ipfs/${model.uploadUsageDocumentation}`,
        { responseType: "blob" }
      );
      // console.log(response);

      const blob = new Blob([response.data], {
        type: "application/octet-stream",
      });

      // Get the content-type header from the response
      const contentTypeHeader = response.headers["content-type"];

      // Extract the file extension from the content-type header
      const fileExtension = contentTypeHeader.split("/").pop();

      const blobURL = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobURL;
      link.download = `usageDoc.${fileExtension}`;
      link.style.display = "none";

      document.body.appendChild(link);
      link.click();

      URL.revokeObjectURL(blobURL);
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
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

  const handleBuyModel = async () => {
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

      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        if (!provider) {
          console.log("Metamask is not installed, please install!");
        }
        const con = await modelInstance();
        // const price = parseInt(model[4]._hex, 16);
        // console.log(model);
        // // console.log("Ether value: ", ethers.utils.parseEther(price.toString()));
        // const tx = model[11] && await con.purchaseModel(parseInt(model[11]._hex, 16), {
        //   value: ethers.utils.parseEther(price.toString()),
        // });
        const price = model.length > 4 && model[4] && model[4]._hex
  ? parseInt(model[4]._hex, 16) === 0
    ? "0"
    : parseInt(model[4]._hex, 16)
  : null;

const tx = price !== null
  ? await con.purchaseModel(
      model.length > 11 && model[11] && model[11]._hex
        ? parseInt(model[11]._hex, 16)
        : null,
      {
        value: ethers.utils.parseEther(price.toString()),
      }
    )
  : null;

        // console.log(tx);
        await tx.wait();
        setbtnloading(false);

        const status = await con.getPurchaseStatus(
          parseInt(model[11]._hex, 16),
          address
        );
        const cid = model[6];

        const { publicKey, signedMessage } = await encryptionSignature();

        const { error, shards } = await recoverShards(
          publicKey,
          cid,
          signedMessage,
          3,
          { "1.modelId": parseInt(model[11]._hex, 16).toString() }
        );

        const { masterKey: recoveredKey } = await recoverKey(shards);

        const fileType = "application/gzip";
        const model_file = await lighthouse.decryptFile(
          cid,
          recoveredKey,
          fileType
        );

        // console.log("Decrypted file", model_file);

        const url = window.URL.createObjectURL(model_file);
        const a = document.createElement("a");
        a.href = url;
        a.download = "downloaded_file";
        a.click();
        window.URL.revokeObjectURL(url);

        // console.log("Decryption: ", model_file);
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
      // console.log("Error in buying dataset: ", e.reason);
    }
  };
  useEffect(() => {
    if (isPopupVisible) {
      window.scrollTo(0,0);
      document.body.style.overflow = "hidden"; // Disable scrolling on body
    } else {
      document.body.style.overflow = "auto"; // Enable scrolling on body
    }
  
    return () => {
      document.body.style.overflow = "auto"; // Make sure scrolling is enabled when component is unmounted
    };
  }, [isPopupVisible]);
  
const signMessage = async () => {
  try {
    if (window.ethereum) {
      await window.ethereum.request({ method: "eth_requestAccounts" }); // Prompt user to connect their wallet
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const messageBytes = ethers.utils.toUtf8Bytes(
        process.env.REACT_APP_MSG_TO_SIGN
      );
      const sign = await signer.signMessage(messageBytes);

      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/de-computation`,
        {
          address,
          sign,
        }
      );
      const token = res.data.jwtToken;
      console.log("token",token)
      Cookies.set("jwtToken", token, { expires: 1 });
      setPopupVisible(false);
    } else {
      console.error("No Ethereum wallet detected");
    }
  } catch (error) {
    console.error("Error signing the message:", error);
  }
};

// useEffect(() => {
//   const prevAddress = Cookies.get("prevAddress");
//   if (!prevAddress) {
//     Cookies.set("prevAddress", address);
//   } else if (address !== prevAddress) {
//     Cookies.remove("jwtToken");
//     Cookies.set("prevAddress", address);
//   }
// }, []);
useEffect(() => {
  const prevAddress = Cookies.get("prevAddress");
  const handleAddressChange = () => {
    if (prevAddress !== address) {
      Cookies.remove("jwtToken");
      Cookies.set("prevAddress", address);
    }
  };

  handleAddressChange();

  window.addEventListener("addressChanged", handleAddressChange);
  return () => {
    window.removeEventListener("addressChanged", handleAddressChange);
  };
}, [address]);

useEffect(() => {
  if (location.pathname === "/model-marketplace/single-model") {
    const jwtToken = Cookies.get("jwtToken");
    console.log(jwtToken)
    if(!address){
      setPopupVisible(false);
    }
    else if(!jwtToken) {
      setPopupVisible(true);
    }
  } else {
    setPopupVisible(false);
  }
}, [location,address]);

const hidePopup = () => {
  setPopupVisible(false);
};
const popupBg = isPopupVisible ? "popup-background" : "";
const handleBackClick = () => {
  navigate('/model-marketplace'); // Navigate to the '/previous-route' path
};
  return (<>
   
   <div className={`${popupBg}`}>
   <div className="col-lg-1 back" onClick={handleBackClick}>
              <FontAwesomeIcon icon={faArrowLeftLong} />
              &nbsp;
              &nbsp;
              <span>Back</span>            
              </div>
    <div className={`d-flex flex-md-row flex-column `}>
      <div className={"py-3 col-md-8 col-lg-9"}>
        <div className="py-4 mx-3 my-2 single-model-heading-container">
          <div className="px-5 py-1 d-flex single-model-head">{model[0]}</div>
          <div className="px-5 py-1 d-flex single-model-subhead">
            {model[1]}
          </div>
        </div>
        <div className="mx-4">
          <div className="py-3">
            <div className="single-model-documents">Licence Agreement</div>
            <div className="d-flex">
              <button
                type="submit"
                className="py-2 px-5 btn single-model-document-btn"
                onClick={handleLicenseDownload}
              >
                View
              </button>
            </div>
          </div>
          <div className="py-3">
            <div className="single-model-documents">Usage Documentation</div>
            <div className="d-flex">
              <button
                type="submit"
                className="py-2 px-5 btn single-model-document-btn"
                onClick={handleUsageDownload}
              >
                View
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="col-md-4 col-lg-3 ">
        <div className="py-5 single-model-details">
          {model.isPublic || model.isPrivate ? (
            <div className="py-sm-5 py-4">
              <button
                type="submit"
                className="py-2 px-5 btn single-model-download"
                onClick={handleDownload}
                disabled={model[10]}
              >
                Download
              </button>
            </div>
          ) : (
            ""
          )}

          <div className="pt-sm-4 pt-2 px-md-3 single-model-content">
            <div className="py-3">
              <div className="single-model-details-head">Category</div>
              <div className="single-model-details-value">{model[2]}</div>
            </div>
            <div className="py-3">
              <div className="single-model-details-head">Tags/keywords</div>
              <div className="single-model-details-value">{model[3]}</div>
            </div>

            <div className="py-2">
              <div className="single-model-details-head">
                Price of Model (in BTT)
              </div>
              <div className="single-model-details-value">
                {console.log(model)}
                {parseInt(model[4]._hex, 16) === 0  ? "0" : parseInt(model[4]._hex, 16)}
              </div>
            </div>
            {model.isForSale ? (
              <div className="py-4">
                <button
                  type="submit"
                  className="btn rounded-pill my-2 py-sm-3 px-sm-5 model-buy-btn"
                  disabled={!model[10]}
                  onClick={handleBuyModel}
                >
                  {btnloading ? (
                    <>
                      <PulseLoader color="#fff" size={12} />
                    </>
                  ) : (
                    <>Buy Now</>
                  )}
                </button>
              </div>
            ) : (
              ""
            )}

     
            <ToastContainer />
          </div>
        </div>
      </div>
      </div>
  
      </div>
      
   { isPopupVisible && <ComputationPopup
              isVisible={isPopupVisible}
              signMessage={signMessage}
              hidePopup={hidePopup}
            />
   }
    </>
  );
}

export default SingleModel;
