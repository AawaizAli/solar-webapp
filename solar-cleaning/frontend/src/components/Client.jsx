import React, { useState } from "react";
import { Link } from "react-router-dom";
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

import Header from "./Header";
import Footer from "./Footer";

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
    const [initialArea, setInitialArea] = useState("");

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
                    });
                    setInitialArea(client.area);
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
        const clientData = {
            ...values,
            latitude,
            longitude,
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

    const handleAreaChange = (area, lat, lon) => {
        form.setFieldsValue({ area });
        setLatitude(lat);
        setLongitude(lon);
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
                        <AddressForm
                            initialAddress={initialArea}
                            onAddressChange={handleAreaChange}
                        />
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
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            {clientId ? "Update Client" : "Create Client"}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
            <div className="hero_area">
                <Header></Header>
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

            <Footer></Footer>
        </>
    );
};

export default Client;
