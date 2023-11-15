import React from "react";
import AddCryptoForm from "../Components/AddCryptoForm/AddCryptoForm";
import Nav from "../Components/Nav/Nav";
import useRequireAuth from "../Hooks/useRequireAuth";
import { Bars } from "react-loader-spinner";

const AddCrypto = () => {
  const loggedIn = useRequireAuth();

  if (!loggedIn) {
    return (
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
    );
  }

  return (
    <div>
      <h1>Add Crypto</h1>
      <AddCryptoForm />
      <Nav />
    </div>
  );
};

export default AddCrypto;
