import React from "react";
import Nav from "../Components/Nav/Nav";
// import CryptoTable from "../Components/CryptoTable/CryptoTable";
import Table from "../Components/Table/Table";

const UpdateCrypto = () => {
  return (
    <div>
      <h1>Portfoglio</h1>
      {/* <CryptoTable /> */}
      <Table />
      <Nav />
    </div>
  );
};

export default UpdateCrypto;
