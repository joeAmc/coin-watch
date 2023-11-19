import React, { useContext } from "react";
import AuthForm from "../Components/AuthForm/AuthForm";
import SignOutForm from "../Components/SignOutForm /SignOutForm";
import Nav from "../Components/Nav/Nav";
import { useSearchParams } from "react-router-dom";
import { AuthContext } from "../AuthContext";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const { loggedIn } = useContext(AuthContext);
  const signUp = searchParams.get("mode") === "signup";

  return (
    <div>
      <div className="header-container">
        {!loggedIn ? signUp ? <h1>Sign up</h1> : <h1>Log in</h1> : null}
      </div>
      <Nav />
      {!loggedIn ? <AuthForm /> : <SignOutForm />}
    </div>
  );
};

export default Auth;
