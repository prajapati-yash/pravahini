import React, { useState, useEffect } from "react";
import "../../styles/dataset/SingleDataset.css";
import axios from "axios";
import csvfile from "../../dummyData/data.csv";
import xlsxFile from "../../dummyData/excelData.xlsx";
import jsonFile from "../../dummyData/jsonData.json";
import * as XLSX from "xlsx";
import { useNavigate, useLocation } from "react-router-dom";
import { datasetInstance } from "../Contract";
import { ethers } from "ethers";
import lighthouse from "@lighthouse-web3/sdk";
import { useAccount } from "wagmi";
import { PulseLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { recoverShards, recoverKey } from "@lighthouse-web3/kavach";

function SingleDataset() {
  // const [csvData, setCSVData] = useState([]);
  const [tableHeaders, setTableHeaders] = useState([]);
  const [tableRows, setTableRows] = useState([]);
  const { address } = useAccount();
  const location = useLocation();
  console.log(location.state.data);
  const dataset = location.state ? location.state.data : "";
  const [btnloading, setbtnloading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCSVData();
    // fetchXLSXData();
    // fetchJSONData();
    // console.log("Datasets: ", datasets);
  }, []);

  const fetchCSVData = async () => {
    try {
      const response = await axios.get(
        `https://gateway.lighthouse.storage/ipfs/${dataset.uploadDemoDataset}`
      );
      const csvData = response.data;

      const rows = csvData.split("\n");
      const headers = rows[0].split(",").map((header) => header.trim());
      const parsedData = rows
        .slice(1)
        .filter((row) => row.trim() !== "")
        .map((row) => {
          const values = row.split(",").map((value) => value.trim());
          const rowData = {};
          headers.forEach((header, index) => {
            rowData[header] = values[index];
          });
          return rowData;
        });

      console.log(parsedData);
      setTableHeaders(headers);
      setTableRows(parsedData);
    } catch (error) {
      console.error("Error fetching CSV file:", error);
    }
  };

  const fetchXLSXData = async () => {
    try {
      const response = await axios.get(xlsxFile, {
        responseType: "arraybuffer",
      });
      const buffer = response.data;
      const workbook = XLSX.read(buffer, { type: "array" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      console.log(jsonData);
      if (jsonData.length > 0) {
        const headers = jsonData[0];
        setTableHeaders(headers);
        setTableRows(jsonData.slice(1));
      }
    } catch (error) {
      console.error("Error fetching XLSX file:", error);
    }
  };

  const fetchJSONData = async () => {
    try {
      // const response = await axios.get(jsonFile);
      const jsonData = jsonFile;
      console.log("json data: ", jsonData);

      if (jsonData.length > 0) {
        const headers = Object.keys(jsonData[0]);
        setTableHeaders(headers);
        setTableRows(jsonData);
      }
    } catch (error) {
      console.error("Error fetching JSON file:", error);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await axios.get(
        `https://gateway.lighthouse.storage/ipfs/${dataset.uploadDataset}`,
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
      link.download = `encrypted.${fileExtension}`;
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
        `https://gateway.lighthouse.storage/ipfs/${dataset.uploadLicense}`,
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
      link.download = `encrypted.${fileExtension}`;
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

  const handleBuyDataset = async () => {
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
        const con = await datasetInstance();
        console.log("Hello");
        console.log("Dataset Id: ", parseInt(dataset[11]._hex, 16));
        console.log("Price of Dataset: ", parseInt(dataset[2]._hex, 16));
        const price = parseInt(dataset[2]._hex, 16);
        console.log("Ether value: ", ethers.utils.parseEther(price.toString()));
        console.log("Hi");
        const tx = await con.purchaseDataset(parseInt(dataset[11]._hex, 16), {
          value: ethers.utils.parseEther(price.toString()),
        });

        console.log(tx);
        await tx.wait();
        setbtnloading(false);

        const status = await con.getPurchaseStatus(
          parseInt(dataset[11]._hex, 16),
          address
        );
        console.log("Purchase status: ", status);
        const cid = dataset[4];

        const { publicKey, signedMessage } = await encryptionSignature();

        const { error, shards } = await recoverShards(
          publicKey,
          cid,
          signedMessage,
          3,
          { "1.datasetId": parseInt(dataset[11]._hex, 16).toString() }
        );

        const { masterKey: recoveredKey } = await recoverKey(shards);

        const fileType = "text/csv";
        const dataset_file = await lighthouse.decryptFile(
          cid,
          recoveredKey,
          fileType
        );

        console.log("Decrypted file", dataset_file);

        const url = window.URL.createObjectURL(dataset_file);
        const a = document.createElement("a");
        a.href = url;
        a.download = "downloaded_file";
        a.click();
        window.URL.revokeObjectURL(url);

        console.log("Decryption: ", dataset_file);

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
        <div className="py-3">
          <div className="single-dataset-head">{dataset[0]}</div>
          <div className="single-dataset-subhead">{dataset[1]}</div>
        </div>
        <div className="py-4">
          {tableRows.length > 0 && (
            <div className="single-dataset-table">
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead className="dataset-table-head">
                    <tr>
                      {tableHeaders.map((header, index) => (
                        <th key={index}>{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tableRows.map((row, rowIndex) => (
                      <tr key={rowIndex} className="dataset-table-body">
                        {tableHeaders.map((header, colIndex) => (
                          <td key={colIndex}>{row[header]}</td>
                        ))}
                      </tr>
                    ))}

                    {/* {tableRows.map((row, rowIndex) => (
                          <tr key={rowIndex} className='dataset-table-body'>
                            {row.map((value, colIndex) => (
                              <td key={colIndex}>{value}</td>
                            ))}
                          </tr>
                      ))} */}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="col-md-5 col-lg-4">
        <div className="py-5 single-dataset-details">
          {dataset.isPublic || dataset.isPrivate ? (
            <div className="py-sm-5 py-4">
              <button
                type="submit"
                className="py-2 px-5 btn single-dataset-download"
                onClick={handleDownload}
                disabled={dataset[10]}
              >
                Download
              </button>
            </div>
          ) : (
            ""
          )}

          <div className="pt-sm-4 pt-2 px-md-5 single-dataset-content">
            <div className="py-3">
              <div className="single-dataset-details-head">Category</div>
              <div className="single-dataset-details-value">{dataset[7]}</div>
            </div>
            {/* <div className="py-3">
              <div className="single-dataset-details-head">Attributes</div>
              <div className="single-dataset-details-value">Value</div>
            </div> */}
            <div className="py-3">
              <div className="single-dataset-details-head">
                Price Of Dataset
              </div>
              <div className="single-dataset-details-value">
                {parseInt(dataset[2]._hex, 16)}
              </div>
            </div>

            <div className="py-3">
              <button
                type="submit"
                className="px-5 btn single-dataset-license"
                onClick={handleLicenseDownload}
              >
                License
              </button>
            </div>
            {dataset.isForSale ? (
              <div className="py-4">
                <button
                  type="submit"
                  className="btn rounded-pill my-2 py-sm-3 px-sm-5 dataset-buy-btn"
                  disabled={!dataset[10]}
                  onClick={handleBuyDataset}
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

export default SingleDataset;
