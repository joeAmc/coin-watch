import { createContext } from "react";

export const AuthContext = createContext({
  loggedIn: false,
  showModal: false,
  userId: "",
  setUserId: () => {},
  setLoggedIn: () => {},
  setShowModal: () => {},
});
// Compare this snippet from client/src/App.js:
