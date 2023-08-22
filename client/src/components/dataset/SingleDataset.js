import React, { useState, useEffect } from "react";
import "../../styles/dataset/SingleDataset.css";
import axios from "axios";
import csvfile from "../../dummyData/data.csv";
import xlsxFile from "../../dummyData/excelData.xlsx";
import jsonFile from "../../dummyData/jsonData.json";
import * as XLSX from "xlsx";

function SingleDataset() {
  // const [csvData, setCSVData] = useState([]);
  const [tableHeaders, setTableHeaders] = useState([]);
  const [tableRows, setTableRows] = useState([]);

  useEffect(() => {
    // fetchCSVData();
    // fetchXLSXData();
    fetchJSONData();
  }, []);

  const fetchCSVData = async () => {
    try {
      const response = await axios.get(csvfile);
      const csvData = response.data;

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

      console.log(parsedData);
      setTableHeaders(headers);
      setTableRows(parsedData);
    } catch (error) {
      console.error("Error fetching CSV file:", error);
    }
  };

  const fetchXLSXData = async () => {
    try {
      const response = await axios.get(xlsxFile, {
        responseType: "arraybuffer",
      });
      const buffer = response.data;
      const workbook = XLSX.read(buffer, { type: "array" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      console.log(jsonData);
      if (jsonData.length > 0) {
        const headers = jsonData[0];
        setTableHeaders(headers);
        setTableRows(jsonData.slice(1));
      }
    } catch (error) {
      console.error("Error fetching XLSX file:", error);
    }
  };

  const fetchJSONData = async () => {
    try {
      // const response = await axios.get(jsonFile);
      const jsonData = jsonFile;
      console.log("json data: ", jsonData);

      if (jsonData.length > 0) {
        const headers = Object.keys(jsonData[0]);
        setTableHeaders(headers);
        setTableRows(jsonData);
      }
    } catch (error) {
      console.error("Error fetching JSON file:", error);
    }
  };

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
        <div className="py-3">
          <div className="single-dataset-head">Title</div>
          <div className="single-dataset-subhead">Description</div>
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
                    {tableRows.map((row, rowIndex) => (
                      <tr key={rowIndex} className="dataset-table-body">
                        {tableHeaders.map((header, colIndex) => (
                          <td key={colIndex}>{row[header]}</td>
                        ))}
                      </tr>
                    ))}

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
        </div>
      </div>
      <div className="col-md-5 col-lg-4">
        <div className="py-5 single-dataset-details">
          <div className="py-sm-5 py-4">
            <button
              type="submit"
              className="py-2 px-5 btn single-dataset-download"
              onClick={handleDownload}
            >
              Download
            </button>
          </div>
          <div className="pt-sm-4 pt-2 px-md-5 single-dataset-content">
            <div className="py-3">
              <div className="single-dataset-details-head">Category</div>
              <div className="single-dataset-details-value">Value</div>
            </div>
            <div className="py-3">
              <div className="single-dataset-details-head">Attributes</div>
              <div className="single-dataset-details-value">Value</div>
            </div>
            <div className="py-3">
              <div className="single-dataset-details-head">Price Per Data</div>
              <div className="single-dataset-details-value">Value</div>
            </div>
            <div className="py-3">
              <div className="single-dataset-details-head">
                No.of Data Records
              </div>
              <div className="single-dataset-details-value">Value</div>
            </div>
            <div className="py-2">
              <div className="single-dataset-details-head">Final Cost</div>
              <div className="single-dataset-details-value">Value</div>
            </div>
            <div className="py-4">
              <button
                type="submit"
                className="btn rounded-pill my-2 py-sm-3 px-sm-5 dataset-buy-btn"
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

export default SingleDataset;
