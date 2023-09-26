import { createContext } from "react";

export const AuthContext = createContext({
  loggedIn: false,
  showAlert: false,
  setLoggedIn: () => {},
  setShowAlert: () => {},
});
