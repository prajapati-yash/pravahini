import React from 'react'
import Navbar from '../components/navbar/Navbar';
import Sidebar from '../components/sidebar/Sidebar';
import SingleModel from '../components/model/SingleModel';
import Footer from '../components/footer/Footer';
import Comment from './Comment';
import '../styles/model/IndividualModel.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeftLong } from '@fortawesome/free-solid-svg-icons';

function IndividualModel() {
  return (
    <div style={{ background: "linear-gradient(to right, #E9F1FF, #B5D2FE)" }}>
      <Navbar /> 
      <div className="app">
        <div className="container-fluid">
          <div className="row">
          
            <div className="container-fluid ps-4 ps-md-5 rightPadding">
              <SingleModel />  
              <Comment/>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default IndividualModel