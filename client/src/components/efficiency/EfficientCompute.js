import React, { useState } from "react";
import hero from "../../assets/computation/efficient2.png";
import add from "../../assets/computation/add.png";
import "../../styles/efficiency/EfficientCompute.css";
import axios from "axios";
import { useAccount } from "wagmi";
import Cookies from "js-cookie";

function EfficientCompute() {
  const {address} = useAccount();
  const [datasetUrls, setDatasetUrls] = useState([]);
  const [datasetUrl, setDatasetUrl] = useState("");
  const [notebookUrl, setNotebookUrl] = useState("");
  const [jobId, setJobId] = useState("");
  const [btnloading, setbtnloading] = useState(false);
  const [cid, setCid] = useState("");
  const [showButton, setShowButton] = useState(true);
  const token = Cookies.get('jwtToken');
  const tokenHeaders = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
 

  const handleDatasetUrlChange = (event) => {
    setDatasetUrl(event.target.value);
  };

  const handleAddUrl = () => {
    if (datasetUrl.trim() !== "") {
      setDatasetUrls([...datasetUrls, datasetUrl]);
      setDatasetUrl("");
    }
  };

  const handleRemoveUrl = (index) => {
    const newUrls = datasetUrls.filter((_, i) => i !== index);
    setDatasetUrls(newUrls);
  };

  
  const handleExecute = () => {
    if(!address){
      console.log("Wallet Address is required!")
    }else{
    console.log("Started Execution...")
    setbtnloading(true);
    setJobId("");
    setShowButton(true);
    setCid("");
    const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/container1/execute`;
    const requestData = {
      notebookUrl: notebookUrl,
      inputs: datasetUrls.map((url) => ({ url: url })),
    };
    
    const startTimeStamp = new Date();
    axios
      .post(apiUrl, requestData, tokenHeaders)
      .then((response) => {
        const { jobId } = response.data;

        setJobId(jobId);
        setCid(cid);
        const saveJobUrl = `${process.env.REACT_APP_BACKEND_URL}/container1/save-job`;
        const jobData = {
          walletAddress: address, 
          jobId: jobId,
          cid: "",
          timeStamp:startTimeStamp,
          jobStatus:"InProgress"
        };
  
        // Post request to save the data in the database
        axios
          .post(saveJobUrl, jobData, tokenHeaders)
          .then((saveResponse) => {
            console.log("Job details saved:");
          })
          .catch((saveError) => {
            console.error("Error saving job:", saveError);
          });
  
        setbtnloading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setbtnloading(false);
      });}
  };

  const handleGetCID = (jobId) =>{
    console.log("Started Cid Getting")
    // const index = dataList.findIndex((data) => data.jobId === jobId );
    // if(index !== -1){
      console.log("Getting CID of this Job Id!")
    const apiURL = `${process.env.REACT_APP_BACKEND_URL}/container1/get-cid/:${jobId}`;
    console.log(jobId)

    axios
    .get(apiURL, tokenHeaders)
    .then((response) =>{
      const { cid } = response.data;
      setCid(cid);
      console.log(`CID for current ${jobId} is `, cid);
      setShowButton(false);
      try{
      const updateJobUrl = `${process.env.REACT_APP_BACKEND_URL}/container1/update-cid`;
      const jobData = {
        walletAddress: address, 
        jobId: jobId,
        cid: cid,
      };
      // Post request to save the data in the database
      axios
        .post(updateJobUrl, jobData, tokenHeaders)
        .then((saveResponse) => {
          console.log("Job details updated:");
        })
        .catch((saveError) => {
          console.error("Error updating job:", saveError);
        });}catch(error){
          console.log("While Updating job", error)
        }
  
    })
    .catch((error)=>{
      console.error("Error:",error);
    })
  }


  return (
    <div>
      <div className="pt-4 efficient-compute-container">
        <div>
          <img src={hero} className="efficient-compute-img" />
        </div>
        <div className="py-3 efficient-compute-details">
          <div className="py-3 d-flex efficient-compute-head">
            Compute Your Model
          </div>
          <div className="efficient-compute-data">
            <div className="py-2">
              <div className="d-flex efficient-compute-dataset-text">
                Enter Dataset URL
              </div>
              <div className="d-flex align-items-center">
                <div className="py-2">
                  <input
                    type="text"
                    className="efficient-compute-dataset-input"
                    placeholder="Enter Dataset URL"
                    onChange={handleDatasetUrlChange}
                  />
                </div>
                <div className="d-flex">
                  <img
                    className="efficient-compute-dataset-img"
                    src={add}
                    onClick={() => handleAddUrl()}
                  />
                </div>
              </div>
              <div>
                {datasetUrls.map((url, index) => (
                  <div
                    key={index}
                    className="d-flex align-items-center mb-2 bg-white efficient-display-url-container"
                  >
                    <div className="flex-grow-1 efficient-display-urls">{url}</div>
                    <button
                      className="btn btn-danger efficient-display-urls-btn"
                      onClick={() => handleRemoveUrl(index)}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="py-2">
              <div className="d-flex efficient-compute-model-text">
                Enter Model URL
              </div>
              <div className="d-xl-flex align-items-center">
                <div className="py-2">
                  <input
                    type="text"
                    value={notebookUrl}
                    onChange={(e) => setNotebookUrl(e.target.value)}
                    className="efficient-compute-model-input"
                    placeholder="Enter Model URL"
                  />
                </div>
                <div>
                <button className="rounded-pill visualization-compute-model-btn" onClick={() => handleExecute()}>
                  {btnloading ? (
                  <svg
                    className="animate-spin button-spin-svg-pic"
                    version="1.1"
                    id="L9"
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    viewBox="0 0 100 100"
                    style={{ fill: "#fff" }}
                  >
                    <path d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50"></path>
                  </svg>
                ) : (
                  <> Compute</>
                )}
                  </button>
                </div>
              </div>
            </div>

            <div className="py-2">
              <div className="visualization-compute-job-id">Job id: {jobId}</div>
            </div>

            <div className="d-flex py-2 align-items-center">
              <div className="visualization-compute-cid">cid:</div>
              <div className="px-3">
              {showButton ? (
                <button className="rounded-pill visualization-compute-cid-btn" onClick={() => handleGetCID(jobId)}>
                 Get CID
                 </button>
                ) : (
                  cid
                )}
              </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EfficientCompute;
