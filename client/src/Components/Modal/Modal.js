import React from "react";
import { useContext } from "react";
import { AuthContext } from "../../AuthContext";
import { useNavigate } from "react-router-dom";
import "./Modal.css";

const Modal = ({ amount, name, backgroundColor, onConfirm, action }) => {
  const navigate = useNavigate();
  const { showModal, setShowModal } = useContext(AuthContext);

  const cancelModalHandler = () => {
    setShowModal(false);
    console.log("cancelModalHandler");
  };

  const addModalHandler = () => {
    console.log("confirming!");
    onConfirm(); // Call the parent's callback function
    // navigate(`/add`);
  };

  console.log("amount", amount);
  console.log("name", name);

  return (
    <>
      {/* <div className={`modal ${backgroundColor}`}> */}
      <div className={`modal success`}>
        <div className="modal-info">
          <p>
            {action === "update"
              ? `Confirm ${amount} units of ${name}?`
              : `Are you sure you want to delete ${amount} units of ${name}?`}
          </p>
        </div>
        <div className="modal-btns">
          <button className="modal-close-btn" onClick={cancelModalHandler}>
            Cancel
          </button>
          <button className="modal-add-btn" onClick={addModalHandler}>
            Confirm
          </button>
        </div>
        {/* <div className="modal-alert" onClick={closeAlertHandler}>
          <RxCrossCircled />
        </div> */}
      </div>
      <div className="modal-backdrop"></div>
    </>
  );
};

export default Modal;
