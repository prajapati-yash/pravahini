const express = require('express');
require('dotenv').config();
const router = express.Router();
const { spawnSync } = require('child_process');
const container1Model = require("../models/efficientComputing");
const container2Model = require("../models/advanceJobs");
const dockerImage = process.env.CONTAINER_1_DOCKER_IMAGE;
const dockerImage2 = process.env.CONTAINER_2_DOCKER_IMAGE;
const timeout = process.env.TIMEOUT;
const waitTimeout = process.env.WAIT_TIMEOUT_SECS;


// Created Dynamic Routes
router.post("/save-job", async (req, res) => {
    const { walletAddress, jobId, cid, timeStamp, jobStatus } = req.body;
    try {
    let newJob;
if (req.originalUrl == '/efficientComputing/save-job'){
    newJob = new container1Model({
      walletAddress,
      jobId,
      cid,
      timeStamp,
      jobStatus
    });
}else{
    newJob = new container2Model({
        walletAddress,
        jobId,
        cid,
        timeStamp,
        jobStatus,
      });
}
  
      await newJob.save();
      res.status(200).json({ message: "Job saved successfully." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred while saving the job." });
    }
  });


  // List of all the jobs by the user
  router.get('/user-jobs', async (req, res) => {
    try {
      const walletAddress = req.query.walletAddress; 
      let userJobs;
      if (req.originalUrl == '/efficientComputing/user-jobs'){
        userJobs = await container1Model.find({ walletAddress });
      }else{
        const userJobs = await container2Model.find({ walletAddress });
      }
      res.status(200).json(userJobs);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while fetching user jobs.' });
    }
  }); 

  router.post('/update-cid', async(req, res) =>{
    const {walletAddress,jobId, cid, } = req.body;
    try{
        let updatedJob;
    if (req.originalUrl == '/efficientComputing/update-cid'){
      updatedJob = await container1Model.findOneAndUpdate(
        {walletAddress, jobId},
        {cid},
        {new:true}
      );
    }else{
     updatedJob = await container2Model.findOneAndUpdate(
            { walletAddress, jobId },
            { cid },
            { new: true }
          );
      }
  
      if(updatedJob){
        res.status(200).json({message:"Job details updated successfully!"})
      }else{
        res.status(404).json({message:"Job not found or not updated."})
      }
    }catch(error){
      console.log(error);
      res.status(500).json({error:"An error occured while updating the job."})
    }
  })

  router.post('/update-job-status', async (req, res) => {
    const { walletAddress,jobId, jobStatus } = req.body;
    try {
        let updatedJob
        if (req.originalUrl == '/efficientComputing/update-job-status'){
       updatedJob = await container1Model.findOneAndUpdate(
        { walletAddress, jobId },
        { jobStatus },
        // { new: true }
      );
    }else{
        updatedJob = await container2Model.findOneAndUpdate(
            { walletAddress, jobId },
            { jobStatus },
            { new: true }
          );
    }
  
      if (updatedJob) {
        res.status(200).json({ message: "Job status updated successfully!" });
      } else {
        res.status(404).json({ message: "Job not found or not updated." });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "An error occurred while updating the job status." });
    }
  });


// Delete the job from the Database 
router.delete('/delete-job/:id', async(req, res) =>{
    const {id} = req.params;
  
    try{
    let deletedJob;
    if (req.originalUrl == '/efficientComputing/delete-job/:id'){
   deletedJob = await container1Model.findOneAndDelete({ _id: id});
}  else{
    deletedJob = await container2Model.findOneAndDelete({ id });
   }
      if(deletedJob){
        res.status(200).json({message:"Job deleted successfully!"})
      }else{
        res.status(404).json({message:"Job not found or deleted!"})
      }
  
    }catch(error){
      console.log(error);
      res.status(500).json({message:"An error occured while deleting the Job."})
  
    }
  })


// Check the job status
  router.get('/get-job-status/:jobId', (req, res) => {
    const jobId = req.params;
    const output = jobId.jobId.replace(/:/g, '');
    const jobListCommand = `bacalhau list --id-filter=${output} --output json`;
    const jobListExecution = spawnSync('bash', ['-c', jobListCommand]);
  
    if (jobListExecution.status === 0) {
        const jobListOutput = jobListExecution.stdout.toString().trim();
  
        try {
            const jobList = JSON.parse(jobListOutput);
            if (Array.isArray(jobList) && jobList.length > 0) {
                let state = jobList[0].State.State;
                // console.log("State", state)
                if(state === "New"){
                  state = "In Progress";
                  res.json({ state });
                }else{
                res.json({ state });
                }
            } else {
                res.status(404).json({ error: 'Job not found' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Failed to parse jobList JSON' });
        }
    } else {
        res.status(500).json({ error: 'Failed to get job information' });
    }
  }); 
  
  // Get the CID of the Job
  router.get('/get-cid/:jobId', (req,res) => {
    const jobId = req.params;
    const output = jobId.jobId.replace(/:/g, '');
    const jobInfoCommand = `bacalhau describe ${output}`;
    const jobInfoExecution = spawnSync('bash', ['-c', jobInfoCommand]);
  
    if (jobInfoExecution.status === 0) {
      const jobInfo = jobInfoExecution.stdout.toString().trim();
      const cidRegex = /PublishedResults:[\s\S]*?CID:\s*(\S+)/;
      const match = jobInfo.match(cidRegex);
      if (match && match.length > 1) {
        const cid = match[1];
        jobIdToDownload = jobId;
        res.json({cid, jobInfo});
      } else {
        res.status(500).json({ error: 'CID not found in jobInfo' });
      }
    } else {
      res.status(500).json({ error: 'Failed to get job information' });
    }
  })

// Execution of the Containers
  router.post('/execute', (req, res) => {
    try{
    const { notebookUrl, inputs } = req.body;
    const notebookFileName = getFileNameFromUrl(notebookUrl);
    const outputFileName = generateOutputFileName(notebookUrl);  
    const inputArgs = inputs.map(input => `-i src=${input.url},dst=/inputs/data/`).join(' ');
    let jobCommand;
    
    if (req.originalUrl == '/efficientComputing/execute'){
      jobCommand = `bacalhau docker run --wait=false --id-only --timeout ${timeout} --wait-timeout-secs ${waitTimeout} -w /inputs -i src=${notebookUrl},dst=/inputs/notebook/ ${inputArgs} ${dockerImage} -- jupyter nbconvert --execute --to notebook --output /outputs/${outputFileName} /inputs/notebook/${notebookFileName}`;
    }else{
      jobCommand = `bacalhau docker run --wait=false --id-only --timeout ${timeout} --wait-timeout-secs ${waitTimeout} -w /inputs -i src=${notebookUrl},dst=/inputs/notebook/ ${inputArgs} ${dockerImage2} -- jupyter nbconvert --execute --to notebook --output /outputs/${outputFileName} /inputs/notebook/${notebookFileName}`;
    }
    const jobExecution = spawnSync('bash', ['-c', jobCommand]);
    const jobId = jobExecution.stdout.toString().trim();    
    res.status(200).json({jobId})
    }catch(error){
      res.status(400).json({error: error.message})
      console.log(error)
    }
  });
  
  function getFileNameFromUrl(url) {
    const parts = url.split('/');
    return parts[parts.length - 1];
  }
  
  function generateOutputFileName(notebookUrl) {
    const urlParts = notebookUrl.split('/');
    const notebookName = urlParts[urlParts.length - 1];
    const fileNameParts = notebookName.split('.');
    fileNameParts.pop();
    return `${fileNameParts.join('.')}_output.ipynb`;
  }


module.exports = router;