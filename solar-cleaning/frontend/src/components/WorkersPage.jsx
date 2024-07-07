import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Menu, Button, Form, Input, Checkbox, message } from 'antd';
import { Link } from 'react-router-dom';
import { fetchWorkers, createWorker, updateWorker, deleteWorker } from '../features/workers/workersSlice';
import './WorkersPage.css';

const timeSlots = ['9am', '11am', '1pm', '3pm', '5pm'];

const WorkersPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true); // For testing purposes
  const [showForm, setShowForm] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [formMode, setFormMode] = useState('create');
  
  const dispatch = useDispatch();
  // Mock state for testing
  const mockState = {
    workers: [
      { id: 1, firstName: 'John', lastName: 'Doe', availability: {} },
      { id: 2, firstName: 'Jane', lastName: 'Doe', availability: {} }
    ],
    loading: false,
    error: null
  };
  // Uncomment the following line for actual state and comment the mock state
  // const { workers, loading, error } = useSelector(state => state.workers || mockState);
  const { workers, loading, error } = mockState; // For testing

  useEffect(() => {
    dispatch(fetchWorkers());
  }, [dispatch]);

  const handleCreateWorker = () => {
    setShowForm(true);
    setFormMode('create');
    setSelectedWorker(null);
  };

  const handleUpdateWorker = (id) => {
    const worker = workers.find(w => w.id === id);
    if (worker) {
      setSelectedWorker(worker);
      setFormMode('update');
      setShowForm(true);
    } else {
      message.error('Worker not found');
    }
  };

  const handleDeleteWorker = (id) => {
    const worker = workers.find(w => w.id === id);
    if (worker) {
      setSelectedWorker(worker);
      setFormMode('delete');
      setShowForm(true);
    } else {
      message.error('Worker not found');
    }
  };

  const handleFormSubmit = (values) => {
    if (formMode === 'create') {
      dispatch(createWorker(values));
    } else if (formMode === 'update' && selectedWorker) {
      dispatch(updateWorker({ id: selectedWorker.id, updatedData: values }));
    }
    setShowForm(false);
  };

  const handleDeleteConfirm = () => {
    if (selectedWorker) {
      dispatch(deleteWorker(selectedWorker.id));
      setShowForm(false);
    }
  };

  return (
    <div>
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['workers']}>
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
            <Button type="primary" onClick={handleCreateWorker} style={{ margin: '0 8px' }}>
              Create Worker
            </Button>
            <Button type="primary" onClick={() => handleUpdateWorker(prompt('Enter Worker ID to Update'))} style={{ margin: '0 8px' }}>
              Update Worker
            </Button>
            <Button type="primary" danger onClick={() => handleDeleteWorker(prompt('Enter Worker ID to Delete'))} style={{ margin: '0 8px' }}>
              Delete Worker
            </Button>
          </div>
        ) : formMode === 'delete' ? (
          <div>
            <h2>Confirm Delete Worker</h2>
            <p>Are you sure you want to delete worker with ID: {selectedWorker.id}?</p>
            <Button type="danger" onClick={handleDeleteConfirm}>
              Confirm Delete
            </Button>
            <Button type="default" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        ) : (
          <div className="form-container" style={{ maxHeight: '80vh', overflowY: 'scroll' }}>
            <Form onFinish={handleFormSubmit} layout="vertical" initialValues={selectedWorker}>
              <Form.Item label="First Name" name="firstName" rules={[{ required: true, message: 'Please enter the first name!' }]}>
                <Input />
              </Form.Item>
              <Form.Item label="Last Name" name="lastName" rules={[{ required: true, message: 'Please enter the last name!' }]}>
                <Input />
              </Form.Item>

              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                <div key={day}>
                  <h3>{day}</h3>
                  <Form.List name={`${day.toLowerCase()}Slots`}>
                    {() => (
                      <div style={{ display: 'flex', flexDirection: 'column', marginTop: '8px' }}>
                        {timeSlots.map(slot => (
                          <Form.Item key={slot} name={`${day.toLowerCase()}${slot}`} valuePropName="checked" noStyle>
                            <Checkbox style={{ marginLeft: '8px' }}>{slot}</Checkbox>
                          </Form.Item>
                        ))}
                      </div>
                    )}
                  </Form.List>
                </div>
              ))}

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  {formMode === 'create' ? 'Create' : 'Update'} Worker
                </Button>
                <Button type="default" onClick={() => setShowForm(false)} style={{ marginLeft: '8px' }}>
                  Cancel
                </Button>
              </Form.Item>
            </Form>
          </div>
        )}
      </div>

      <footer className="footer">
        <p>&copy; 2024 Solar Panel Cleaning Service. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default WorkersPage;
