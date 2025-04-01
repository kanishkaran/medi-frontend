import React from "react";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useAuthStore } from "../store/authStore"; // Import the auth store

const GoogleLoginButton: React.FC = () => {
  const navigate = useNavigate();
  const setToken = useAuthStore((state) => state.setToken); // Access the setToken function

  const handleSuccess = async (credentialResponse: any) => {
    try {
      const res = await fetch("http://localhost:5000/login/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      if (!res.ok) {
        throw new Error("Failed to log in with Google");
      }

      const data = await res.json();
      setToken(data.access_token); // Save token to the auth store
      localStorage.setItem("token", data.access_token); // Save token to localStorage
      navigate("/chat"); // Redirect to chat page
    } catch (error) {
      console.error("Google login failed:", error);
      alert("Google login failed. Please try again.");
    }
  };

  const handleFailure = () => {
    alert("Google login failed. Please try again.");
  };

  return (
    <GoogleOAuthProvider clientId="1075856046253-71vvtot48lv4p82cloon1145ovf123ga.apps.googleusercontent.com">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleFailure}
      />
    </GoogleOAuthProvider>
  );
};

export default GoogleLoginButton;