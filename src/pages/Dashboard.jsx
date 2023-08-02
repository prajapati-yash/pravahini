import React from "react";
import UserDetails from "../components/dashboard/UserDetails";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";
import Sidebar from "../components/sidebar/Sidebar";

function Dashboard() {
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
              <UserDetails />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Dashboard;
