import React,{useState, useEffect} from "react";
import axios from "axios";
import { useAccount } from "wagmi";
import Cookies from "js-cookie";

function EfficientComputationDetails() {
  const { address } = useAccount();
  const [jobStatus, setJobStatus] = useState("");
  const [userJobs, setUserJobs] = useState([]);
  const [cid, setCid] = useState("");
  const [showButton, setShowButton] = useState(true);
  const [btnloadingArray, setBtnLoadingArray] = useState(Array(userJobs.length).fill(false));
  const [cidbtnloadingArray, setCidBtnLoadingArray] = useState(Array(userJobs.length).fill(false));
  const token = Cookies.get('jwtToken');
  const tokenHeaders = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const handleCheckJobStatus = (jobId, index) => {
    console.log("Checking Job Status...");
    const newBtnLoadingArray = [...btnloadingArray];
    newBtnLoadingArray[index] = true;
    setBtnLoadingArray(newBtnLoadingArray);
    const apiURL = `${process.env.REACT_APP_BACKEND_URL}/container1/get-job-status/${jobId}`;

    axios
      .get(apiURL, tokenHeaders)
      .then((response) => {
        const { state } = response.data;

        setJobStatus(state);

        // Update the job status in the database
        const updateJobStatusUrl = `${process.env.REACT_APP_BACKEND_URL}/container1/update-job-status`;
        const jobData = {
          walletAddress: address,
          jobId: jobId,
          jobStatus: state,
        };

        axios
          .post(updateJobStatusUrl, jobData, tokenHeaders)
          .then((updateResponse) => {
            console.log(
              "Job status updated in the database:"
            );
          })
          .catch((updateError) => {
            console.error(
              "Error updating job status in the database:",
              updateError
            );
          });
          newBtnLoadingArray[index] = false;
      })
      .catch((error) => {
        console.error("Error:", error);
        newBtnLoadingArray[index] = false;
      });
  };

  const handleGetCID = (jobId, index) =>{
    console.log("Started Cid Getting")
    // const index = dataList.findIndex((data) => data.jobId === jobId );
    // if(index !== -1){
      const newCidBtnLoadingArray = [...btnloadingArray];
      newCidBtnLoadingArray[index] = true;
      setCidBtnLoadingArray(newCidBtnLoadingArray);
      console.log("Getting CID of this Job Id!")
    const apiURL = `${process.env.REACT_APP_BACKEND_URL}/container1/get-cid/:${jobId}`;

    axios
    .get(apiURL, tokenHeaders)
    .then((response) =>{
      const { cid } = response.data;
      setCid(cid);
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
        newCidBtnLoadingArray[index] = false;
  
    })
    .catch((error)=>{
      console.error("Error:",error);
      newCidBtnLoadingArray[index] = false;
    })
  // }
  }

  const handleDeleteJob = (jobId) => {
    axios
      .delete(`${process.env.REACT_APP_BACKEND_URL}/container1/delete-job/${jobId}`, tokenHeaders)
      .then((response) => {
        console.log("Deletion Started");
        // Remove the deleted job from the userJobs array
        const updatedUserJobs = userJobs.filter((job) => job.jobId !== jobId);
        setUserJobs(updatedUserJobs);
        console.log("Deleted!");
      })
      .catch((error) => {
        console.error("Error deleting job:", error);
      });
  };


  const fetchUserJobs = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/container1/user-jobs?walletAddress=${address}`, tokenHeaders
      );
      const userJobs = response.data;
      setUserJobs(userJobs);
    } catch (error) {
      console.error("Error fetching user jobs:", error);
    }
  };

  useEffect(() => {
    fetchUserJobs();
  }, []);

  const pollForUpdates = async () => {
    while (true) {
      await fetchUserJobs();
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  };

  useEffect(() => {
    pollForUpdates();
  }, []);

  return (
    <div className="container-fluid">
      <div className="table-responsive">
        <table className="table table-striped">
          <thead className="dataset-table-head">
            <tr>
              <th>Sr. No.</th>
              <th>JobId</th>
              <th>CID</th>
              <th>Started At</th>
              <th>Status</th>
              <th>Check status</th>
              <th>Delete</th>
            </tr>
          </thead>
        
          <tbody>
            {userJobs.map((job, index) => (
              <tr className="dataset-table-body" key={index}>
                <td>{index + 1}</td>
                <td>{job.jobId}</td>
                <td>
                  {job.cid ? (
                    <a href={`https://ipfs.io/ipfs/${job.cid}`} target="_blank" rel="noopener noreferrer">
                    {job.cid}
                  </a>
                  ) : (
                    <button onClick={() => handleGetCID(job.jobId)} className="bg-info border-0 rounded-3 text-white">
                      {cidbtnloadingArray[index] ? (
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
                        <> Get CID</>
                      )}
                    </button> 
                  )}
                </td>
                <td>{new Date(job.timeStamp).toLocaleString()}</td>
                <td > <button className={job.jobStatus === "InProgress" ? "bg-warning text-white border-0 rounded-3" : job.jobStatus === "Completed" ? "bg-success text-white border-0 rounded-3" : "white"}> {job.jobStatus}</button></td>
                <td>
                  {" "}
                  <button onClick={() => handleCheckJobStatus(job.jobId, index) } className="bg-primary text-white border-0 rounded-3">
                  {btnloadingArray[index] ? (
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
                  <> Check Job Status</>
                )}
                  </button>
                </td>
                <td>
                  <button onClick={() => handleDeleteJob(job.jobId)} className="bg-danger text-white my-auto border-0 rounded-3">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EfficientComputationDetails;
