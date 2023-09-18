import React,{useState, useEffect} from 'react';
import ComputationAbout from '../components/computation/ComputationAbout';
import ComputationDetails from '../components/computation/ComputationDetails';
import Navbar from '../components/navbar/Navbar';
import Sidebar from '../components/sidebar/Sidebar'; 
import Footer from '../components/footer/Footer';
import {ethers} from 'ethers';
import axios from "axios";
import { useAccount } from "wagmi";
import Cookies from 'js-cookie';

function Computation() {

  const { address } = useAccount();
  const [signature, setSignature] = useState("");
 

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
});


  const signMessage = async () => {
   
    try {
      if (window.ethereum) {
        await window.ethereum.request({ method: 'eth_requestAccounts' }); // Prompt user to connect their wallet
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        const messageBytes = ethers.utils.toUtf8Bytes(process.env.REACT_APP_MSG_TO_SIGN);
        const sig = await signer.signMessage(messageBytes);
        setSignature(sig);
        const res = await axiosInstance.post("/de-computation", { address, signature });
        const token = res.data.jwtToken;
        Cookies.set('jwtToken', token, { expires: 1 })
      } else {
        console.error('No Ethereum wallet detected');
      }
    } catch (error) {
      console.error('Error signing the message:', error);
    }
  };
  useEffect(() => {
    const prevAddress = Cookies.get('prevAddress')
    if(!prevAddress){
        Cookies.set('prevAddress', address);
        
    }else if(address !== prevAddress){
      Cookies.remove('jwtToken');
      Cookies.set('prevAddress', address);
    }
}, []) 
  return (
    <div style={{ background: "linear-gradient(to right, #E9F1FF, #B5D2FE)" }}>
      <Navbar />
      <div className="app">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-3">
              <Sidebar />
            </div>
            <div className="col-lg-9">
              <ComputationAbout /> 
              <ComputationDetails />
            </div>
          </div>
          <div style={{position:'absolute', height:"200px", width:"200px", backgroundColor:"white", top:'200px', left:'700px'}} className="mx-auto">
            <div>
                  <button className="btn-primary" style={{height:'50px',border:'2px solid black'}} onClick={()=>signMessage()}>Click ME to sign in for performing the computation</button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Computation