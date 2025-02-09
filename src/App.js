import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MobileLoginSignup from "./MobileLoginSignup";
import OTPverification from "./OTPverification";
import VerifyPhone from "./VerifyPhone";
import Dashboard from "./Dashboard";

const App = () => {
    return (
        //<Router>
            <Routes>
                <Route path="/" element={<MobileLoginSignup />} />
                <Route path="/verifyOTP" element={<OTPverification />} />
                <Route path="/verifyPhoneOTP" element={<VerifyPhone />} />
                <Route path="/Dashboard" element={<Dashboard />} />
            </Routes>
        //</Router>
    );
};

export default App;
