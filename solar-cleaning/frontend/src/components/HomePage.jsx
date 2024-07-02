import React, { useState } from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';
import './HomePage.css'; // Create a CSS file for custom styles

const HomePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div>
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['home']}>
        <Menu.Item key="company">
          <div className="company-name">Dada Panel Cleaning Service</div>
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
