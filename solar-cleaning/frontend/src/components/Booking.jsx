import React, { useEffect, useRef, useState } from "react";
import { Modal, Form, Input, Select, Button, Tag, Tooltip } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
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
import { getAllClients } from "../features/clients/clientsSlice";

const Booking = () => {
    const [bookingId, setBookingId] = useState("");
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const [selectedClientId, setSelectedClientId] = useState(0);
    const [workers, setWorkers] = useState([]);
    const [clients, setClients] = useState([]);
    const [workerTags, setWorkerTags] = useState([]);
    const [inputVisible, setInputVisible] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const inputRef = useRef(null);
    const [workerIds, setWorkerIds] = useState([]);
    const [isWorkerModalVisible, setIsWorkerModalVisible] = useState(false);

    // Fetch workers data when the component mounts
    useEffect(() => {
        const dispatchFunc = async () => {
            const { payload } = await dispatch(getAllWorkers());
            setWorkers(payload);

            const { payload: clientsPayload } = await dispatch(getAllClients());
            setClients(clientsPayload);
        };

        dispatchFunc();
    }, [dispatch]);

    useEffect(() => {
        if (inputVisible) {
            inputRef.current?.focus();
        }
    }, [inputVisible]);

    const showCreateModal = () => {
        setBookingId("");
        setIsEditMode(false);
        setIsCreateModalVisible(true);
    };

    const handleCreateModalCancel = () => {
        setIsCreateModalVisible(false);
        form.resetFields();
    };

    const handleInputConfirm = () => {
        if (inputValue && !tags.includes(inputValue)) {
            const selectedWorker = workers.find(
                (worker) => worker.name === inputValue
            );
            if (selectedWorker) {
                setTags([...tags, inputValue]);
                setSelectedWorkerIds([...selectedWorkerIds, selectedWorker.id]);
            } else {
                alert("Worker not found");
            }
        }
        setInputVisible(false);
        setInputValue("");
    };

    const handleClose = (removedTag) => {
        const newTags = tags.filter((tag) => tag !== removedTag);
        const newSelectedWorkerIds = selectedWorkerIds.filter(
            (id, index) => tags[index] !== removedTag
        );
        setTags(newTags);
        setSelectedWorkerIds(newSelectedWorkerIds);
    };

    const handleWorkerModalCancel = () => {
        setIsWorkerModalVisible(false);
    };

    const handleWorkerModalOk = () => {
        if (inputValue && !workerTags.includes(inputValue)) {
            const selectedWorker = workers.find(
                (worker) => worker.name === inputValue
            );
            if (selectedWorker) {
                setWorkerTags([...workerTags, inputValue]);
                setWorkerIds([...workerIds, selectedWorker.id]);
            }
        }
        setIsWorkerModalVisible(false);
        setInputValue("");
    };

    const showWorkerModal = () => {
        setInputVisible(true);
        setIsWorkerModalVisible(true);
    };

    const handleInputChange = (value) => {
        setInputValue(value);
    };

    const handleWorkerTagClose = (removedTag) => {
        const newTags = workerTags.filter((tag) => tag !== removedTag);
        const newWorkerIds = workerIds.filter(
            (id, index) => workerTags[index] !== removedTag
        );
        setWorkerTags(newTags);
        setWorkerIds(newWorkerIds);
    };

    const checkWorkerAvailability = async (workerId, day, timeSlot) => {
        console.log(
            `Checking availability for Worker ID: ${workerId}, Day: ${day}, Time Slot: ${timeSlot}`
        );

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
        console.log(
            `Worker Availability on Day ${day}, Time Slot ${timeSlot}:`,
            isAvailable
        );

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

        const formattedValues = {
            ...values,
            client_id: selectedClientId,
            worker_ids: workerIds,
            time_slot: values.time_slot,
            recurrence_period: parseInt(values.recurrence_period, 10),
        };

        try {
            console.log(formattedValues);
            await dispatch(createBooking(formattedValues)).unwrap();
            setIsCreateModalVisible(false);
            form.resetFields();
            setWorkerTags([]);
            setWorkerIds([]);
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
    
        // We no longer check the number of worker_ids, just ensure availability of the remaining workers
        const isAvailable = workerIds.every(async (workerId) => {
            return await checkWorkerAvailability(workerId, day, timeSlot);
        });
    
        if (!isAvailable) {
            return;
        }
    
        const formattedValues = {
            ...values,
            client_id: selectedClientId,
            worker_ids: workerIds,  // Send the updated worker IDs
            time_slot: values.time_slot,
            recurrence_period: parseInt(values.recurrence_period, 10),
        };
    
        try {
            await dispatch(
                updateBooking({ id: bookingId, updatedData: formattedValues })
            ).unwrap();
            setIsCreateModalVisible(false);
            form.resetFields();
            setWorkerTags([]);
            setWorkerIds([]);
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
    
        // Populate the form with booking details
        const values = {
            ...bookingDetails,
            client_id: bookingDetails.client.id.toString(),
            time_slot: bookingDetails.time_slot,
            status: bookingDetails.status,
            recurrence: bookingDetails.recurrence,
            recurrence_period: bookingDetails.recurrence_period.toString(),
        };
    
        // Set form values
        form.setFieldsValue(values);
    
        // Set worker tags and worker IDs
        const workerNames = bookingDetails.workers.map((worker) => worker.name);
        const workerIds = bookingDetails.workers.map((worker) => worker.id);
        setWorkerTags(workerNames);
        setWorkerIds(workerIds);
    
        // Set the booking ID and switch to edit mode
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
            <Modal
                title={isEditMode ? "Update Booking" : "Create Booking"}
                open={isCreateModalVisible}
                onCancel={handleCreateModalCancel}
                footer={null}>
                <Form
                    form={form}
                    onFinish={
                        isEditMode ? handleUpdateBooking : handleCreateBooking
                    }
                    layout="vertical">

                    <Form.Item
                        name="client_id"
                        label="Client"
                        rules={[
                            {
                                required: true,
                                message: "Please select a Client!",
                            },
                        ]}>
                        <Select
                            onChange={(value) => setSelectedClientId(value)}>
                            {clients.map((client) => (
                                <Select.Option
                                    key={client.id}
                                    value={client.id}>
                                    {client.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item label="Workers">
                        {workerTags.map((tag, index) => (
                            <Tag
                                key={tag}
                                closable
                                onClose={() => handleWorkerTagClose(tag)}>
                                {tag}
                            </Tag>
                        ))}
                        <Tag
                            icon={<PlusOutlined />}
                            onClick={showWorkerModal}
                            style={{ cursor: "pointer" }}>
                            New Worker
                        </Tag>
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
                                <Select.Option key={key} value={timeSlots[key]}>
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
                            <Select.Option value="weekly">Weekly</Select.Option>
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
                            {isEditMode ? "Update Booking" : "Create Booking"}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Select Worker"
                open={isWorkerModalVisible}
                onCancel={handleWorkerModalCancel}
                onOk={handleWorkerModalOk}>
                <Select
                    showSearch
                    placeholder="Select a worker"
                    value={inputValue}
                    onChange={handleInputChange}
                    style={{ width: "100%" }}>
                    {workers.map((worker) => (
                        <Select.Option key={worker.id} value={worker.name}>
                            {worker.name}
                        </Select.Option>
                    ))}
                </Select>
            </Modal>

            <Header />
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

            <Footer />
        </>
    );
};

export default Booking;
