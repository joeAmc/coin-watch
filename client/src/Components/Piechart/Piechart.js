import React from "react";
import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import "./Piechart.css";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import { AuthContext } from "../../AuthContext";
import { createTheme, ThemeProvider } from "@mui/material";

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

  const totalSum = data.reduce((sum, item) => sum + parseFloat(item.value), 0);

  const getArcLabel = (params) => {
    const percent = params.value / totalSum;
    return `${params.label} ${(percent * 100).toFixed(0)}%`;
  };

  const sizing = {
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    width: 280,
    height: 275,
    // legend: { hidden: true },
  };

  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  const customTooltipFormatter = (params) => {
    const value = parseFloat(params.value) || 0;
    const formattedValue = currencyFormatter.format(value);
    return `${params.label}: ${formattedValue}`;
  };

  const totalPortfolioValue = data.reduce(
    (sum, item) => sum + parseFloat(item.value),
    0
  );

  return (
    <>
      <div
        className="piechart-container"
        style={{
          position: "absolute",
          top: "45%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <PieChart
          slotProps={{
            legend: {
              direction: "row",
              // position: { vertical: "top", horizontal: "middle" },
              padding: 0,
            },
          }}
          className="custom-pie-chart"
          series={[
            {
              arcLabel: getArcLabel,
              arcLabelMinAngle: 30,
              paddingAngle: 3,
              innerRadius: 8,
              data,
              highlightScope: { faded: "global", highlighted: "item" },
              faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
              valueFormatter: customTooltipFormatter,
            },
          ]}
          // tooltip={{
          //   valueFormatter: customTooltipFormatter,
          // }}
          sx={{
            [`& .${pieArcLabelClasses.root}`]: {
              fill: "white",
              fontWeight: "regular",
              fontSize: 16,
              fontFamily: "'Fira Sans', sans-serif",
            },
          }}
          {...sizing}
        />
      </div>
      <h4 className="total-value">
        Total Value: {currencyFormatter.format(totalPortfolioValue)}
      </h4>
    </>
  );
};

export default Piechart;
