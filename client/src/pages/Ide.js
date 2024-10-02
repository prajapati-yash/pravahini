import React from 'react';
import CreateDataset from '../components/dataset/CreateDataset';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/footer/Footer';
import Sidebar from '../components/sidebar/Sidebar';
import CodeEditor from '../components/Ide/CodeEditor';


function Ide() {
  return (
    <div style={{ background: "linear-gradient(to right, #E9F1FF, #B5D2FE)" }}>
      <Navbar />
      <div className="app">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-2">
              <Sidebar />
            </div>
            <div className="col-lg-10">
                <CodeEditor />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Ide