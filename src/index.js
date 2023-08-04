import React from 'react';
import ReactDOM from 'react-dom/client';
// import { WagmiConfig, createConfig } from "wagmi";
// import { ConnectKitProvider, ConnectKitButton, getDefaultConfig } from "connectkit";
// import { configureChains } from "wagmi";
// import { goerli, polygonMumbai } from "wagmi/chains";
// import { alchemyProvider } from "wagmi/providers/alchemy";
// import { publicProvider } from "wagmi/providers/public";
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  
      <React.StrictMode>
        <App />
      </React.StrictMode>
   
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

