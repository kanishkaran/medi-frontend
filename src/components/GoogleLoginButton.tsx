import React from "react";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { gapi } from "gapi-script";
import { useAuthStore } from "../store/authStore";

const GoogleLoginButton: React.FC = () => {
  const navigate = useNavigate();
  const setToken = useAuthStore((state) => state.setToken);

  React.useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: "1075856046253-71vvtot48lv4p82cloon1145ovf123ga.apps.googleusercontent.com",
        scope: "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/user.birthday.read https://www.googleapis.com/auth/user.phonenumbers.read",
      });
    }
    gapi.load("client:auth2", start);
  }, []);

  const handleLogin = async () => {
    try {
      const authInstance = gapi.auth2.getAuthInstance();
      const user = await authInstance.signIn();
      const accessToken = user.getAuthResponse().access_token;

      // Send the access token to the backend
      const res = await fetch("http://localhost:5000/login/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: accessToken }),
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

  return (
    <GoogleOAuthProvider clientId="1075856046253-71vvtot48lv4p82cloon1145ovf123ga.apps.googleusercontent.com">
      <button
        onClick={handleLogin}
        className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-hover rounded-md shadow-sm transition duration-300"
      >
        
        Sign in with Google
      </button>
    </GoogleOAuthProvider>
  );
};

export default GoogleLoginButton;