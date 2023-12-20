import React from "react";
import { useEffect, useContext, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import { createTheme, ThemeProvider } from "@mui/material";
import { GridRowModes, DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import { AuthContext } from "../../AuthContext";
import Modal from "../Modal/Modal";
import { gridStyles } from "./gridStyles";
import * as R from "ramda";
import "./Table.css";

const Table = () => {
  const API_URL = process.env.REACT_APP_API;
  const [coins, setCoins] = useState([]);
  const [hasCoins, setHasCoins] = useState(false);
  const [rowModesModel, setRowModesModel] = useState({});
  const [newAmount, setNewAmount] = useState("");
  const { showModal, setShowModal } = useContext(AuthContext);
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [action, setAction] = useState("");
  const [initialRows, setInitialRows] = useState([]);

  useEffect(() => {
    let storedUserID = localStorage.getItem("pie-bit-user-id");
    storedUserID = R.replace(/^"|"$/g, "", storedUserID);
    if (storedUserID) {
      getCoins(storedUserID);
    }
  }, []);

  const getCoins = (userId) => {
    fetch(`${API_URL}/coins/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("data: ", data);
        setCoins(data);
        console.log("coins: ", coins);

        if (!data.length) {
          setHasCoins(false);
        } else {
          setHasCoins(true);
          const newInitialRows = data.map((coin) => {
            return createData(coin._id, coin.name, coin.ticker, coin.amount);
          });
          setInitialRows(newInitialRows);
        }
      })
      .catch((err) => console.log("Error: ", err));
  };

  const createData = (id, name, ticker, amount) => {
    return { id, name, ticker, amount };
  };

  const myTheme = createTheme({
    palette: {
      mode: "dark",
    },
    components: {
      MuiDataGrid: {
        styleOverrides: {
          row: {
            "&.textPrimary": {
              color: "purple",
            },
          },
        },
      },
    },
  });

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    setAction("update");
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
  };

  const handleModalSubmit = async () => {
    if (action === "delete") {
      await handleDeleteSubmit(id);
      setShowModal(false);
    } else if (action === "update") {
      await handleUpdateSubmit();
      setShowModal(false);
    }
  };

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow };
    setNewAmount(updatedRow.amount);
    setShowModal(true);
    setName(updatedRow.name);
    setId(updatedRow.id);
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const handleUpdateSubmit = async () => {
    try {
      const response = await fetch(`${API_URL}/coin/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: newAmount }),
      });

      if (response.ok) {
      } else {
        console.error("Failed to update coin amount");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDeleteClick = (id) => () => {
    const coinToDelete = coins.find((coin) => coin._id === id);
    if (coinToDelete) {
      const { name, amount } = coinToDelete;
      setName(name);
      setNewAmount(amount);
      setShowModal(true);
      setAction("delete");
      setId(id);
    }
  };

  const handleDeleteSubmit = async (id) => {
    try {
      const response = await fetch(`${API_URL}/coin/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: newAmount }),
      });

      if (response.ok) {
        const updatedCoins = coins.filter((coin) => coin._id !== id);
        setCoins(updatedCoins);
        setRowModesModel((prevRowModesModel) => ({
          ...prevRowModesModel,
          [id]: { mode: GridRowModes.View },
        }));
        const updatedRows = initialRows.filter((row) => row.id !== id);
        setInitialRows(updatedRows);
      } else {
        console.error("Failed to delete coin amount");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const columns = [
    { field: "id", headerName: "Id" },
    {
      field: "name",
      headerName: "Crypto",
      flex: 1,
      headerAlign: "left",
      align: "left",
    },
    {
      field: "amount",
      headerName: "Units",
      headerAlign: "left",
      type: "number",
      flex: 0.9,
      editable: true,
      align: "left",
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Edit",
      headerAlign: "center",
      align: "center",
      flex: 1,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: "#6ece95",
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="#6ece95"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="#6ece95"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="#6ece95"
          />,
        ];
      },
    },
  ];

  return (
    <div className="table-container">
      {!hasCoins ? (
        <h3 className="no-coins">Add some coins to edit</h3>
      ) : (
        <ThemeProvider theme={myTheme}>
          <div
            className="crpt-table"
            style={{
              width: "90%",
              maxWidth: "659px",
              boxShadow: "0 0 25px rgba(122, 215, 138, 0.35)",
              backgroundColor: "#131922",
            }}
          >
            <DataGrid
              initialState={{
                columns: {
                  columnVisibilityModel: {
                    id: false,
                  },
                },
              }}
              rows={initialRows}
              columns={columns}
              editMode="row"
              rowModesModel={rowModesModel}
              onRowModesModelChange={handleRowModesModelChange}
              processRowUpdate={processRowUpdate}
              sx={{ ...gridStyles }}
              disableColumnMenu
              hideFooter
            />
          </div>
          {showModal && (
            <Modal
              name={name}
              amount={newAmount}
              onConfirm={handleModalSubmit}
              action={action}
            />
          )}
        </ThemeProvider>
      )}
    </div>
  );
};

export default Table;
