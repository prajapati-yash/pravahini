import React from 'react';
import ReactDOM from 'react-dom/client';
import { WagmiConfig, createConfig } from "wagmi";
import { ConnectKitProvider, ConnectKitButton, getDefaultConfig } from "connectkit";
import { configureChains } from "wagmi";
import { goerli, polygonMumbai } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import './index.css';
import App from './App';

const { chains } = configureChains(
  [polygonMumbai, goerli],
  [
    alchemyProvider({ apiKey: "Rwja692xoss6YsaqbUDRNVwpjZrO4ltM" }),
    publicProvider(),
  ]
);

const config = createConfig(
  getDefaultConfig({
    // Required API Keys
    alchemyId: "Rwja692xoss6YsaqbUDRNVwpjZrO4ltM", 
    chains
  }),
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  
  <WagmiConfig config={config}>
  <ConnectKitProvider>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ConnectKitProvider>
</WagmiConfig>
   
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

