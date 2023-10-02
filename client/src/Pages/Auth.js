import React from "react";
import AuthForm from "../Components/AuthForm/AuthForm";
import Nav from "../Components/Nav/Nav";
import { useSearchParams } from "react-router-dom";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const signUp = searchParams.get("mode") === "signup";

  return (
    <div>
      <h1>{signUp ? "Sign up" : "Log in"}</h1>
      <AuthForm />
      <Nav />
    </div>
  );
};

export default Auth;
