import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Styles.css";

const Dashboard = () => {
    const [timeLeft, setTimeLeft] = useState(() => {
        const savedTime = localStorage.getItem('timeLeft');
        return savedTime ? parseInt(savedTime, 10) : 21600; // Default to 6 hrs if no saved time
    });

    // add automatic logout after 6 hours of inactivity - requires deletion of otp - what counts as activity??
    // add a button to manually logout


    // Get from navigation state or local storage
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || localStorage.getItem("email") || "";
    //const phone = location.state?.phone || localStorage.getItem("phone") || "";

    useEffect(() => {
        // Function to request a new OTP
        // fisrt check if one exists if so dont addEventListener, then chack if over 6 hours if so then go home
        const newOTP = async () => {
            try {
                const response = await fetch(`http://localhost:1100/usafiri/authenticator/new_otp/${email}`, {
                    method: "GET",
                });

                const result = await response.json(); // Parse JSON response

                if (response.ok) {
                    console.log("New OTP request sent successfully.");
                    console.log("Full response:", result);
                } else {
                    console.error("Failed to send new OTP.");
                    console.error("Full error:", result);
                }
            } catch (error) {
                console.error("Error sending OTP request:", error);
            }
        };

        newOTP(); // Call the function when the component mounts
    }, [email]); // Dependency array includes email to ensure it is available when the component mounts

    //time of 6 hrs starts on mount and can only be reset by when a button is clicked
    //if 6 hours is up then go home and delete user otp
    //if user logs out then go home and delete user otp

    useEffect(() => {
        if (timeLeft <= 0) {
            deleteOTP(); // Call deleteOTP when timer hits 0
            localStorage.removeItem('timeLeft');
            return;
        }

        localStorage.setItem('timeLeft', timeLeft);

        const timer = setInterval(() => {
            setTimeLeft((prevTime) => prevTime - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

      // Function to handle the deletion request
      const deleteOTP = async () => {
        try {
            const response = await fetch(`http://localhost:1100/usafiri/authenticator/delete_otp/${email}`, {
                method: "GET",
            });

            const result = await response.json(); // Parse JSON response

            if (response.ok) {
                console.log("User OTP deleted successfully.");
                console.log("Full response:", result);

                if (response.status === 200) {
                    navigate("/"); // Go home
                }

            } else {
                console.error("Failed to delete user OTP.");
                console.error("Full error:", result);
            }

        } catch (error) {
            console.error("Error sending delete request:", error);
            console.error("Full error:", error);
        }
    };

return(

    <div>Hi</div>
)


}

export default Dashboard