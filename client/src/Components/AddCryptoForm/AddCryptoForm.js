import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const AddCryptoForm = () => {
  const [ticker, setTicker] = useState("");
  const [amount, setAmount] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const { userId } = useParams();

  const API_SECRET = process.env.REACT_APP_API_SECRET;
  const API_ACCESS = process.env.REACT_APP_API_ACCESS;
  const API_URL = process.env.REACT_APP_API;

  console.log("name", name);
  console.log("ticker", ticker);
  console.log("amount", amount);
  console.log("amount", amount);

  useEffect(() => {
    let retryDelay = 5000; // Initial delay of 5 seconds

    const fetchCoinData = async () => {
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
          `https://quantifycrypto.com/api/v1/coins/${ticker}`,
          requestOptions
        );

        if (!response.ok) {
          throw new Error(`Request failed with status: ${response.status}`);
        }

        const data = await response.json();
        setName(data.data.coin_name);
      } catch (error) {
        console.error(`Error fetching data for ${ticker}:`, error);
      }
    };
    if (ticker) {
      fetchCoinData();
    }
  }, [ticker]);

  const handleTickerChange = (event) => {
    setTicker(event.target.value);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const newCryptoData = {
      ticker: ticker,
      name: name,
      amount: amount,
      user_id: userId,
    };

    console.log("newCryptoData", newCryptoData);

    try {
      const response = await fetch(`${API_URL}/coin/new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCryptoData),
      });

      if (response.ok) {
        console.log("New crypto added successfully!");
        // setAlertMessage("New crypto added!");
        // setAlertClass("success");
      } else {
        console.error("Failed to add crypto");
        // setAlertMessage("Failed to add crypto");
        // setAlertClass("fail");
      }
    } catch (error) {
      console.error(`Failed to add crypto" : ${error}`);
      //   setAlertMessage(`Failed to add crypto : ${error}`);
      //   setAlertClass("fail");
    }
    // setShowAlert(true);
    setLoading(false);
  };

  return (
    <div className="new-crypto-form-container">
      <h1>Add Crypto</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Ticker
          <input
            type="text"
            value={ticker}
            onChange={handleTickerChange}
            required
          />
        </label>
        <br />
        <label>
          Name
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            required
          />
        </label>
        <br />
        <label>
          Amount
          <input
            type="text"
            value={amount}
            onChange={handleAmountChange}
            required
          />
        </label>
        <br />
        <button type="submit">Add Crypto</button>
      </form>
    </div>
  );
};

export default AddCryptoForm;
