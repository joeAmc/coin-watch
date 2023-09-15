import React from "react";
import { useState, useEffect } from "react";

const Piechart = () => {
  const API_SECRET = process.env.REACT_APP_API_SECRET;
  const API_ACCESS = process.env.REACT_APP_API_ACCESS;
  const [price, setPrice] = useState(null);

  console.log("price", `$${price}`);
  useEffect(() => {
    const fetchData = async () => {
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
          "https://quantifycrypto.com/api/v1/coins/btc",
          requestOptions
        );

        if (!response.ok) {
          throw new Error(`Request failed with status: ${response.status}`);
        }

        const data = await response.json();

        setPrice(data.data.coin_price);
      } catch (error) {
        console.error("error", error);
      }
    };

    fetchData();
  }, []);

  return <div>Piechart</div>;
};

export default Piechart;
