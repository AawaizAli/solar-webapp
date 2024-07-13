import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Table, Input, Button, Modal, Select } from "antd";

import {
    getAllWorkers,
    getById,
    getByName,
    getByBaseLocation,
} from "../features/workers/workersSlice";

import {
    getAllBookings,
    getByClientId as getBookingByClientId,
    getByWorkerId as getBookingByWorkerId,
    getByClientName as getBookingByClientName,
    getByWorkerName as getBookingByWorkerName,
    getByStatus,
    getByTimeSlot,
    getByRecurrence
} from "../features/bookings/bookingsSlice";

import {
    getAllClients,
    getById as getClientById,
    getByName as getClientByName,
    getByContact as getClientByContact,
    getByAddress as getClientByAddress,
    getByTotalPanels as getClientByTotalPanels,
    getByCharges as getClientByCharges
} from "../features/clients/clientsSlice";

import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import "../../public/css/responsive.css";
import "../../public/css/style.css";

const { Search } = Input;
const { Option } = Select;

const SearchPage = () => {
    const authState = useSelector((state) => state.auth);
    const actualIsAuthenticated = authState?.isAuthenticated ?? false;
    const actualUser = authState?.user ?? { username: "Guest" };

    const [selectedOption, setSelectedOption] = useState(null);
    const [selectedField, setSelectedField] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [availabilityData, setAvailabilityData] = useState([]);
    const [searchField, setSearchField] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const dispatch = useDispatch();
    const clients = useSelector((state) => state.clients.clients);
    const workers = useSelector((state) => state.workers.workers);
    const bookings = useSelector((state) => state.bookings.bookings);
    const loadingClients = useSelector((state) => state.clients.loading);
    const loadingWorkers = useSelector((state) => state.workers.loading);
    const loadingBookings = useSelector((state) => state.bookings.loading);

    const handleMenuClick = (option) => {
        setSelectedOption(option);
        setSelectedField(null); // Reset the selected field
        setSearchQuery("");
        fetchData(option);
    };

    const fetchData = (option) => {
        if (option === "Clients") {
            dispatch(getAllClients());
        } else if (option === "Workers") {
            dispatch(getAllWorkers());
        } else if (option === "Bookings") {
            dispatch(getAllBookings()).then((action) => {
                if (action.payload) {
                    const mappedBookings = action.payload.map((booking) => ({
                        ...booking,
                        client_name: booking.client.name,
                        worker_name: booking.worker.name,
                    }));
                    setData(mappedBookings);
                }
            });
        }
    };

    const handleSearch = () => {
        if (!selectedOption || !searchField || !searchQuery) {
            return;
        }

        if (selectedOption === "Workers") {
            if (searchField === "ID") {
                dispatch(getById(searchQuery));
            } else if (searchField === "Name") {
                dispatch(getByName(searchQuery));
            } else if (searchField === "Base Location") {
                dispatch(getByBaseLocation(searchQuery));
            }
        } else if (selectedOption === "Clients") {
            if (searchField === "ID") {
                dispatch(getClientById(searchQuery));
            } else if (searchField === "Name") {
                dispatch(getClientByName(searchQuery));
            } else if (searchField === "Contact") {
                dispatch(getClientByContact(searchQuery));
            } else if (searchField === "Address") {
                dispatch(getClientByAddress(searchQuery));
            } else if (searchField === "Total Panels") {
                dispatch(getClientByTotalPanels(searchQuery));
            } else if (searchField === "Charges per Clean") {
                dispatch(getClientByCharges(searchQuery));
            }
        } else if (selectedOption === "Bookings") {
            if (searchField === "Client ID") {
                dispatch(getBookingByClientId(searchQuery));
            } else if (searchField === "Worker ID") {
                dispatch(getBookingByWorkerId(searchQuery));
            } else if (searchField === "Client Name") {
                dispatch(getBookingByClientName(searchQuery));
            } else if (searchField === "Worker Name") {
                dispatch(getBookingByWorkerName(searchQuery));
            } else if (searchField === "Status") {
                dispatch(getByStatus(searchQuery));
            } else if (searchField === "Slot") {
                dispatch(getByTimeSlot(searchQuery));
            } else if (searchField === "Reoccurrence") {
                dispatch(getByRecurrence(searchQuery));
            }
        }
    };

    const handleShowAvailability = (workerId) => {
        console.log(`Fetching availability for worker ${workerId}`);
        const dummyAvailability = Array(7)
            .fill(null)
            .map(() =>
                Array(5)
                    .fill(0)
                    .map(() =>
                        Math.random() > 0.5 ? "Available" : "Unavailable"
                    )
            );
        setAvailabilityData(dummyAvailability);
        setModalVisible(true);
    };

    const columns =
        selectedOption === "Clients"
            ? [
                  { title: "ID", dataIndex: "id", key: "id" },
                  { title: "Name", dataIndex: "name", key: "name" },
                  {
                      title: "Contact",
                      dataIndex: "contact_details",
                      key: "contact_details",
                  },
                  { title: "Address", dataIndex: "address", key: "address" },
                  {
                      title: "Total Panels",
                      dataIndex: "total_panels",
                      key: "total_panels",
                  },
                  {
                      title: "Charges per Clean",
                      dataIndex: "charge_per_clean",
                      key: "charge_per_clean",
                  },
                  {
                      title: "Subscription Plan",
                      dataIndex: "subscription_plan",
                      key: "subscription_plan",
                  },
                  {
                      title: "Subscription Start",
                      dataIndex: "subscription_start",
                      key: "subscription_start",
                  },
                  {
                      title: "Subscription End",
                      dataIndex: "subscription_end",
                      key: "subscription_end",
                  },
              ]
            : selectedOption === "Workers"
            ? [
                  { title: "ID", dataIndex: "id", key: "id" },
                  { title: "Name", dataIndex: "name", key: "name" },
                  {
                      title: "Base Location",
                      dataIndex: "base_location",
                      key: "base_location",
                  },
                  {
                      title: "Availability",
                      dataIndex: "id",
                      key: "availability",
                      render: (text, record) => (
                          <Button
                              onClick={() => handleShowAvailability(record.id)}>
                              Show Availability
                          </Button>
                      ),
                  },
              ]
            : selectedOption === "Bookings"
            ? [
                  { title: "Booking ID", dataIndex: "id", key: "id" },
                  {
                      title: "Client ID",
                      dataIndex: "client_id",
                      key: "client_id",
                  },
                  {
                      title: "Worker ID",
                      dataIndex: "worker_id",
                      key: "worker_id",
                  },
                  {
                      title: "Client Name",
                      dataIndex: "client_name",
                      key: "client_name",
                  },
                  {
                      title: "Worker Name",
                      dataIndex: "worker_name",
                      key: "worker_name",
                  },
                  { title: "Date", dataIndex: "date", key: "date" },
                  { title: "Slot", dataIndex: "time_slot", key: "time_slot" },
                  { title: "Status", dataIndex: "status", key: "status" },
                  {
                      title: "Reoccurrence",
                      dataIndex: "recurrence",
                      key: "recurrence",
                  },
              ]
            : [];

    const data =
        selectedOption === "Clients"
            ? clients
            : selectedOption === "Workers"
            ? workers
            : selectedOption === "Bookings"
            ? bookings
            : [];

    const loading =
        selectedOption === "Clients"
            ? loadingClients
            : selectedOption === "Workers"
            ? loadingWorkers
            : selectedOption === "Bookings"
            ? loadingBookings
            : false;

    const fields =
        selectedOption === "Clients"
            ? [
                  { label: "ID", value: "id" },
                  { label: "Name", value: "name" },
                  { label: "Contact", value: "contact_details" },
                  { label: "Address", value: "address" },
                  { label: "Total Panels", value: "total_panels" },
                  { label: "Charges per Clean", value: "charges" },
                  { label: "Subscription Plan", value: "subscription_plan" },
                  { label: "Subscription Start", value: "subscription_start" },
                  { label: "Subscription End", value: "subscription_end" },
              ]
            : selectedOption === "Workers"
            ? [
                  { label: "ID", value: "id" },
                  { label: "Name", value: "name" },
                  { label: "Base Location", value: "base_location" },
                  { label: "Availability", value: "availability" },
              ]
            : selectedOption === "Bookings"
            ? [
                  { label: "Booking ID", value: "id" },
                  { label: "Client ID", value: "client_id" },
                  { label: "Worker ID", value: "worker_id" },
                  { label: "Client Name", value: "client_name" },
                  { label: "Worker Name", value: "worker_name" },
                  { label: "Date", value: "date" },
                  { label: "Slot", value: "time_slot" },
                  { label: "Status", value: "status" },
                  { label: "Reoccurrence", value: "recurrence" },
              ]
            : [];

    return (
        <>
            <div className="hero_area">
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
            </div>
            <div className="container mt-4">
                <div className="row mb-3">
                    <div className="col-md-12">
                        <div className="d-flex justify-content-center">
                            <Button
                                className={`search-menu-btn mr-2 ${
                                    selectedOption === "Clients"
                                        ? "btn-primary"
                                        : ""
                                }`}
                                onClick={() => handleMenuClick("Clients")}>
                                Clients
                            </Button>
                            <Button
                                className={`search-menu-btn mr-2 ${
                                    selectedOption === "Workers"
                                        ? "btn-primary"
                                        : ""
                                }`}
                                onClick={() => handleMenuClick("Workers")}>
                                Workers
                            </Button>
                            <Button
                                className={`search-menu-btn ${
                                    selectedOption === "Bookings"
                                        ? "btn-primary"
                                        : ""
                                }`}
                                onClick={() => handleMenuClick("Bookings")}>
                                Bookings
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col-md-2 d-flex align-items-center">
                        <span>Search By:</span>
                    </div>
                    <div className="col-md-3">
                        <Select
                            style={{ width: "100%" }}
                            placeholder="Select field"
                            onChange={(value) => setSearchField(value)}
                            disabled={!selectedOption}>
                            {selectedOption === "Clients" && (
                                <>
                                    <Option value="id">ID</Option>
                                    <Option value="name">Name</Option>
                                    <Option value="contact_details">
                                        Contact
                                    </Option>
                                    <Option value="address">Address</Option>
                                    <Option value="total_panels">
                                        Total Panels
                                    </Option>
                                    <Option value="charges">
                                        Charges per Clean
                                    </Option>
                                    <Option value="subscription_plan">
                                        Subscription Plan
                                    </Option>
                                    <Option value="subscription_start">
                                        Subscription Start
                                    </Option>
                                    <Option value="subscription_end">
                                        Subscription End
                                    </Option>
                                </>
                            )}
                            {selectedOption === "Workers" && (
                                <>
                                    <Option value="id">ID</Option>
                                    <Option value="name">Name</Option>
                                    <Option value="base_location">
                                        Base Location
                                    </Option>
                                    <Option value="availability">
                                        Availability
                                    </Option>
                                </>
                            )}
                            {selectedOption === "Bookings" && (
                                <>
                                    <Option value="id">Booking ID</Option>
                                    <Option value="client_id">Client ID</Option>
                                    <Option value="worker_id">Worker ID</Option>
                                    <Option value="client_name">
                                        Client Name
                                    </Option>
                                    <Option value="worker_name">
                                        Worker Name
                                    </Option>
                                    <Option value="date">Date</Option>
                                    <Option value="time_slot">Slot</Option>
                                    <Option value="status">Status</Option>
                                    <Option value="recurrence">
                                        Reoccurrence
                                    </Option>
                                </>
                            )}
                        </Select>
                    </div>
                    <div className="col-md-5">
                        <Search
                            placeholder={`Search ${selectedOption}`}
                            onSearch={handleSearch}
                            enterButton
                            disabled={!selectedField}
                        />
                    </div>
                    <div className="col-md-2">
                        <Button
                            type="primary"
                            onClick={() => handleSearch()}
                            disabled={!selectedField}>
                            Search
                        </Button>
                    </div>
                </div>
                <Table columns={columns} dataSource={data} loading={loading} />
            </div>
            <Modal
                title="Worker Availability"
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null}>
                <div className="availability-grid">
                    {availabilityData.map((week, weekIndex) => (
                        <div key={weekIndex} className="week-row">
                            {week.map((slot, slotIndex) => (
                                <div
                                    key={slotIndex}
                                    className={`time-slot ${
                                        slot === "Available"
                                            ? "available"
                                            : "unavailable"
                                    }`}>
                                    {slot}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </Modal>
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
            <footer className="footer_section">
                <div className="container">
                    <p>
                        © <span id="displayDateYear" /> All Rights Reserved By{" "}
                        <a href="https://www.behance.net/aawaizali">
                            Aawaiz Ali
                        </a>
                    </p>
                </div>
            </footer>
        </>
    );
};

export default SearchPage;
