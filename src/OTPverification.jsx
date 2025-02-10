import React, {useState,useEffect} from "react";
import"./Styles.css";
import { useLocation, useNavigate } from "react-router-dom";
import VerifyPhone from "./VerifyPhone" 


const OTPverification = () => {

    const navigate = useNavigate();

    const location = useLocation();
    const email = location.state?.email || ""; // Get email from navigation state
    const phone = location.state?.phone || ""; // Get email from navigation state

    const [otpData, setOtpData] = useState({ otp: "" });

    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [otpErrorMessage, setOTPErrorMessage] = useState("");

    const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds

    // Function to request a new OTP
    const newOTP = async () => {
        try {
            const response = await fetch(`http://localhost:1100/usafiri/authenticator/new_otp/${email}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            if (response.ok) {
                console.log("New OTP request sent successfully.");
                setSuccessMessage("New OTP request sent successfully.") 
                setOTPErrorMessage("")

            } else {
                console.error("Failed to send new OTP.");
                setOTPErrorMessage("Failed to send new OTP.")
                setSuccessMessage("")
            }
        } catch (error) {
            console.error("Error sending OTP request:", error);
            setOTPErrorMessage("Error sending OTP request:", error)
            setSuccessMessage("")
        }
    };

    useEffect(() => {
        if (timeLeft <= 0) {
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prevTime) => prevTime - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? `0${secs}` : secs}`;
    };

    const handleChange = (e, setData) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (url, data) => {
        if (Object.values(data).some((field) => field.trim() === "")) {
          alert("Please fill in all fields.");
          return;
        }
    
        try {

          const newOTPresponse = await fetch(url+`/new_otp/${phone}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          });

          const newOTPresult = await newOTPresponse.json(); // Parse JSON response
    
          if (newOTPresponse.ok) {

            console.log("Full newOTPResponse:", newOTPresult);
            console.log(`Status: ${newOTPresult.status} - ${newOTPresponse.statusText || "N/A"}`);
            console.log(`Success message: ${newOTPresult.message}`);
            setErrorMessage(""); // Clear any previous error on success
                    
            const response = await fetch(url+`/confirm_otp/${data.otp}/${email}/${phone}`, {
              method: "GET",
              headers: { "Content-Type": "application/json" },
            });
    
            const result = await response.json(); // Parse JSON response

            if (response.ok) {

              console.log("Full Response:", result);
              console.log(`Status: ${result.status} - ${response.statusText || "N/A"}`);
              console.log(`Success message: ${result.message}`);
              setErrorMessage(""); // Clear any previous error on success

              if (response.status === 202 && newOTPresponse.status === 201) {
                navigate("/verifyPhoneOTP", { state: { email: data.email, phone: data.phone } }); // Pass email via state
              }
      
            } else {
              console.error(`Error ${result.status}: ${result.message}`);
              setErrorMessage(result.message || "An error occurred. Please try again."); // Set error message from backend
            }

          } else {
            console.error(`Error ${newOTPresult.status}: ${newOTPresult.message}`);
            setErrorMessage(newOTPresult.message || "An error occurred. Please try again."); // Set error message from backend
          }
    
        } catch (error) {
          console.error("Fetch Error:", error);
          setErrorMessage("Network error. Please check your connection.");
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
            
            {/* Submit OTP Section */}
            <p className="tagline">New users will receive an OTP via email, and via phone for existing users. Check your junk folder before requesting a new one.</p>
            <h2 className="section-title">Submit OTP</h2>
            <input 
              type="text" 
              name="otp" 
              placeholder="Enter your OTP here." 
              className="input-field" 
              value={otpData.otp}
              onChange={(e) => handleChange(e, setOtpData)}
            />

            {errorMessage && <p className="error-text">{errorMessage}</p>} {/* Display error message in red */}
            <button className="button" onClick={() => handleSubmit("http://localhost:1100/usafiri/authenticator", otpData)}>
            Submit OTP
            </button>

            {/* Home Button Section */}
            <p className="tagline">Confirm the OTP within {" "}
                
                <span style={{ fontSize: "14px", fontWeight: "bold", color: timeLeft <= 5 * 60 ? "red" : "green" }}>
                    {formatTime(timeLeft)}
                </span> 
                
            {" "} minutes or request another one if you didn't receive it.</p>

            <button className="button" onClick={() => newOTP()}>
                Request New OTP
            </button>
            {successMessage && <p className="success-text">{successMessage}</p>} {/* Display success message in green */}
            {otpErrorMessage && <p className="error-text">{otpErrorMessage}</p>} {/* Display error message in red */}

            <button className="button" onClick={() => navigate("/")}>
                Start Again add delete user after timeout or click here
            </button>

            </div>
      
      {/* Contact Section */}
      <div className="contact">
        <h2 className="contact-title">Contact Us</h2>
        <p>Business WhatsApp</p>
        <p className="contact-info">+255774243466</p>
        <p>Email</p>
        <p className="contact-info">usafiri@gmail.com</p>
      </div>
    </div>
  );


}

export default OTPverification;