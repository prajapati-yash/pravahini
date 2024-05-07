const express = require("express");
require("dotenv").config();
const router = express.Router();
const { spawnSync } = require("child_process");
const container2Model = require("../models/advanceJobs");
const dockerImage = process.env.CONTAINER_2_DOCKER_IMAGE;
const timeout = process.env.TIMEOUT;
const nodemailer = require("nodemailer");
const waitTimeout = process.env.WAIT_TIMEOUT_SECS;

let mailTransporter =
nodemailer.createTransport(
    {
        service: 'gmail',
        auth: {
            user: 'oggyyy420@gmail.com',
            pass: process.env.GMAIL_KEY
        }
    }
);
router.post("/save-job", async (req, res) => {
  const { walletAddress, jobId, cid, timeStamp, jobStatus } = req.body;

  try {
    const newJob = new container2Model({
      walletAddress,
      jobId,
      cid,
      timeStamp,
      jobStatus,
    });

    await newJob.save();
    res.status(200).json({ message: "Job saved successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while saving the job." });
  }
});

router.get("/user-jobs", async (req, res) => {
  try {
    const walletAddress = req.query.walletAddress;
    const userJobs = await container2Model.find({ walletAddress });
    res.status(200).json(userJobs);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching user jobs." });
  }
});

