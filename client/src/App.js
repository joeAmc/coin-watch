import "./App.css";
import { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import Auth from "./Pages/Auth";
import AddCrypto from "./Pages/AddCrypto";
import Portfoglio from "./Pages/Portfoglio";
import UpdateCrypto from "./Pages/UpdateCrypto";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const user = localStorage.getItem("pie-bit-user");
    if (user) {
      setLoggedIn(true);
    }
  }, []);

  return (
    <div className="App">
      <AuthContext.Provider
        value={{
          loggedIn,
          userId,
          setUserId,
          setLoggedIn,
        }}
      >
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/add" element={<AddCrypto />} />
          <Route path="/portfoglio" element={<Portfoglio />} />
          <Route path="/update" element={<UpdateCrypto />} />
        </Routes>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
