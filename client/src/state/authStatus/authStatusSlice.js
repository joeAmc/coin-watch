import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
};

const authStatusSlice = createSlice({
  name: "authStatus",
  initialState,
  reducers: {
    // mutating code possible due to createSlice, under the hood it doesn't mutate the state
    setLoggedIn: (state) => {
      state.isLoggedIn = true;
    },
    setLoggedOut: (state) => {
      state.isLoggedIn = false;
    },
  },
});

export const { setLoggedIn, setLoggedOut } = authStatusSlice.actions;

export default authStatusSlice.reducer;
