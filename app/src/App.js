import React, {useEffect, useState} from 'react';
// import logo from './logo.svg';
import './App.css';
// import {Route, Routes} from "react-router-dom";

function App() {

    const [popup, setPopup] = useState({current: null, item: null});

    const onPopup = (current = null, item = null) => {
        setPopup({current, item});
    };

    const onConnect = async () => {
        try {
            debugger;
            await window.tronLink.request({method: 'tron_requestAccounts'});
            console.log("wallet connected")
        } catch (err) {
            console.log("Error: ", err);
            onPopup('error', 'TronLink extension is not installed');
        }
    };
    return (
        <>
            <div className="App">
                {/*<header className="App-header">*/}
                {/*    <img src={logo} className="App-logo" alt="logo"/>*/}
                {/*    <p>*/}
                {/*        Edit <code>src/App.js</code> and save to reload.*/}
                {/*    </p>*/}
                {/*    <a*/}
                {/*        className="App-link"*/}
                {/*        href="https://reactjs.org"*/}
                {/*        target="_blank"*/}
                {/*        rel="noopener noreferrer"*/}
                {/*    >*/}
                {/*        Learn React*/}
                {/*    </a>*/}
                {/*</header>*/}
                <button onClick={onConnect}>Connect Wallet</button>
            </div>
            {/*<div className="content">*/}
            {/*    <Routes>*/}
            {/*        <Route*/}
            {/*            path="/"*/}
            {/*            exact*/}
            {/*            element={<Home*/}
            {/*                account={account}*/}
            {/*                onExit={onExit}*/}
            {/*                onConnect={onConnect}*/}
            {/*                tokens={tokens}*/}
            {/*                myPlayers={myPlayers}*/}
            {/*                isLoadingPlayers={isLoadingPlayers}*/}
            {/*            />}*/}
            {/*        />*/}
            {/*    </Routes>*/}
            {/*</div>*/}
        </>

    );
}

export default App;
