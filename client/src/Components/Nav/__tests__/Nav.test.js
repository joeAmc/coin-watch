import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Nav from "../Nav";

describe("Nav Component", () => {
  it("renders all expected", () => {
    render(
      <MemoryRouter>
        <Nav />
      </MemoryRouter>
    );

    const chartLink = screen.getByRole("link", { name: /chart/i });
    const addLink = screen.getByRole("link", { name: /add/i });
    const editLink = screen.getByRole("link", { name: /edit/i });
    const authLink = screen.getByRole("link", { name: /auth/i });

    expect(chartLink).toBeInTheDocument();
    expect(addLink).toBeInTheDocument();
    expect(editLink).toBeInTheDocument();
    expect(authLink).toBeInTheDocument();
  });

  it("adds active class to selected link", () => {
    render(
      <MemoryRouter initialEntries={["/portfoglio"]}>
        <Nav />
      </MemoryRouter>
    );

    const activeLink = screen.getByRole("link", { name: /chart/i });
    const authLink = screen.getByRole("link", { name: /auth/i });

    expect(activeLink).toHaveClass("active");
    expect(authLink).not.toHaveClass("active");
  });
});
