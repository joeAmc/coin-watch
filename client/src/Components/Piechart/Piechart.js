import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./Piechart.css";
// import { Chart } from "react-google-charts";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";

const btc = "6,030";

const data = [
  { coin: "BTC", value: 6353, label: "BTC" },
  { coin: "ETH", value: 3353, label: "ETH" },
  { coin: "ADA", value: 1653, label: "ADA" },
];

export const options = {
  title: "My Cryptos",
};

const Piechart = () => {
  const API_SECRET = process.env.REACT_APP_API_SECRET;
  const API_ACCESS = process.env.REACT_APP_API_ACCESS;
  const [responseArray, setResponseArray] = useState([]);
  const removeDups = [...new Set(responseArray)];
  const [coins, setCoins] = useState([]);
  const { userId } = useParams();

  const API_URL = process.env.REACT_APP_API;

  console.log("responseArray", responseArray);
  console.log("removeDups", removeDups);

  useEffect(() => {
    getCoins();
  }, []);

  const getCoins = () => {
    // fetch(`http://localhost:4000/coins/${userId}`);
    fetch(`http://localhost:4000/coins/64fe34f8ab51f404081a1b6a`)
      .then((res) => res.json())
      .then((data) => {
        console.log("coinData", data);
        setCoins(data);
      })
      .catch((err) => console.log("Error: ", err));
  };

  useEffect(() => {
    const fetchCoinData = async (coin) => {
      // if (responseArray.forEach((item) => item.coin !== coin)) {
      try {
        const myHeaders = new Headers();
        myHeaders.append("QC-Access-Key", API_ACCESS);
        myHeaders.append("QC-Secret-Key", API_SECRET);

        const requestOptions = {
          method: "GET",
          headers: myHeaders,
          redirect: "follow",
        };

        const response = await fetch(
          `https://quantifycrypto.com/api/v1/coins/${coin}`,
          requestOptions
        );

        if (!response.ok) {
          throw new Error(`Request failed with status: ${response.status}`);
        }

        const data = await response.json();
        console.log("data", data);

        setResponseArray((prevResponseArray) => [
          ...prevResponseArray,
          { coin: coin, value: data.data.coin_price, label: coin },
        ]);
      } catch (error) {
        console.error(`Error fetching data for ${coin}:`, error);
      }
    };
    // };

    const coins = ["BTC", "ETH"];

    coins.forEach((coin) => {
      fetchCoinData(coin);
    });
  }, []);

  return (
    <PieChart
      series={[
        {
          arcLabel: (item) => `${item.coin}`,
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
