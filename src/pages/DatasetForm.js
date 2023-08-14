import React from 'react'
import CreateDataset from '../components/dataset/CreateDataset'
import Navbar from '../components/navbar/Navbar';
import Sidebar from '../components/sidebar/Sidebar';
import Footer from '../components/footer/Footer';

function DatasetForm() {
  return (
    <div style={{ background: "linear-gradient(to right, #E9F1FF, #B5D2FE)" }}>
      <Navbar />
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-3">
              <Sidebar />
            </div>
            <div className="col-lg-9">
              <CreateDataset />  
            </div>
          </div>
        </div>
      <Footer />
    </div>
  )
}

export default DatasetForm