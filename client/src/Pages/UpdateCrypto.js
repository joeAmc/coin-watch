import React from "react";
import Nav from "../Components/Nav/Nav";
import Table from "../Components/Table/Table";
import useRequireAuth from "../Hooks/useRequireAuth";
import { Bars } from "react-loader-spinner";

const UpdateCrypto = () => {
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
      <h1>Edit</h1>
      <Table />
      <Nav />
    </div>
  );
};

export default UpdateCrypto;
