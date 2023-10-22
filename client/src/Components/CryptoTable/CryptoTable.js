import React from "react";
import { useEffect, useContext, useState } from "react";
import { AuthContext } from "../../AuthContext";
import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from "@mui/x-data-grid";
import "./CryptoTable.css";
import { createTheme, ThemeProvider } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import Modal from "../Modal/Modal";

const myTheme = createTheme({
  components: {
    MuiDataGrid: {
      styleOverrides: {
        row: {
          "&.Mui-selected": {
            color: "#6ece95",
          },
        },
      },
    },
  },
});

const CryptoTable = () => {
  const API_URL = process.env.REACT_APP_API;
  const [coins, setCoins] = useState([]);
  const [coinId, setCoinId] = useState("");
  const { showModal, setShowModal, userId } = useContext(AuthContext);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [rowModesModel, setRowModesModel] = useState({});
  const [newAmount, setNewAmount] = useState("");
  const [name, setName] = useState("");
  const [editedRows, setEditedRows] = useState([]);

  useEffect(() => {
    getCoins();
  }, []);

  // console.log("userId", userId);
  const getCoins = () => {
    // fetch(`${API_URL}/coins/${userId}`)
    fetch(`${API_URL}/coins/65285e63aa3062a5429f4956`)
      .then((res) => res.json())
      .then((data) => {
        setCoins(data);
      })
      .catch((err) => console.log("Error: ", err));
  };

  const handleEditClick = (id) => {
    // setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    setIsEdit(true);
    setSelectedRowId(id);
  };

  const handleCancelClick = (id) => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    setIsEdit(false);
    setSelectedRowId(id);
  };

  const handleDeleteClick = (id) => {
    setShowModal(true);
  };

  const handleSaveClick = async (id) => {
    // Find the edited row
    const editedRow = editedRows.find((row) => row.id === id);

    // Extract the updated amount from the edited row
    const newAmount = editedRow.amount;

    // Send a PUT request to update the coin amount
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
        // Handle errors (e.g., show an error message)
        console.error("Failed to update coin amount");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleModalConfirm = (id) => () => {
    // setRows(rows.filter((row) => row.id !== id));
  };

  // //   console.log("userId", userId);
  // console.log("coins", coins);
  // console.log("isEdit", isEdit);

  function createData(id, name, ticker, amount) {
    return { id, name, ticker, amount };
  }

  const columns = [
    { field: "id", headerName: "Id" },
    { field: "ticker", headerName: "Ticker", flex: 0.7 },
    { field: "name", headerName: "Crypto", flex: 1 },
    {
      field: "amount",
      headerName: "Units",
      headerAlign: "left",
      type: "number",
      flex: 0.8,
      editable: isEdit,
      align: "left",
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      flex: 1,
      cellClassName: "actions",
      getActions: ({ id }) => {
        if (isEdit && selectedRowId === id) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: "primary.main",
              }}
              onClick={() => handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={() => handleCancelClick(id)}
              color="primary.main"
            />,
          ];
        } else {
          return [
            <GridActionsCellItem
              icon={<EditIcon />}
              label="Edit"
              className="textPrimary"
              onClick={() => handleEditClick(id)}
              color="inherit"
            />,
            <GridActionsCellItem
              icon={<DeleteIcon />}
              label="Delete"
              onClick={() => handleDeleteClick(id)}
              color="inherit"
            />,
          ];
        }
      },
    },
  ];

  const initialRows = coins.map((coin) => {
    return createData(coin._id, coin.name, coin.ticker, coin.amount);
  });

  // const editedRows = initialRows.map((row) => {
  //   if (isEdit && row.id === selectedRowId) {
  //     return { ...row, amount: row.amount.toString() };
  //   }
  //   return row;
  // });

  console.log("editedRows", editedRows);
  console.log("initialRows", initialRows);
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
          // onRowClick={handleRowClick}f
          initialState={{
            columns: {
              columnVisibilityModel: {
                // Hide columns status and traderName, the other columns will remain visible
                id: false,
              },
            },
          }}
          onEditRowsModelChange={(model) => {
            setEditedRows(
              model.rows.map((row) => {
                const originalRow = initialRows.find((r) => r.id === row.id);
                return {
                  ...originalRow,
                  amount: parseFloat(row.amount),
                };
              })
            );
          }}
          autoHeight
          rows={editedRows}
          columns={columns}
          sx={{
            boxShadow: 2,
            border: 2,
            color: "white",
            borderColor: "#61759b",
            "& .MuiDataGrid-row:hover": {
              color: "#6ece95",
            },
            "& .MuiButtonBase-root": {
              color: "white",
              background: "transparent",
            },
            "& .MuiDataGrid-cell, .MuiDataGrid-columnHeader": {
              padding: "0 30px",
              borderColor: "#61759b",
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              fontSize: "16px",
              // borderColor: "#61759b",
            },
            "& .MuiDataGrid-columnHeaders": {
              borderColor: "#61759b",
              borderWidth: "0 0 2px 0",
            },
            "& .MuiIconButton-root": {
              width: "unset",
            },
            "& .MuiDataGrid-columnHeaderTitleContainer": {
              flexDirection: "unset",
            },
            "& .MuiDataGrid-cell--editing": {
              backgroundColor: "green!important",
              padding: "0 30px",
            },
          }}
          disableColumnMenu
          hideFooter
        />
      </div>
      {showModal && (
        <Modal name={name} amount={newAmount} onConfirm={handleModalConfirm} />
      )}
    </ThemeProvider>
  );
};

export default CryptoTable;
