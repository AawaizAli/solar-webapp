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
    getById as getBookingById,
    getByClientId as getBookingByClientId,
    getByWorkerId as getBookingByWorkerId,
    getByClientName as getBookingByClientName,
    getByWorkerName as getBookingByWorkerName,
    getByStatus,
    getByTimeSlot,
    getByRecurrence,
} from "../features/bookings/bookingsSlice";
import {
    getAllClients,
    getById as getClientById,
    getByName as getClientByName,
    getByContact as getClientByContact,
    getByAddress as getClientByAddress,
    getByTotalPanels as getClientByTotalPanels,
    getByCharges as getClientByCharges,
    getBySubscriptionPlan,
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
    const [tableData, setTableData] = useState([]);
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
            dispatch(getAllClients()).then((action) => {
                if (action.payload) {
                    const mappedClients = action.payload.map((client) => ({
                        ...client,
                        key: client.id,
                    }));
                    setTableData(mappedClients);
                }
            });
        } else if (option === "Workers") {
            dispatch(getAllWorkers()).then((action) => {
                if (action.payload) {
                    const mappedWorkers = action.payload.map((worker) => ({
                        ...worker,
                        key: worker.id,
                    }));
                    setTableData(mappedWorkers);
                }
            });
        } else if (option === "Bookings") {
            dispatch(getAllBookings()).then((action) => {
                if (action.payload) {
                    const mappedBookings = action.payload.map((booking) => ({
                        ...booking,
                        key: booking.id,
                        client_name: booking.client.name,
                        worker_name: booking.worker.name,
                    }));
                    setTableData(mappedBookings);
                }
            });
        }
    };

    const handleSearch = () => {
        console.log("handleSearch");

        if (!selectedOption || !selectedField || !searchQuery) {
            console.log("something missing");
            return;
        }

        if (selectedOption === "Workers") {
            if (selectedField === "ID") {
                dispatch(getById(searchQuery)).then((action) => {
                    if (action.payload) {
                        setTableData(
                            action.payload.map((item) => ({
                                ...item,
                                key: item.id,
                            }))
                        );
                    }
                });
            } else if (selectedField === "Name") {
                dispatch(getByName(searchQuery)).then((action) => {
                    if (action.payload) {
                        setTableData(
                            action.payload.map((item) => ({
                                ...item,
                                key: item.id,
                            }))
                        );
                    }
                });
            } else if (selectedField === "Base Location") {
                dispatch(getByBaseLocation(searchQuery)).then((action) => {
                    if (action.payload) {
                        setTableData(
                            action.payload.map((item) => ({
                                ...item,
                                key: item.id,
                            }))
                        );
                    }
                });
            }
        } else if (selectedOption === "Clients") {
            if (selectedField === "ID") {
                dispatch(getClientById(searchQuery)).then((action) => {
                    if (action.payload) {
                        setTableData(
                            action.payload.map((item) => ({
                                ...item,
                                key: item.id,
                            }))
                        );
                    }
                });
            } else if (selectedField === "Name") {
                dispatch(getClientByName(searchQuery)).then((action) => {
                    if (action.payload) {
                        setTableData(
                            action.payload.map((item) => ({
                                ...item,
                                key: item.id,
                            }))
                        );
                    }
                });
            } else if (selectedField === "Contact") {
                dispatch(getClientByContact(searchQuery)).then((action) => {
                    if (action.payload) {
                        setTableData(
                            action.payload.map((item) => ({
                                ...item,
                                key: item.id,
                            }))
                        );
                    }
                });
            } else if (selectedField === "Address") {
                dispatch(getClientByAddress(searchQuery)).then((action) => {
                    if (action.payload) {
                        setTableData(
                            action.payload.map((item) => ({
                                ...item,
                                key: item.id,
                            }))
                        );
                    }
                });
            } else if (selectedField === "Total Panels") {
                dispatch(getClientByTotalPanels(searchQuery)).then((action) => {
                    if (action.payload) {
                        setTableData(
                            action.payload.map((item) => ({
                                ...item,
                                key: item.id,
                            }))
                        );
                    }
                });
            } else if (selectedField === "Charges per Clean") {
                dispatch(getClientByCharges(searchQuery)).then((action) => {
                    if (action.payload) {
                        setTableData(
                            action.payload.map((item) => ({
                                ...item,
                                key: item.id,
                            }))
                        );
                    }
                });
            } else if (selectedField === "Subscription Plan") {
                dispatch(getBySubscriptionPlan(searchQuery)).then((action) => {
                    if (action.payload) {
                        setTableData(
                            action.payload.map((item) => ({
                                ...item,
                                key: item.id,
                            }))
                        );
                    }
                });
            }
        } else if (selectedOption === "Bookings") {
            if (selectedField === "Booking ID") {
                dispatch(getBookingById(searchQuery)).then((action) => {
                    if (action.payload) {
                        setTableData([
                            {
                                ...action.payload,
                                key: action.payload.id,
                                client_name: action.payload.client.name,
                                worker_name: action.payload.worker.name,
                            },
                        ]);
                    }
                });
            } else if (selectedField === "Client ID") {
                dispatch(getBookingByClientId(searchQuery)).then((action) => {
                    if (action.payload) {
                        setTableData(
                            action.payload.map((item) => ({
                                ...item,
                                key: item.id,
                                client_name: item.client.name,
                                worker_name: item.worker.name,
                            }))
                        );
                    }
                });
            } else if (selectedField === "Worker ID") {
                dispatch(getBookingByWorkerId(searchQuery)).then((action) => {
                    if (action.payload) {
                        setTableData(
                            action.payload.map((item) => ({
                                ...item,
                                key: item.id,
                                client_name: item.client.name,
                                worker_name: item.worker.name,
                            }))
                        );
                    }
                });
            } else if (selectedField === "Client Name") {
                dispatch(getBookingByClientName(searchQuery)).then((action) => {
                    if (action.payload) {
                        setTableData(
                            action.payload.map((item) => ({
                                ...item,
                                key: item.id,
                                client_name: item.client.name,
                                worker_name: item.worker.name,
                            }))
                        );
                    }
                });
            } else if (selectedField === "Worker Name") {
                dispatch(getBookingByWorkerName(searchQuery)).then((action) => {
                    if (action.payload) {
                        setTableData(
                            action.payload.map((item) => ({
                                ...item,
                                key: item.id,
                                client_name: item.client.name,
                                worker_name: item.worker.name,
                            }))
                        );
                    }
                });
            } else if (selectedField === "Status") {
                dispatch(getByStatus(searchQuery)).then((action) => {
                    if (action.payload) {
                        setTableData(
                            action.payload.map((item) => ({
                                ...item,
                                key: item.id,
                                client_name: item.client.name,
                                worker_name: item.worker.name,
                            }))
                        );
                    }
                });
            } else if (selectedField === "Slot") {
                dispatch(getByTimeSlot(searchQuery)).then((action) => {
                    if (action.payload) {
                        setTableData(
                            action.payload.map((item) => ({
                                ...item,
                                key: item.id,
                                client_name: item.client.name,
                                worker_name: item.worker.name,
                            }))
                        );
                    }
                });
            } else if (selectedField === "Reoccurrence") {
                dispatch(getByRecurrence(searchQuery)).then((action) => {
                    if (action.payload) {
                        setTableData(
                            action.payload.map((item) => ({
                                ...item,
                                key: item.id,
                                client_name: item.client.name,
                                worker_name: item.worker.name,
                            }))
                        );
                    }
                });
            }
        }
    };

    const handleShowAvailability = (workerId) => {
        const selectedWorker = workers.find((worker) => worker.id === workerId);
        if (selectedWorker) {
            setAvailabilityData(selectedWorker.availability);
            setModalVisible(true);
        } else {
            console.error("Worker not found");
        }
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
                      title: "Subscription Plan (Months)",
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

    const data = tableData;

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
                  { label: "Charges per Clean", value: "charge_per_clean" },
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
                    <div className="col-md-4">
                        <Select
                            style={{ width: "100%" }}
                            placeholder="Select field"
                            onChange={(value) => setSelectedField(value)}
                            disabled={!selectedOption}>
                            {selectedOption === "Clients" && (
                                <>
                                    <Option value="ID">ID</Option>
                                    <Option value="Name">Name</Option>
                                    <Option value="Contact">Contact</Option>
                                    <Option value="Address">Address</Option>
                                    <Option value="Total Panels">
                                        Total Panels
                                    </Option>
                                    <Option value="Charges per Clean">
                                        Charges per Clean
                                    </Option>
                                    <Option value="Subscription Plan">
                                        Subscription Plan (Months)
                                    </Option>
                                </>
                            )}
                            {selectedOption === "Workers" && (
                                <>
                                    <Option value="ID">ID</Option>
                                    <Option value="Name">Name</Option>
                                    <Option value="Base Location">
                                        Base Location
                                    </Option>
                                    <Option value="Availability">
                                        Availability
                                    </Option>
                                </>
                            )}
                            {selectedOption === "Bookings" && (
                                <>
                                    <Option value="Booking ID">
                                        Booking ID
                                    </Option>
                                    <Option value="Client ID">Client ID</Option>
                                    <Option value="Worker ID">Worker ID</Option>
                                    <Option value="Client Name">
                                        Client Name
                                    </Option>
                                    <Option value="Worker Name">
                                        Worker Name
                                    </Option>
                                    <Option value="Date">Date</Option>
                                    <Option value="Slot">Slot</Option>
                                    <Option value="Status">Status</Option>
                                    <Option value="Reoccurrence">
                                        Reoccurrence
                                    </Option>
                                </>
                            )}
                        </Select>
                    </div>
                    <div className="col-md-6">
                        <Search
                            placeholder={`Search ${selectedOption}`}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onSearch={handleSearch}
                            enterButton
                            disabled={!selectedField}
                        />
                    </div>
                </div>
                <Table
                    columns={columns}
                    dataSource={data}
                    loading={loading}
                    rowKey="id"
                />
            </div>
            <Modal
                title="Worker Availability"
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null}>
                <div className="availability-grid">
                    {availabilityData.length > 0 ? (
                        availabilityData.map((week, weekIndex) => (
                            <div key={weekIndex} className="week-row">
                                {week.map((slot, slotIndex) => (
                                    <div
                                        key={slotIndex}
                                        className={`time-slot ${
                                            slot ? "available" : "unavailable"
                                        }`}>
                                        {slot ? "Available" : "Unavailable"}
                                    </div>
                                ))}
                            </div>
                        ))
                    ) : (
                        <p>No availability data to display.</p>
                    )}
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
                            TJ Solars
                        </a>
                    </p>
                </div>
            </footer>
        </>
    );
};

export default SearchPage;
