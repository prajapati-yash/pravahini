const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const { spawnSync } = require("child_process");
const { ethers } = require("ethers");
const app = express();
const port = process.env.PORT;
// Importing JWT
const expressJwt = require("express-jwt");
const jwt = require("jsonwebtoken");

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const MSG_TO_SIGN = process.env.MSG_TO_SIGN;
const hashRoutes = require('./routes/hashRoutes');

app.use(cors());
app.use(express.json());
const connectString = process.env.MONGO_CONNECT_STRING;
mongoose
  .connect(connectString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database Connected!");
  })
  .catch((e) => {
    console.log(e);
  });

  app.use(
    expressJwt({
      secret: JWT_SECRET_KEY,
      algorithms: ["HS256"],
    }).unless(function(req) {
      const path = req.originalUrl || req.url;
      return [
        "/",
        "/de-computation",
        "/rating/rate-ai-agent",
        "/user/register",
        "/dataset/comments",
        "/model/comments",
        "/ai-agent/comments",
        '/ai-agent/comment/reply',
        'ai-agent/comment/delete',
        "/hashes/hashesValue",
        "/model/comment/delete",
        "/dataset/comment/delete"
      ].includes(path) || path.startsWith("/add-data/ai-agents");
    })
  );
  
app.post("/de-computation", async (req, res) => {
  try {
    const { address, sign } = req.body;
    // console.log("Signature ", sign);
    const recoveredAddress = await ethers.utils.verifyMessage(
      MSG_TO_SIGN,
      sign
    );
    if (recoveredAddress == address) {
      const payload = {
        address,
      };
      const jwtToken = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: "1d" });
      res.json({ jwtToken });
      // window.dispatchEvent(new Event("addressChanged"));

    } else {
      // Invalid signature
      res.status(401).json({ message: "Invalid signature" });
    }
  } catch (error) {
    console.log(error);
  }
});

// Error handling middleware for invalid tokens
app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({ message: "Invalid token" });
  } else {
    next(err); // For other errors, pass them along
  }
});

const container1Router = require("./routes/container1Routes");
const container2Router = require("./routes/container2Routes");
const containerRoutes =require("./routes/containerRoutes");
const endpoint = require("./routes/datasetComment");
const userDetail = require("./routes/userDetail");
const UserRating = require("./routes/rating");
// const AIAgent = require("./routes/AIAgentDetail");

app.use("/container1", container1Router);
app.use("/container2", container2Router);

app.use('/efficientComputing',containerRoutes);
app.use('/advanceJobs',containerRoutes);

app.use("/dataset", endpoint);
app.use("/model", endpoint);
app.use("/ai-agent", endpoint);
app.use("/user", userDetail);

app.use("/hashes", hashRoutes);

app.use("/rating", UserRating);
// app.use("/add-data",AIAgent)

app.get("/", (req, res) => {
  res.send("Welcome to our Pravahini DAPP!");
});

app
  .listen(5500, () => {
    console.log(`Server is running on 5500`);
  })
  .on("error", (error) => {
    console.error("Error starting the server:", error);
  });
