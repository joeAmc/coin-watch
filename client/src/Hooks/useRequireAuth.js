import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const useRequireAuth = () => {
  const loggedIn = useSelector((state) => state.authStatus.isLoggedIn);
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
