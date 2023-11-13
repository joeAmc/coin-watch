import React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

const ComboBox = ({ options }) => {
  return (
    <Autocomplete
      disablePortal
      id="combo-box"
      options={options}
      sx={{ width: 300 }}
      renderInput={(params) => <TextField {...params} label="Crypto" />}
    />
  );
};

export default ComboBox;
