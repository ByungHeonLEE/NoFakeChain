import React, { useState } from "react";
import Web3 from "web3";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";

function Header() {
  const [account, setAccount] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [connected, setConnected] = useState(false);

  const connectWallet = async () => {
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      try {
        // Request account access
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
        setWeb3(web3Instance);
        setConnected(true);
      } catch (error) {
        console.error("User denied account access");
      }
    } else if (window.web3) {
      // Legacy dapp browsers
      const web3Instance = new Web3(window.web3.currentProvider);
      setWeb3(web3Instance);
      setConnected(true);
    } else {
      // Non-dapp browsers
      console.log(
        "Non-Ethereum browser detected. Consider installing MetaMask!"
      );
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setWeb3(null);
    setConnected(false);
    if (window.ethereum) {
      window.ethereum.removeAllListeners();
    }
    window.locaation.reload();
  };

  return (
    <header className="masthead mb-auto">
      <div className="inner">
        <nav className="nav nav-masthead justify-content-center">
          <Link to="/" className="nav-link active">
            Home
          </Link>
          <Link to="/upload" className="nav-link">
            Upload
          </Link>
          <Link to="/gallery" className="nav-link">
            Gallery
          </Link>
          <button className="btn btn-primary" onClick={connectWallet}>
            {account
              ? `Connected: ${account.substring(0, 6)}...${account.substring(
                  38
                )}`
              : "Connect Wallet"}
          </button>
        </nav>
        <hr />
      </div>
    </header>
  );
}

export default Header;
