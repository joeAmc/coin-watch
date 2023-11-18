import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";

const useRequireAuth = () => {
  const { loggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // prevent redirect before async auth check
    setLoading(false);
  }, [loggedIn]);

  useEffect(() => {
    // Redirect logic after check
    if (!loading && !loggedIn) {
      navigate("/");
    }
  }, [loggedIn, navigate, loading]);

  return loggedIn;
};

export default useRequireAuth;
