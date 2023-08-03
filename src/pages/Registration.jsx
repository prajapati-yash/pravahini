import React from "react";
import RegistrationPage from "../components/registration/RegistrationPage";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";

function Registration() {
  return (
    <div style={{ background: "linear-gradient(to right, #E9F1FF, #B5D2FE)" }}>
      <Navbar />
      <RegistrationPage />
      <Footer/>
    </div>
  );
}

export default Registration;
