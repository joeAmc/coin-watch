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

const Table = () => {
  const API_URL = process.env.REACT_APP_API;
  const [coins, setCoins] = useState([]);
  const [rowModesModel, setRowModesModel] = React.useState({});
  const [newAmount, setNewAmount] = useState("");
  const { userId, showModal, setShowModal } = useContext(AuthContext);
  const [id, setId] = useState("");
  // const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    getCoins();
  }, []);

  console.log("coins", coins);

  const getCoins = () => {
    // fetch(`${API_URL}/coins/${userId}`)
    fetch(`${API_URL}/coins/65285e63aa3062a5429f4956`)
      .then((res) => res.json())
      .then((data) => {
        setCoins(data);
      })
      .catch((err) => console.log("Error: ", err));
  };

  const createData = (id, name, ticker, amount) => {
    return { id, name, ticker, amount };
  };

  const initialRows = coins.map((coin) => {
    return createData(coin._id, coin.name, coin.ticker, coin.amount);
  });
  const [rows, setRows] = useState([initialRows]);

  const myTheme = createTheme({
    components: {
      MuiDataGrid: {
        styleOverrides: {
          row: {
            "&.Mui-selected": {
              color: "#6ece95",
            },
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
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  // const handleDeleteClick = (id) => () => {
  //   setRows(rows.filter((row) => row.id !== id));
  // };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    setRows(rows.filter((row) => row.id !== id));
  };

  // handle amount update
  const handleModalUpdateConfirm = async () => {
    await handleUpdateSubmit();
    setShowModal(false);
  };

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow };
    console.log("updatedRow", updatedRow);
    setNewAmount(updatedRow.amount);
    setShowModal(true);
    setName(updatedRow.name);
    setId(updatedRow.id);
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
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
        console.log("Coin amount updated successfully");
      } else {
        console.error("Failed to update coin amount");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // handle delete coin

  const handleModalDeleteConfirm = async () => {
    await handleDeleteSubmit();
    setShowModal(false);
  };

  console.log("coins", coins);

  const handleDeleteRow = (id) => {
    // Remove the row from the coins array
    const updatedCoins = coins.filter((coin) => coin._id !== id);
    setCoins(updatedCoins);

    // Remove the row from the DataGrid by setting its mode to View
    setRowModesModel((prevRowModesModel) => ({
      ...prevRowModesModel,
      [id]: { mode: GridRowModes.View },
    }));

    // Optional: You can also setRows if you want to immediately remove it from the DataGrid display.
    // const updatedRows = rows.filter((row) => row.id !== id);
    // setRows(updatedRows);
  };

  // const processRowDelete = (newRow) => {
  //   const updatedRow = { ...newRow };
  //   console.log("updatedRow", updatedRow);
  //   setNewAmount(updatedRow.amount);
  //   setShowModal(true);
  //   setName(updatedRow.name);
  //   setId(updatedRow.id);
  //   setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
  //   return updatedRow;
  // };

  const handleDeleteClick = (id) => () => {
    // ...
    setShowModal(true);
    // setName(updatedRow.name);
    // setId(updatedRow.id);

    handleDeleteRow(id);
  };

  const handleDeleteSubmit = async () => {
    try {
      const response = await fetch(`${API_URL}/coin/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: newAmount }),
      });

      if (response.ok) {
        console.log("Coin deleted successfully");
      } else {
        console.error("Failed to delete coin amount");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const columns = [
    { field: "id", headerName: "Id" },
    { field: "name", headerName: "Crypto", flex: 1 },
    {
      field: "amount",
      headerName: "Units",
      headerAlign: "left",
      type: "number",
      flex: 0.8,
      editable: true,
      align: "left",
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
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
    <ThemeProvider theme={myTheme}>
      <div
        className="crpt-table"
        style={{
          position: "absolute",
          top: "45%",
          left: "50%",
          width: "90%",
          transform: "translate(-50%, -50%)",
          boxShadow: "0 0 25px rgba(122, 215, 138, 0.35)",
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
          onConfirm={handleModalUpdateConfirm}
        />
      )}
    </ThemeProvider>
  );
};

export default Table;
