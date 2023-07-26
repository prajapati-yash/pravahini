import React from "react";
import "../../styles/navbar/Navbar.css";

const navigation = [
  {
    title: "About Us",
    link: "/",
  },
  {
    title: "Connect Wallet",
    link: "/",
  },
  
];

export default function Navbar() {
  return (
    <>
      <nav
        className="navbar navbar-expand-lg navbar-light sticky-top"
        role="navigation"
      >
        <div className="container-fluid px-4 px-md-5">
          <a className="navbar-brand" href="/">
             <h1>LOGO</h1>
          </a>

          <button
            type="button"
            className="navbar-toggler collapsed d-flex d-lg-none flex-column justify-content-around" data-bs-toggle="collapse" data-bs-target="#navbarRightAlignExample"
            aria-controls="navbarRightAlignExample" aria-expanded="false" aria-label="Toggle navigation"
            >
            <span className="toggler-icon top-bar"></span>
            <span className="toggler-icon middle-bar"></span>
            <span className="toggler-icon bottom-bar"></span>
          </button>

          <div
            className="collapse navbar-collapse justify-content-end"
            id="navbarRightAlignExample"
          >
            <ul className="navbar-nav ml-auto align-items-center mb-2 mb-lg-0">
              {navigation.map((item, index) => (
                <NavLink body={item} key={index}/>
              ))}

            </ul>
          </div>
        </div>
      </nav>
    </>
  );
} 
function NavLink({body}){
    return (
        <li className="nav-item px-2">
          <a
            className="nav-link p-0 active"
            aria-current="page"
            href={body.link}
          >
            {body.title}
          </a>
        </li>
    )
}