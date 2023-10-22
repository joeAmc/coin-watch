import React from "react";
import { useEffect, useContext, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import { createTheme, ThemeProvider } from "@mui/material";
import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from "@mui/x-data-grid";
import {
  randomCreatedDate,
  randomTraderName,
  randomId,
  randomArrayItem,
} from "@mui/x-data-grid-generator";
import { AuthContext } from "../../AuthContext";
import Modal from "../Modal/Modal";

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

const initialRows = [
  {
    id: randomId(),
    name: "Bitcoin",
    amount: 1,
  },
  {
    id: randomId(),
    name: "Ethereum",
    amount: 6,
  },
];

// function EditToolbar(props) {
//   const { setRows, setRowModesModel } = props;

//   const handleClick = () => {
//     const id = randomId();
//     setRows((oldRows) => [...oldRows, { id, name: "", age: "", isNew: true }]);
//     setRowModesModel((oldModel) => ({
//       ...oldModel,
//       [id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
//     }));
//   };

//   return (
//     <GridToolbarContainer>
//       <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
//         Add record
//       </Button>
//     </GridToolbarContainer>
//   );
// }

export default function FullCrud() {
  const API_URL = process.env.REACT_APP_API;
  const [coins, setCoins] = useState([]);
  const [rows, setRows] = React.useState([]);
  const [rowModesModel, setRowModesModel] = React.useState({});
  const [newAmount, setNewAmount] = useState("");
  const { userId, showModal, setShowModal } = useContext(AuthContext);
  const [id, setId] = useState("");
  // const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");

  function createData(id, name, ticker, amount) {
    return { id, name, ticker, amount };
  }
  // const initialRows = coins.map((coin) => {
  //   return createData(coin._id, coin.name, coin.ticker, coin.amount);
  // });

  // setRows(initialRows);

  // const handleRowEditStop = (params, event) => {
  //   if (params.reason === GridRowEditStopReasons.rowFocusOut) {
  //     event.defaultMuiPrevented = true;
  //   }
  // };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id) => () => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleModalConfirm = async () => {
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

  console.log("ShowModal", showModal);

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const handleUpdateSubmit = async (id) => {
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
    // <Box
    //   sx={{
    //     position: "absolute",
    //     top: "45%",
    //     left: "50%",
    //     width: "90%",
    //     height: "500px",
    //     transform: "translate(-50%, -50%)",
    //     boxShadow: "0 0 25px rgba(122, 215, 138, 0.35)",
    //   }}
    // >
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
          // onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          // slots={{
          //   toolbar: EditToolbar,
          // }}
          // slotProps={{
          //   toolbar: { setRows, setRowModesModel },
          // }}
          sx={{
            boxShadow: 2,
            border: 2,
            color: "white",
            borderColor: "#61759b",
            "& .MuiDataGrid-row:hover": {
              color: "#6ece95",
            },
            "& .MuiDataGrid-row--editing .MuiDataGrid-cell": {
              backgroundColor: "#61759b",
              color: "white",
            },
            "& .MuiDataGrid-editInputCell input": {
              padding: "0 30px",
              color: "white",
            },
            "& .MuiButtonBase-root": {
              color: "white",
              background: "transparent",
            },
            "& .MuiButtonBase-root:hover": {
              color: "#6ece95",
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
            "& .MuiDataGrid-row--editing": {
              backgroundColor: "purple!important",
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
}
