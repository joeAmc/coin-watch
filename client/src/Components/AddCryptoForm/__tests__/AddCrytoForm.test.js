import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AddCryptoForm from "../AddCryptoForm";
import "whatwg-fetch";
import { setupServer } from "msw/node";
import { handlers } from "../../../Mocks/handlers";
import userEvent from "@testing-library/user-event";

describe("AddCryptoForm Component", () => {
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

  it("renders AddCryptoForm correctly", async () => {
    render(<AddCryptoForm />);
    expect(screen.getByText("Crypto Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Amount")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Add Crypto" })
    ).toBeInTheDocument();
  });

  it("selects a crypto", async () => {
    render(<AddCryptoForm />);

    expect(screen.getByText("Crypto Name")).toBeInTheDocument();

    const amountField = screen.getByLabelText("Amount");
    expect(amountField).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Add Crypto" })
    ).toBeInTheDocument();

    userEvent.type(amountField, "100");

    await waitFor(() => {
      expect(amountField).toHaveValue("100");
    });
  });
});
