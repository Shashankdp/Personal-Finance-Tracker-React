import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./Components/Header";
import Signup from "./Pages/Signup";
import Dashboard from "./Pages/Dashboard";
import "./App.css";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {

    return(
        <>
            <ToastContainer />   {/*This is where the toasts will be rendered */}
            <Router>
                <Routes>
                    <Route path="/" element={<Signup></Signup>}></Route>
                    <Route path="/dashboard" element={<Dashboard></Dashboard>}></Route>
                </Routes>
            </Router>
        </>
    )
}

export default App;