import React from "react";
import { useContext } from "react";
import { AuthContext } from "../../AuthContext";
import "./Modal.css";

const Modal = ({ amount, name, backgroundColor, onConfirm, action }) => {
  const { showModal, setShowModal } = useContext(AuthContext);

  const cancelModalHandler = () => {
    setShowModal(false);
  };

  const addModalHandler = () => {
    onConfirm(); // Call the parent's callback function
  };

  return (
    <>
      {/* <div className={`modal ${backgroundColor}`}> */}
      <div className={`modal success`}>
        <div className="modal-info">
          <p>
            {action === "update" || action === "add"
              ? `Confirm ${amount} units of ${name}?`
              : `Are you sure you want to delete ${amount} units of ${name}?`}
          </p>
        </div>
        <div className="modal-btns">
          <button className="btn-secondary" onClick={cancelModalHandler}>
            Cancel
          </button>
          <button onClick={addModalHandler}>Confirm</button>
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
