import React, { useEffect, useState } from "react";
// import logo from './logo.svg';
import "./App.css";
// import {Route, Routes} from "react-router-dom";

function App() {
  const [popup, setPopup] = useState({ current: null, item: null });
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);

  const onPopup = (current = null, item = null) => {
    setPopup({ current, item });
  };

  const onConnect = async () => {
    try {
      //      debugger;
      await window.tronLink.request({ method: "tron_requestAccounts" });
      let accounts = await window.tronLink;

      setWalletConnected(true);
      setWalletAddress(accounts.tronWeb.defaultAddress.base58);
    } catch (err) {
      console.log("Error: ", err);
      onPopup("error", "TronLink extension is not installed");
    }
  };

  async function becomeMember() {
    const trc20ContractAddress = "TWbmyb5i9M9HmJNpUhXNytQhbxLB84p7bA"; //contract address
    let tronWeb = window.tronLink.tronWeb;
    try {
        setMembershipStatus("Trying to become Member..");
      let contract = await tronWeb.contract().at(trc20ContractAddress);
      //Use call to execute a pure or view smart contract method.
      // These methods do not modify the blockchain, do not cost anything to execute and are also not broadcasted to the network.
      let result = await contract.becomeMember().send({
        callValue:"2000000",
      });
      console.log("result: ", result);
        
    } catch (error) {
      console.error("trigger smart contract error", error);
    }
    
  }
  async function getMembershipStatus() {
    const trc20ContractAddress = "TWbmyb5i9M9HmJNpUhXNytQhbxLB84p7bA"; //contract address
    let tronWeb = window.tronLink.tronWeb;
    setMembershipStatus("Checking..")
    try {
      let contract = await tronWeb.contract().at(trc20ContractAddress);
      //Use call to execute a pure or view smart contract method.
      // These methods do not modify the blockchain, do not cost anything to execute and are also not broadcasted to the network.
      let result = await contract.isMember(walletAddress).call();
      console.log("result: ", result);
        setMembershipStatus(result == true ? "Yes, A Member" : "No , Not a member");


    } catch (error) {
      console.error("trigger smart contract error", error);
    }

  }

  function setMembershipStatus(msg){
    document.getElementById("membershipStatus").innerHTML =msg

  }

  return (
    <>
      <div className="app">
      <div className="membership">
      <div className="membership__buttons">
      {!walletConnected && (
          <button onClick={onConnect}>Connect Wallet</button>
        )}
        {walletConnected && (
          <>
            <button id="membershipStatusButton" onClick={getMembershipStatus}>
              Get Membership Status
            </button>
            <button id="becomeMember" onClick={becomeMember}>
              becomeMember
            </button>
          </>
        )}

      </div>
        
      <p id="membershipStatus"></p>


      </div>
        
      </div>
    </>
  );
}

export default App;
