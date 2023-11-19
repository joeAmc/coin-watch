import { render, screen } from "@testing-library/react";
import React from "react";
import AddCryptoForm from "../AddCryptoForm";

describe("Add form", () => {
  it("test file", () => {
    render(<AddCryptoForm />);
    // expect(heading).toBeInTheDocument();
  });
});
