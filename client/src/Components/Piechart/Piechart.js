import React from "react";
import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import "./Piechart.css";
// import { Chart } from "react-google-charts";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import { AuthContext } from "../../AuthContext";
import { createTheme, ThemeProvider } from "@mui/material";

// export const options = {
//   title: "My Cryptos",
// };

const Piechart = () => {
  const API_SECRET = process.env.REACT_APP_API_SECRET;
  const API_ACCESS = process.env.REACT_APP_API_ACCESS;
  const [data, setData] = useState([]);
  const [coins, setCoins] = useState([]);
  const [userCoinAmounts, setUserCoinAmounts] = useState([]);
  const { userId } = useContext(AuthContext);
  const API_URL = process.env.REACT_APP_API;

  useEffect(() => {
    getCoins();
  }, []);

  const getCoins = () => {
    fetch(`http://localhost:4000/coins/${userId}`)
      // fetch(`http://localhost:4000/coins/6550aef4bff6ff1f42769fbd`)
      .then((res) => res.json())
      .then((data) => {
        const userCoins = data.map((coin) => coin.name.toLowerCase());
        setCoins(userCoins);
        const coinAmounts = data.map((coin) => ({
          [coin.name.toLowerCase()]: coin.amount,
        }));
        setUserCoinAmounts(coinAmounts);
      })
      .catch((err) => console.log("Error: ", err));
  };

  useEffect(() => {
    const fetchCoinData = async (coin) => {
      // if (responseArray.forEach((item) => item.coin !== coin)) {
      try {
        const requestOptions = {
          method: "GET",
          redirect: "follow",
        };

        const response = await fetch(
          `https://api.coincap.io/v2/assets/${coin}`,
          requestOptions
        );

        if (!response.ok) {
          throw new Error(`Request failed with status: ${response.status}`);
        }

        const result = await response.json();
        console.log("userCoinAmounts", userCoinAmounts[0]);

        setData((prevResponseArray) => {
          const updatedArray = prevResponseArray.filter(
            (item) => item.coin !== result.data.symbol
          );

          const coinValue = userCoinAmounts.find(
            (userCoin) => userCoin[coin.toLowerCase()]
          );

          return [
            ...updatedArray,
            {
              coin: result.data.symbol,
              value: `${result.data.priceUsd * coinValue[coin.toLowerCase()]}`,
              label: `${result.data.symbol}`,
            },
          ];
        });
      } catch (error) {
        console.error(`Error fetching data for ${coin}:`, error);
      }
    };

    coins.forEach((coin) => {
      fetchCoinData(coin);
    });
  }, [coins]);

  // Step 1: Calculate the total sum of all values
  const totalSum = data.reduce((sum, item) => sum + parseFloat(item.value), 0);

  // Step 2: Calculate the percentage for each value
  const dataWithPercentage = data.map((item) => ({
    ...item,
    percentage: (item.value / totalSum) * 100,
  }));

  console.log(dataWithPercentage);

  // const getArcLabel = (params) => {
  //   const percent = params.value / TOTAL;
  //   console.log("params.value", params.value);
  //   return `${(percent * 100).toFixed(0)}%`;
  // };

  const getArcLabel = (params) => {
    const percent = params.value / totalSum;
    console.log("percent", percent);
    return `${params.label} ${(percent * 100).toFixed(0)}%`;
  };

  return (
    <PieChart
      series={[
        {
          arcLabel: getArcLabel,
          data,
        },
      ]}
      sx={{
        [`& .${pieArcLabelClasses.root}`]: {
          fill: "white",
          fontWeight: "regular",
          fontSize: 16,
        },
      }}
      width={400}
      height={250}
    />
  );
};

export default Piechart;
