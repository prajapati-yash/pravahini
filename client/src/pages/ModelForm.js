import React from 'react'
import Navbar from '../components/navbar/Navbar'
import Sidebar from '../components/sidebar/Sidebar'
import Footer from '../components/footer/Footer'
import CreateModel from '../components/model/CreateModel'

function ModelForm() {
  return (
    <div style={{ background: "linear-gradient(to right, #E9F1FF, #B5D2FE)" }}>
      <Navbar /> 
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-3">
            <Sidebar />
          </div>
          <div className="col-lg-9">
            <CreateModel />  
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default ModelForm