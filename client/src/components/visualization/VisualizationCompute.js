import React, { useState } from "react";
import "../../styles/visualization/VisualizationCompute.css";
import hero from "../../assets/computation/visualization2.png";
import add from "../../assets/computation/add.png";
import axios from "axios";
import { useAccount } from "wagmi";
import Cookies from "js-cookie";
import { PulseLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function VisualizationCompute() {
  const { address } = useAccount();
  const [datasetUrls, setDatasetUrls] = useState([]);
  const [datasetUrl, setDatasetUrl] = useState("");
  const [notebookUrl, setNotebookUrl] = useState("");
  const [jobId, setJobId] = useState("");
  const [btnloading, setbtnloading] = useState(false);
  const [cidloading, setcidloading] = useState(false);
  const [cid, setCid] = useState("");
  const [showButton, setShowButton] = useState(true);
  const token = Cookies.get("jwtToken");
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

  const handleExecute =async() => {
    if (!address) {
      console.log("Wallet Address is required!");
    } else {
      console.log("Started Execution...");
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/user/register?address=${address}` )

      toast.info("Your Job is computing", {
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
      setJobId("");
      setShowButton(true);
      setCid("");
      const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/container2/execute`;
      const requestData = {
        Email:response.data.Email,
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

          const saveJobUrl = `${process.env.REACT_APP_BACKEND_URL}/container2/save-job`;
          const jobData = {
            walletAddress: address,
            jobId: jobId,
            cid: "",
            timeStamp: startTimeStamp,
            jobStatus: "In Progress",
          };

          // Post request to save the data in the database
          axios
            .post(saveJobUrl, jobData, tokenHeaders)
            .then((saveResponse) => {
              console.log("Job details saved:", saveResponse.data);
            })
            .catch((saveError) => {
              console.error("Error saving job:", saveError);
            });

          setbtnloading(false);
        })
        .catch((error) => {
          console.error("Error:", error);
          setbtnloading(false);
        });
    }
  };

  const handleGetCID = (jobId) => {
    console.log("Started Cid Getting");
    // const index = dataList.findIndex((data) => data.jobId === jobId );
    // if(index !== -1){
    console.log("Getting CID of this Job Id!");
    setcidloading(true);
    const apiURL = `${process.env.REACT_APP_BACKEND_URL}/container2/get-cid/:${jobId}`;

    axios
      .get(apiURL, tokenHeaders)
      .then((response) => {
        const { cid } = response.data;
        setCid(cid);
        
        setShowButton(false);
        try {
          const updateJobUrl = `${process.env.REACT_APP_BACKEND_URL}/container2/update-cid`;
          const jobData = {
            walletAddress: address,
            jobId: jobId,
            cid: cid,
          };

          // Post request to save the data in the database

          axios
            .post(updateJobUrl, jobData, tokenHeaders)
            .then((saveResponse) => {
              console.log("Job details updated:", saveResponse.data);
            })
            .catch((saveError) => {
              console.error("Error updating job:", saveError);
            });
        } catch (error) {
          console.log("While Updating job", error);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div>
      <div className="pt-4 visualization-compute-container">
        <div>
          <img src={hero} className="visualization-compute-img" />
        </div>
        <div className="py-3 visualization-compute-details">
          <div className="py-3 d-flex visualization-compute-head">
            Compute Your Model
          </div>
          <div className="visualization-compute-data">
            <div className="py-2">
              <div className="d-flex visualization-compute-dataset-text">
                Enter Dataset URL
              </div>
              <div className="d-flex align-items-center">
                <div className="py-2">
                  <input
                    type="text"
                    className="visualization-compute-dataset-input"
                    placeholder="Enter Dataset URL"
                    onChange={handleDatasetUrlChange}
                  />
                </div>
                <div className="d-flex">
                  <img
                    className="visualization-compute-dataset-img"
                    src={add}
                    onClick={() => handleAddUrl()}
                  />
                </div>
              </div>
              <div>
                {datasetUrls.map((url, index) => (
                  <div
                    key={index}
                    className="d-flex align-items-center mb-2 bg-white visualization-display-url-container"
                  >
                    <div className="flex-grow-1 visualization-display-urls">
                      {url}
                    </div>
                    <button
                      className="btn btn-danger visualization-display-urls-btn"
                      onClick={() => handleRemoveUrl(index)}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="py-2">
              <div className="d-flex visualization-compute-model-text">
                Enter Model URL
              </div>
              <div className="d-xl-flex align-items-center">
                <div className="py-2">
                  <input
                    type="text"
                    value={notebookUrl}
                    onChange={(e) => setNotebookUrl(e.target.value)}
                    className="visualization-compute-model-input"
                    placeholder="Enter Model URL"
                  />
                </div>
                <div>
                  <button
                    className="rounded-pill visualization-compute-model-btn"
                    onClick={() => handleExecute()}
                    disabled={notebookUrl == "" && datasetUrls == ""}
                  >
                    {btnloading ? (
                      <PulseLoader color="#fff" size={12} />
                    ) : (
                      <> Compute</>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="py-2">
              <div className="visualization-compute-job-id">
                Job id: {jobId}
              </div>
            </div>

            {/* <div className="d-flex py-2 align-items-center">
              <div className="visualization-compute-cid">cid:</div>
              <div className="px-3">
                {showButton ? (
                  <button
                    className="rounded-pill visualization-compute-cid-btn"
                    onClick={() => handleGetCID(jobId)}
                  >
                    {cidloading ? (
                      <PulseLoader color="#fff" size={8} />
                    ) : (
                      <>Get CID</>
                    )}
                  </button>
                ) : (
                  cid
                )}
              </div>
            </div>
            <div className="cid-info">
              *CID will be generated after your job is computed. You can track
              your job status from the below table.
            </div> */}
          </div>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
}

export default VisualizationCompute;
