import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../AuthContext";
import Modal from "../Modal/Modal";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import "./AddCryptoForm.css";
import * as R from "ramda";
import Alert from "../Alert/Alert";

const AddCryptoForm = () => {
  const [ticker, setTicker] = useState("");
  const [amount, setAmount] = useState("");
  const [name, setName] = useState("");

  const [loading, setLoading] = useState(false);
  const [coinData, setCoinData] = useState([]);
  const { showModal, setShowModal } = useContext(AuthContext);
  const [showAlert, setShowAlert] = useState(false);
  const [action, setAction] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertColor, setAlertColor] = useState("");

  const API_URL = process.env.REACT_APP_API;

  let storedUserID = localStorage.getItem("pie-bit-user-id");
  storedUserID = storedUserID ? R.replace(/^"|"$/g, "", storedUserID) : null;

  useEffect(() => {
    const fetchCoinIds = async () => {
      try {
        const requestOptions = {
          method: "GET",
          redirect: "follow",
        };

        const response = await fetch(
          `https://api.coincap.io/v2/assets`,
          requestOptions
        );

        if (!response.ok) {
          throw new Error(`Request failed with status: ${response.status}`);
        }
        const result = await response.json();

        const coinIdAndName = result.data.map((coin) => ({
          id: coin.id,
          name: coin.name,
        }));

        setCoinData(coinIdAndName);
      } catch (error) {
        console.error(`Error fetching coin ids:`, error);
      }
    };
    fetchCoinIds();
  }, []);

  const fetchTicker = async (event) => {
    event.preventDefault();
    setLoading(true);

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
      setAction("add");
    } catch (error) {
      console.error(`Error fetching data for ${name}:`, error);
    }
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
    console.log("event.target.value", name);
  };

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };

  const checkCryptoExists = async () => {
    try {
      const response = await fetch(`${API_URL}/check-crypto`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });
      const data = await response.json();
      return data.exists;
    } catch (error) {
      console.error(`Failed to check crypto: ${error}`);
      setAlertMessage(`Failed to check crypto: ${error}`);
      setAlertColor("fail");
      // setSuccess(false);
      setShowAlert(true);
      setLoading(false);
      return false;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    const newCryptoData = {
      ticker: ticker,
      name: name,
      amount: amount,
      user_id: storedUserID,
    };

    const cryptoExists = await checkCryptoExists();
    if (cryptoExists) {
      console.error("User already has added this crypto");
      setAlertMessage(`${name} already added`);
      setAlertColor("fail");
      setShowAlert(true);
      setLoading(false);
      return;
    }

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
        console.log(`${name} added successfully!`);
        setAlertMessage(`${name} added successfully!`);
        setAlertColor("success");
      } else {
        console.error("Failed to add crypto");
        setAlertColor("fail");
        setAlertMessage("Failed to add crypto");
      }
    } catch (error) {
      console.error(`Failed to add crypto" : ${error}`);
      setAlertColor("fail");
      setAlertMessage(`Failed to add crypto : ${error}`);
    }
    setShowAlert(true);
    setLoading(false);
  };

  const handleConfirmModal = async () => {
    await handleSubmit();
    setShowModal(false);
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  return (
    <div className="new-crypto-form-container">
      <form onSubmit={fetchTicker}>
        <div>
          <label htmlFor="cryptoName">Crypto Name</label>
          <Box>
            <FormControl sx={{ minWidth: "100%" }}>
              <Select
                id="cryptoName"
                value={name}
                onChange={handleNameChange}
                displayEmpty
                inputProps={{
                  sx: {
                    bgcolor: "#61759b",
                    color: "white",
                    textAlign: "start",
                    paddingTop: 1,
                    paddingBottom: 1,
                    "& .MuiSvgIcon-root": {
                      color: "white",
                      fill: "white",
                    },
                  },
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      bgcolor: "#253040",
                      color: "white",
                      "& .MuiMenuItem-root": {
                        padding: 2,
                      },
                    },
                  },
                }}
              >
                {coinData.map((coin, i) => (
                  <MenuItem key={coin.id} value={coin.id}>
                    {coin.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </div>
        <br />
        <div>
          <label htmlFor="amount">Amount</label>
          <input
            id="amount"
            type="text"
            value={amount}
            onChange={handleAmountChange}
            required
          />
        </div>
        <br />
        <button>Add Crypto</button>
      </form>
      {showModal && (
        <Modal
          name={name}
          amount={amount}
          action={action}
          onConfirm={handleConfirmModal}
        />
      )}
      {showAlert && (
        <Alert
          message={alertMessage}
          onClose={handleCloseAlert}
          color={alertColor}
        />
      )}
    </div>
  );
};

export default AddCryptoForm;
