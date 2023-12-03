import React from "react";
import { useState, useEffect } from "react";
import "./Piechart.css";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import * as R from "ramda";

const Piechart = () => {
  const [data, setData] = useState([]);
  const [coins, setCoins] = useState([]);
  const [userCoinAmounts, setUserCoinAmounts] = useState([]);
  const API_URL = process.env.REACT_APP_API;

  useEffect(() => {
    let storedUserID = localStorage.getItem("pie-bit-user-id");
    storedUserID = R.replace(/^"|"$/g, "", storedUserID);
    if (storedUserID) {
      getCoins(storedUserID);
    }
  }, []);

  const getCoins = (userid) => {
    fetch(`${API_URL}/coins/${userid}`)
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
  };

  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  const customTooltipFormatter = (params) => {
    const value = parseFloat(params.value) || 0;
    const formattedValue = currencyFormatter.format(value);
    return formattedValue;
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
          sx={{
            [`& .${pieArcLabelClasses.root}`]: {
              fill: "white",
              fontWeight: "regular",
              fontSize: 12,
              fontFamily: "'Fira Sans', sans-serif",
            },
            "& .MuiPieArc-root": {
              stroke: "white",
            },
          }}
          {...sizing}
        />
      </div>
      <div className="total-value">
        <h4>Total Value: {currencyFormatter.format(totalPortfolioValue)}</h4>
      </div>
    </>
  );
};

export default Piechart;
