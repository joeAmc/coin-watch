import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import AddCryptoForm from "../AddCryptoForm";
import "whatwg-fetch";
import { setupServer } from "msw/node";
import { handlers } from "../../../Mocks/handlers";
import userEvent from "@testing-library/user-event";

const server = setupServer(...handlers);

beforeAll(() => {
  server.listen();
  process.env.REACT_APP_API = "http://localhost:3000";
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});

describe("Add crypto form", () => {
  it("can display the top 100 crypto currency in the drop down and select", async () => {
    render(<AddCryptoForm />);
    const select = await screen.findByTestId("ArrowDropDownIcon");
    fireEvent.click(select);

    await waitFor(() => {
      expect(screen.getByDisplayValue("Bitcoin")).toBeInTheDocument();
    });
  });
});
