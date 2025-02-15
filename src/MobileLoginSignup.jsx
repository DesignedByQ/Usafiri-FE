import React, { useState } from "react";
import "./Styles.css";
import { useNavigate } from "react-router-dom";

const MobileLoginSignup = () => {

  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({ email: "", phone: "" });
  const [signUpData, setSignUpData] = useState({
    email: "",
    region: "",
    phone: "",
    DOB: "",
    password: "",
  });

  const [errorMessageLogIn, setErrorMessageLogIn] = useState("");
  const [errorMessageSignUp, setErrorMessageSignUp] = useState("");

  const handleChange = (e, setData) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (url, data) => {
    if (Object.values(data).some((field) => field.trim() === "")) {
      alert("Please fill in all fields.");
      return;
    }

    //prefix region to phone number before sending
    const newData = {
      email: data.email,
      region: data.region,
      phone: data.phone.startsWith("0") 
        ? data.region + data.phone.substr(1, 10) 
        : data.region + data.phone,
      DOB: data.DOB,
      password: data.password,
    }
    
  
    try {
      console.log("Data being sent: ", data); // Debugging line
      console.log("Data being sent: ", newData); // Debugging line

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData),
      });

      const result = await response.json(); // Parse JSON response

      if (response.ok) {
        console.log("Full Response:", result);
        console.log(`Status: ${result.status} - ${result.statusText || "N/A"}`);
        console.log(`Success message: ${result.message}`);
        setErrorMessageLogIn(""); // Clear any previous error on success
        setErrorMessageSignUp("");
        
        if (response.status === 200 || response.status === 201) {
          navigate("/verifyOTP", { state: { email: data.email, phone: data.phone } }); // Pass email via state
        }

      } else {
        console.error(`Error ${result.status}: ${result.message}`);
        if(Object.keys(data).length > 2)
          setErrorMessageSignUp(result.message || "An error occurred. Please try again."); // Set error message from backend
        else
          setErrorMessageLogIn(result.message || "An error occurred. Please try again."); // Set error message from backend
      }

    } catch (error) {
      console.error("Fetch Error:", error);
      if(Object.keys(data).length > 2)
        setErrorMessageSignUp("Network error. Please check your connection or contact admin.");
      else
        setErrorMessageLogIn("Network error. Please check your connection or contact admin.");
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1 className="title">USAFIRI</h1>
        <p className="subtitle">Guaranteed trackable deliveries.</p>
      </div>
      
      <div className="form-container">
        {/* Placeholder for Logo/Image */}
        <div className="logo">
          <img
            src="./Assets/USAFIRI Logo.png"
            alt="Usafiri Logo"
            className="logo-img"
          />
        </div>
        
        {/* Log In Section */}
        <h2 className="section-title">Log In</h2>
        <input 
          type="email" 
          name="email" 
          placeholder="Email" 
          className="input-field" 
          value={loginData.email}
          onChange={(e) => handleChange(e, setLoginData)}
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone (Example: 0759296484)"
          className="input-field"
          value={loginData.phone}
          onChange={(e) => handleChange(e, setLoginData)}
        />
        {errorMessageLogIn && <p className="error-text">{errorMessageLogIn}</p>} {/* Display error message in red */}
        <button className="button" onClick={() => handleSubmit("http://localhost:1100/usafiri/authenticator/signup_login", loginData)}>
          Log In
        </button>
        
        {/* Sign Up Section */}
        <p className="tagline">Join us, deliver products, get paid!</p>
        <h2 className="section-title">Sign Up</h2>
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="input-field"
          value={signUpData.email}
          onChange={(e) => handleChange(e, setSignUpData)}
        />

        {/* Dropdown for Region Selection */}
        <select
          name="region"
          className="input-field"
          value={signUpData.region || ""}
          onChange={(e) => handleChange(e, setSignUpData)}
        >
          <option value="" disabled>Country Code</option>
          <option value="+255">Tanzania +255</option>
          <option value="+250">Rwanda +250</option>
        </select>

        <input
          type="text"
          name="phone"
          placeholder="Phone (Example: 0759296484)"
          className="input-field"
          value={signUpData.phone}
          onChange={(e) => handleChange(e, setSignUpData)}
        />
        <input
          type="date"
          name="DOB"
          placeholder="Date of Birth"
          className="input-field"
          value={signUpData.DOB}
          onChange={(e) => handleChange(e, setSignUpData)}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="input-field"
          value={signUpData.password}
          onChange={(e) => handleChange(e, setSignUpData)}
        />
        {errorMessageSignUp && <p className="error-text">{errorMessageSignUp}</p>} {/* Display error message in red */}
        <button className="button" onClick={() => handleSubmit("http://localhost:1100/usafiri/authenticator/signup_login", signUpData)}>
          Sign Up
        </button>
      </div>
      
      {/* Contact Section */}
      <div className="contact">
        <h2 className="contact-title">Contact Us</h2>
        <p>Business WhatsApp</p>
        <p className="contact-info">+255774243466</p>
        <p>Email</p>
        <p className="contact-info">usafiri@gmail.com</p>
        <p>Business Registration No.</p>
        <p className="contact-info">419419</p>
        <p>Tax No.</p>
        <p className="contact-info">000000</p>
      </div>
    </div>
  );
};

export default MobileLoginSignup;

