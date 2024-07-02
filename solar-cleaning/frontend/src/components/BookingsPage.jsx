import React, { useState } from 'react';
import { Menu, Button, Form, Input, Select, DatePicker } from 'antd';
import { Link } from 'react-router-dom';
import './BookingsPage.css'; // Create a CSS file for custom styles

const { Option } = Select;

const BookingsPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleCreateBooking = () => {
    setShowForm(true);
  };

  const handleFormSubmit = (values) => {
    console.log('Form values:', values);
    // Add logic to handle form submission
  };

  return (
    <div>
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['bookings']}>
        <Menu.Item key="company">
          <div className="company-name">Solar Panel Cleaning Service</div>
        </Menu.Item>
        <Menu.Item key="home">
          <Link to="/">Home</Link>
        </Menu.Item>
        <Menu.Item key="bookings">
          <Link to="/bookings">Bookings</Link>
        </Menu.Item>
        <Menu.Item key="workers">
          <Link to="/workers">Workers</Link>
        </Menu.Item>
        <Menu.Item key="reports">
          <Link to="/reports">Reports</Link>
        </Menu.Item>
        {isLoggedIn ? (
          <Menu.Item key="logout">
            <Link to="/logout">Logout</Link>
          </Menu.Item>
        ) : (
          <Menu.Item key="login">
            <Link to="/login">Login</Link>
          </Menu.Item>
        )}
      </Menu>

      <div className="content">
        {!showForm ? (
          <Button type="primary" onClick={handleCreateBooking}>
            Create Booking
          </Button>
        ) : (
          <Form onFinish={handleFormSubmit} layout="vertical">
            <Form.Item label="ClientID" name="clientID" rules={[{ required: true, message: 'Please select a ClientID!' }]}>
              <Select placeholder="Select ClientID">
                {/* Replace with dynamic values from the database */}
                <Option value="1">Client 1</Option>
                <Option value="2">Client 2</Option>
              </Select>
            </Form.Item>
            <Form.Item label="WorkerID" name="workerID" rules={[{ required: true, message: 'Please select a WorkerID!' }]}>
              <Select placeholder="Select WorkerID">
                {/* Replace with dynamic values from the database */}
                <Option value="1">Worker 1</Option>
                <Option value="2">Worker 2</Option>
              </Select>
            </Form.Item>
            <Form.Item label="Date" name="date" rules={[{ required: true, message: 'Please select a date!' }]}>
              <DatePicker />
            </Form.Item>
            <Form.Item label="Time Slot" name="timeSlot" rules={[{ required: true, message: 'Please select a time slot!' }]}>
              <Select placeholder="Select Time Slot">
                <Option value="9am">9am</Option>
                <Option value="11am">11am</Option>
                <Option value="1pm">1pm</Option>
                <Option value="3pm">3pm</Option>
                <Option value="5pm">5pm</Option>
              </Select>
            </Form.Item>
            <Form.Item label="Location" name="location" rules={[{ required: true, message: 'Please enter a location!' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Status" name="status" rules={[{ required: true, message: 'Please select a status!' }]}>
              <Select placeholder="Select Status">
                <Option value="true">True</Option>
                <Option value="false">False</Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        )}
      </div>

      <footer className="footer">
        <p>&copy; 2024 Solar Panel Cleaning Service. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default BookingsPage;
