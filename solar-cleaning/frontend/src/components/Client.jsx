import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    deleteClient,
    createClient,
    getAllClients,
    updateClient,
} from "../features/clients/clientsSlice";
import { Modal, Form, Input, Button } from "antd";
import AddressForm from "../components/AddressForm";

import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import "../../public/css/responsive.css";
import "../../public/css/style.css";

import professionalImg from "../../public/professional-img.png";

const Client = () => {
    const [clientId, setClientId] = useState(""); // Add this state at the top
    const dispatch = useDispatch();
    const authState = useSelector((state) => state.auth);
    const actualIsAuthenticated = authState?.isAuthenticated ?? false;
    const actualUser = authState?.user ?? { username: "Guest" };
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);

    const showCreateModal = () => {
        setClientId(""); // Clear clientId for create mode
        setIsCreateModalVisible(true);
    };

    const handleCreateModalCancel = () => {
        setIsCreateModalVisible(false);
    };

    const handleEditClient = () => {
        const id = prompt("Enter Client ID to edit:");
        if (id) {
            dispatch(getAllClients()).then((action) => {
                const client = action.payload.find(
                    (client) => client.id === parseInt(id)
                );
                if (client) {
                    form.setFieldsValue({
                        ...client,
                        subscription_start: client.subscription_start
                            ? client.subscription_start.split("T")[0]
                            : null,
                        subscription_plan: client.subscription_plan,
                    });
                    setLatitude(client.latitude);
                    setLongitude(client.longitude);
                    setClientId(id); // Set clientId for editing mode
                    setIsCreateModalVisible(true);
                } else {
                    alert("Client not found!");
                }
            });
        }
    };

    const handleCreateClient = (values) => {
        const { subscription_start, subscription_plan } = values;
        const subscription_end = new Date(subscription_start);
        subscription_end.setMonth(
            subscription_end.getMonth() + parseInt(subscription_plan)
        );

        const clientData = {
            ...values,
            latitude,
            longitude,
            subscription_end: subscription_end.toISOString().split("T")[0],
        };

        if (clientId) {
            dispatch(
                updateClient({ id: clientId, updatedData: clientData })
            ).then(() => {
                setIsCreateModalVisible(false);
                form.resetFields();
                setClientId(""); // Clear clientId after update
            });
        } else {
            dispatch(createClient(clientData)).then(() => {
                setIsCreateModalVisible(false);
                form.resetFields();
            });
        }
    };

    const handleAddressChange = (address, lat, lon) => {
        form.setFieldsValue({ address });
        setLatitude(lat);
        setLongitude(lon);
    };

    const handleAreaChange = (area) => {
        form.setFieldsValue({ area });
    };

    const handleDeleteClient = () => {
        const id = prompt("Enter Client ID to delete:");
        if (id) {
            dispatch(deleteClient(id));
        }
    };

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
            <Modal
                title={clientId ? "Update Client" : "Create Client"}
                open={isCreateModalVisible}
                onCancel={handleCreateModalCancel}
                footer={null}>
                <Form
                    form={form}
                    onFinish={handleCreateClient}
                    layout="vertical">
                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[
                            {
                                required: true,
                                message: "Please input the client name!",
                            },
                        ]}>
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="contact_details"
                        label="Contact Details"
                        rules={[
                            {
                                required: true,
                                message: "Please input the contact details!",
                            },
                        ]}>
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="address"
                        label="Address"
                        rules={[
                            {
                                required: true,
                                message: "Please input the address!",
                            },
                        ]}>
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="area"
                        label="Area"
                        rules={[
                            {
                                required: true,
                                message: "Please input the Area!",
                            },
                        ]}>
                        <AddressForm onAddressChange={handleAreaChange} />
                    </Form.Item>
                    <Form.Item
                        name="total_panels"
                        label="Total Panels"
                        rules={[
                            {
                                required: true,
                                message: "Please input the total panels!",
                            },
                        ]}>
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item
                        name="charge_per_clean"
                        label="Charge per Clean"
                        rules={[
                            {
                                required: true,
                                message: "Please input the charge per clean!",
                            },
                        ]}>
                        <Input type="number" addonAfter="PKR" />
                    </Form.Item>
                    <Form.Item
                        name="subscription_plan"
                        label="Subscription Period (months)"
                        rules={[
                            {
                                required: true,
                                message:
                                    "Please input the subscription period in months!",
                            },
                        ]}>
                        <Input type="number" addonAfter="months" />
                    </Form.Item>
                    <Form.Item
                        name="subscription_start"
                        label="Subscription Start"
                        rules={[
                            {
                                required: true,
                                message:
                                    "Please input the subscription start date!",
                            },
                        ]}>
                        <Input type="date" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            {clientId ? "Update Client" : "Create Client"}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
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
                                <h2>manage your clients</h2>

                                <a href="#" onClick={showCreateModal}>
                                    Add Client
                                </a>
                                <br />
                                <a href="#" onClick={handleEditClient}>
                                    Update Client
                                </a>
                                <br />
                                <a
                                    className="delete-button"
                                    href="#"
                                    onClick={handleDeleteClient}>
                                    Delete Client
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

export default Client;
