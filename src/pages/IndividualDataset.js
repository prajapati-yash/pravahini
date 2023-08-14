import React from 'react'
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/footer/Footer';
import SingleDataset from '../components/dataset/SingleDataset';
import Sidebar from '../components/sidebar/Sidebar';

function IndividualDataset() {
  return (
    <div style={{ background: "linear-gradient(to right, #E9F1FF, #B5D2FE)" }}>
      <Navbar /> 
      <div className="app">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-3">
              <Sidebar />
            </div>
            <div className="col-lg-9 px-0">
              <SingleDataset />  
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default IndividualDataset