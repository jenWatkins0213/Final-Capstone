import React from "react";
import { Link } from "react-router-dom";
import "./Menu.css"
/**
 * Defines the menu for this application.
 *
 * @returns {JSX.Element}
 */

function Menu() {
  return (
    <nav className="navbar align-items-start p-0 border-right border-dark h-100">
      <div className="container-fluid d-flex flex-column p-0">
        <Link
          className="navbar-brand d-flex justify-content-center align-items-center sidebar-brand m-0"
          to="/"
        >
          <div className="text-dark mx-3">
            <h4>Periodic Tables</h4>
          </div>
        </Link>
        <hr className="sidebar-divider my-0" />
        <ul className="nav navbar-nav text-dark" id="accordionSidebar">
          <li className="nav-item ">
            <Link className="nav-link text-dark" to="/dashboard">
              {/* <MdOutlineDashboard size={20}/> */}
              &nbsp;Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-dark" to="/search">
              {/* <FaSistrix size={20}/> */}
              &nbsp;Search
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-dark" to="/reservations/new">
            {/* <HiOutlinePlus size={20}/> */}
              &nbsp;New Reservation
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-dark" to="/tables/new">
              {/* <GiRoundTable size={20}/> */}
              &nbsp;New Table
            </Link>
          </li>
        </ul>
        <div className="text-center d-none d-md-inline">
          <button
            className="btn rounded-circle border-0"
            id="sidebarToggle"
            type="button"
          />
        </div>
      </div>
    </nav>
  );
}

export default Menu;