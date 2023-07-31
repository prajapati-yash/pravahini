import React from "react";
import RegistrationPage from "../components/registration/RegistrationPage";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";

function Registration() {
  return (
    <div style={{ background: "linear-gradient(to left, #C5DDF3, #E1EFFC)" }}>
      <Navbar />
      <RegistrationPage />
      <Footer/>
    </div>
  );
}

export default Registration;
