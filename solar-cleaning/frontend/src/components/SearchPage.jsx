import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Table, Input, Button, Modal } from "antd";
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
    const [modalVisible, setModalVisible] = useState(false);
    const [availabilityData, setAvailabilityData] = useState([]);

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
                { key: "1", id: "1", name: "John Doe", contact: "john@example.com", address: "123 Main St", panels: 10, charges: "$100", plan: "Monthly", start: "2023-01-01", end: "2024-01-01" },
                { key: "2", id: "2", name: "Jane Smith", contact: "jane@example.com", address: "456 Oak St", panels: 8, charges: "$80", plan: "Annual", start: "2023-06-01", end: "2024-06-01" },
            ]);
        } else if (option === "Workers") {
            setData([
                { key: "1", id: "1", name: "Worker One", location: "New York" },
                { key: "2", id: "2", name: "Worker Two", location: "Los Angeles" },
            ]);
        } else if (option === "Bookings") {
            setData([
                { key: "1", bookingid: "1", "client-id": "1", "worker-id": "1", "client-name": "John Doe", "worker-name": "Worker One", date: "2024-07-07", slot: "Morning", status: "Confirmed", reocc: "No" },
                { key: "2", bookingid: "2", "client-id": "2", "worker-id": "2", "client-name": "Jane Smith", "worker-name": "Worker Two", date: "2024-07-08", slot: "Afternoon", status: "Pending", reocc: "Yes" },
            ]);
        }
    };

    const handleSearch = (value) => {
        setSearchQuery(value);
        // Implement search functionality here
        console.log(`Searching for ${value} in ${selectedOption}`);
    };

    const handleShowAvailability = (workerId) => {
        // Fetch availability data for the worker and set it
        console.log(`Fetching availability for worker ${workerId}`);
        // Dummy data for demonstration
        const dummyAvailability = Array(7).fill(null).map(() => Array(5).fill(0).map(() => Math.random() > 0.5 ? "Available" : "Unavailable"));
        setAvailabilityData(dummyAvailability);
        setModalVisible(true);
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
        { title: "ID", dataIndex: "id", key: "id" },
        { title: "Name", dataIndex: "name", key: "name" },
        { title: "Base Location", dataIndex: "location", key: "location" },
        { title: "Availability", dataIndex: "id", key: "availability", render: (text, record) => <Button onClick={() => handleShowAvailability(record.id)}>Show Availability</Button> },
    ] : selectedOption === "Bookings" ? [
        { title: "Booking ID", dataIndex: "bookingid", key: "bookingid" },
        { title: "Client ID", dataIndex: "client-id", key: "client-id" },
        { title: "Worker ID", dataIndex: "worker-id", key: "worker-id" },
        { title: "Client Name", dataIndex: "client-name", key: "client-name" },
        { title: "Worker Name", dataIndex: "worker-name", key: "worker-name" },
        { title: "Date", dataIndex: "date", key: "date" },
        { title: "Slot", dataIndex: "slot", key: "slot" },
        { title: "Status", dataIndex: "status", key: "status" },
        { title: "Reoccurrence", dataIndex: "reocc", key: "reocc" },
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
                                                        href="">
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
                    <div className="col-md-12">
                        <div className="d-flex justify-content-center">
                            <Button
                                className={`mr-2 ${selectedOption === "Clients" ? "btn-primary" : ""}`}
                                onClick={() => handleMenuClick("Clients")}
                            >
                                Clients
                            </Button>
                            <Button
                                className={`mr-2 ${selectedOption === "Workers" ? "btn-primary" : ""}`}
                                onClick={() => handleMenuClick("Workers")}
                            >
                                Workers
                            </Button>
                            <Button
                                className={`${selectedOption === "Bookings" ? "btn-primary" : ""}`}
                                onClick={() => handleMenuClick("Bookings")}
                            >
                                Bookings
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col-md-12">
                        <Search
                            placeholder={`Search ${selectedOption}`}
                            onSearch={handleSearch}
                            enterButton
                            disabled={!selectedOption}
                        />
                    </div>
                </div>
                <Table columns={columns} dataSource={data} />
            </div>
            <Modal
                title="Worker Availability"
                visible={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null}
            >
                <div className="availability-grid">
                    {availabilityData.map((week, weekIndex) => (
                        <div key={weekIndex} className="week-row">
                            {week.map((slot, slotIndex) => (
                                <div
                                    key={slotIndex}
                                    className={`time-slot ${slot === "Available" ? "available" : "unavailable"}`}
                                >
                                    {slot}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </Modal>
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
