import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../AuthContext";
import Modal from "../Modal/Modal";
import { useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import "./AddCryptoForm.css";
import * as R from "ramda";

const AddCryptoForm = () => {
  const [ticker, setTicker] = useState("");
  const [amount, setAmount] = useState("");
  const [name, setName] = useState("");

  const [loading, setLoading] = useState(false);
  const [coinData, setCoinData] = useState([]);
  const { showModal, setShowModal, userId } = useContext(AuthContext);
  const [action, setAction] = useState("");

  const API_SECRET = process.env.REACT_APP_API_SECRET;
  const API_ACCESS = process.env.REACT_APP_API_ACCESS;
  const API_URL = process.env.REACT_APP_API;

  let storedUserID = localStorage.getItem("pie-bit-user-id");
  storedUserID = R.replace(/^"|"$/g, "", storedUserID);

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

  const handleSubmit = async () => {
    // event.preventDefault();
    setLoading(true);

    const newCryptoData = {
      ticker: ticker,
      name: name,
      amount: amount,
      user_id: storedUserID,
    };

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
    await handleSubmit();
    setShowModal(false);
  };

  return (
    <div className="new-crypto-form-container">
      <form onSubmit={fetchTicker}>
        <p>
          <label>Crypto Name</label>
          <Box>
            <FormControl sx={{ minWidth: "100%" }}>
              <Select
                // value={age}
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
                {/* <MenuItem value="">
                  <em>None</em>
                </MenuItem> */}
                {coinData.map((coin) => (
                  <MenuItem value={coin.id}>{coin.name}</MenuItem>
                ))}
              </Select>
              {/* <FormHelperText>Without label</FormHelperText> */}
            </FormControl>
          </Box>
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
        <Modal
          name={name}
          amount={amount}
          action={action}
          onConfirm={handleConfirmModal}
        />
      )}
    </div>
  );
};

export default AddCryptoForm;
