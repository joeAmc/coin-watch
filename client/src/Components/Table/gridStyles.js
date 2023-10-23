export const gridStyles = {
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
};
