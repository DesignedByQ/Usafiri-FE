import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MobileLoginSignup from "./MobileLoginSignup";
import OTPverification from "./OTPverification";

const App = () => {

    return (
        //<Router>
            <Routes>
                <Route path="/" element={<MobileLoginSignup />} />
                <Route path="/verifyOTP" element={<OTPverification />} />
            </Routes>
        //<Router>
    )

}

export default App;