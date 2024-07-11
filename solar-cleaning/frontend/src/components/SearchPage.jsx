import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Table, Input, Button } from "antd";
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import "../../public/css/responsive.css";
import "../../public/css/style.css";

const { Search } = Input;

const SearchPage = () => {
    const authState = useSelector((state) => state.auth);
    const actualIsAuthenticated = authState?.isAuthenticated ?? false;
    const actualUser = authState?.user ?? { username: "Guest" };

    const [selectedOption, setSelectedOption] = useState(null);
    const [data, setData] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    const handleMenuClick = (option) => {
        setSelectedOption(option);
        fetchData(option);
    };

    const fetchData = (option) => {
        // Replace this with your actual fetch logic
        console.log(`Fetching data for ${option}`);
        // Dummy data for demonstration
        if (option === "Clients") {
            setData([
                { key: "1", name: "John Doe", contact: "john@example.com" },
                { key: "2", name: "Jane Smith", contact: "jane@example.com" },
            ]);
        } else if (option === "Workers") {
            setData([
                { key: "1", name: "Worker One", job: "Installer" },
                { key: "2", name: "Worker Two", job: "Technician" },
            ]);
        } else if (option === "Bookings") {
            setData([
                { key: "1", client: "John Doe", worker: "Worker One", date: "2024-07-07" },
                { key: "2", client: "Jane Smith", worker: "Worker Two", date: "2024-07-08" },
            ]);
        }
    };

    const handleSearch = (value) => {
        setSearchQuery(value);
        // Implement search functionality here
        console.log(`Searching for ${value} in ${selectedOption}`);
    };

    const columns = selectedOption === "Clients" ? [
        { title: "ID", dataIndex: "id", key: "id" },
        { title: "Name", dataIndex: "name", key: "name" },
        { title: "Contact", dataIndex: "contact", key: "contact" },
        { title: "Address", dataIndex: "address", key: "address" },
        { title: "Total Panels", dataIndex: "panels", key: "panels" },
        { title: "Charges per Clean", dataIndex: "charges", key: "charges" },
        { title: "Subscription Plan", dataIndex: "plan", key: "plan" },
        { title: "Subscription Start", dataIndex: "start", key: "start" },
        { title: "Subscription End", dataIndex: "end", key: "end" },
    ] : selectedOption === "Workers" ? [
        { title: "Name", dataIndex: "name", key: "name" },
        { title: "Job", dataIndex: "job", key: "job" },
    ] : selectedOption === "Bookings" ? [
        { title: "Client", dataIndex: "client", key: "client" },
        { title: "Worker", dataIndex: "worker", key: "worker" },
        { title: "Date", dataIndex: "date", key: "date" },
    ] : [];

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
                                                    <a
                                                        className="nav-link"
                                                        href="">
                                                        Reports
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
            </div>
            {/* Table Section beginning */}
            <div className="container mt-4">
                <div className="row mb-3">
                    <div className="col-md-12 d-flex justify-content-center">
                        <Button
                            type={selectedOption === "Clients" ? "primary" : "default"}
                            onClick={() => handleMenuClick("Clients")}
                        >
                            Clients
                        </Button>
                        <Button
                            type={selectedOption === "Workers" ? "primary" : "default"}
                            onClick={() => handleMenuClick("Workers")}
                            className="mx-2"
                        >
                            Workers
                        </Button>
                        <Button
                            type={selectedOption === "Bookings" ? "primary" : "default"}
                            onClick={() => handleMenuClick("Bookings")}
                        >
                            Bookings
                        </Button>
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col-md-12">
                        <Search
                            placeholder="Search..."
                            enterButton="Search"
                            size="large"
                            onSearch={handleSearch}
                        />
                    </div>
                </div>
                <Table columns={columns} dataSource={data} />
            </div>
            {/* Table Section end */}
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
                                                A56, X.1, Gulshan e Maymar, Karachi, Pakistan
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
                            Aawaiz Ali
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

export default SearchPage;
