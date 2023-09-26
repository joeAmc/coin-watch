import React from "react";
import "./Nav.css";
import { AiOutlinePieChart } from "react-icons/ai";
import { CgAdd } from "react-icons/cg";
import { BsWrenchAdjustableCircle } from "react-icons/bs";
import { NavLink } from "react-router-dom";

const Nav = () => {
  return (
    <div>
      <nav className="navbar">
        <NavLink to="/portfoglio" className="nav-icon" activeClassName="active">
          <AiOutlinePieChart />
        </NavLink>
        <NavLink to="/add" className="nav-icon" activeClassName="active">
          <CgAdd />
        </NavLink>
        <NavLink to="/update" className="nav-icon" activeClassName="active">
          <BsWrenchAdjustableCircle />
        </NavLink>
      </nav>
    </div>
  );
};

export default Nav;
