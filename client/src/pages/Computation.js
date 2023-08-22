import React from 'react';
import ComputationAbout from '../components/computation/ComputationAbout';
import ComputationDetails from '../components/computation/ComputationDetails';
import Navbar from '../components/navbar/Navbar';
import Sidebar from '../components/sidebar/Sidebar'; 
import Footer from '../components/footer/Footer';

function Computation() {
  return (
    <div style={{ background: "linear-gradient(to right, #E9F1FF, #B5D2FE)" }}>
      <Navbar />
      <div className="app">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-3">
              <Sidebar />
            </div>
            <div className="col-lg-9">
              <ComputationAbout /> 
              <ComputationDetails />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Computation