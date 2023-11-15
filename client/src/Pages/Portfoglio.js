import React from "react";
import Nav from "../Components/Nav/Nav";
import Piechart from "../Components/Piechart/Piechart";
import useRequireAuth from "../Hooks/useRequireAuth";
import { Bars } from "react-loader-spinner";

const Portfoglio = () => {
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
    <>
      <h1>Split</h1>
      <Piechart />
      <Nav />
    </>
  );
};

export default Portfoglio;
