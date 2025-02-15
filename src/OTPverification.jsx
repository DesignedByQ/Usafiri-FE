import React, {useState,useEffect} from "react";
import"./Styles.css";
import { useLocation, useNavigate } from "react-router-dom";

const OTPverification = () => {

    const navigate = useNavigate();

    const location = useLocation();
    const email = location.state?.email || ""; // Get email from navigation state
    const phone = location.state?.phone || ""; // Get phone from navigation state

    const [otpData, setOtpData] = useState({ otp: "" });

    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [otpErrorMessage, setOTPErrorMessage] = useState("");

    //const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds

    const [timeLeft, setTimeLeft] = useState(() => {
      const savedTime = localStorage.getItem('timeLeft');
      return savedTime ? parseInt(savedTime, 10) : 300; // Default to 5 minutes if no saved time
    });

    // Function to request a new OTP
    const newOTP = async () => {
        try {
            const response = await fetch(`http://localhost:1100/usafiri/authenticator/new_otp/${email}`, {
                method: "GET",
            });

            const result = await response.json(); // Parse JSON response

            if (response.ok) {
                console.log("New OTP request sent successfully.");
                console.log("Full response:", result);
                setSuccessMessage("New OTP request sent successfully.") 
                setOTPErrorMessage("")

            } else {
                console.error("Failed to send new OTP.");
                console.error("Full error:", result);
                setOTPErrorMessage(`Error ${result.status}: ${result.message}`) // Set error message from backend
                setSuccessMessage("")
            }
        } catch (error) {
            console.error("Error sending OTP request:", error);
            setOTPErrorMessage("Error sending OTP request:", error)
            setSuccessMessage("")
        }
    };

    // Function to handle the deletion request
    const deleteUser = async () => {
        try {
            const response = await fetch(`http://localhost:1100/usafiri/authenticator/delete_user/${email}`, {
                method: "GET",
            });

            const result = await response.json(); // Parse JSON response

            if (response.ok) {
                console.log("Email OTP not confirmed. User deletion request sent successfully.");
                console.log("Full response:", result);

                if (response.status === 200) {
                    navigate("/"); // Go home
                }

            } else {
                console.error("Failed to send user deletion request.");
                console.error("Full error:", result);
            }

        } catch (error) {
            console.error("Error sending delete request:", error);
            console.error("Full error:", error);
        }
    };

    useEffect(() => {
      if (timeLeft <= 0) {
          deleteUser(); // Call deleteUser when timer hits 0
          localStorage.removeItem('timeLeft');
          return;
      }

      localStorage.setItem('timeLeft', timeLeft);

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

        let formattedPhone = "";

        if(phone.startsWith("0")){
          formattedPhone = "+255" + phone.substr(1,10)
        } else if(phone.startsWith("7")){
          formattedPhone = "+255" + phone
        }
    
        try {

          const response = await fetch(url+`/confirm_otp/${data.otp}/${email}/${phone}`, {
            method: "GET",
          });
  
          const result = await response.json(); // Parse JSON response

          if (response.ok) {

            console.log("Full Response:", result);
            console.log(`Status: ${result.status} - ${response.statusText || "N/A"}`);
            console.log(`Success message: ${result.message}`);
            setErrorMessage(""); // Clear any previous error on success

            const newOTPresponse = await fetch(url+`/new_otp/${formattedPhone}`, {
              method: "GET",
            });
  
            const newOTPresult = await newOTPresponse.json(); // Parse JSON response
      
            if (newOTPresponse.ok) {
  
              console.log("Full newOTPResponse:", newOTPresult);
              console.log(`Status: ${newOTPresult["status"]} - ${newOTPresult.statusText || "N/A"}`);
              console.log(`Success message: ${newOTPresult.message}`);
              setErrorMessage(""); // Clear any previous error on success
                      
              } else {
                console.error("Full Error: ", newOTPresult);
                console.error(`Error ${newOTPresult.status}: ${newOTPresult.message}`);
                setErrorMessage(newOTPresult.message || "Error sending OTP to phone number. Please check the phone number submitted and try again."); // Set error message from backend
              }

              if (response.status === 202 && newOTPresponse.status === 201) {
                localStorage.setItem("email", email);
                localStorage.setItem("phone", phone);
                navigate("/verifyPhoneOTP", { state: { email: email, phone: phone } }); // Pass email, phone via state
              }

              //console.log("Data before navigate:", email, phone);
    
          } else {
            console.error("Full Error: ", result);
            console.error(`Error ${result.status}: ${result.message}`);
            setErrorMessage(result.message || "Error confirming OTP for email. Please check the OTP submitted and try again."); // Set error message from backend
          }
    
        } catch (error) {
          console.error("Fetch Error:", error);
          setErrorMessage("Network or system error. Please check your connection otherwise contact admin.");
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

            <button className="button" onClick={() => { deleteUser(); navigate("/")}}>
                Home
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