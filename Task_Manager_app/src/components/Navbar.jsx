import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <>
      <nav className="navbar">
        <div className="links">
          <Link to="/">In Process</Link>
          <Link to="/finished">Finished</Link>
          <Link to="/all-tasks">All Tasks</Link>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
