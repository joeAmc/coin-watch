import React from "react";
import { useDispatch } from "react-redux";
import { closeModal } from "../../state/modal/modalSlice";
import "./Modal.css";

const Modal = ({ amount, name, backgroundColor, onConfirm, action }) => {
  const dispatch = useDispatch();

  const cancelModalHandler = () => {
    dispatch(closeModal());
  };

  const addModalHandler = () => {
    onConfirm();
  };

  return (
    <>
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
      </div>
      <div className="modal-backdrop"></div>
    </>
  );
};

export default Modal;
