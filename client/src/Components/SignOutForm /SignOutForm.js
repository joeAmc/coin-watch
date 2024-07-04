import React from "react";
import "./SignOutForm.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLoggedOut } from "../../state/authStatus/authStatusSlice";

const SignOutForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const signOutHandler = () => {
    localStorage.removeItem("pie-bit-user");
    dispatch(setLoggedOut());
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
