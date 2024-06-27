import React from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div>
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['home']}>
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
        <Menu.Item key="login">
          <Link to="/login">Login</Link>
        </Menu.Item>
      </Menu>
    </div>
  );
};

export default HomePage;
