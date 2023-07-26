import React from 'react'
import "../../styles/home/HomeHero.css";
import arrow from "../../assets/home/arrow.png";
import union from "../../assets/home/union.png";
import union1 from "../../assets/home/union-1.png";
import heroimg from "../../assets/home/heroImage.png";
import search from "../../assets/home/search.png";
import security from "../../assets/home/security.png";
import link from "../../assets/home/link.png";

function HomeHero() {
  return (
    <div className='d-flex main-container px-5 px-md-5 '>
        <div className="container-fluid hero-container px-5 py-4 col-7">
            <div>
                <p className='hero-text  '>Welcome  to Pravahini (प्रवाहिनी)</p>
                <p className='hero-sub-text '>Here you can find the datasets for your ML Models, buy the ML Models, you can sell your datasets and ML Models, you can write code on our platform and create a ML Model and perform the Decentralized Computation of your ML Models.</p>
            </div>

            <div className='hero-button ps-3 d-flex align-items-center'>
                <span className='py-3 hero-button-text '>Get Started</span>
                <span className='hero-arrow mx-2'>
                    <img className="img-arrow" src={arrow} alt="" srcset="" />
                </span>
            </div>
        </div>
        <div className='col-5'>
            <div className=''>
                <img className='union-img' src={union} />
                <img className='security-img' src={security}/>
                <img className='hero-img' src={heroimg}/>
                <img className='union1-img' src={union1} />
                <img className='search-img' src={search} />
                <img className='link-img' src={link} />
            </div>
        </div>
    </div>

  )
}

export default HomeHero