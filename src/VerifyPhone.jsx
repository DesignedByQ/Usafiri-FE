import React, {useState, useEffect} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import"./Styles.css";

const VerifyPhone = () => {

    const navigate = useNavigate();

    const location = useLocation();
    const email = location.state?.email || ""; // Get email from navigation state
    const phone = location.state?.phone || ""; // Get phone from navigation state

    const [otpData, setOtpData] = useState({ otp: "" });

    const [errorMessage, setErrorMessage] = useState("");

    const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds

    // Function to handle the deletion request
    const deleteUser = async () => {
        try {
            const response = await fetch(`http://localhost:1100/usafiri/authenticator/delete_user/${email}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            if (response.ok) {
                console.log("User deletion request sent successfully.");

                if (response.status === 200) {
                    navigate("/"); // Go home
                }

            } else {
                console.error("Failed to send user deletion request.");
            }
        } catch (error) {
            console.error("Error sending delete request:", error);
        }
    };

    useEffect(() => {
        if (timeLeft <= 0) {
            deleteUser(); // Call deleteUser when timer hits 0
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
          //console.log(url)
          const response = await fetch(url+`/${data.otp}/${email}/${phone}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          });
    
          const result = await response.json(); // Parse JSON response
    
          if (response.ok) {
            console.log("Full Response:", result);
            console.log(`Status: ${result.status} - ${response.statusText || "N/A"}`);
            console.log(`Success message: ${result.message}`);
            setErrorMessage(""); // Clear any previous error on success

            if (response.status === 202 || response.status === 201) {
              navigate("/Dashboard", { state: { email: data.email } }); // Pass email via state
            }
        
          } else {
            console.error(`Error ${result.status}: ${result.message}`);
            setErrorMessage(result.message || "An error occurred. Please try again."); // Set error message from backend
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
            <p className="tagline">Your account has been created. Now confirm your <strong>phone number</strong> to continue.</p>
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
            <button className="button" onClick={() => handleSubmit("http://localhost:1100/usafiri/authenticator/confirm_otp", otpData)}>
                Submit OTP
            </button>

            {/* Home Button Section */}
            <p className="tagline">Confirm the OTP within 
                
                <span style={{ 
                    fontSize: "14px", 
                    fontWeight: "bold", 
                    color: timeLeft <= 5 * 60 ? "red" : "green" 
                }}>
                    {formatTime(timeLeft)}
                </span> 
                
            minutes or start the sign up process again.</p>

            <button className="button" onClick={() => {deleteUser(); navigate("/")}}>
                Start Again
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

export default VerifyPhone;