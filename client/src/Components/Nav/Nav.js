import React from "react";
import "./Nav.css";
import { AiOutlinePieChart } from "react-icons/ai";
import { GoPlusCircle } from "react-icons/go";
import { BsWrenchAdjustableCircle } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { NavLink } from "react-router-dom";

const Nav = () => {
  return (
    <div>
      <nav className="navbar">
        <NavLink to="/portfoglio" className="nav-icon" activeClassName="active">
          <AiOutlinePieChart />
        </NavLink>
        <NavLink to="/add" className="nav-icon" activeClassName="active">
          <GoPlusCircle />
        </NavLink>
        <NavLink to="/update" className="nav-icon" activeClassName="active">
          <BsWrenchAdjustableCircle />
        </NavLink>
        <NavLink to="/" className="nav-icon" activeClassName="active">
          <CgProfile />
        </NavLink>
      </nav>
    </div>
  );
};

export default Nav;
