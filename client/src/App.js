import "./App.css";
import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import Auth from "./Pages/Auth";
import AddCrypto from "./Pages/AddCrypto";
import Portfoglio from "./Pages/Portfoglio";
import UpdateCrypto from "./Pages/UpdateCrypto";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [userId, setUserId] = useState("");

  return (
    <div className="App">
      <AuthContext.Provider
        value={{
          loggedIn,
          showModal,
          userId,
          setUserId,
          setLoggedIn,
          setShowModal,
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
