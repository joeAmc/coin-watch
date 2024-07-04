import { configureStore } from "@reduxjs/toolkit";
import modalReducer from "./modal/modalSlice";
import authStatusReducer from "./authStatus/authStatusSlice";

export const store = configureStore({
  reducer: {
    modal: modalReducer,
    authStatus: authStatusReducer,
  },
});

export default store;
