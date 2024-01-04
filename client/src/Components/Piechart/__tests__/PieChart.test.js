import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import PieChart from "../Piechart";
import "whatwg-fetch";
import { setupServer } from "msw/node";
import { handlers } from "../../../Mocks/handlers";
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

describe("Pie chart", () => {
  it("renders the piechart as expected", async () => {
    render(
      // <AuthContext.Provider value={contextValue}>
      <PieChart />
      // </AuthContext.Provider>
    );

    screen.debug();
  });
});
