import React from "react";
import AddCryptoForm from "../Components/AddCryptoForm/AddCryptoForm";
import Nav from "../Components/Nav/Nav";
import useRequireAuth from "../Hooks/useRequireAuth";
import { RotatingLines } from "react-loader-spinner";

const AddCrypto = () => {
  const loggedIn = useRequireAuth();

  if (!loggedIn) {
    return (
      <div className="loader">
        <RotatingLines
          strokeColor="var(--loader-color)"
          strokeWidth="5"
          animationDuration="1.3"
          width="96"
          visible={true}
        />
      </div>
    );
  }

  return (
    <div className="">
      <div className="header-container">
        <h1>Add Crypto</h1>
      </div>
      <AddCryptoForm />
      <Nav />
    </div>
  );
};

export default AddCrypto;
