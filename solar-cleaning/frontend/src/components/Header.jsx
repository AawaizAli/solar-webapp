import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Header = () => {
    const authState = useSelector((state) => state.auth);
    const actualIsAuthenticated = authState?.isAuthenticated ?? false;
    const actualUser = authState?.user ?? { username: "Guest" };

    return (
        <header className="header_section">
            <div className="header_top">
                <div className="container-fluid">
                    <div className="contact_nav">
                        <a href="">
                            <i className="header-icon fa fa-phone" aria-hidden="true" />
                            <span>Call : +92 3302061260</span>
                        </a>
                        <a href="">
                            <i className="fa fa-envelope" aria-hidden="true" />
                            <span> Email : tjsolarinfo@gmail.com </span>
                        </a>
                    </div>
                </div>
            </div>
            <div className="header_bottom">
                <div className="container-fluid">
                    <nav className="navbar navbar-expand-lg custom_nav-container">
                        <a className="navbar-brand" href="/">
                            <span> TJ Solars </span>
                        </a>
                        <button
                            className="navbar-toggler"
                            type="button"
                            data-toggle="collapse"
                            data-target="#navbarSupportedContent"
                            aria-controls="navbarSupportedContent"
                            aria-expanded="false"
                            aria-label="Toggle navigation">
                            <span className=""> </span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav">
                                {actualIsAuthenticated ? (
                                    <>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/bookings">Bookings</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/workers">Workers</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/clients">Clients</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/search">Search</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/reports">Reports</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/logout">Logout</Link>
                                        </li>
                                    </>
                                ) : (
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/login">Login</Link>
                                    </li>
                                )}
                                {actualIsAuthenticated && (
                                    <li className="nav-item">
                                        <span className="nav-link">
                                            Welcome, {actualUser.username}
                                        </span>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;
