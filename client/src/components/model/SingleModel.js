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
import { useAccount } from "wagmi";
import { PulseLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function SingleModel() {
  const { address } = useAccount();
  const location = useLocation();
  console.log(location.state.data);
  const model = location.state ? location.state.data : "";
  const [documentData, setDocumentData] = useState(null);
  const [btnloading, setbtnloading] = useState(false);

  const handleDownload = async () => {
    try {
      const response = await axios.get(xlsxFile, { responseType: "blob" });
      console.log(response);

      const blob = new Blob([response.data], {
        type: "application/octet-stream",
      });

      const blobURL = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobURL;
      link.download = "file.xlsx";
      link.style.display = "none";

      document.body.appendChild(link);
      link.click();

      URL.revokeObjectURL(blobURL);
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  // useEffect(() => {
  //   // Replace with the actual URL of your Word document
  //   const documentUrl = `https://gateway.lighthouse.storage/ipfs/${model.uploadUsageDocumentation}`;

  //   axios
  //     .get(documentUrl, {
  //       responseType: "arraybuffer", // Make sure to request the data as an array buffer
  //     })
  //     .then((response) => {
  //       const data = new Blob([response.data], {
  //         type: "application/octet-stream",
  //       });
  //       // console.log("Document data:--- ",data);
  //       const url = URL.createObjectURL(data);
  //       setDocumentData(url);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching Word document:", error);
  //     });
  // }, []);

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
        console.log("Price of model: ", parseInt(model[2]._hex, 16));
        const price = parseInt(model[2]._hex, 16);
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
        // const cid = dataset[4];

        // const { publicKey, signedMessage } = await encryptionSignature();
        // const keyObject = await lighthouse.fetchEncryptionKey(
        //   cid,
        //   publicKey,
        //   signedMessage
        // );

        // const fileType = "text/csv";
        // const decrypted = await lighthouse.decryptFile(
        //   cid,
        //   keyObject.data.key,
        //   fileType
        // );
        // console.log("Decryption: ", decrypted);

        // console.log(`https://files.lighthouse.storage/viewFile/${dataset[4]}`);
        // navigate("/user-dashboard");
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
        <div className="">
          {/* <iframe
            src={`https://gateway.lighthouse.storage/ipfs/${model.uploadUsageDocumentation}`}
            style={{ width: "100%", height: "500px" }}
            frameBorder="0"
            scrolling="no"
          /> */}
        </div>
      </div>
      <div className="col-md-5 col-lg-4">
        <div className="py-5 single-model-details">
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
          <div className="pt-sm-4 pt-2 px-md-5 single-model-content">
            <div className="py-3">
              <div className="single-model-details-head">Category</div>
              <div className="single-model-details-value">{model[2]}</div>
            </div>
            <div className="py-3">
              <div className="single-model-details-head">Tags/keywords</div>
              <div className="single-model-details-value">Value</div>
            </div>
            <div className="py-3">
              <div className="single-model-details-head">Licence Agreement</div>
              <div className="single-model-details-value">Value</div>
            </div>
            <div className="py-3">
              <div className="single-model-details-head">
                Usage Documentation
              </div>
              <div className="single-model-details-value">Value</div>
            </div>
            <div className="py-2">
              <div className="single-model-details-head">Price of Model</div>
              <div className="single-model-details-value">
                {parseInt(model[3]._hex, 16)}
              </div>
            </div>
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
            <ToastContainer />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SingleModel;
