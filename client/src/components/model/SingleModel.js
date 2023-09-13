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
import { useAccount } from 'wagmi';

function SingleModel() {
  const { address } = useAccount();
  const location = useLocation();
  console.log(location.state.data);
  const model = location.state ? location.state.data : "";

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

  return (
    <div className="d-flex flex-md-row flex-column">
      <div className="py-3 col-md-7 col-lg-8">
        <div className="py-4 mx-3 my-2 single-model-heading-container">
          <div className="px-5 py-1 d-flex single-model-head">{model[0]}</div>
          <div className="px-5 py-1 d-flex single-model-subhead">
            {model[1]}
          </div>
        </div>
        <div className=""></div>
      </div>
      <div className="col-md-5 col-lg-4">
        <div className="py-5 single-model-details">
          <div className="py-sm-5 py-4">
            <button
              type="submit"
              className="py-2 px-5 btn single-model-download"
              onClick={handleDownload}
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
              <div className="single-model-details-head">Final Cost</div>
              <div className="single-model-details-value">{parseInt(model[3]._hex, 16)}</div>
            </div>
            <div className="py-4">
              <button
                type="submit"
                className="btn rounded-pill my-2 py-sm-3 px-sm-5 model-buy-btn"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SingleModel;
