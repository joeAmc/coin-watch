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

    screen.debug();
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

    // await waitFor(() => {});

    // You might want to add assertions to check for loading state or API requests.
    // For example, expect loading spinner to be visible or expect a specific API call.
    // These assertions will depend on the exact behavior you want to test.
    // Use `waitFor` from RTL to await asynchronous behavior if needed.
    // await waitFor(() => {})
    // Add assertions here to check for expected behavior after form submission.
    // });
  });

  // Test other scenarios such as sign-up mode, error handling, API requests, etc.
});
