import React from 'react'
import ReactDOM from 'react-dom/client'
import { WagmiConfig, createConfig } from "wagmi";
import { ConnectKitProvider, ConnectKitButton, getDefaultConfig } from "connectkit";
import { configureChains } from "wagmi";
import { goerli, polygonMumbai } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import App from './App.jsx'
import './index.css'

const BTTChain = {
  id: 1028,
  name: "BTTC",
  network: "BitTorrent Chain Donau",
  iconUrl: "https://testscan.bt.io/static/media/BTT.e13a6c4e.svg",
  iconBackground: "#fff",
  nativeCurrency: {
    decimals: 18,
    name: "BitTorrent Chain Donau",
    symbol: "BTT",
  },
  rpcUrls: {
    default: "https://testrpc.bittorrentchain.io",
  },
  blockExplorers: {
    default: {
      name: "BitTorrent Chain Donau",
      url: "https://testscan.bt.io",
    },
  },
  testnet: true,
};

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

ReactDOM.createRoot(document.getElementById('root')).render(
  <WagmiConfig config={config}>
    <ConnectKitProvider theme="midnight">
      
        <App />
    
    </ConnectKitProvider>
  </WagmiConfig>,
)
