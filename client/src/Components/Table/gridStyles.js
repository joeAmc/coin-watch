export const gridStyles = {
  boxShadow: 2,
  border: 2,
  color: "white",
  borderColor: "#61759b",
  "& .MuiDataGrid-row:hover": {
    // color: "#61759b",
  },
  "& .MuiDataGrid-row--editing .MuiDataGrid-cell": {
    backgroundColor: "#131922",
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
    color: "#61759b",
    background: "transparent",
  },
  "& .MuiDataGrid-cell, .MuiDataGrid-columnHeader": {
    padding: "0 30px",
    borderColor: "#61759b",
  },
  "& .MuiDataGrid-columnHeaderTitle": {
    fontSize: "20px",
    color: "#6ece95",
  },
  "& .MuiDataGrid-columnHeaders": {
    borderColor: "#61759b",
    borderWidth: "0 0 1px 0",
  },
  "& .MuiIconButton-root": {
    width: "unset",
  },
  "& .MuiDataGrid-columnHeaderTitleContainer": {
    flexDirection: "unset",
  },
  "& .MuiDataGrid-cellContent": {
    fontSize: "16px",
  },

  // "& .MuiDataGrid-virtualScrollerContent": {
  //   height: "100px",
  // },
  // "& .css-1kwdphh-MuiDataGrid-virtualScrollerContent": {
  //   height: "100px!important",
  // },
};
