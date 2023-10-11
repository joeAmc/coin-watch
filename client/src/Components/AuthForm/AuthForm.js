import React from "react";
import { useState, useContext } from "react";
import "./AuthForm.css";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { Bars } from "react-loader-spinner";
// import AuthAlert from "../AuthAlert/AuthAlert";
import { AuthContext } from "../../AuthContext";

const Auth = () => {
  const navigate = useNavigate();
  //   const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const signUp = searchParams.get("mode") === "signup";
  const [alertMessage, setAlertMessage] = useState("");
  const [alertClass, setAlertClass] = useState("x");
  const [success, setSuccess] = useState();
  const {
    setLoggedIn,
    showAlert,
    setShowAlert,
    setUserId,
    userId,
  } = useContext(AuthContext);

  console.log("Auth userId: ", userId);

  const API_URL = process.env.REACT_APP_API;

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

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
      setAlertClass("fail");
      setSuccess(false);
      setShowAlert(true);
      setLoading(false);
      return false;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    console.log("submitting");

    if (password.length < 8) {
      setAlertMessage("Password must be at least 8 characters long");
      setAlertClass("fail");
      setSuccess(false);
      setShowAlert(true);
      setLoading(false);
      return;
    }

    if (signUp) {
      const userExists = await checkUserExists();
      if (userExists) {
        console.error("Username or email already exists");
        setAlertMessage("Username or email already exists");
        setAlertClass("fail");
        setSuccess(false);
        // setShowAlert(true);
        setLoading(false);
        return;
      }
    }

    const newUserData = {
      email: email,
      password: password,
    };
    console.log("API", `${API_URL}/signup`);

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
        if (signUp) {
          console.log("New user added successfully!");
          setAlertMessage("Welcome to Vibe Check!");
          setAlertClass("success");
          setSuccess(true);
          setLoggedIn(true);
        } else {
          console.log("Logged in successfully!");
          setLoggedIn(true);
        }
        console.log(json._id, "......../ HHe!");
        setUserId(json._id);
        navigate("/add");
        localStorage.setItem("pie-bit-user", JSON.stringify(json));
      } else {
        console.error("Failed to sign up or log in");
        setAlertMessage(signUp ? "Failed to sign up" : "Failed to log in");
        setAlertClass("fail");
        setSuccess(false);
      }
    } catch (error) {
      console.error(
        `${signUp ? "Failed to sign up" : "Failed to log in"}: ${error}`
      );
      setAlertMessage(
        `${signUp ? "Failed to sign up" : "Failed to log in"}: ${error}`
      );
      setAlertClass("fail");
      setSuccess(false);
    }

    // setShowAlert(true);
    setLoading(false);
  };

  return (
    <>
      <div className="signup-container">
        {loading && (
          <>
            <div className="loader">
              <Bars
                height="80"
                width="80"
                radius="9"
                color="var(--primary)"
                ariaLabel="bars-loading"
                wrapperStyle
                wrapperClass
              />
            </div>
            <div className="alert-backdrop"></div>
          </>
        )}
        <form onSubmit={handleSubmit}>
          <p>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              onChange={handleEmailChange}
              required
            />
          </p>
          <p>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              onChange={handlePasswordChange}
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
      </div>
    </>
  );
};

export default Auth;
