import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import Table from "../Table";
import "whatwg-fetch";
import { setupServer } from "msw/node";
import { handlers } from "../../../Mocks/handlers";
import userEvent from "@testing-library/user-event";
import { AuthContext } from "../../../AuthContext";

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

const localStorageMock = (() => {
  let store = {};

  return {
    getItem: jest.fn((key) => store[key]),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

localStorageMock.setItem("pie-bit-user-id", "6550aef4bff6ff1f42769fbd");

describe("crypto table", () => {
  it("it shows the users crypto name and amount", async () => {
    render(<Table />);

    const bnb = await screen.findByText("binance-coin");
    const etc = await screen.findByText("Ethereum Classic");

    expect(bnb).toBeInTheDocument();
    expect(etc).toBeInTheDocument();

    const bnbAmount = await screen.findByText("10");
    const etcAmount = await screen.findByText("200");

    expect(bnbAmount).toBeInTheDocument();
    expect(etcAmount).toBeInTheDocument();
  });
  it("it can update an amount", async () => {
    render(<Table />);

    // const editButton = await screen.findByRole("button", { role: "menuitem" });
    const editButtons = await screen.findAllByRole("menuitem", {
      name: "Edit",
    });
    const editButton = editButtons[0];
    fireEvent.click(editButton);

    // assert save button is now visible
    const saveButton = await screen.findByRole("menuitem", { name: "Save" });
    expect(saveButton).toBeInTheDocument();

    const inputElement = screen.getByDisplayValue("200");

    userEvent.clear(inputElement);
    userEvent.type(inputElement, "500");

    userEvent.click(saveButton);
    await waitFor(() => {
      expect(screen.getByDisplayValue("500")).toBeInTheDocument();
    });
  });
  it("it can delete a cry", async () => {
    const contextValue = {
      setShowModal: jest.fn(),
      showModal: true,
    };

    render(
      <AuthContext.Provider value={contextValue}>
        <Table />
      </AuthContext.Provider>
    );

    const deleteButtons = await screen.findAllByRole("menuitem", {
      name: "Delete",
    });
    const deleteButton = deleteButtons[0];
    fireEvent.click(deleteButton);

    expect(
      screen.getByText(
        "Are you sure you want to delete 200 units of Ethereum Classic?"
      )
    ).toBeInTheDocument();

    const confirmButton = screen.getByRole("button", { name: "Confirm" });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(contextValue.setShowModal).toHaveBeenCalledWith(false);
    });
  });
});
