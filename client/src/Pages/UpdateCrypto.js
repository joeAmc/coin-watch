import React from "react";
import Nav from "../Components/Nav/Nav";
import Table from "../Components/Table/Table";
import useRequireAuth from "../Hooks/useRequireAuth";
import { RotatingLines } from "react-loader-spinner";

const UpdateCrypto = () => {
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
    <div>
      <div className="header-container">
        <h1>Edit</h1>
      </div>
      <Table />
      <Nav />
    </div>
  );
};

export default UpdateCrypto;
