import React from "react";

function VisualizationComputationDetails() {
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
            <tr className="dataset-table-body">
              <td>1</td>
              <td>2</td>
              <td>3</td>
              <td>4</td>
              <td>5</td>
              <td>6</td>
              <td>7</td>
            </tr>
            <tr className="dataset-table-body">
              <td>1</td>
              <td>2</td>
              <td>3</td>
              <td>4</td>
              <td>5</td>
              <td>6</td>
              <td>7</td>
            </tr>
            <tr className="dataset-table-body">
              <td>1</td>
              <td>2</td>
              <td>3</td>
              <td>4</td>
              <td>5</td>
              <td>6</td>
              <td>7</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default VisualizationComputationDetails;
