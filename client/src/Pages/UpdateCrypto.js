import React from "react";
import Nav from "../Components/Nav/Nav";
import CryptoTable from "../Components/CryptoTable/CryptoTable";
import FullCrud from "../Components/FullCrud/FullCrud";

const UpdateCrypto = () => {
  return (
    <div>
      <h1>UpdateCrypto</h1>
      {/* <CryptoTable /> */}
      <FullCrud />
      <Nav />
    </div>
  );
};

export default UpdateCrypto;
