import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/chartpage.css";
import { useLocation } from "react-router-dom";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  Brush,
  ResponsiveContainer,
} from "recharts";

const Chartss = () => {
  const [tableHeaders, setTableHeaders] = useState([]);
  const [tableRows, setTableRows] = useState([]);
  const location = useLocation();
  const dataset = location.state ? location.state.data : null;
  const [xAxisColumn, setXAxisColumn] = useState("");
  const [yAxisColumn, setYAxisColumn] = useState("");
  const [chartType, setChartType] = useState("bar");
  const [stackedColumns, setStackedColumns] = useState([]);
  const [LineColumns, setLineColumns] = useState([]);

  const [averages, setAverages] = useState([]);
  const [countData, setCountData] = useState([]);


  

  // const [lineColumns, setLineColumns] = useState([]);


  useEffect(() => {
    if (dataset) {
      fetchCSVData();
    }
  }, [dataset]);

  useEffect(() => {
    if (xAxisColumn && stackedColumns.length > 0) {
      calculateAverages();
    }
  }, [xAxisColumn, stackedColumns]);
  
  const calculateAverages = () => {
    const uniqueXValues = Array.from(new Set(tableRows.map((row) => row[xAxisColumn]).filter((value) => value !== undefined && value !== "")));
  
    const calculatedAverages = uniqueXValues.map((xValue) => {
      const filteredRows = tableRows.filter((row) => row[xAxisColumn] === xValue);
  
      const averageValues = {};
      stackedColumns.forEach((column) => {
        const values = filteredRows.map((row) => parseFloat(row[column])).filter((value) => !isNaN(value));
        const sum = values.reduce((total, value) => total + value, 0);
        const avg = values.length > 0 ? sum / values.length : 0;
        averageValues[column] = avg;
      });
  
      // return { [xAxisColumn]: xValue, ...averageValues };
      return { [xAxisColumn]: xValue, ...averageValues, count: filteredRows.length };

    });
  
    setAverages(calculatedAverages);
    setCountData(calculatedAverages.map((entry) => ({ [xAxisColumn]: entry[xAxisColumn], count: entry.count })));

  };
  
  

  const fetchCSVData = async () => {
    try {
      const response = await axios.get(
        `https://gateway.lighthouse.storage/ipfs/${dataset.uploadDemoDataset}`
      );
      const csvData = response.data;
      const rows = csvData.split("\n");
      const headers = rows[0].split(",").map((header) => header.trim());
      const parsedData = rows.slice(1).map((row) => {
        const values = row.split(",").map((value) => value.trim());
        const rowData = {};
        headers.forEach((header, index) => {
          rowData[header] = values[index];
        });
        return rowData;
      });
      setTableHeaders(headers);
      setTableRows(parsedData);

      setXAxisColumn(headers[0]);
      // setStackedColumns([headers[0]]);
      setLineColumns([headers[0]]);
    } catch (error) {
      console.error("Error fetching CSV file:", error);
    }
  };
  const handleCheckboxChange = (column) => {
    // Toggle the checked state of the clicked checkbox
    if (stackedColumns.includes(column)) {
      setStackedColumns(stackedColumns.filter((col) => col !== column));
    } else {
      setStackedColumns([...stackedColumns, column]);
    }
  };
  const handleCheckboxChange2 = (column) => {
    // Toggle the checked state of the clicked checkbox
    if (LineColumns.includes(column)) {
      setLineColumns(LineColumns.filter((col) => col !== column));
    } else {
      setLineColumns([...LineColumns, column]);
    }
  };

  const isNumericColumn = (columnName) => {
   
    const columnValues = tableRows.map((row) => row[columnName]);
    // console.log("cv",columnValues)
    for (let value of columnValues[0][0]) {
  
      if (!isNaN(value)) {
        // Convert value to a number and check if it's a finite number
        const numericValue = Number(value);
        if (isFinite(numericValue)) {
          // Value is numeric, continue checking other values
          continue;
        }
      }
  
      // If any value is not a valid number, the column contains string values
      return false;
    }
  
    // If all values are valid numbers, the column contains only numeric values
    return true;
  };




  const renderChartInputs = () => {
    if (chartType === "bar") {
      return (
        <div className="barchart-content">
          <p className="barchartpara">Bar charts are used to compare discrete categories of data. They display data as rectangular bars of varying lengths, with each bar representing a category.
          <br /> <br /> Here, You can select column to show on X-axes and columns to show average values. It is recommended to use brush below the graph to check the data range properly.</p>
          
          <p className="question">Select columns for Stacked Graph:</p>
          
          <div className="options">
          {tableHeaders.map((column, index) => (
            isNumericColumn(column) && (
            <label key={column} className={`checkbox ${stackedColumns.includes(column) ? 'active' : ''}`}>
              <input
                type="checkbox"
                className="boxes"
                checked={index === 0 || stackedColumns.includes(column)}
                // onChange={(e) =>
                //   e.target.checked
                //     ? setStackedColumns([...stackedColumns, column])
                //     : setStackedColumns(
                //       stackedColumns.filter((col) => col !== column)
                //     )
                // }
                onChange={() => handleCheckboxChange(column)}
              />
              {column}
            </label>
            )
          ))}
          
          </div>
            <p className="question">Select column for X:</p>
            <div className="select-container">
            <select
            value={xAxisColumn}
            onChange={(e) => setXAxisColumn(e.target.value)}
            >
            {tableHeaders.map((column) => (
              <option key={column} value={column}>
                {column}
              </option>
            ))}
          </select>
        </div>
        </div>
      );
    } 
    else if (chartType === "line") {
      return (
        <div className="linechart-content">
          <p className="barchartpara">A line chart is a fundamental visualization tool used to display data trends across categories. It consists of a series of data points connected by lines, making it easy to observe changes, patterns, or relationships within the dataset. 
          <br /> Here, Each line represent data of column. </p>
          <p className="question">Select columns for Line Graph:</p>
          <div className="options">
          {tableHeaders.map((column) => (
            <label key={column} className={`checkbox ${LineColumns.includes(column) ? 'active' : ''}`}>
              <input
                type="checkbox"
                className="boxes"
                checked={LineColumns.includes(column)}
                // onChange={(e) =>
                //   e.target.checked
                //     ? setLineColumns([...lineColumns, column])
                //     : setLineColumns(
                //       lineColumns.filter((col) => col !== column)
                //     )
                // }
                onChange={() => handleCheckboxChange2(column)}
              />
              {column}
            </label>
          ))}
          </div>
          <p className="question">Select column for X:</p>
          <div className="select-container">
          <select
            value={xAxisColumn}
            onChange={(e) => setXAxisColumn(e.target.value)}
          >
            {tableHeaders.map((column) => (
              <option key={column} value={column}>
                {column}
              </option>
            ))}
          </select>
        </div>
        </div>

      );
    } 
    else if (chartType === "pie") {
      return (
        <div className="piechart-content">
          <p className="barchartpara">A pie chart is a circular statistical graphic used to represent proportions or percentages within a whole. It is divided into slices to illustrate numerical proportions. Each slice represents a category or value, and the size of each slice corresponds to the proportion of the whole it represents.
          <br /> Here, It is recommended to select that column for which you want to see the proportion of each data in entire dataset. </p>
          <p className="question">Select Column Name:</p>
          <div className="select-container">
          <select
            value={xAxisColumn}
            onChange={(e) => setXAxisColumn(e.target.value)}
          >
            {tableHeaders.map((column) => (
              <option key={column} value={column}>
                {column}
              </option>
            ))}
          </select>
        </div>
        </div>
      );
    }
  };

  const CustomTooltip = ({ active, payload, label, xAxisColumn, yAxisColumns }) => {
    if (active && payload && payload.length) {
      const tooltipContent = payload.map((entry) => (
        <p key={entry.dataKey}>{`${entry.dataKey}: ${entry.value}`}</p>
      ));
    
      return (
        <div className="custom-tooltip">
          {tooltipContent}
        </div>
      );
    }
  
    return null;
  };

  const renderChart = () => {
    if (tableRows.length === 0) {
      return <p>Loading...</p>;
    }

    switch (chartType) {
      case "bar":
        // const filteredRows = tableRows.map((row) => {
        //   const filteredRow = {};
        //   Object.keys(row).forEach((key) => {
        //     if (key !== xAxisColumn && !isNaN(parseFloat(row[key]))) {
        //       filteredRow[key] = parseFloat(row[key]);
        //     }
        //   });
        //   return { ...filteredRow, [xAxisColumn]: row[xAxisColumn] };
        // });
        // console.log("123156",xAxisColumn)
        // const filteredRows = tableRows.map((row) => {
        //     const filteredRow = {};
        //     Object.keys(row).forEach((key) => {
        //       if (key !== xAxisColumn && !isNaN(parseFloat(row[key]))) {
        //         filteredRow[key] = parseFloat(row[key]);
        //       }
        //     });
        //     return { ...filteredRow, [xAxisColumn]: row[xAxisColumn] };
        //   });
          
        if (averages.length === 0 || stackedColumns.length === 0) {
          return null;
        }
        const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#00bfff"];
        return (
          <ResponsiveContainer width="100%" height="100%">
          <BarChart width={500} height={300} data={averages}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
            dataKey={xAxisColumn}
            // type="category"
            // allowDuplicatedCategory={false}
            // tickCount={uniqueXValues.length}
            // ticks={uniqueXValues}
            />
            <YAxis />
            <Tooltip  />
            <Legend />
            <ReferenceLine y={0} stroke="#000" />
            <Brush dataKey={xAxisColumn} height={30} stroke="#8884d8" />
            {stackedColumns.map((column, index) => (
              <Bar
                key={column}
                dataKey={column}
                stackId="a"
                fill={colors[index % colors.length]} 
              />
            ))}
                    <Bar key="count" dataKey="count" stackId="b" fill="#800080" />

          </BarChart>
          </ResponsiveContainer>
        );

      case "line":
        const filteredRows2 = tableRows.map((row) => {
          const filteredRow = {};
          Object.keys(row).forEach((key) => {
            if (key !== xAxisColumn && !isNaN(parseFloat(row[key]))) {
              filteredRow[key] = parseFloat(row[key]);
            }
          });
          return { ...filteredRow, [xAxisColumn]: row[xAxisColumn] };
        });

        const colors2 = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#00bfff"];

        return (
          <ResponsiveContainer width="100%" height="100%">
          <LineChart width={400} height={300} data={filteredRows2}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxisColumn} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Brush dataKey={xAxisColumn} height={30} stroke="#8884d8" endIndex={10} />

            {LineColumns.map((header, index) => (
              <Line
                key={header}
                type="monotone"
                dataKey={header}
                stroke={colors2[index % colors2.length]}
              />
            ))}
          </LineChart>
          </ResponsiveContainer>
        );

      case "pie":
        const valueCounts = {};
        const colors3 = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#00bfff"];

        tableRows.forEach((row) => {
          const value = row[xAxisColumn];
          if (value) {
            if (valueCounts[value]) {
              valueCounts[value] += 1;
            } else {
              valueCounts[value] = 1;
            }
          }
        });

        const filteredPieData = Object.entries(valueCounts)
        .filter(([value, count]) => value !== undefined && value !== "")
        .map(([value, count], index) => ({
        name: value,
        value: count,
        fill: colors3[index % colors3.length],
        }));

        const totalCount = filteredPieData.reduce(
          (total, entry) => total + entry.value,
          0
        );

        return (
          <ResponsiveContainer>         
            <PieChart width={400} height={300}>
            <Pie
              data={filteredPieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              label={(entry) =>
                `${entry.name} (${((entry.value / totalCount) * 100).toFixed(
                  2
                )}%)`
              }
            />
            <Tooltip />
            {/* <Legend /> */}
          </PieChart>
          </ResponsiveContainer>

        );

      default:
        return null;
    }
  };

  const [activeButton, setActiveButton] = useState(null);

  const handleButtonClick = (chartType) => {
    if (activeButton === chartType) {
        setActiveButton(null);
    } else {
        setActiveButton(chartType);
    }
};

// const renderUniqueValues = () => {
//   // Collect unique non-empty values from the selected xAxisColumn
//   const uniqueValues = new Set(
//     tableRows.map((row) => row[xAxisColumn]).filter((value) => value !== undefined && value !== "")
//   );

//   return (
//     <div className="unique-values">
//       <p>Unique Values for {xAxisColumn}:</p>
//       <ul>
//         {[...uniqueValues].map((value, index) => (
//           <li key={index}>{value}</li>
//         ))}
//       </ul>
//     </div>
//   );
// };



  return (
    <div className="main-module">
         {/* <div className="column-data-type-message">
          {xAxisColumn && renderColumnDataTypeMessage(xAxisColumn)}
        </div> */}
       
      {/* <div className="averages">
        {averages.map((averageData, index) => (
          <div key={index}>
            <p>{`${xAxisColumn}: ${averageData[xAxisColumn]}`}</p>
            <ul>
              {stackedColumns.map((column) => (
                <li key={column}>
                {`${column}: ${averageData[column] !== undefined && !isNaN(averageData[column]) ? averageData[column].toFixed(2) : '-'}`}
              </li>
              ))}
            </ul>
          </div>
        ))}
      </div> */}
      <div className="button-list">
        <button
          className={`chart-button ${activeButton==="bar" ? "active" : ""} ${chartType === "bar" ? "btn-primary" : "btn-secondary"
            } `}
          onClick={() => {setChartType("bar"); handleButtonClick("bar")}}
        >
          <span>Bar Chart <i class=" icon-graph fa fa-bar-chart"></i></span>
        </button>
        <button
          className={`chart-button ${activeButton==="line" ? "active" : ""} ${chartType === "line" ? "btn-primary" : "btn-secondary"
            }`}
          onClick={() => {setChartType("line"); handleButtonClick("line")}}
        >
          <span>Line Chart <i class=" icon-graph fa fa-line-chart"></i></span>
        </button>
        <button
          className={`chart-button ${activeButton==="pie" ? "active" : ""} ${chartType === "pie" ? "btn-primary" : "btn-secondary"
            }`}
          onClick={() => {setChartType("pie"); handleButtonClick("pie")}}
        >
          <span>Pie Chart <i class=" icon-graph fa fa-pie-chart"></i></span>
        </button>
      </div>

      <div className="py-3">
        {renderChartInputs()}
      </div>

      <div className="chart-container">
        {renderChart()}
      </div>
    </div>
  );
};

export default Chartss;