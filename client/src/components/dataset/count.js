import "../../styles/dataset/SingleDataset.css";
import axios from "axios";
import lighthouse from "@lighthouse-web3/sdk";
import { useNavigate, useLocation } from "react-router-dom";

import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";

function Count() {

    const [tableHeaders, setTableHeaders] = useState([]);
    const [tableRows, setTableRows] = useState([]);
    const location = useLocation();
    const dataset = location.state ? location.state.data : "";

    useEffect(() => {
        fetch();
      }, []);
    
    const fetch= async () => {
    try {
      const response = await axios.get(
        `https://gateway.lighthouse.storage/ipfs/${dataset.uploadDataset}`
      );
      const csvData = response.data;
      console.log(response);

            console.log(csvData)

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
      
      setTableHeaders(headers);
      setTableRows(parsedData);
    
      console.log("Number of rows:", parsedData.length);
      console.log("Column names:", headers);
      return { rowCount: parsedData.length, columnNames: headers };
    } catch (error) {
      console.error("Error fetching CSV file:", error);
      return { rowCount: 0, columnNames: [] }; 
    }
  };

  return (
    <div className="text-white">
        <p>This dataset has <span className="fs-5 fw-bold text-decoration-underline">{tableRows.length} Number</span> of rows.</p>
      </div>
  )

};

export default Count;
