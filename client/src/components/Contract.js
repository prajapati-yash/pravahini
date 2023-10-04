import { ethers } from "ethers";
import userAuthorizationABI from "../contracts/artifacts/UserAuthorizationABI.json";
import datasetMarketplaceABI from "../contracts/artifacts/DatasetMarketplaceABI.json";
import modelMarketplaceABI from "../contracts/artifacts/ModelMarketplaceABI.json";

export const AUTHORIZATION_ADDRESS =
  "0x0F5e3C75D595cCa37556fA3a4554FbFA45aF05fC";
export const DATASET_ADDRESS = "0x24d6E3AFd3afE716045ebB1A1B24d93eeEE76291";
export const MODEL_ADDRESS = "0xFd3c306578C4bd70Ef9f3752d2B1C9b97858E82f";

export const authorizationInstance = async () => {
  const { ethereum } = window;
  if (ethereum) {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    if (!provider) {
      console.log("Metamask is not installed, please install!");
    }
    const con = new ethers.Contract(
      AUTHORIZATION_ADDRESS,
      userAuthorizationABI,
      signer
    );
    // console.log(con);
    return con;
  } else {
    console.log("error");
  }
};

export const datasetInstance = async () => {
  const { ethereum } = window;
  if (ethereum) {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    if (!provider) {
      console.log("Metamask is not installed, please install!");
    }
    const con = new ethers.Contract(
      DATASET_ADDRESS,
      datasetMarketplaceABI,
      signer
    );
    // console.log(con);
    return con;
  } else {
    console.log("error");
  }
};

export const modelInstance = async () => {
  const { ethereum } = window;
  if (ethereum) {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    if (!provider) {
      console.log("Metamask is not installed, please install!");
    }
    const con = new ethers.Contract(MODEL_ADDRESS, modelMarketplaceABI, signer);
    // console.log(con);
    return con;
  } else {
    console.log("error");
  }
};
