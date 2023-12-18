import React from "react";
import { useState, useContext, useRef } from "react";
import "./AuthForm.css";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { RotatingLines } from "react-loader-spinner";
import { AuthContext } from "../../AuthContext";
import Alert from "../Alert/Alert";
import validator from "validator";

const Auth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const signUp = searchParams.get("mode") === "signup";
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertColor, setAlertColor] = useState("");
  const { setLoggedIn, setUserId } = useContext(AuthContext);
  const email = useRef();
  const password = useRef();

  const API_URL = process.env.REACT_APP_API;

  const checkUserExists = async () => {
    try {
      const response = await fetch(`${API_URL}/check-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      return data.exists;
    } catch (error) {
      console.error(`Failed to check user: ${error}`);
      setAlertMessage(`Failed to check user: ${error}`);
      setAlertColor("fail");
      setShowAlert(true);
      setLoading(false);
      return false;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const enteredEmail = email.current.value;
    const enteredPassword = password.current.value;

    if (!validator.isEmail(enteredEmail)) {
      setAlertMessage("Please enter a valid Email");
      setAlertColor("fail");
      setShowAlert(true);
      setLoading(false);
      return;
    }

    if (enteredPassword.length < 8) {
      setAlertMessage("Password must be at least 8 characters long");
      setAlertColor("fail");
      setShowAlert(true);
      setLoading(false);
      return;
    }

    if (signUp) {
      const userExists = await checkUserExists();
      if (userExists) {
        console.error("User already exists");
        setAlertMessage("User already exists");
        setAlertColor("fail");
        setLoading(false);
        setShowAlert(true);
        return;
      }
    }

    const newUserData = {
      email: enteredEmail,
      password: enteredPassword,
    };
    try {
      const endpoint = signUp ? `${API_URL}/signup` : `${API_URL}/login`;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUserData),
      });

      const json = await response.json();

      if (response.ok) {
        setLoggedIn(true);
        setUserId(json._id);
        navigate("/portfoglio");
        localStorage.setItem("pie-bit-user", JSON.stringify(json));
        localStorage.setItem("pie-bit-user-id", JSON.stringify(json._id));
      } else {
        console.error("Failed to sign up or log in");
        setAlertMessage(signUp ? "Failed to sign up" : "Failed to log in");
        setAlertColor("fail");
        setShowAlert(true);
      }
    } catch (error) {
      console.error(
        `${signUp ? "Failed to sign up" : "Failed to log in"}: ${error}`
      );
      setAlertMessage(
        `${signUp ? "Failed to sign up" : "Failed to log in"}: ${error}`
      );
      setAlertColor("fail");
      setShowAlert(true);
    }

    setLoading(false);
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  return (
    <>
      <div className="signup-container">
        {loading && (
          <>
            <div className="loader" data-testid="spinner">
              <RotatingLines
                strokeColor="var(--loader-color)"
                strokeWidth="5"
                animationDuration="1.3"
                width="96"
                visible={true}
              />
            </div>
            <div className="alert-backdrop"></div>
          </>
        )}
        <form onSubmit={handleSubmit}>
          <p>
            <label htmlFor="email">Email</label>
            <input id="email" type="email" name="email" ref={email} required />
          </p>
          <p>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              ref={password}
              required
            />
          </p>
          <div>
            <button type="submit">{signUp ? "Sign up" : "Log in"}</button>
          </div>

          <div className="signup-text">
            <h4>
              {signUp ? "Already have an account?" : "Don't have an account?"}
            </h4>
            <Link to={`?mode=${!signUp ? "signup" : "login"}`}>
              <h5>{signUp ? "Log in" : "Sign up"}</h5>
            </Link>
          </div>
        </form>
        {showAlert && (
          <Alert
            message={alertMessage}
            onClose={handleCloseAlert}
            color={alertColor}
          />
        )}
      </div>
    </>
  );
};

export default Auth;
