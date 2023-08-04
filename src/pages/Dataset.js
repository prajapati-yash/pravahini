import React from 'react';
import CreateDataset from '../components/dataset/CreateDataset';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/footer/Footer';

function Dataset() {
  return (
    <div style={{ background: "linear-gradient(to right, #E9F1FF, #B5D2FE)" }}>
        <Navbar />
        <CreateDataset />
        <Footer />
    </div>
  )
}

export default Dataset