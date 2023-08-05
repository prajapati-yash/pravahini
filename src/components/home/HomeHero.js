import React from "react";
import "../../styles/home/HomeHero.css";
import arrow from "../../assets/home/arrow.png";
import union from "../../assets/home/union-2.png";
import union1 from "../../assets/home/union-1.png";
import heroimg from "../../assets/home/heroImage.png";
import search from "../../assets/home/search.png";
import security from "../../assets/home/security.png";
import link from "../../assets/home/link.png";
import unioncopy from "../../assets/home/union-copy.png";

function HomeHero() {
  return (
    <div className="d-flex flex-lg-row flex-column hero-main-container px-4 px-sm-5 my-xl-4 mx-2">
      <div className="container-fluid hero-container px-4 py-3 px-sm-5 py-sm-4 col-lg-6">
        <div>
          <p className="hero-text">Welcome to Pravahini (प्रवाहिनी)</p>
          <p className="hero-sub-text ">
            Here you can find the datasets for your ML Models, buy the ML
            Models, you can sell your datasets and ML Models, you can write code
            on our platform and create a ML Model and perform the Decentralized
            Computation of your ML Models.
          </p>
        </div>

        <div className="get-started-container justify-content-center">
          <div className="hero-button ps-3 d-flex align-items-center">
            <span className="py-3 hero-button-text ">Get Started</span>
            <span className="d-end hero-arrow mx-2 ">
              <img className="img-arrow" src={arrow} alt="" srcset="" />
            </span>
          </div>
        </div>
      </div>
      <div className="col-lg-6 hero-img-container">
        <img className="img-union" src={union} />
        <img className="img-security " src={security} />
        <img className="img-hero" src={heroimg} />
        <img className="img-union1" src={unioncopy} />
        {/* <img className="img-search" src={search} />
        <img className="img-link" src={link} /> */}
      </div>
    </div>
  );
}

export default HomeHero;
