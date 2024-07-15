import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Modal, Form, Input, Select, Button } from "antd";
import { deleteBooking, createBooking, getAllBookings, updateBooking } from "../features/bookings/bookingsSlice";

import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import "../../public/css/responsive.css";
import "../../public/css/style.css";

import professionalImg from "../../public/professional-img.png";

const Booking = () => {
    const [bookingId, setBookingId] = useState("");
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [form] = Form.useForm();
    const dispatch = useDispatch();

    const authState = useSelector((state) => state.auth);
    const actualIsAuthenticated = authState?.isAuthenticated ?? false;
    const actualUser = authState?.user ?? { username: "Guest" };

    const showCreateModal = () => {
        setBookingId("");
        setIsEditMode(false);
        setIsCreateModalVisible(true);
    };

    const handleCreateModalCancel = () => {
        setIsCreateModalVisible(false);
        form.resetFields();
    };

    const handleEditBooking = () => {
        const id = prompt("Enter Booking ID to edit:");
        if (id) {
            dispatch(getAllBookings()).then((action) => {
                const booking = action.payload.find(
                    (booking) => booking.id === parseInt(id)
                );
                if (booking) {
                    form.setFieldsValue({
                        ...booking,
                        client_id: booking.client_id.toString(),
                        worker_id: booking.worker_id
                            ? booking.worker_id.toString()
                            : "",
                        time_slot: booking.time_slot.toString(),
                    });
                    setBookingId(id); // Set bookingId for editing mode
                    setIsEditMode(true);
                    setIsCreateModalVisible(true);
                } else {
                    alert("Booking not found!");
                }
            });
        }
    };

    const handleCreateBooking = (values) => {
        const formattedValues = {
            ...values,
            client_id: parseInt(values.client_id, 10),
            worker_id: values.worker_id ? parseInt(values.worker_id, 10) : null,
            time_slot: parseInt(values.time_slot, 10),

            // Convert time_slot to an integer
        };
        console.log("Formatted Values:", formattedValues);
        if (isEditMode) {
            dispatch(updateBooking({ id: bookingId, updatedData: formattedValues }))
                .then(() => {
                    setIsCreateModalVisible(false);
                    form.resetFields();
                    setIsEditMode(false);
                })
                .catch((error) => {
                    console.error("Error updating booking:", error);
                });
        } else {
            dispatch(createBooking(formattedValues))
                .then(() => {
                    setIsCreateModalVisible(false);
                    form.resetFields();
                })
                .catch((error) => {
                    console.error("Error creating booking:", error);
                });
        }
    };

    const handleDeleteBooking = () => {
        const id = prompt("Enter Booking ID to delete:");
        if (id) {
            dispatch(deleteBooking(id));
        }
    };

    return (
        <>
            <meta charSet="utf-8" />
            <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
            <meta name="keywords" content="" />
            <meta name="description" content="" />
            <meta name="author" content="" />
            <title>SolarPod</title>
            <link
                rel="stylesheet"
                type="text/css"
                href="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.min.css"
            />
            <link rel="stylesheet" type="text/css" href="css/bootstrap.css" />
            <link
                rel="stylesheet"
                type="text/css"
                href="css/font-awesome.min.css"
            />
            <link href="css/style.css" rel="stylesheet" />
            <link href="css/responsive.css" rel="stylesheet" />
            <div className="hero_area">
                <Modal
                    title={isEditMode ? "Update Booking" : "Create Booking"}
                    open={isCreateModalVisible}
                    onCancel={handleCreateModalCancel}
                    footer={null}>
                    <Form
                        form={form}
                        onFinish={handleCreateBooking}
                        layout="vertical">
                        <Form.Item
                            name="client_id"
                            label="Client ID"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input the client ID!",
                                },
                            ]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="worker_id" label="Worker ID">
                            <Input placeholder="Leave empty for automatic assignment" />
                        </Form.Item>
                        <Form.Item
                            name="date"
                            label="Date"
                            rules={[
                                {
                                    required: true,
                                    message: "Please select the date!",
                                },
                            ]}>
                            <Input type="date" />
                        </Form.Item>
                        <Form.Item
                            name="time_slot"
                            label="Time Slot"
                            rules={[
                                {
                                    required: true,
                                    message: "Please select a time slot!",
                                },
                            ]}>
                            <Select>
                                <Select.Option value="0">
                                    09:00-11:00
                                </Select.Option>
                                <Select.Option value="1">
                                    11:00-13:00
                                </Select.Option>
                                <Select.Option value="2">
                                    13:00-15:00
                                </Select.Option>
                                <Select.Option value="3">
                                    15:00-17:00
                                </Select.Option>
                                <Select.Option value="4">
                                    17:00-19:00
                                </Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="status"
                            label="Status"
                            rules={[
                                {
                                    required: true,
                                    message: "Please select the status!",
                                },
                            ]}>
                            <Select>
                                <Select.Option value="Scheduled">
                                    Scheduled
                                </Select.Option>
                                <Select.Option value="Completed">
                                    Completed
                                </Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name="recurrence" label="Recurrence">
                            <Select>
                                <Select.Option value="weekly">
                                    Weekly
                                </Select.Option>
                                <Select.Option value="biweekly">
                                    Biweekly
                                </Select.Option>
                                <Select.Option value="monthly">
                                    Monthly
                                </Select.Option>
                                <Select.Option value="bimonthly">
                                    Bimonthly
                                </Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                {isEditMode
                                    ? "Update Booking"
                                    : "Create Booking"}
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>

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
                                                        Logout
                                                    </a>
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
            {/* professional section */}
            <section className="professional_section booking_padding">
                <div id="professional_section" className="container">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="img-box">
                                <img src={professionalImg} alt="" />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="detail-box center-detail-box">
                                <h2>manage your bookings</h2>

                                <a href="#" onClick={showCreateModal}>
                                    Create Booking
                                </a>
                                <br />
                                <a href="#" onClick={handleEditBooking}>
                                    Update Booking
                                </a>

                                <br />
                                <a
                                    className="delete-button"
                                    href="#"
                                    onClick={handleDeleteBooking}>
                                    Delete Booking
                                </a>
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
                                                <p>03153738555</p>
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

export default Booking;
