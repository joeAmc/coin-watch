import React from "react";
import "./Alert.css";
import { AiFillCloseCircle } from "react-icons/ai";

const Alert = ({ message, onClose, color }) => {
  const closeAlertHandler = () => {
    onClose();
  };

  return (
    <>
      <div className={`alert`}>
        <div className={`alert-info ${color}`}>
          <p>{message}</p>
          <AiFillCloseCircle onClick={closeAlertHandler} />
        </div>
      </div>
    </>
  );
};

export default Alert;
