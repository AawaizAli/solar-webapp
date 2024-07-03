import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Menu, Button, Form, Input, Select, DatePicker, message } from 'antd';
import { Link } from 'react-router-dom';
import { fetchBookings, createBooking, updateBooking, deleteBooking } from '../features/bookings/bookingsSlice';
import './BookingsPage.css';

const { Option } = Select;

const BookingsPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [formMode, setFormMode] = useState('create');

  const dispatch = useDispatch();
  const { bookings, loading, error } = useSelector(state => state.bookings);

  useEffect(() => {
    dispatch(fetchBookings());
  }, [dispatch]);

  const handleCreateBooking = () => {
    setShowForm(true);
    setFormMode('create');
    setSelectedBooking(null);
  };

  const handleUpdateBooking = (id) => {
    const booking = bookings.find(b => b.id === id);
    if (booking) {
      setSelectedBooking(booking);
      setFormMode('update');
      setShowForm(true);
    } else {
      message.error('Booking not found');
    }
  };

  const handleDeleteBooking = (id) => {
    const booking = bookings.find(b => b.id === id);
    if (booking) {
      setSelectedBooking(booking);
      setFormMode('delete');
      setShowForm(true);
    } else {
      message.error('Booking not found');
    }
  };

  const handleFormSubmit = (values) => {
    if (formMode === 'create') {
      dispatch(createBooking(values));
    } else if (formMode === 'update' && selectedBooking) {
      dispatch(updateBooking({ id: selectedBooking.id, updatedData: values }));
    }
    setShowForm(false);
  };

  const handleDeleteConfirm = () => {
    if (selectedBooking) {
      dispatch(deleteBooking(selectedBooking.id));
      setShowForm(false);
    }
  };

  return (
    <div>
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['bookings']}>
        <Menu.Item key="company">
          <div className="company-name">Pod Bhai Cleaning Service</div>

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
          <div>
            <Button type="primary" onClick={handleCreateBooking} style={{ margin: '0 8px' }}>
              Create Booking
            </Button>
            <Button type="primary" onClick={() => handleUpdateBooking(prompt('Enter Booking ID to Update'))} style={{ margin: '0 8px' }}>
              Update Booking
            </Button>
            <Button type="primary" danger onClick={() => handleDeleteBooking(prompt('Enter Booking ID to Delete'))} style={{ margin: '0 8px' }}>
              Delete Booking
            </Button>
          </div>
        ) : formMode === 'delete' ? (
          <div>
            <h2>Confirm Delete Booking</h2>
            <p>Are you sure you want to delete booking with ID: {selectedBooking.id}?</p>
            <Button type="danger" onClick={handleDeleteConfirm}>
              Confirm Delete
            </Button>
            <Button type="default" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        ) : (
          <Form onFinish={handleFormSubmit} layout="vertical" initialValues={selectedBooking}>
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
                {formMode === 'create' ? 'Create' : 'Update'} Booking
              </Button>
              <Button type="default" onClick={() => setShowForm(false)} style={{ marginLeft: '8px' }}>
                Cancel
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
