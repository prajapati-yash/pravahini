import React, { useState, useEffect ,useRef} from "react";
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
import Chartss from "./chartpage.js";
import ComputationPopup from "../../pages/ComputationPopUp.js";
// import Chartss from "./barchart.js";
import Count from "./count.js";
import Cookies from "js-cookie";


function SingleDataset() {
  const [tableHeaders, setTableHeaders] = useState([]);
  const [tableRows, setTableRows] = useState([]);
  const { address } = useAccount();
  const location = useLocation();
  // console.log(location.state.data);
  const dataset = location.state ? location.state.data : "";
  const [btnloading, setbtnloading] = useState(false);
  const [displayedRows, setDisplayedRows] = useState(10);
  const [isPopupVisible, setPopupVisible] = useState(false); // Initialize to true to always show initially

  const popupRef = useRef(null);
  
  const handleViewMore = () => {
    setDisplayedRows(displayedRows + 10);
  };

  const handleViewLess = () => {
    setDisplayedRows(displayedRows - 10);
  };

  useEffect(() => {
    // console.log("dataset",dataset)
    fetchCSVData();
  }, []);

  const fetchCSVData = async () => {
    try {
      const response = await axios.get(
        `https://gateway.lighthouse.storage/ipfs/${dataset.uploadDemoDataset}`
      );
      // console.log(response);----data je uploaded 6
      const csvData = response.data;
      // console.log(csvData)
      // console.log(data);
      const rows = csvData.split("\n");
      // console.log(rows)---bdhi row
      const headers = rows[0].split(",").map((header) => header.trim());
      // console.log(headers)----first row
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
      // console.log(parsedData)
      // setData(parsedData[0]);
      // console.log(data)
      setTableHeaders(headers);
      setTableRows(parsedData);
      // console.log(tableRows);

      // console.log("Number of rows:", parsedData.length);
      // console.log("Column names:", headers);
      return { rowCount: parsedData.length, columnNames: headers };
    } catch (error) {
      console.error("Error fetching CSV file:", error);
      return { rowCount: 0, columnNames: [] }; 
    }
  };


  const handleDownload = async () => {
    try {
      const response = await axios.get(
        `https://gateway.lighthouse.storage/ipfs/${dataset.uploadDataset}`,
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
        // const price = parseInt(dataset[2]._hex, 16);
        const price=dataset.length > 11 && dataset[11] && dataset[11]._hex
        ? parseInt(dataset[2]._hex, 16)
        : null;
        const tx = await con.purchaseDataset(parseInt(dataset[11]._hex, 16), {
          value: ethers.utils.parseEther(price.toString()),
        });

        // console.log(tx);
        await tx.wait();
        setbtnloading(false);
       

        const status = await con.getPurchaseStatus(
          parseInt(dataset[11]._hex, 16),
          address
        );
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

        const url = window.URL.createObjectURL(dataset_file);
        const a = document.createElement("a");
        a.href = url;
        a.download = "downloaded_file";
        a.click();
        window.URL.revokeObjectURL(url);
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
  
  useEffect(() => {
    const prevAddress = Cookies.get("prevAddress");
    if (!prevAddress) {
      Cookies.set("prevAddress", address);
    } else if (address !== prevAddress) {
      Cookies.remove("jwtToken");
      Cookies.set("prevAddress", address);
    }
  }, []);
  
  useEffect(() => {
    if (location.pathname === "/dataset-marketplace/single-dataset") {
      const jwtToken = Cookies.get("jwtToken");
      console.log(jwtToken)
      if(!address){
        setPopupVisible(false);
       
      }
      else if (!jwtToken) {
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
  return (
    <>
    <div className={`${popupBg}`} atyle={{overflow: isPopupVisible ? 'hidden' : 'auto',}}>
    <div className="d-flex flex-md-row flex-column">
      <div className="py-3 col-md-7 col-lg-8">
        <div className="py-3">
          <div className="single-dataset-head">{dataset[0]}</div>
          <div className="single-dataset-subhead">{dataset[1]}</div>
        </div>

        <div>
          <Chartss />
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
                    {/* {tableRows.map((row, rowIndex) => (
                      <tr key={rowIndex} className="dataset-table-body">
                        {tableHeaders.map((header, colIndex) => (
                          <td key={colIndex}>{row[header]}</td>
                        ))}
                      </tr>
                    ))} */}
                     {tableRows.slice(0, displayedRows).map((row, rowIndex) => (
                    <tr key={rowIndex} className="dataset-table-body">
                      {tableHeaders.map((header, colIndex) => (
                        <td key={colIndex}>{row[header]}</td>
                      ))}
                    </tr>
                  ))}
{/* allready commented */}
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

          {tableRows.length > displayedRows && (
          <button className="button-more" onClick={handleViewMore}>
            View More
          </button>
        )}

        {displayedRows > 10 && (
          <button className="button-less" onClick={handleViewLess}>
            View Less
          </button>
        )}
        </div>
      </div>
      <div className="col-md-5 col-lg-4">
        <div className="py-5 single-dataset-details">

          <div className="count-row">
            <Count />
            <p>It contains data about the </p>
            <ul>
              {tableHeaders.map((header, index) => (
                <React.Fragment key={index}>
                <li>{header}</li>
                {index !== tableHeaders.length - 1 && <span>, </span>}
                </React.Fragment>
              ))}
            </ul>

            </div>
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
                Price Of Dataset (in BTT)
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

            {/* <div>Dataset Id:-{parseInt(dataset[11]._hex, 16)}</div> */}

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

export default SingleDataset;
