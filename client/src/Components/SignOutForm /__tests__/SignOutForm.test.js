import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import SignOutForm from "../SignOutForm";
import { BrowserRouter } from "react-router-dom";
import { AuthContext } from "../../../AuthContext";

describe("Sign out form", () => {
  beforeEach(() => {
    localStorage.setItem("pie-bit-user", "6550aef4bff6ff1f42769fbd");
  });

  afterEach(() => {
    localStorage.removeItem("pie-bit-user");
  });

  it("should call signOutHandler on 'Sign out' button click", async () => {
    const removeItemMock = jest.spyOn(
      window.localStorage.__proto__,
      "removeItem"
    );
    render(
      <BrowserRouter>
        <AuthContext.Provider value={{ setLoggedIn: jest.fn() }}>
          <SignOutForm />
        </AuthContext.Provider>
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText("Sign out"));

    await waitFor(() => {
      expect(removeItemMock).toHaveBeenCalledWith("pie-bit-user");
    });
    expect(localStorage.getItem("pie-bit-user")).not.toBe(
      "6550aef4bff6ff1f42769fbd"
    );
  });

  it("should maintain pie-bit-user value on 'Go back' button click", () => {
    render(
      <BrowserRouter>
        <SignOutForm />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText("Go back"));

    expect(localStorage.getItem("pie-bit-user")).toBe(
      "6550aef4bff6ff1f42769fbd"
    );
  });
});