router.post("/update-cid", async (req, res) => {
  const { walletAddress, jobId, cid } = req.body;
  try {
    const updatedJob = await container2Model.findOneAndUpdate(
      { walletAddress, jobId },
      { cid },
      { new: true }
    );

    if (updatedJob) {
      res.status(200).json({ message: "Job details updated successfully!" });
    } else {
      res.status(404).json({ message: "Job not found or not updated." });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occured while updating the job." });
  }
});

router.post("/update-job-status", async (req, res) => {
  const { walletAddress, jobId, jobStatus } = req.body;
  try {
    const updatedJob = await container2Model.findOneAndUpdate(
      { walletAddress, jobId },
      { jobStatus },
      { new: true }
    );

    if (updatedJob) {
      res.status(200).json({ message: "Job status updated successfully!" });
    } else {
      res.status(404).json({ message: "Job not found or not updated." });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the job status." });
  }
});

router.delete("/delete-job/:jobId", async (req, res) => {
  const { jobId } = req.params;

  try {
    const deletedJob = await container2Model.findOneAndDelete({ jobId });
    if (deletedJob) {
      res.status(200).json({ message: "Job deleted successfully!" });
    } else {
      res.status(404).json({ message: "Job not found or deleted!" });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "An error occured while deleting the Job." });
  }
});

  router.get("/get-job-status/:jobId", (req, res) => {
    const jobId = req.params;
    const emailId = req.query.emailId;
    const output = jobId.jobId.replace(/:/g, "");
    const jobListCommand = `bacalhau list --id-filter=${output} --output json`;
    const jobListExecution = spawnSync("bash", ["-c", jobListCommand]);

    if (jobListExecution.status === 0) {
      const jobListOutput = jobListExecution.stdout.toString().trim();

      try {
        const jobList = JSON.parse(jobListOutput);
        if (Array.isArray(jobList) && jobList.length > 0) {
          let state = jobList[0].State.State;
          // console.log("State", state);
          if (state === "New") {
            state = "In Progress";

            res.json({ state });
           } else if(state==="Completed"){
                  
              let mailDetails = {
                from: 'oggyyy420@gmail.com',
                to: `${emailId}`,
                subject: 'Mission Accomplished: Your Decentralized Job is Complete',
                text: `Congratulations! 🎉

                We're thrilled to inform you that your decentralized computation job with Job ID ${jobId.jobId} has been successfully completed. 🥳
                
                The results are now available for you to access on our platform, Pravahini.
                
                If you have any further questions or require assistance, our support team is always ready to help. 💪
                
                Thank you for choosing our platform for your decentralized computation needs. We look forward to serving you again in the future. 🙌
                
Best regards,
Team Pravahini (प्रवाहिनी) 🤖
                `
              };

              mailTransporter
                .sendMail(mailDetails,
                  function (err, data) {
                    if (err) {
                      console.log('Error Occurs');
                    } else {
                      console.log('Email sent successfully');
                    }
                  });
              
            res.json({ state });
            
          } else {
            res.json({ state });
          }
        } else {
          res.status(404).json({ error: "Job not found" });
        }
      } catch (error) {
        res.status(500).json({ error: "Failed to parse jobList JSON" });
      }
    } else {
      res.status(500).json({ error: "Failed to get job information" });
    }
  });

  router.get("/get-cid/:jobId", (req, res) => {
    const jobId = req.params;
    const output = jobId.jobId.replace(/:/g, "");
    const jobInfoCommand = `bacalhau describe ${output}`;
    const jobInfoExecution = spawnSync("bash", ["-c", jobInfoCommand]);

    if (jobInfoExecution.status === 0) {
      const jobInfo = jobInfoExecution.stdout.toString().trim();
      const cidRegex = /PublishedResults:[\s\S]*?CID:\s*(\S+)/;
      //     const cidRegex = /CID:\s*(\S+)/;
      const match = jobInfo.match(cidRegex);
      if (match && match.length > 1) {
        const cid = match[1];
        jobIdToDownload = jobId;
        res.json({ cid, jobInfo });
      } else {
        res.status(500).json({ error: "CID not found in jobInfo" });
      }
    } else {
      res.status(500).json({ error: "Failed to get job information" });
    }
  });

  router.post("/execute", (req, res) => {
    const { notebookUrl, inputs,Email } = req.body;
    const notebookFileName = getFileNameFromUrl(notebookUrl);
    const outputFileName = generateOutputFileName(notebookUrl);

    const inputArgs = inputs
      .map((input) => `-i src=${input.url},dst=/inputs/data/`)
      .join(" ");
    const jobCommand = `bacalhau docker run --wait=false --id-only --timeout ${timeout} --wait-timeout-secs ${waitTimeout} -w /inputs -i src=${notebookUrl},dst=/inputs/notebook/ ${inputArgs} ${dockerImage} -- jupyter nbconvert --execute --to notebook --output /outputs/${outputFileName} /inputs/notebook/${notebookFileName}`;
    const jobExecution = spawnSync("bash", ["-c", jobCommand]);
    const jobId = jobExecution.stdout.toString().trim();

let mailDetails = {
      from: 'oggyyy420@gmail.com',
      to: Email,
      subject: 'Buckle Up! Your Decentralized Computation is Underway ',
      text: `Greetings from Pravahini (प्रवाहिनी) 🎉
    
  We hope this email finds you well. We're excited to share that your decentralized computation job has been successfully initiated on our platform. Your Job ID is ${jobId}.
      
  We ensures that your datasets and scripts are processed securely and efficiently. 💻
      
  Thank you for choosing our platform for your decentralized computation needs. If you have any questions or concerns, please don't hesitate to reach out to our support team. 🙌

  Happy computing! 🚀
Best regards,
Team Pravahini (प्रवाहिनी) `
    };    
        
    
        if(jobId){
          console.log(jobId)
          mailTransporter
          .sendMail(mailDetails,
              function (err, data) {
                  if (err) {
                      console.log('Error Occurs');
                  } else {
                      console.log('Email sent successfully');
                  }
              });
        }
      
    res.json({ jobId });
  });

  function getFileNameFromUrl(url) {
    const parts = url.split("/");
    return parts[parts.length - 1];
  }

  function generateOutputFileName(notebookUrl) {
    const urlParts = notebookUrl.split("/");
    const notebookName = urlParts[urlParts.length - 1];
    const fileNameParts = notebookName.split(".");
    fileNameParts.pop();
    return `${fileNameParts.join(".")}_output.ipynb`;
  }

module.exports = router;
