import { ethers } from "ethers";
import userAuthorizationABI from "../contracts/artifacts/UserAuthorizationABI.json";
import datasetMarketplaceABI from "../contracts/artifacts/DatasetMarketplaceABI.json";
import modelMarketplaceABI from "../contracts/artifacts/ModelMarketplaceABI.json";
import AiAgentMarketplaceABI from "../contracts/artifacts/AIAgentMarketplaceABI.json";

// BTTC Testnet Addresses

export const AUTHORIZATION_ADDRESS = "0x0F5e3C75D595cCa37556fA3a4554FbFA45aF05fC";
export const DATASET_ADDRESS = "0x24d6E3AFd3afE716045ebB1A1B24d93eeEE76291";
export const MODEL_ADDRESS = "0xFd3c306578C4bd70Ef9f3752d2B1C9b97858E82f";
// export const AUTHORIZATION_ADDRESS = "0x7AbC10F35319a7B67DF0EB5B864C3f3bd8005A06";
export const AIAgentMarketplace_address= "0x3a2e9Aa459D85891574f6e1343fbFe487f5e43CF";

// export const AUTHORIZATION_ADDRESS =
//   "0xd6bF2cC4F53Fbe71E88288Cd661a31D62AA7237c";
// export const DATASET_ADDRESS = "0xd25B5d65970006D5941C2715538421373F3F9b70";
// export const MODEL_ADDRESS = "0x6de831c3A1d963439A1E54c66ec7E5db204E29a9";


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
    console.log(con);
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

export const AiAgentInstance = async () => {
  const { ethereum } = window;
  if (ethereum) {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    if (!provider) {
      console.log("Metamask is not installed, please install!");
    }
    const con = new ethers.Contract(AIAgentMarketplace_address, AiAgentMarketplaceABI, signer);
    console.log(con);
    return con;
  } else {
    console.log("error");
  }
};

