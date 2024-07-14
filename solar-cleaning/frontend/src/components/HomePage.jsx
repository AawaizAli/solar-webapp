import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import "../../public/css/responsive.css";
import "../../public/css/style.css";
import sliderImg from "../../public/slider-img.png";
import professionalImg from "../../public/professional-img.png";

const HomePage = () => {
    const authState = useSelector((state) => state.auth);
    const actualIsAuthenticated = authState?.isAuthenticated ?? false;
    const actualUser = authState?.user ?? { username: "Guest" };

    return (
        <>
            {/* Basic */}
            <meta charSet="utf-8" />
            <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
            {/* Mobile Metas */}
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1, shrink-to-fit=no"
            />
            {/* Site Metas */}
            <meta name="keywords" content="" />
            <meta name="description" content="" />
            <meta name="author" content="" />
            <title>SolarPod</title>
            {/* slider stylesheet */}
            <link
                rel="stylesheet"
                type="text/css"
                href="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.min.css"
            />
            {/* bootstrap core css */}
            <link rel="stylesheet" type="text/css" href="css/bootstrap.css" />
            {/* font awesome style */}
            <link
                rel="stylesheet"
                type="text/css"
                href="css/font-awesome.min.css"
            />
            {/* Custom styles for this template */}
            <link href="css/style.css" rel="stylesheet" />
            {/* responsive style */}
            <link href="css/responsive.css" rel="stylesheet" />
            <div className="hero_area">
                {/* header section strats */}
                <header className="header_section">
                    <div className="header_top">
                        <div className="container-fluid">
                            <div className="contact_nav">
                                <a href="">
                                    <i
                                        className="header-icon fa fa-phone"
                                        aria-hidden="true"
                                    />
                                    <span>Call : +92 3302061260</span>
                                </a>
                                <a href="">
                                    <i
                                        className="fa fa-envelope"
                                        aria-hidden="true"
                                    />
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
                                <div
                                    className="collapse navbar-collapse"
                                    id="navbarSupportedContent">
                                    <ul className="navbar-nav">
                                        <li className="nav-item">
                                            <a className="nav-link" href="/">
                                                Home
                                            </a>
                                        </li>
                                        {actualIsAuthenticated ? (
                                            <>
                                                <li className="nav-item">
                                                    <a
                                                        href="/bookings"
                                                        className="nav-link">
                                                        Bookings
                                                    </a>
                                                </li>
                                                <li className="nav-item">
                                                    <a
                                                        className="nav-link"
                                                        href="/workers">
                                                        Workers
                                                    </a>
                                                </li>
                                                <li className="nav-item">
                                                    <a
                                                        className="nav-link"
                                                        href="/clients">
                                                        Clients
                                                    </a>
                                                </li>
                                                <li className="nav-item">
                                                    <a
                                                        className="nav-link"
                                                        href="/search">
                                                        Search
                                                    </a>
                                                </li>
                                                <li className="nav-item">
                                                    <Link
                                                        className="nav-link"
                                                        to="/logout">
                                                        Logout
                                                    </Link>
                                                </li>
                                            </>
                                        ) : (
                                            <li className="nav-item">
                                                <a
                                                    className="nav-link"
                                                    href="/login">
                                                    Login
                                                </a>
                                            </li>
                                        )}
                                        {actualIsAuthenticated && (
                                            <li className="nav-item">
                                                <span className="nav-link">
                                                    Welcome,{" "}
                                                    {actualUser.username}
                                                </span>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            </nav>
                        </div>
                    </div>
                </header>
                {/* end header section */}
                {/* slider section */}
                <section className="slider_section">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-6">
                                <div className="detail-box">
                                    <h1>
                                        Solar Repair and <br />
                                        Maintenance <br />
                                        Services
                                    </h1>
                                    <p>
                                        At TJ Solars, we provide top-notch
                                        repair and maintenance services for your
                                        solar panel systems. Our experienced
                                        technicians ensure that your panels
                                        operate at peak efficiency, saving you
                                        money and contributing to a greener
                                        planet. From routine inspections to
                                        emergency repairs, we've got you
                                        covered. Trust TJ Solars for reliable
                                        and professional solar panel care.
                                    </p>
                                    <a href="#professional_section">
                                        {" "}
                                        Get Started{" "}
                                    </a>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="img-box">
                                    <img src={sliderImg} alt="Slider Image" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* end slider section */}
            </div>
            {/* feature section */}
            <section className="feature_section">
                <div className="container">
                    <div className="feature_container">
                        <a
                            href="/clients"
                            className="box"
                            style={{
                                textDecoration: "none",
                                color: "inherit",
                            }}>
                            <div className="img-box">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width={16}
                                    height={16}
                                    fill="currentColor"
                                    className="bi bi-person-arms-up"
                                    viewBox="0 0 16 16">
                                    <path d="M8 3a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3" />
                                    <path d="m5.93 6.704-.846 8.451a.768.768 0 0 0 1.523.203l.81-4.865a.59.59 0 0 1 1.165 0l.81 4.865a.768.768 0 0 0 1.523-.203l-.845-8.451A1.5 1.5 0 0 1 10.5 5.5L13 2.284a.796.796 0 0 0-1.239-.998L9.634 3.84a.7.7 0 0 1-.33.235c-.23.074-.665.176-1.304.176-.64 0-1.074-.102-1.305-.176a.7.7 0 0 1-.329-.235L4.239 1.286a.796.796 0 0 0-1.24.998l2.5 3.216c.317.316.475.758.43 1.204Z" />
                                </svg>
                            </div>
                            <h5 className="name">Clients</h5>
                        </a>
                        <a
                            href="/bookings"
                            className="box"
                            style={{
                                textDecoration: "none",
                                color: "inherit",
                            }}>
                            <div className="img-box">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width={16}
                                    height={16}
                                    fill="currentColor"
                                    className="bi bi-bookmark-check"
                                    viewBox="0 0 16 16">
                                    <path
                                        fillRule="evenodd"
                                        d="M10.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0"
                                    />
                                    <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1z" />
                                </svg>
                            </div>
                            <h5 className="name">Bookings</h5>
                        </a>
                        <a
                            href="/workers"
                            className="box"
                            style={{
                                textDecoration: "none",
                                color: "inherit",
                            }}>
                            <div className="img-box">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    class="bi bi-person-vcard"
                                    viewBox="0 0 16 16">
                                    <path d="M5 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4m4-2.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5M9 8a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4A.5.5 0 0 1 9 8m1 2.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5" />
                                    <path d="M2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zM1 4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H8.96q.04-.245.04-.5C9 10.567 7.21 9 5 9c-2.086 0-3.8 1.398-3.984 3.181A1 1 0 0 1 1 12z" />
                                </svg>
                            </div>
                            <h5 className="name">Workers</h5>
                        </a>
                    </div>
                </div>
            </section>
            {/* end feature section */}
            {/* professional section */}
            <section className="professional_section layout_padding">
                <div id="professional_section" className="container">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="img-box">
                                <img src={professionalImg} alt="" />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="detail-box">
                                <h2>
                                    We Provide Professional <br />
                                    Solar Cleaning Services.
                                </h2>
                                <p>
                                    At TJ Solar, our expert team specializes in
                                    professional solar cleaning services that
                                    ensure your solar panels operate at their
                                    maximum efficiency. Regular cleaning can
                                    enhance energy production and prolong the
                                    lifespan of your panels. We use advanced
                                    cleaning techniques to remove dirt, debris,
                                    and grime, ensuring optimal performance.
                                    Trust us to keep your solar investment clean
                                    and productive.
                                </p>
                                <a href="/bookings">Book Now</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* end professional section */}

            {/* info section */}
            <section className="info_section">
                <div className="container">
                    <h4>Get In Touch</h4>
                    <div className="row">
                        <div className="col-lg-10 mx-auto">
                            <div className="info_items">
                                <div className="row">
                                    <div className="col-md-4">
                                        <a href="">
                                            <div className="item">
                                                <div className="img-box">
                                                    <i
                                                        className="fa fa-map-marker"
                                                        aria-hidden="true"
                                                    />
                                                </div>
                                                <p>
                                                    A56, X.1, Gulshan e Maymar,
                                                    Karachi, Pakistan
                                                </p>
                                            </div>
                                        </a>
                                    </div>
                                    <div className="col-md-4">
                                        <a href="">
                                            <div className="item">
                                                <div className="img-box">
                                                    <i
                                                        className="fa fa-phone"
                                                        aria-hidden="true"
                                                    />
                                                </div>
                                                <p>+92 3302061260</p>
                                            </div>
                                        </a>
                                    </div>
                                    <div className="col-md-4">
                                        <a href="">
                                            <div className="item">
                                                <div className="img-box">
                                                    <i
                                                        className="fa fa-envelope"
                                                        aria-hidden="true"
                                                    />
                                                </div>
                                                <p>tjsolarinfo@gmail.com</p>
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="social-box">
                    <h4>Follow Us</h4>
                    <div className="box">
                        <a href="https://www.facebook.com/tjsolarcleaningservices">
                            <i className="fa fa-facebook" aria-hidden="true" />
                        </a>
                        <a href="">
                            <i className="fa fa-twitter" aria-hidden="true" />
                        </a>
                        <a href="">
                            <i className="fa fa-youtube" aria-hidden="true" />
                        </a>
                        <a href="https://www.instagram.com/tjsolars/">
                            <i className="fa fa-instagram" aria-hidden="true" />
                        </a>
                    </div>
                </div>
            </section>
            {/* end info_section */}
            {/* footer section */}
            <footer className="footer_section">
                <div className="container">
                    <p>
                        © <span id="displayDateYear" /> All Rights Reserved By
                        <a href="https://www.behance.net/aawaizali">
                            TJ Solars
                        </a>
                    </p>
                </div>
            </footer>
            {/* footer section */}
            {/* Google Map */}
            {/* End Google Map */}
        </>
    );
};

export default HomePage;
