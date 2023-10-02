import React, { useState, useEffect } from "react";
import "../../styles/model/SingleModel.css";
import axios from "axios";
import csvfile from "../../dummyData/data.csv";
import xlsxFile from "../../dummyData/excelData.xlsx";
import jsonFile from "../../dummyData/jsonData.json";
import * as XLSX from "xlsx";
import { useLocation } from "react-router-dom";
import { modelInstance } from "../Contract";
import { ethers } from "ethers";
import lighthouse from "@lighthouse-web3/sdk";
import { useAccount } from "wagmi";
import { PulseLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { recoverShards, recoverKey } from "@lighthouse-web3/kavach";

function SingleModel() {
  const { address } = useAccount();
  const location = useLocation();
  console.log(location.state.data);
  const model = location.state ? location.state.data : "";
  const [documentData, setDocumentData] = useState(null);
  const [btnloading, setbtnloading] = useState(false);

  const handleDownload = async () => {
    try {
      const response = await axios.get(
        `https://gateway.lighthouse.storage/ipfs/${model.uploadModel}`,
        { responseType: "blob" }
      );
      console.log(response);

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
      console.log(response);

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
      console.log(response);

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
        console.log("Hello");
        console.log("model Id: ", parseInt(model[11]._hex, 16));
        console.log("Price of model: ", parseInt(model[4]._hex, 16));
        const price = parseInt(model[4]._hex, 16);
        console.log("Ether value: ", ethers.utils.parseEther(price.toString()));
        console.log("Hi");
        const tx = await con.purchaseModel(parseInt(model[11]._hex, 16), {
          value: ethers.utils.parseEther(price.toString()),
        });

        console.log(tx);
        await tx.wait();
        setbtnloading(false);

        const status = await con.getPurchaseStatus(
          parseInt(model[11]._hex, 16)
        );
        console.log("Purchase status: ", status);
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

        const fileType = "text/csv";
        const model_file = await lighthouse.decryptFile(
          cid,
          recoveredKey,
          fileType
        );

        console.log("Decrypted file", model_file);

        const url = window.URL.createObjectURL(model_file);
        const a = document.createElement("a");
        a.href = url;
        a.download = "downloaded_file";
        a.click();
        window.URL.revokeObjectURL(url);

        console.log("Decryption: ", model_file);
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
      console.log("Error in buying dataset: ", e.reason);
    }
  };

  return (
    <div className="d-flex flex-md-row flex-column">
      <div className="py-3 col-md-7 col-lg-8">
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
      <div className="col-md-5 col-lg-4">
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

          <div className="pt-sm-4 pt-2 px-md-5 single-model-content">
            <div className="py-3">
              <div className="single-model-details-head">Category</div>
              <div className="single-model-details-value">{model[2]}</div>
            </div>
            <div className="py-3">
              <div className="single-model-details-head">Tags/keywords</div>
              <div className="single-model-details-value">{model[3]}</div>
            </div>

            <div className="py-2">
              <div className="single-model-details-head">Price of Model</div>
              <div className="single-model-details-value">
                {parseInt(model[4]._hex, 16)}
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
  );
}

export default SingleModel;
