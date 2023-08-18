import React from "react";
import "../../styles/home/HowItWorks.css";

const howWorksContent = [
  {
    number: "1",
    head: "Connect your wallet :",
    title: "Connecting your wallet is the first step to using our Platform.",
  },
  {
    number: "2",
    head: "Get Started :",
    title:
      "Click on the 'Get Started' button to be redirected to the sign-up page.",
  },
  {
    number: "3",
    head: "User Dashboard :",
    title:
      "The user dashboard will provide you with access to all your datasets and machine learning models. Additionally, it will display the purchased models and datasets for your convenience.",
  },
  {
    number: "4",
    head: "Create Dataset  & ML Model :",
    title:
      "To create a dataset or ML Model , upload a file from your local device in the required format. Fill in all the necessary details and click the submit button.",
  },
  {
    number: "5",
    head: "Dataset Marketplace & ML Model Marketplace :",
    title:
      "Here you can find the list of datasets and ML Models which you can buy and use it. There will be free as well as paid Datasets and ML Models.",
  },
];

function HowItWorks() {
  return (
    <div className="mt-3 how-works-main-container">
      <p className="how-works-title">
        Detailed Guide on How the System Works and Operates
      </p>
      <div className="how-works-content">
        <div>
          {howWorksContent.map((item, key) => (
            <div
              className="pb-4 d-flex align-items-center onHoverHowItContent"
              index={key}
            >
              <div className="col-1">
                <div className="circle-number">
                  <span className="text-number">{item.number}</span>
                </div>
              </div>
              <div className="col-1 col-sm-0 d-sm-none"> </div>
              <div className="how-works-mono-content col-10 col-sm-11">
                <span className="how-works-head"> {item.head}</span> &nbsp;
                <span className="how-works-sub-content">{item.title}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HowItWorks;
