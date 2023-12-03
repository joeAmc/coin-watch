import React from "react";
import Nav from "../Components/Nav/Nav";
import Piechart from "../Components/Piechart/Piechart";
import useRequireAuth from "../Hooks/useRequireAuth";
import { RotatingLines } from "react-loader-spinner";

const Portfoglio = () => {
  const loggedIn = useRequireAuth();

  console.log("loggedIn: ", loggedIn);

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
    <>
      <div className="header-container">
        <h1>Split</h1>
      </div>
      <Piechart />
      <Nav />
    </>
  );
};

export default Portfoglio;
