import React from "react";
import { useState, useContext } from "react";
import "./SignOutForm.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext";

const SignOutForm = () => {
  const navigate = useNavigate();
  const { setLoggedIn } = useContext(AuthContext);

  const signOutHandler = () => {
    localStorage.removeItem("pie-bit-user");
    setLoggedIn(false);
  };

  const cancelSignOutHandler = () => {
    navigate("/portfoglio");
  };
  return (
    <>
      <div className="signout-container">
        <div className="signout-btns">
          <button onClick={signOutHandler}>Sign out</button>
          <button className="btn-secondary" onClick={cancelSignOutHandler}>
            Go back
          </button>
        </div>
      </div>
    </>
  );
};

export default SignOutForm;
