import React, { useState, useEffect,useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/model/SingleModel.css";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { AiAgentInstance } from "../Contract";
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
import RatingSystem from './RatingSystem'; 

function SingleAIAgent() {
  const { address } = useAccount();
  const location = useLocation();
  // console.log(location.state.data);
  const AIAgent = location.state ? location.state.data : "";
  const [btnloading, setbtnloading] = useState(false);
  const [isPopupVisible, setPopupVisible] = useState(false); // Initialize to true to always show initially
  const popupRef = useRef(null);
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const [userRating, setUserRating] = useState(null); 
  const [features, setFeatures] = useState([]);
  const [useCases, setUseCases] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchRatingData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/rating/get-ai-agent-rating/${parseInt(AIAgent[11]._hex,16)}`, {
          params: {
            userId: address // Pass the user address as a query parameter
          }
        });
                setAverageRating(response.data.averageRating);
        setRatingCount(response.data.ratingCount);
        setUserRating(response.data.userRating);
      } catch (error) {
        console.error('Error fetching rating data:', error);
      }
    };

    fetchRatingData();
  }, [AIAgent]);
  
  useEffect(() => {
    const fetchAIAgentData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/add-data/ai-agents/${parseInt(AIAgent[11]._hex, 16)}`);
        setFeatures(response.data.keyFeatures || []);
        setUseCases(response.data.useCase || []);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    // if (AIAgent && AIAgent[11]) {
      fetchAIAgentData();
    // }
  }, [AIAgent]);

  const handleRatingSubmit = (newRating) => {
    setUserRating(newRating);
    // Optionally, you can update the average rating and count here
    // or refetch the rating data from the server
  };
  useEffect(() => {
    const fetchRating = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/rating/get-ai-agent-rating/${parseInt(AIAgent[11]._hex,16)}`);
        setRating(response.data.rating);
      } catch (error) {
        console.error('Error fetching rating:', error);
      }
    };

    fetchRating();
  }, [AIAgent,userRating  ]);

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  // useEffect(() => {
  //   if(!address){
  //     setPopupVisible(false);
  //   }
  // }, [address]);
// console.log(model);

  const handleDownload = async () => {
    try {
      const response = await axios.get(
        `https://gateway.lighthouse.storage/ipfs/${AIAgent.uploadAIAgent}`,
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
        `https://gateway.lighthouse.storage/ipfs/${AIAgent.uploadLicense}`,
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
        `https://gateway.lighthouse.storage/ipfs/${AIAgent.uploadUsageDocumentation}`,
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
  const handleBuyAIAgentToast = async () => {
    toast.info("Thank you for your patience! We're working on improving this feature. Soon, you'll be able to purchase AI agents right here.", {
      position: "top-right",  // You can change this based on your preferred position
      autoClose: 5000,  // Auto close after 5 seconds
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    
  }

  const handleBuyAIAgent = async () => {
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
        const con = await AiAgentInstance();
        // const price = parseInt(model[4]._hex, 16);
        // console.log(model);
        // // console.log("Ether value: ", ethers.utils.parseEther(price.toString()));
        // const tx = model[11] && await con.purchaseModel(parseInt(model[11]._hex, 16), {
        //   value: ethers.utils.parseEther(price.toString()),
        // });
        const price = AIAgent.length > 3 && AIAgent[3] && AIAgent[3]._hex
  ? parseInt(AIAgent[3]._hex, 16) === 0
    ? "0"
    : parseInt(AIAgent[3]._hex, 16)
  : null;
console.log(con)
const tx = price !== null
  ? await con.purchaseAIAgent(
    AIAgent.length > 10  && AIAgent[11] && AIAgent[11]._hex
        ? parseInt(AIAgent[11]._hex, 16)
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
          parseInt(AIAgent[11]._hex, 16),
          address
        );
        const cid = AIAgent[6];

        const { publicKey, signedMessage } = await encryptionSignature();

        const { error, shards } = await recoverShards(
          publicKey,
          cid,
          signedMessage,
          3,
          { "1.AIAgentId": parseInt(AIAgent[11]._hex, 16).toString() }
        );
        const { masterKey: recoveredKey } = await recoverKey(shards);

        const fileType = "application/gzip";
        const model_file = await lighthouse.decryptFile(
          cid,
          recoveredKey,
          fileType
        );


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
  if (location.pathname === "/ai-agents-marketplace/single-ai-agent") {
    const jwtToken = Cookies.get("jwtToken");
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
  navigate('/ai-agents-marketplace'); // Navigate to the '/previous-route' path
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
          <div className="px-5 py-1 d-flex single-model-head">{AIAgent[0]}</div>
          <div className="px-5 py-1 d-flex single-model-subhead">
            {AIAgent[1]}
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
            <div className=" my-4">
            <h3 className="single-model-documents">Features</h3>
    {loading ? (<p>Loading features...</p>): features.length > 0 ? ( 
      <p className="mb-2 "style={{"textAlign":"left"}}>{features}</p>): (<p>No features available.</p>)}

            <h3 className="single-model-documents">Use Cases</h3>
            {loading ? (<p>Loading features...</p>): useCases.length > 0 ? ( 
      <p className="mb-2" style={{"textAlign":"left"}}>{useCases}</p>): (<p>No useCase available.</p>)}
            {/* {loading ? (
              <p>Loading features...</p>
            ) : features.length > 0 ? (
              <ul className="list-unstyled">
                {features.map((feature, index) => (
                  <li key={index} className="mb-2">{feature}</li>
                ))}
              </ul>
            ) : (
              <p>No features available.</p>
            )} */}
          {/* </div> */}
        </div>
 
          </div>
        </div>
      </div>
      <div className="col-md-4 col-lg-3 ">
        <div className="py-5 single-model-details">
      <div className="py-3">
              <div className="single-model-details-head">Rating</div>
              <RatingSystem
                aiAgentId={parseInt(AIAgent[11]._hex,16)}
                averageRating={averageRating}
                ratingCount={ratingCount}
                userRating={userRating}
                userAddress={address}
                onRatingSubmit={handleRatingSubmit}
              />
            </div>
          {AIAgent.isPublic || AIAgent.isPrivate ? (
            <div className=" py-2">
              <button
                type="submit"
                className="py-1 px-5 btn single-model-download"
                onClick={handleDownload}
                disabled={AIAgent[9]}
              >
                Download
              </button>
            </div>
          ) : (
            ""
          )}
       
          <div className="pt-sm-4 pt-1.5 px-md-3 single-model-content">
            <div className="py-1">
              <div className="py-1 single-model-details-head">Category</div>
              <div className="single-model-details-value">{AIAgent[2]}</div>
            </div>
            {/* <div className="py-3">
              <div className="single-model-details-head">Tags/keywords</div>
              <div className="single-model-details-value">{model[2]}</div>
            </div> */}

            <div className="py-2">
              <div className="single-model-details-head">
                Price of AI Agent (in BTT)
              </div>
              <div className="single-model-details-value">
                {parseInt(AIAgent[3]._hex, 16) === 0  ? "0" : parseInt(AIAgent[3]._hex, 16)}
              </div>
            </div>
            {AIAgent.isForSale ? (
              <div className="py-4">
                <button
                  type="submit"
                  className="btn rounded-pill my-2 py-sm-3 px-sm-5 model-buy-btn"
                  disabled={!AIAgent[10]}
                  onClick={handleBuyAIAgentToast}
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

export default SingleAIAgent;
