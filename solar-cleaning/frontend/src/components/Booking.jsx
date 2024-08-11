import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Modal as Modal, Form, Input, Select, Button } from "antd";
import {
    deleteBooking,
    createBooking,
    getAllBookings,
    updateBooking,
} from "../features/bookings/bookingsSlice";
import { getAllWorkers } from "../features/workers/workersSlice";

import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import "../../public/css/responsive.css";
import "../../public/css/style.css";

import professionalImg from "../../public/professional-img.png";

import Header from "./Header";
import Footer from "./Footer";

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
    
    const checkWorkerAvailability = async (workerId, day, timeSlot) => {
        console.log(`Checking availability for Worker ID: ${workerId}, Day: ${day}, Time Slot: ${timeSlot}`);

        if (!workerId) return true; // If workerId is not provided, skip the check

        const { payload: workers } = await dispatch(getAllWorkers());
        const worker = workers.find(
            (worker) => worker.id === parseInt(workerId)
        );

        if (!worker) {
            console.error("Worker not found:", workerId);
            return false;
        }

        const isAvailable = worker.availability[day][timeSlot];
        console.log(`Worker Availability on Day ${day}, Time Slot ${timeSlot}:`, isAvailable);

        if (!isAvailable) {
            console.error(`Worker is not available on ${day} at ${timeSlot}`);
            Modal.warning({
                title: "Worker Unavailable",
                content: `Worker is not available on ${
                    [
                        "Sunday",
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Saturday",
                    ][day]
                } at ${timeSlots[timeSlot]}.`,
            });
            return false;
        }

        return true;
    };

    const fetchBookingDetails = async (id) => {
        try {
            console.log("Fetching booking details for ID:", id);
            const { payload: bookings } = await dispatch(getAllBookings());
            const booking = bookings.find(
                (booking) => booking.id === parseInt(id)
            );
            console.log("Fetched booking details:", booking);
            return booking || null;
        } catch (error) {
            console.error("Error fetching booking details:", error);
            return null;
        }
    };

    const handleCreateBooking = async (values) => {
        const day = new Date(values.date).getDay(); 
        const timeSlot = Object.keys(timeSlots).find(
            (key) => timeSlots[key] === values.time_slot
        );
        console.log(`Day: ${day}, Time Slot: ${timeSlot}`);
    
        const isAvailable = await checkWorkerAvailability(
            values.worker_id,
            day,
            timeSlot
        );
    
        if (!isAvailable) {
            return;
        }
    
        const formattedValues = {
            ...values,
            client_id: parseInt(values.client_id, 10),
            worker_id: values.worker_id ? parseInt(values.worker_id, 10) : null,
            time_slot: values.time_slot, // Send time_slot string directly
            recurrence_period: parseInt(values.recurrence_period, 10), // Convert to integer
        };
        console.log("Formatted Values:", formattedValues);
    
        try {
            await dispatch(createBooking(formattedValues)).unwrap();
            setIsCreateModalVisible(false);
            form.resetFields();
        } catch (error) {
            console.error("Error creating booking:", error);
            alert("Worker is busy. Please select another time slot.");
        }
    };
    
    const handleUpdateBooking = async (values) => {
        const day = new Date(values.date).getDay(); 
        const timeSlot = Object.keys(timeSlots).find(
            (key) => timeSlots[key] === values.time_slot
        );
        console.log(`Day: ${day}, Time Slot: ${timeSlot}`);
    
        const isAvailable = await checkWorkerAvailability(
            values.worker_id,
            day,
            timeSlot
        );
    
        if (!isAvailable) {
            return;
        }
    
        const formattedValues = {
            ...values,
            client_id: parseInt(values.client_id, 10),
            worker_id: values.worker_id ? parseInt(values.worker_id, 10) : null,
            time_slot: values.time_slot, // Send time_slot string directly
            recurrence_period: parseInt(values.recurrence_period, 10), // Convert to integer
        };
    
        try {
            await dispatch(
                updateBooking({ id: bookingId, updatedData: formattedValues })
            ).unwrap();
            setIsCreateModalVisible(false);
            form.resetFields();
            setIsEditMode(false);
        } catch (error) {
            console.error("Error updating booking:", error);
        }
    };
    

    const handleEditBooking = async () => {
        const id = prompt("Enter Booking ID to edit:");
        if (!id) return;

        const bookingDetails = await fetchBookingDetails(id);
        if (!bookingDetails) {
            alert("Booking not found!");
            return;
        }

        const values = {
            ...bookingDetails,
            client_id: bookingDetails.client_id.toString(),
            worker_id: bookingDetails.worker_id
                ? bookingDetails.worker_id.toString()
                : "",
            time_slot: bookingDetails.time_slot, // Keep the time slot string as is
        };

        form.setFieldsValue(values);
        setBookingId(id);
        setIsEditMode(true);
        setIsCreateModalVisible(true);
    };

    const timeSlots = {
        0: "09:00-11:00",
        1: "11:00-13:00",
        2: "13:00-15:00",
        3: "15:00-17:00",
        4: "17:00-19:00",
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
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1, shrink-to-fit=no"
            />
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
                        onFinish={
                            isEditMode
                                ? handleUpdateBooking
                                : handleCreateBooking
                        }
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
                                {Object.keys(timeSlots).map((key) => (
                                    <Select.Option
                                        key={key}
                                        value={timeSlots[key]}>
                                        {timeSlots[key]}
                                    </Select.Option>
                                ))}
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
                                <Select.Option value="ten">
                                    Every 10 Days
                                </Select.Option>
                                <Select.Option value="biweekly">
                                    Biweekly
                                </Select.Option>
                                <Select.Option value="twenty">
                                    Every 20 Days
                                </Select.Option>
                                <Select.Option value="monthly">
                                    Monthly
                                </Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="recurrence_period"
                            label="Reccurence Period (months)"
                            rules={[
                                {
                                    required: true,
                                    message:
                                        "Please input the Reccurence period in months!",
                                },
                            ]}>
                            <Input type="number" addonAfter="months" />
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

            <Footer></Footer>
        </>
    );
};

export default Booking;
