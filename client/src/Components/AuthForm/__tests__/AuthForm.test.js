import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import AuthForm from "../AuthForm";
import { BrowserRouter } from "react-router-dom";
import { setupServer } from "msw/node";
import { handlers } from "../../../Mocks/handlers";

const server = setupServer(...handlers);

beforeAll(() => {
  server.listen();
  process.env.REACT_APP_API = "http://localhost:4000";
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});

describe("Auth form", () => {
  it("renders email and password inputs", () => {
    render(
      <BrowserRouter>
        <AuthForm />
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const logInButton = screen.getByText("Log in");
    const signUpLink = screen.getByText("Sign up");

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(logInButton).toBeInTheDocument();
    expect(signUpLink).toBeInTheDocument();

    const signUpButton = screen.getByText("Sign up");
    const logInLink = screen.getByText("Log in");

    expect(signUpButton).toBeInTheDocument();
    expect(logInLink).toBeInTheDocument();

    fireEvent.click(signUpLink);
  });

  it("submits the form with valid email and password", async () => {
    render(
      <BrowserRouter>
        <AuthForm />
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const logInButton = screen.getByText("Log in");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    fireEvent.click(logInButton);
  });

  // Test other scenarios such as sign-up mode, error handling, API requests, etc.
});
