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

  it("renders an alert when password invalid", async () => {
    render(
      <BrowserRouter>
        <AuthForm />
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const signUpButton = screen.getByRole("button", { name: "Sign up" });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "abc" } });

    fireEvent.click(signUpButton);

    await expect(
      screen.getByText("Password must be at least 8 characters long")
    ).toBeInTheDocument();
  });

  it("renders an alert when email is invalid", async () => {
    render(
      <BrowserRouter>
        <AuthForm />
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const signUpButton = screen.getByRole("button", { name: "Sign up" });

    fireEvent.change(emailInput, { target: { value: "joe+@dd.c" } });
    fireEvent.change(passwordInput, { target: { value: "abc1234" } });

    fireEvent.click(signUpButton);

    // await waitFor(() => {
    //   expect(
    //     screen.getByText("Please enter a valid Email")
    //   ).toBeInTheDocument();
    // });
    await expect(
      screen.getByText("Please enter a valid Email")
    ).toBeInTheDocument();
  });
});
