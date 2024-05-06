import React, { useState, useEffect } from "react";
import "../../styles/dashboard/UserDetails.css";
import { useNavigate } from "react-router-dom";
import UserDatasets from "./UserDatasets";
import UserModels from "./UserModels";
import SubscribedDatasets from "./SubscribedDatasets";
import SubscribedModels from "./SubscribedModels";
import { ethers } from "ethers";
import { authorizationInstance } from "../Contract";
import { useAccount } from "wagmi";
import { ClipLoader } from "react-spinners";
import axios from "axios";
import Cookies from "js-cookie";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';


function UserDetails() {
  const [img, setImg] = useState();
  const [userName, setUserName] = useState();
  const [occupation, setOccupation] = useState();
  const [organization, setOrganization] = useState();
  const [location, setLocation] = useState();
  const [Email,setEmail]=useState("");
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [showButtons, setShowButtons] = useState(false);
  const [activeComponent, setActiveComponent] = useState("userDatasets");
  const { address } = useAccount();
  const navigate = useNavigate();
  const [isPageLoading, setIsPageLoading] = useState(true);
 
  
  useEffect(()=>{
    const verifyUserAccount = async () => {
      try {
        const { ethereum } = window;
        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const messageBytes = ethers.utils.toUtf8Bytes(
            process.env.REACT_APP_MSG_TO_SIGN
          );
          if(address){

            if(!Cookies.get("jwtToken")){
            const sign = await signer.signMessage(messageBytes);
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/de-computation`, {
              address,
              sign,
            });
            const token = res.data.jwtToken;
            Cookies.set("jwtToken", token, { expires: 1 });
            }
            const con = await authorizationInstance();
            const verifyTx = await con.isRegistered(address);
            // result = verifyTx
            console.log("verify",verifyTx);
            // console.log(con);
            return verifyTx;
          }else {
          }
          console.log("Metamask is not installed, please install!");
        }
      } catch (error) {
        console.log(error);
      }
    };
    verifyUserAccount();
  },[address,navigate])
  const handleDatasetClick = (e) => {
    setShowButtons(false);
    e.preventDefault();
    navigate("/user-dashboard");
    setActiveComponent("userDatasets");
  };

  const handleModelClick = (e) => {
    setShowButtons(false);
    e.preventDefault();
    navigate("/user-dashboard/user-dashboard-models");
    setActiveComponent("userModels");
  };

  const handleSubscribedDatasets = (e) => {
    e.preventDefault();
    navigate("/user-dashboard/subscription/user-datasets");
    setShowButtons(true);
    setActiveComponent("subscribedDatasets");
  };

  const handleSubscribedModels = (e) => {
    e.preventDefault();
    navigate("/user-dashboard/subscription/user-models");
    setActiveComponent("subscribedModels");
  };
  
  const editEmail = async () => {
    setIsEditingEmail(true);
  };

  const saveEmail = async (e) => {
    e.preventDefault();
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      if (!provider) {
        console.log("Metamask is not installed, please install!");
      } else {
        const address = await provider.getSigner().getAddress();
        // console.log("address", address);

        const con = await authorizationInstance();
        const userData = await con.getUser(address);

        const data = { address, userData, Email: newEmail };
        // console.log("dataaaaa", data.userData);
        await axios
          .put(`${process.env.REACT_APP_BACKEND_URL}/user/register`, data)
          .then((response) => {
            console.log("User updated successfully!");
            setEmail(newEmail); // Update the Email state with the new email
            setIsEditingEmail(false); // Exit editing mode
          })
          .catch((error) => {
            console.error("Error updating user:", error);
            // Handle the error here
          });
      }
    }
  };
  const getUserAccountDetails = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        if (!provider) {
          console.log("Metamask is not installed, please install!");
        }else{
          const address = await signer.getAddress();
          // console.log("address",address);
          //get request to get email from mongodb with address
         
          const con = await authorizationInstance();
          const userData = await con.getUser(address);
  
          console.log(userData);
          setUserName(userData[0]);
          setOccupation(userData[1]);
          setOrganization(userData[2]);
          setLocation(userData[3]);
          setImg(userData[4]);
          // console.log("response",response.data.Email);
          
          return userData;
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const userEmail = async () => {
      try{

        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/user/register?address=${address}`);
        if(response){
          setEmail(response.data.Email);//set email here
        }else{
          setEmail("");
        }
      }catch(error){
console.log(error)
      }
    }
    getUserAccountDetails();
    userEmail()
    setIsPageLoading(false);
  }, []);

  const renderComponent = () => {
    switch (activeComponent) {
      case "userDatasets":
        return <UserDatasets />;
      case "userModels":
        return <UserModels />;
      case "subscribedDatasets":
        return <SubscribedDatasets />;
      case "subscribedModels":
        return <SubscribedModels />;
      default:
        return <UserDatasets />;
    }
  };

  useEffect(() => {
    // Enable Bootstrap tooltips
    const tooltipTriggerList = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );
    tooltipTriggerList.map(
      (tooltipTriggerEl) => new window.bootstrap.Tooltip(tooltipTriggerEl)
    );

    // Clean up when the component unmounts
    return () => {
      tooltipTriggerList.forEach((tooltipTriggerEl) => {
        const tooltip = window.bootstrap.Tooltip.getInstance(tooltipTriggerEl);
        if (tooltip) {
          tooltip.dispose();
        }
      });
    };
  });

  return (
    <div className="dashboard-main-component">
      <div className="d-flex flex-md-row flex-column user-details-component py-4 px-1">
        <div className="col-md-4 d-flex align-items-center justify-content-center">
          <img
            src={"https://gateway.lighthouse.storage/ipfs/" + img}
            alt="logo"
            className="dash-image"
          />
        </div>
        <div className="py-sm-4 col-md-8 user-details-content">
          <div className="user-main-content">
            Welcome, <span>{userName}</span>
          </div>
          <div className="platform-content">
            Pravahini facilitates the assessment and sharing of datasets and ML
            models while also enabling decentralized computing capabilities.
          </div>
          <div className="pt-2">
            <div className="d-flex py-1 details-content">
              <div className="col-sm-3 px-3 px-sm-0 col-5 d-flex justify-content-flex-start user-details-head">
                Occupation
              </div>
              <div className="d-flex col-md-4 col-sm-7 col-6 user-details-div">
                {occupation}
              </div>
            </div>
            <div className="d-flex py-1 details-content">
              <div className="col-sm-3 px-3 px-sm-0 col-5 d-flex justify-content-flex-start user-details-head">
                Organization
              </div>
              <div className="d-flex col-md-4 col-sm-7 col-6 user-details-div">
                {organization}
              </div>
            </div>
            <div className="d-flex py-1 details-content">
              <div className="col-sm-3 px-3 px-sm-0 col-5 d-flex justify-content-flex-start user-details-head">
                Location
              </div>
              <div className="d-flex col-md-4 col-sm-7 col-6 user-details-div">
                {location}
              </div>
            </div>
            {/* <div className="d-flex py-1 details-content">
              <div className="col-sm-3 px-3 px-sm-0 col-5 d-flex justify-content-flex-start user-details-head">
                Email
              </div>
              <div className="d-flex col-md-4 col-sm-7 col-6 user-details-div">
                {Email}
              </div>
                <a onClick={editEmail}>edit</a>

            </div> */}
                <div className="d-flex py-1 details-content">
          <div className="col-sm-3 px-3 px-sm-0 col-5 d-flex justify-content-flex-start user-details-head">
            Email
          </div>
          {isEditingEmail ? (
            <form onSubmit={saveEmail} className="d-flex col-md-4 col-sm-7 col-6">
              <input
              className="user-details-div"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                required
              />
              <button className="mx-sm-1 mx-2 save-btn" type="submit">Save</button>
            </form>
          ) : (
            <>
            <div className="d-flex col-md-4 col-sm-7 col-6 user-details-div">
              {Email}
            </div>
            &nbsp;
            &nbsp;
            <FontAwesomeIcon   style={{ cursor: 'pointer' }}
 className="my-1 " onClick={editEmail} icon={faPenToSquare} />
            </>
          )}
        </div>
          </div>
        </div>
      </div>
      <div>
        <div className="d-flex py-4 justify-content-center dashboard-btns">
          <button
            type="button"
            data-bs-toggle="tooltip"
            data-bs-placement="bottom"
            title="The datasets that are created by user will be displayed here."
            className={`mx-sm-3 mx-2 dashboard-dataset-btn ${
              activeComponent === "userDatasets" ? "active-button" : ""
            }`}
            onClick={handleDatasetClick}
          >
            All Datasets
          </button>
          <button
            type="button"
            data-bs-toggle="tooltip"
            data-bs-placement="bottom"
            title="The ML models that are created by user will be displayed here."
            className={`mx-sm-3 mx-2 dashboard-model-btn ${
              activeComponent === "userModels" ? "active-button" : ""
            }`}
            onClick={handleModelClick}
          >
            All Models
          </button>
          <button
            type="button"
            data-bs-toggle="tooltip"
            data-bs-placement="bottom"
            title="The datasets or models that user have bought will be displayed here."
            className={`mx-sm-3 mx-2 dashboard-subscription-btn ${
              showButtons === true ? "active-button" : ""
            }`}
            onClick={handleSubscribedDatasets}
          >
            Subscription
          </button>
        </div>
        <div>
          {showButtons && (
            <div>
              <button
                className={`my-sm-4 mx-sm-3 my-3 mx-2 px-4 py-2 subscription-dataset-btn ${
                  activeComponent === "subscribedDatasets"
                    ? "active-button"
                    : ""
                }`}
                onClick={handleSubscribedDatasets}
              >
                Datasets
              </button>
              <button
                className={`my-sm-4 mx-sm-3 my-3 mx-2 px-4 py-2 subscription-model-btn ${
                  activeComponent === "subscribedModels" ? "active-button" : ""
                }`}
                onClick={handleSubscribedModels}
              >
                Models
              </button>
            </div>
          )}
        </div>
        <>{renderComponent()}</>
      </div>
    </div>
  );
}

export default UserDetails;
