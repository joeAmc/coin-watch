import React from "react";
import { useEffect, useContext, useState } from "react";
import { AuthContext } from "../../AuthContext";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const CryptoTable = () => {
  const API_URL = process.env.REACT_APP_API;
  const [coins, setCoins] = useState([]);
  const { userId } = useContext(AuthContext);
  console.log("API_URL", `${API_URL}/coins/${userId}`);

  useEffect(() => {
    getCoins();
  }, []);

  const getCoins = () => {
    // fetch(`${API_URL}/coins/${userId}`);
    fetch(`${API_URL}/coins/65285e63aa3062a5429f4956`)
      .then((res) => res.json())
      .then((data) => {
        setCoins(data);
      })
      .catch((err) => console.log("Error: ", err));
  };
  console.log("userId", userId);
  console.log("coins", coins);
  function createData(name, ticker, amount, carbs, protein) {
    return { name, ticker, amount, carbs, protein };
  }

  const rows = coins.map((coin) => {
    return createData(coin.name, coin.ticker, coin.amount);
  });

  console.log("rows", rows);
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Ticker</TableCell>
            <TableCell align="right">Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.name}
              checkboxSelection
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.ticker}</TableCell>
              <TableCell align="right">{row.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CryptoTable;
