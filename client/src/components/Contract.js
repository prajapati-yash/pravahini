import { ethers } from "ethers";
import userAuthorizationABI from "../contracts/artifacts/UserAuthorizationABI.json";
import datasetMarketplaceABI from "../contracts/artifacts/DatasetMarketplaceABI.json";
import modelMarketplaceABI from "../contracts/artifacts/ModelMarketplaceABI.json";

export const AUTHORIZATION_ADDRESS =
  "0xE2c64f32671Bc14B873f5C90FCae2Dca4A6227a5";
export const DATASET_ADDRESS = "0x3A848F9038065413Cf296DeE7D7b888Ed345AC0e";
export const MODEL_ADDRESS = "0xf88a9Af03DAA1B5DB4C0e61CA53FdCdCe31E198e";

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
