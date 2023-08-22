import React from "react";
import VisualizationAbout from "../components/visualization/VisualizationAbout";
import VisualizationCompute from "../components/visualization/VisualizationCompute";
import VisualizationComputationDetails from "../components/visualization/VisualizationComputationDetails";
import Navbar from "../components/navbar/Navbar";
import Sidebar from "../components/sidebar/Sidebar";
import Footer from "../components/footer/Footer";

function Visualization() {
  return (
    <div style={{ background: "linear-gradient(to right, #E9F1FF, #B5D2FE)" }}>
      <Navbar />
      <div className="app">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-3">
              <Sidebar />
            </div>
            <div className="d-flex flex-md-row flex-column col-lg-9">
              <div className="row">
                <div className="col-md-7">
                  <VisualizationAbout />
                </div>
                <div className="col-md-5 px-0">
                  <VisualizationCompute />
                </div>
                <VisualizationComputationDetails />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Visualization;
