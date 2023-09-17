import React from "react";
import { useState, useEffect } from "react";
// import { Chart } from "react-google-charts";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";

const btc = "6,030";

const data = [
  { coin: "BTC", value: 6353 },
  { coin: "ETH", value: 3353 },
  { coin: "ADA", value: 1653 },
];

const size = {
  width: 400,
  height: 400,
};

export const options = {
  title: "My Cryptos",
};

const Piechart = () => {
  const API_SECRET = process.env.REACT_APP_API_SECRET;
  const API_ACCESS = process.env.REACT_APP_API_ACCESS;
  const [responseArray, setResponseArray] = useState([]);

  console.log("responseArray", responseArray);

  // console.log("price", `$${price}`);

  useEffect(() => {
    const fetchCoinData = async (coin) => {
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

        setResponseArray((prevResponseArray) => [
          ...prevResponseArray,
          { coin: coin, value: data.data.coin_price * 0.32 },
        ]);
      } catch (error) {
        console.error(`Error fetching data for ${coin}:`, error);
      }
    };

    const coins = ["BTC"];

    coins.forEach((coin) => {
      fetchCoinData(coin);
    });
  }, []);

  return (
    responseArray.length > 0 && (
      <PieChart
        series={[
          {
            arcLabel: (item) => `${item.coin} $${item.value}`,
            arcLabelMinAngle: 45,
            data: responseArray,
          },
        ]}
        sx={{
          [`& .${pieArcLabelClasses.root}`]: {
            fill: "white",
            fontWeight: "regular",
            fontSize: 16,
          },
        }}
        {...size}
      />
    )
  );
};

export default Piechart;
