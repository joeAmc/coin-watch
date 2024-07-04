import "./App.css";
import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLoggedIn } from "./state/authStatus/authStatusSlice";
import Auth from "./Pages/Auth";
import AddCrypto from "./Pages/AddCrypto";
import Portfoglio from "./Pages/Portfoglio";
import UpdateCrypto from "./Pages/UpdateCrypto";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const user = localStorage.getItem("pie-bit-user");
    if (user) {
      dispatch(setLoggedIn());
    }
  }, []);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/add" element={<AddCrypto />} />
        <Route path="/portfoglio" element={<Portfoglio />} />
        <Route path="/update" element={<UpdateCrypto />} />
      </Routes>
    </div>
  );
}

export default App;
