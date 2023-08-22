import React from 'react'
import Navbar from '../components/navbar/Navbar';
import Sidebar from '../components/sidebar/Sidebar';
import SingleModel from '../components/model/SingleModel';
import Footer from '../components/footer/Footer';

function IndividualModel() {
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
              <SingleModel />  
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default IndividualModel