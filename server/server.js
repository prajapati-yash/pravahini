const express = require('express');
require('dotenv').config();
const mongoose = require("mongoose");
const cors = require('cors');
const { spawnSync } = require('child_process');


const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
const connectString = process.env.MONGO_CONNECT_STRING;
mongoose.connect(connectString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(()=>{
  console.log("Database Connected!")
}).catch((e)=>{
  console.log(e);
})

const container1Router = require("../server/routes/container1Routes")
const container2Router = require("../server/routes/container2Routes")


app.use('/container1', container1Router);
app.use('/container2', container2Router);

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
  }).on('error', (error) => {
    console.error('Error starting the server:', error);
  });
  
