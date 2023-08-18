import React from "react";
import HomeHero from "../components/home/HomeHero";
import HowItWorks from "../components/home/HowItWorks";
import LandingNavbar from "../components/navbar/LandingNavbar";
import Footer from "../components/footer/Footer";

function Home() {
  return (
    <div style={{ background: "linear-gradient(to right, #E9F1FF, #B5D2FE)" }}>
      <LandingNavbar />
      <HomeHero />
      <HowItWorks />
      <Footer />
    </div>
  );
}

export default Home;
