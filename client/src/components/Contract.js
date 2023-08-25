import { ethers } from "ethers";
import userAuthorizationABI from "../contracts/artifacts/UserAuthorizationABI.json";
import datasetMarketplaceABI from "../contracts/artifacts/DatasetMarketplaceABI.json";
import modelMarketplaceABI from "../contracts/artifacts/ModelMarketplaceABI.json";

export const AUTHORIZATION_ADDRESS =
  "0x6569B7276567075B67DC3bFcc87A0412f174A8c1";
export const DATASET_ADDRESS = "0x4e6D168cF8A5B8D2402faA8F5b4b377413462D95";
export const MODEL_ADDRESS = "0x784adC4c1760343b7a726DFD37D61185A9B1A6dd";

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
      datasetInstance,
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
    const con = new ethers.Contract(modelInstance, modelMarketplaceABI, signer);
    // console.log(con);
    return con;
  } else {
    console.log("error");
  }
};
