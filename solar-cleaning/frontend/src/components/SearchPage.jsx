import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Table, Input, Button, Modal, Select } from "antd";
import { Link } from "react-router-dom";
import {
    getAllWorkers,
    getById,
    getByName,
    getByArea as getWorkerByArea,
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
    getByArea as getClientByArea,
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

import Footer from "./Footer";
import Header from "./Header";

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
    const [workerModalVisible, setWorkerModalVisible] = useState(false);
    const [selectedWorker, setSelectedWorker] = useState([]);

    const dispatch = useDispatch();
    const clients = useSelector((state) => state?.clients?.clients);
    const workers = useSelector((state) => state?.workers?.workers);
    const bookings = useSelector((state) => state?.bookings?.bookings);
    const loadingClients = useSelector((state) => state?.clients?.loading);
    const loadingWorkers = useSelector((state) => state?.workers?.loading);
    const loadingBookings = useSelector((state) => state?.bookings?.loading);

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
                    // Sort by date
                    mappedClients.sort(
                        (a, b) => new Date(a.date) - new Date(b.date)
                    );
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
                    // Sort by date
                    mappedWorkers.sort(
                        (a, b) => new Date(a.date) - new Date(b.date)
                    );
                    setTableData(mappedWorkers);
                }
            });
        } else if (option === "Bookings") {
            dispatch(getAllBookings()).then((action) => {
                if (action.payload) {
                    const mappedBookings = action.payload.map((booking) => ({
                        ...booking,
                        key: booking.booking_id,
                        client_name: booking.client
                            ? booking.client.name
                            : "Unknown Client",
                        worker_names:
                            booking.workers && booking.workers.length > 0
                                ? booking.workers
                                      .map((worker) => worker.name)
                                      .join(", ")
                                : "Unknown Worker",
                        client_address: booking.client
                            ? booking.client.address
                            : "Unknown Address",
                        client_contact: booking.client
                            ? booking.client.contact_details
                            : "Unknown Contact",
                        total_panels: booking.client
                            ? booking.client.total_panels
                            : "Unknown",
                        charges_per_clean: booking.client
                            ? booking.client.charge_per_clean
                            : "Unknown",
                    }));
                    mappedBookings.sort(
                        (a, b) => new Date(a.date) - new Date(b.date)
                    );
                    setTableData(mappedBookings);
                }
            });
        }
    };

    const handleSearch = () => {
        if (!selectedOption || !selectedField || !searchQuery) {
            console.log("something missing");
            return;
        }

        const sortByDate = (data) => {
            return data.sort((a, b) => new Date(a.date) - new Date(b.date));
        };

        if (selectedOption === "Workers") {
            if (selectedField === "ID") {
                dispatch(getById(searchQuery)).then((action) => {
                    if (Array.isArray(action.payload)) {
                        setTableData(sortByDate(action.payload));
                    } else {
                        setTableData([]);
                    }
                });
            } else if (selectedField === "Name") {
                dispatch(getByName(searchQuery)).then((action) => {
                    if (Array.isArray(action.payload)) {
                        setTableData(sortByDate(action.payload));
                    } else {
                        setTableData([]);
                    }
                });
            } else if (selectedField === "Area") {
                dispatch(getWorkerByArea(searchQuery)).then((action) => {
                    if (Array.isArray(action.payload)) {
                        setTableData(sortByDate(action.payload));
                    } else {
                        setTableData([]);
                    }
                });
            }
        } else if (selectedOption === "Clients") {
            if (selectedField === "ID") {
                dispatch(getClientById(searchQuery)).then((action) => {
                    if (Array.isArray(action.payload)) {
                        setTableData(
                            sortByDate(
                                action.payload.map((item) => ({
                                    ...item,
                                    key: item.id,
                                }))
                            )
                        );
                    } else {
                        setTableData([]);
                    }
                });
            } else if (selectedField === "Name") {
                dispatch(getClientByName(searchQuery)).then((action) => {
                    if (Array.isArray(action.payload)) {
                        setTableData(
                            sortByDate(
                                action.payload.map((item) => ({
                                    ...item,
                                    key: item.id,
                                }))
                            )
                        );
                    } else {
                        setTableData([]);
                    }
                });
            } else if (selectedField === "Contact") {
                dispatch(getClientByContact(searchQuery)).then((action) => {
                    if (Array.isArray(action.payload)) {
                        setTableData(
                            sortByDate(
                                action.payload.map((item) => ({
                                    ...item,
                                    key: item.id,
                                }))
                            )
                        );
                    } else {
                        setTableData([]);
                    }
                });
            } else if (selectedField === "Address") {
                dispatch(getClientByAddress(searchQuery)).then((action) => {
                    if (Array.isArray(action.payload)) {
                        setTableData(
                            sortByDate(
                                action.payload.map((item) => ({
                                    ...item,
                                    key: item.id,
                                }))
                            )
                        );
                    } else {
                        setTableData([]);
                    }
                });
            } else if (selectedField === "Area") {
                dispatch(getClientByArea(searchQuery)).then((action) => {
                    if (Array.isArray(action.payload)) {
                        setTableData(sortByDate(action.payload));
                    } else {
                        setTableData([]);
                    }
                });
            } else if (selectedField === "Total Panels") {
                dispatch(getClientByTotalPanels(searchQuery)).then((action) => {
                    if (Array.isArray(action.payload)) {
                        setTableData(
                            sortByDate(
                                action.payload.map((item) => ({
                                    ...item,
                                    key: item.id,
                                }))
                            )
                        );
                    } else {
                        setTableData([]);
                    }
                });
            } else if (selectedField === "Charges per Clean") {
                dispatch(getClientByCharges(searchQuery)).then((action) => {
                    if (Array.isArray(action.payload)) {
                        setTableData(
                            sortByDate(
                                action.payload.map((item) => ({
                                    ...item,
                                    key: item.id,
                                }))
                            )
                        );
                    } else {
                        setTableData([]);
                    }
                });
            } else if (selectedField === "Subscription Plan") {
                dispatch(getBySubscriptionPlan(searchQuery)).then((action) => {
                    if (Array.isArray(action.payload)) {
                        setTableData(
                            sortByDate(
                                action.payload.map((item) => ({
                                    ...item,
                                    key: item.id,
                                }))
                            )
                        );
                    } else {
                        setTableData([]);
                    }
                });
            }
        } else if (selectedOption === "Bookings") {
            if (selectedField === "Booking ID") {
                dispatch(getBookingById(searchQuery)).then((action) => {
                    if (action.payload) {
                        setTableData(
                            sortByDate([
                                {
                                    ...action.payload,
                                    key: action.payload.id,
                                    client_name: action.payload.client.name,
                                    client_address:
                                        action.payload.client.address, // Adding client address
                                    client_contact:
                                        action.payload.client.contact_details, // Adding client contact
                                    total_panels:
                                        action.payload.client.total_panels, // Adding total panels
                                    charges_per_clean:
                                        action.payload.client.charge_per_clean, // Adding charges per clean
                                },
                            ])
                        );
                    } else {
                        setTableData([]);
                    }
                });
            } else if (selectedField === "Client ID") {
                dispatch(getBookingByClientId(searchQuery)).then((action) => {
                    if (Array.isArray(action.payload)) {
                        setTableData(
                            sortByDate(
                                action.payload.map((item) => ({
                                    ...item,
                                    key: item.id,
                                    client_name: item.client.name,
                                    worker_name: item.worker.name,
                                    client_address: item.client.address, // Adding client address
                                    client_contact: item.client.contact_details, // Adding client contact
                                    total_panels: item.client.total_panels, // Adding total panels
                                    charges_per_clean:
                                        item.client.charge_per_clean, // Adding charges per clean
                                }))
                            )
                        );
                    } else {
                        setTableData([]);
                    }
                });
            } else if (selectedField === "Worker ID") {
                dispatch(getBookingByWorkerId(searchQuery)).then((action) => {
                    if (Array.isArray(action.payload)) {
                        setTableData(
                            sortByDate(
                                action.payload.map((item) => ({
                                    ...item,
                                    key: item.id,
                                    client_name: item.client.name,
                                    worker_name: item.worker.name,
                                    client_address: item.client.address, // Adding client address
                                    client_contact: item.client.contact_details, // Adding client contact
                                    total_panels: item.client.total_panels, // Adding total panels
                                    charges_per_clean:
                                        item.client.charge_per_clean, // Adding charges per clean
                                }))
                            )
                        );
                    } else {
                        setTableData([]);
                    }
                });
            } else if (selectedField === "Client Name") {
                dispatch(getBookingByClientName(searchQuery)).then((action) => {
                    if (Array.isArray(action.payload)) {
                        setTableData(
                            sortByDate(
                                action.payload.map((item) => ({
                                    ...item,
                                    key: item.id,
                                    client_name: item.client.name,
                                    worker_name: item.worker.name,
                                    client_address: item.client.address, // Adding client address
                                    client_contact: item.client.contact_details, // Adding client contact
                                    total_panels: item.client.total_panels, // Adding total panels
                                    charges_per_clean:
                                        item.client.charge_per_clean, // Adding charges per clean
                                }))
                            )
                        );
                    } else {
                        setTableData([]);
                    }
                });
            } else if (selectedField === "Worker Name") {
                dispatch(getBookingByWorkerName(searchQuery)).then((action) => {
                    if (Array.isArray(action.payload)) {
                        setTableData(
                            sortByDate(
                                action.payload.map((item) => ({
                                    ...item,
                                    key: item.id,
                                    client_name: item.client.name,
                                    worker_name: item.worker.name,
                                    client_address: item.client.address, // Adding client address
                                    client_contact: item.client.contact_details, // Adding client contact
                                    total_panels: item.client.total_panels, // Adding total panels
                                    charges_per_clean:
                                        item.client.charge_per_clean, // Adding charges per clean
                                }))
                            )
                        );
                    } else {
                        setTableData([]);
                    }
                });
            } else if (selectedField === "Status") {
                dispatch(getByStatus(searchQuery)).then((action) => {
                    if (Array.isArray(action.payload)) {
                        setTableData(
                            sortByDate(
                                action.payload.map((item) => ({
                                    ...item,
                                    key: item.id,
                                    client_name: item.client.name,
                                    worker_name: item.worker.name,
                                    client_address: item.client.address, // Adding client address
                                    client_contact: item.client.contact_details, // Adding client contact
                                    total_panels: item.client.total_panels, // Adding total panels
                                    charges_per_clean:
                                        item.client.charge_per_clean, // Adding charges per clean
                                }))
                            )
                        );
                    } else {
                        setTableData([]);
                    }
                });
            } else if (selectedField === "Slot") {
                dispatch(getByTimeSlot(searchQuery)).then((action) => {
                    if (Array.isArray(action.payload)) {
                        setTableData(
                            sortByDate(
                                action.payload.map((item) => ({
                                    ...item,
                                    key: item.id,
                                    client_name: item.client.name,
                                    worker_name: item.worker.name,
                                    client_address: item.client.address, // Adding client address
                                    client_contact: item.client.contact_details, // Adding client contact
                                    total_panels: item.client.total_panels, // Adding total panels
                                    charges_per_clean:
                                        item.client.charge_per_clean, // Adding charges per clean
                                }))
                            )
                        );
                    } else {
                        setTableData([]);
                    }
                });
            } else if (selectedField === "Recurrence") {
                dispatch(getByRecurrence(searchQuery)).then((action) => {
                    if (Array.isArray(action.payload)) {
                        setTableData(
                            sortByDate(
                                action.payload.map((item) => ({
                                    ...item,
                                    key: item.id,
                                    client_name: item.client.name,
                                    worker_name: item.worker.name,
                                    client_address: item.client.address, // Adding client address
                                    client_contact: item.client.contact_details, // Adding client contact
                                    total_panels: item.client.total_panels, // Adding total panels
                                    charges_per_clean:
                                        item.client.charge_per_clean, // Adding charges per clean
                                }))
                            )
                        );
                    } else {
                        setTableData([]);
                    }
                });
            }
        }
    };

    const handleShowAvailability = (workerId) => {
        dispatch(getAllWorkers())
            .then((data) => {
                const myWorkers = data.payload;
                console.log(myWorkers);

                if (!myWorkers || myWorkers.length === 0) {
                    console.error("rida ashfaq qureshi");
                    return;
                }

                const selectedWorker = myWorkers.find(
                    (worker) => worker.id === workerId
                );

                if (selectedWorker) {
                    console.log("Selected Worker:", selectedWorker);
                    setAvailabilityData(selectedWorker.availability);
                    setModalVisible(true);
                } else {
                    console.error("no worker");
                }
            })
            .catch((error) => {
                console.error("Error fetching workers data:", error);
            });

        console.log("workerId:", workerId);
    };

    const dayNames = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
    ];
    const timeSlots = [
        "09:00-11:00",
        "11:00-13:00",
        "13:00-15:00",
        "15:00-17:00",
        "17:00-19:00",
    ];

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
                      title: "Area",
                      dataIndex: "area",
                      key: "area",
                  },
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
              ]
            : selectedOption === "Workers"
            ? [
                  { title: "ID", dataIndex: "id", key: "id" },
                  { title: "Name", dataIndex: "name", key: "name" },
                  {
                      title: "Area",
                      dataIndex: "area",
                      key: "area",
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
                      title: "Client Name",
                      dataIndex: "client_name",
                      key: "client_name",
                  },
                  {
                      title: "Worker Names",
                      dataIndex: "workers",
                      key: "workers",
                      render: (text, record) => (
                          <Button
                              onClick={() => {
                                  setSelectedWorker(record.workers);
                                  setWorkerModalVisible(true);
                              }}>
                              Show Workers
                          </Button>
                      ),
                  },
                  {
                      title: "Client Address",
                      dataIndex: "client_address",
                      key: "client_address",
                  },
                  {
                      title: "Client Contact",
                      dataIndex: "client_contact",
                      key: "client_contact",
                  },
                  {
                      title: "Total Panels",
                      dataIndex: "total_panels",
                      key: "total_panels",
                  },
                  {
                      title: "Charges per Clean",
                      dataIndex: "charges_per_clean",
                      key: "charges_per_clean",
                  },
                  { title: "Date", dataIndex: "date", key: "date" },
                  { title: "Slot", dataIndex: "time_slot", key: "time_slot" },
                  { title: "Status", dataIndex: "status", key: "status" },
                  {
                      title: "Recurrence",
                      dataIndex: "recurrence",
                      key: "recurrence",
                      render: (text) =>
                          text === "ten"
                              ? "Every 10 Days"
                              : text === "twenty"
                              ? "Every 20 Days"
                              : text,
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
                  { label: "Area", value: "area" },
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
                  { label: "Area", value: "area" },
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
                  { label: "Recurrence", value: "recurrence" },
              ]
            : [];

    return (
        <>
            {console.log(workers)}
            <div className="hero_area">
                <Header></Header>
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
                                    <Option value="Area">Area</Option>
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
                                    <Option value="Area">Area</Option>
                                    {/* <Option value="Availability">
                                        Availability
                                    </Option> */}
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
                                    <Option value="Date">Date</Option>
                                    <Option value="Slot">Slot</Option>
                                    <Option value="Status">Status</Option>
                                    <Option value="Recurrence">
                                        Recurrence
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
                title="Assigned Workers"
                open={workerModalVisible}
                onCancel={() => setWorkerModalVisible(false)}
                footer={null}>
                <ul>
                    {selectedWorker.map((worker) => (
                        <li key={worker.id}>
                            {worker.name} - {worker.area}
                        </li>
                    ))}
                </ul>
            </Modal>

            <Modal
                title="Worker Availability"
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null}>
                <div className="availability-grid">
                    {availabilityData.length > 0 ? (
                        availabilityData.map((dayAvailability, dayIndex) => (
                            <div key={dayIndex} className="day-row">
                                <h6>{dayNames[dayIndex]}</h6>
                                {dayAvailability.map(
                                    (isAvailable, slotIndex) => (
                                        <div
                                            key={slotIndex}
                                            className={`time-slot ${
                                                isAvailable
                                                    ? "available"
                                                    : "unavailable"
                                            }`}
                                            style={{
                                                color: isAvailable
                                                    ? "green"
                                                    : "red",
                                            }}>
                                            {timeSlots[slotIndex]} (
                                            {isAvailable
                                                ? "Available"
                                                : "Unavailable"}
                                            )
                                        </div>
                                    )
                                )}
                            </div>
                        ))
                    ) : (
                        <p>No availability data to display.</p>
                    )}
                </div>
            </Modal>

            <Footer></Footer>
        </>
    );
};

export default SearchPage;
