import React from "react";
import { useState, useContext } from "react";
import "./SignOutForm.css";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
// import AuthAlert from "../AuthAlert/AuthAlert";

const SignOutForm = () => {
  return (
    <>
      <div className="signout-container">
        <div>
          <button type="submit">Sign out</button>
          <button type="submit">Go back</button>
        </div>
      </div>
    </>
  );
};

export default SignOutForm;
