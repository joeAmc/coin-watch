import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AddCryptoForm from "../AddCryptoForm";

describe("AddCryptoForm Component", () => {
  // beforeAll(() => {
  //   global.fetch = jest.fn(() =>
  //     Promise.resolve({
  //       ok: true,
  //       json: () =>
  //         Promise.resolve({ data: [{ id: "bitcoin", name: "Bitcoin" }] }),
  //     })
  //   );
  // });

  // afterAll(() => {
  //   global.fetch.mockClear();
  //   delete global.fetch;
  // });

  it("renders AddCryptoForm correctly", async () => {
    render(<AddCryptoForm />);
    expect(screen.getByText("Crypto Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Amount")).toBeInTheDocument();
  });

  // it("handles input changes correctly", () => {
  //   render(<AddCryptoForm />);
  //   const cryptoNameInput = screen.getByLabelText("Crypto Name");
  //   const amountInput = screen.getByLabelText("Amount");

  //   fireEvent.change(cryptoNameInput, { target: { value: "bitcoin" } });
  //   fireEvent.change(amountInput, { target: { value: "10" } });

  //   expect(cryptoNameInput).toHaveValue("bitcoin");
  //   expect(amountInput).toHaveValue("10");
  // });

  // it("submits the form with correct data", async () => {
  //   render(<AddCryptoForm />);
  //   const addButton = screen.getByRole("button", { name: "Add Crypto" });

  //   fireEvent.click(addButton);

  //   await waitFor(() => {
  //     expect(global.fetch).toHaveBeenCalled();
  //     expect(global.fetch).toHaveBeenCalledWith(
  //       "https://api.coincap.io/v2/assets/bitcoin"
  //     );
  //   });
  // });

  // You can add more tests here for modal rendering and interactions if needed
});
