import React, { useState, useContext } from "react";
import { AuthContext } from "../../AuthContext";
import Modal from "../Modal/Modal";
import { useParams } from "react-router-dom";

const AddCryptoForm = () => {
  const [ticker, setTicker] = useState("");
  const [amount, setAmount] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  // const { user } = useParams();
  const { showModal, setShowModal, userId } = useContext(AuthContext);

  const API_SECRET = process.env.REACT_APP_API_SECRET;
  const API_ACCESS = process.env.REACT_APP_API_ACCESS;
  const API_URL = process.env.REACT_APP_API;
  console.log("Add userId: ", userId);

  const fetchTicker = async (event) => {
    event.preventDefault();
    // setLoading(true);

    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      };

      const response = await fetch(
        `https://api.coincap.io/v2/assets/${name}`,
        requestOptions
      );

      if (!response.ok) {
        throw new Error(`Request failed with status: ${response.status}`);
      }

      const result = await response.json();
      setTicker(result.data.symbol);
      setShowModal(true);
    } catch (error) {
      console.error(`Error fetching data for ${name}:`, error);
    }
  };

  // const fetchName = async (event) => {
  //   event.preventDefault();
  //   // setLoading(true);

  //   try {
  //     const myHeaders = new Headers();
  //     myHeaders.append("QC-Access-Key", API_ACCESS);
  //     myHeaders.append("QC-Secret-Key", API_SECRET);

  //     const requestOptions = {
  //       method: "GET",
  //       headers: myHeaders,
  //       redirect: "follow",
  //     };

  //     const response = await fetch(
  //       `https://quantifycrypto.com/api/v1/coins/${ticker}`,
  //       requestOptions
  //     );

  //     if (!response.ok) {
  //       throw new Error(`Request failed with status: ${response.status}`);
  //     }

  //     const data = await response.json();
  //     setName(data.data.coin_name);
  //     setShowModal(true);
  //   } catch (error) {
  //     console.error(`Error fetching data for ${ticker}:`, error);
  //   }
  // };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };

  const handleSubmit = async () => {
    // event.preventDefault();
    setLoading(true);

    const newCryptoData = {
      ticker: ticker,
      name: name,
      amount: amount,
      user_id: userId,
    };

    console.log("newCryptoData: ", newCryptoData);

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

  const handleConfirmModal = async () => {
    // Call the handleSubmit function when the modal's Confirm button is clicked
    await handleSubmit();
    // Close the modal after handling the submission
    setShowModal(false);
  };

  return (
    <div className="new-crypto-form-container">
      <h1>Add Crypto</h1>
      <form onSubmit={fetchTicker}>
        <p>
          <label>Crypto Name</label>
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            required
            placeholder="Bitcoin"
          />
        </p>

        <br />
        <p>
          <label>Amount</label>
          <input
            type="text"
            value={amount}
            onChange={handleAmountChange}
            required
          />
        </p>
        <br />
        <button>Add Crypto</button>
      </form>
      {showModal && (
        <Modal name={name} amount={amount} onConfirm={handleConfirmModal} />
      )}
    </div>
  );
};

export default AddCryptoForm;
