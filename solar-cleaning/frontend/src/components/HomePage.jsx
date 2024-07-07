import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';
import './HomePage.css'; // Create a CSS file for custom styles

const HomePage = () => {
  // Mock authentication state for testing
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Change this to `false` to simulate a logged-out state
  const user = { username: 'TestUser' }; // Mock user data

  // Use actual authentication state if available
  // const authState = useSelector(state => state.auth);
  // const actualIsAuthenticated = authState?.isAuthenticated ?? isAuthenticated;
  // const actualUser = authState?.user ?? user;

  // For debugging, use mock authentication state
  const actualIsAuthenticated = isAuthenticated;
  const actualUser = user;

  return (
    <div>
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['home']}>
        <Menu.Item key="company">
          <div className="company-name">Pod Bhai Cleaning Service</div>

        </Menu.Item>
        <Menu.Item key="home">
          <Link to="/">Home</Link>
        </Menu.Item>
        {actualIsAuthenticated && (
          <>
            <Menu.Item key="bookings">
              <Link to="/bookings">Bookings</Link>
            </Menu.Item>
            <Menu.Item key="workers">
              <Link to="/workers">Workers</Link>
            </Menu.Item>
            <Menu.Item key="reports">
              <Link to="/reports">Reports</Link>
            </Menu.Item>
            <Menu.Item key="user" style={{ marginLeft: 'auto' }}>
              <div>{actualUser?.username}</div>
            </Menu.Item>
            <Menu.Item key="logout">
              <Link to="/logout">Logout</Link>
            </Menu.Item>
          </>
        )}
        {!actualIsAuthenticated && (
          <Menu.Item key="login" style={{ marginLeft: 'auto' }}>
            <Link to="/login">Login</Link>
          </Menu.Item>
        )}
      </Menu>

      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to Our Solar Panel Cleaning Service</h1>
          <p>Clean energy starts with clean panels.</p>
        </div>
      </section>

      <footer className="footer">
        <p>&copy; 2024 Solar Panel Cleaning Service. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
