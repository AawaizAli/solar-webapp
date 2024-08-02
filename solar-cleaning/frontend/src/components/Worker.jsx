import React, { useState } from "react";
import {
  deleteWorker,
  createWorker,
  getAllWorkers,
  updateWorker,
} from "../features/workers/workersSlice";
import { Modal, Form, Input, Checkbox, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import AddressForm from "./AddressForm";

import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import "../../public/css/responsive.css";
import "../../public/css/style.css";
import professionalImg from "../../public/professional-img.png";

import Header from "./Header";
import Footer from "./Footer";

const Worker = () => {
  const [workerId, setWorkerId] = useState("");
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const actualIsAuthenticated = authState?.isAuthenticated ?? false;
  const actualUser = authState?.user ?? { username: "Guest" };
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const initialAvailability = Array(7).fill(Array(5).fill(false));
  const [availability, setAvailability] = useState(initialAvailability);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [initialArea, setInitialArea] = useState("");

  const showModal = () => {
    setWorkerId(""); // Clear workerId for create mode
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setAvailability(initialAvailability);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const workerData = {
          ...values,
          availability: availability,
          latitude: latitude, // Include latitude
          longitude: longitude,
        };
        if (workerId) {
          dispatch(updateWorker({ id: workerId, updatedData: workerData }));
        } else {
          dispatch(createWorker(workerData));
        }
        setIsModalVisible(false);
        form.resetFields();
        setAvailability(initialAvailability);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const handleAvailabilityChange = (dayIndex, slotIndex) => {
    const newAvailability = availability.map((day, dIndex) =>
      day.map((slot, sIndex) =>
        dIndex === dayIndex && sIndex === slotIndex ? !slot : slot
      )
    );
    setAvailability(newAvailability);
  };

  const handleDeleteWorker = () => {
    const id = prompt("Enter Worker ID to delete:");
    if (id) {
      dispatch(deleteWorker(id));
    }
  };

  const handleEditWorker = () => {
    const id = prompt("Enter Worker ID to edit:");
    if (id) {
      dispatch(getAllWorkers()).then((action) => {
        const worker = action.payload.find(
          (worker) => worker.id === parseInt(id)
        );
        if (worker) {
          form.setFieldsValue({
            ...worker,
          });
          setAvailability(worker.availability);
          setWorkerId(id);
          setInitialArea(worker.area); // Set workerId for editing mode
          setIsModalVisible(true);
        } else {
          alert("Worker not found!");
        }
      });
    }
  };

  const handleAddressChange = (formattedAddress, lat, lon) => {
    form.setFieldsValue({ area: formattedAddress });
    setLatitude(lat);
    setLongitude(lon);
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
      <link rel="stylesheet" type="text/css" href="css/font-awesome.min.css" />
      {/* Custom styles for this template */}
      <link href="css/style.css" rel="stylesheet" />
      {/* responsive style */}
      <link href="css/responsive.css" rel="stylesheet" />
      <div className="hero_area">
        {/* header section strats */}
        <Modal
          title={workerId ? "Update Worker" : "Add Worker"}
          open={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="name"
              label="Name"
              rules={[
                {
                  required: true,
                  message: "Please input the worker name!",
                },
              ]}
            >
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
              ]}
            >
              <AddressForm
                initialAddress={initialArea}
                onAddressChange={handleAddressChange}
              />
            </Form.Item>
            <Form.Item label="Availability">
              {[
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
              ].map((day, dayIndex) => (
                <div key={dayIndex}>
                  <br />
                  <span className="day-in-availability">{day}</span>
                  <br />
                  <br />
                  {[
                    "09:00-11:00",
                    "11:00-13:00",
                    "13:00-15:00",
                    "15:00-17:00",
                    "17:00-19:00",
                  ].map((slot, slotIndex) => (
                    <Checkbox
                      className="slot-in-availability"
                      key={slotIndex}
                      checked={availability[dayIndex][slotIndex]}
                      onChange={() =>
                        handleAvailabilityChange(dayIndex, slotIndex)
                      }
                    >
                      {slot}
                    </Checkbox>
                  ))}
                </div>
              ))}
            </Form.Item>
          </Form>
        </Modal>

        <Header></Header>
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
                <h2>manage your workers</h2>

                <a className="orange-button" href="#" onClick={showModal}>
                  Add Worker
                </a>

                <br />
                <a className="orange-button" href="#" onClick={handleEditWorker}>
                  Update Worker
                </a>
                <br />
                <a
                
                  className="delete-button orange-button"
                  href="#"
                  onClick={handleDeleteWorker}
                >
                  Kick worker
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* end professional section */}

      {/* info section */}
      {/* end info_section */}
      {/* footer section */}
      <Footer></Footer>
      {/* footer section */}
      {/* Google Map */}
      {/* End Google Map */}
    </>
  );
};

export default Worker;
