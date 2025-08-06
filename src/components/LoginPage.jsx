// LoginPage.jsx
import React, { useState, useEffect } from "react";
import axiosInstance from "../axiosConfig";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, User, Lock, AlertCircle } from "lucide-react";
import Header from "./Header";
import Footer from "./Footer";
import AviationLogo from "../static/img/AviationLogo.png";
import styles from "./Login.module.css";
import { useRoleMenus } from "../context/RoleMenuContext"; 

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [location, setLocation] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const navigate = useNavigate();
  const [redirectToHome, setRedirectToHome] = useState(false); // Add this state
  const { refreshMenus } = useRoleMenus();


  useEffect(() => {
    // Trigger animation after component mounts
    setFadeIn(true);

    // Check for saved username in localStorage
    const savedUsername = localStorage.getItem("rememberedUsername");
    if (savedUsername) {
      setUsername(savedUsername);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    // Input validation
    const usernameRegex = /^[a-zA-Z0-9\s]+$/;
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/

    if (!usernameRegex.test(username)) {
      setErrorMessage("Username must contain only alphabets.");
      setIsLoading(false);
      return;
    }
    if (!passwordRegex.test(password)) {
      setErrorMessage(
        "Password must contain at least 8 characters, including a letter, a number, and a special character."
      );
      setIsLoading(false);
      return;
    }

    try {
      // Save username to localStorage if remember me is checked
      if (rememberMe) {
        localStorage.setItem("rememberedUsername", username);
      } else {
        localStorage.removeItem("rememberedUsername");
      }

      // Make the API call to your backend
      const response = await axiosInstance.post("/auth/login", {
        username,
        password,
      },
    {
        headers: {
          "X-User-Location": location, 
        },
      }
    );
  
      console.log('API response:', response); 

      if (response.status === 200) {
      
      if (response && response.data && response.data.token) {

        const { token, passwordExpired, username, role} = response.data;

        // Save the token and username to localStorage
        sessionStorage.setItem('username', username); 
        sessionStorage.setItem("jwt_token", token); // Store JWT token
         sessionStorage.setItem("role", role); 
         sessionStorage.setItem("location", location);
         console.log("Role : ",role);
        if (passwordExpired) {
          alert('Please change your password!');
          navigate('/passwordChange');
        
      } else {
  try {
  const roleResponse = await axiosInstance.get(`/api/roles/byname/${role}`);
  if (roleResponse?.data?.id) {
    const roleId = roleResponse.data.id;
    sessionStorage.setItem("roleId", roleId); // ✅ REQUIRED
    console.log("Role ID:", roleId);

   await refreshMenus(); // make sure menus are loaded
    navigate("/homePage");
  } else {
    console.error("Role not found in response.");
    setErrorMessage("User role is not configured correctly. Please contact support.");
  }
} catch (roleError) {
  console.error("Error fetching roleId:", roleError);
  setErrorMessage("Error fetching role information.");
}
    }
  } else {
    console.error("Role not found or invalid response");
  }
      }
      else if(response.status === 401){
                setErrorMessage("Invalid username or password.");

      }
    }
    catch (error) {
      console.error("Login Error:", error); // Log the error to see more details
      if (error.response && error.response.status === 403) {
        // If password change is required
        alert('Please change your password!');
        navigate('/passwordChange');
      }
      else if (error.response && error.response.status === 401) {
        setErrorMessage("Invalid username or password.");
      } else {
        setErrorMessage("An error occurred. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      {/* <Header /> */}
      <div
        className={`${styles.loginContainer} ${fadeIn ? styles.fadeIn : ""}`}
      >
        <div className={styles.loginCard}>
          <div className={styles.header}>
            <h2 className={styles.title}>
              <img
                style={{ height: "30px", width: "30px", marginRight: "5px" }}
                src={AviationLogo}
                alt="Logo"
              ></img>
              Welcome To Aviation
            </h2>
          </div>

          <div className={styles.body}>
            <form onSubmit={handleLogin}>
            <div className={styles.formGroup}>
            <label htmlFor="location" className={styles.label}>Location</label>
            <select
              id="location"
              className={styles.formInput}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            >
            <option value="">-- Select Location --</option>
            <option value="mumbai">Mumbai</option>
            <option value="delhi">Delhi</option>
            </select>
            </div>
            
              <div className={styles.formGroup}>
                <label htmlFor="username" className={styles.label}>
                  Username
                </label>
                <div className={styles.inputGroup}>
                  <div className={styles.inputIcon}>
                    <User />
                  </div>
                  <input
                    type="text"
                    id="username"
                    className={styles.formInput}
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="password" className={styles.label}>
                  Password
                </label>
                <div className={styles.inputGroup}>
                  <div className={styles.inputIcon}>
                    <Lock />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className={styles.formInput}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <div
                    className={styles.passwordToggle}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </div>
                </div>
              </div>

              <div className={styles.formOptions}>
                <div className={styles.forgotPassword}>
                  <a href="#" className={styles.link}>
                    Forgot password?
                  </a>
                </div>
              </div>

              <button
                type="submit"
                className={`${styles.loginButton} ${
                  isLoading ? styles.buttonLoading : ""
                }`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className={styles.spinner}></span>
                    Login...
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </form>
            <div style={{ marginTop: "5px", alignContent: "center" }}>
              {errorMessage && (
                <div className={styles.errorMessage}>
                  <AlertCircle className={styles.errorIcon} />
                  <p>{errorMessage}</p>
                </div>
              )}
            </div>
            <div className={styles.signupOption}>
              <p>
                Don't have an account?{" "}
                <a href="#" className={styles.link}>
                  Sign up
                </a>
              </p>
            </div>

            <div className={styles.socialLogin}>
              <div className={styles.divider}>
                <span>Or continue with</span>
              </div>

              <div className={styles.socialButtons}>
                <button type="button" className={styles.socialButton}>
                  <svg
                    className={styles.socialIcon}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
                  </svg>
                </button>
                <button type="button" className={styles.socialButton}>
                  <svg
                    className={styles.socialIcon}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22.675 0H1.325C0.593 0 0 0.593 0 1.325v21.351C0 23.407 0.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463 0.099 2.795 0.143v3.24l-1.918 0.001c-1.504 0-1.795 0.715-1.795 1.763v2.313h3.587l-0.467 3.622h-3.12V24h6.116c0.73 0 1.323-0.593 1.323-1.325V1.325C24 0.593 23.407 0 22.675 0z" />
                  </svg>
                </button>
                <button type="button" className={styles.socialButton}>
                  <svg
                    className={styles.socialIcon}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.896-.959-2.173-1.559-3.591-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124C7.691 8.094 4.066 6.13 1.64 3.161c-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 14-7.503 14-14 0-.21 0-.42-.015-.63.961-.689 1.8-1.56 2.46-2.548l-.047-.02z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LoginPage;
