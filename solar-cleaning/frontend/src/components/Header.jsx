import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Navbar, Nav } from 'react-bootstrap';

import "./Header.css"

const Header = () => {
  const authState = useSelector((state) => state.auth);
  const actualIsAuthenticated = authState?.isAuthenticated ?? false;
  const actualUser = authState?.user ?? { username: "Guest" };

  return (
    <header className="header_section">
      <div className="header_top">
        <div className="container-fluid">
          <div className="contact_nav">
            <div style={{ color: "white" }}>
              <i className="header-icon fa fa-phone" aria-hidden="true"></i>
              <span>Call: +92 3302061260</span>
            </div>
            <div style={{ color: "white" }}>
              <i className="fa fa-envelope" aria-hidden="true"></i>
              <span> Email: tjsolarinfo@gmail.com</span>
            </div>
          </div>
        </div>
      </div>
      <div className="header_bottom">
        <div className="container-fluid">
          <Navbar expand="lg" className="custom_nav-container">
            <Navbar.Brand href="/">TJ Solars</Navbar.Brand>

            {actualIsAuthenticated ? (
              <>
                <Navbar.Toggle aria-controls="navbarSupportedContent" />
                <Navbar.Collapse id="navbarSupportedContent">
                  <Nav className="ml-auto">
                    <Link className="nav-link" to="/bookings">Bookings</Link>
                    <Link className="nav-link" to="/workers">Workers</Link>
                    <Link className="nav-link" to="/clients">Clients</Link>
                    <Link className="nav-link" to="/search">Search</Link>
                    <Link className="nav-link" to="/reports">Reports</Link>
                    <Link className="nav-link" to="/logout">Logout</Link>
                    <span className="nav-link">Welcome, {actualUser.username}</span>
                  </Nav>
                </Navbar.Collapse>
              </>
            ) : (
              <Nav className="ml-auto">
                <Link className="nav-link" to="/login">Login</Link>
              </Nav>
            )}
          </Navbar>
        </div>
      </div>
    </header>
  );
};

export default Header;
