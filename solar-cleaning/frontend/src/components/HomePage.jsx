import React from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';

const { Header, Content, Footer } = Layout;

const HomePage = () => {
  return (
    <Layout>
      <Header>
        <div className="logo" />
        <Menu theme="dark" mode="horizontal">
          <Menu.Item key="1">
            <Link to="/">Home</Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to="/bookings">Bookings</Link>
          </Menu.Item>
          <Menu.Item key="3">
            <Link to="/workers">Workers</Link>
          </Menu.Item>
          <Menu.Item key="4">
            <Link to="/reports">Reports</Link>
          </Menu.Item>
          <Menu.Item key="5">
            <Link to="/login">Login</Link>
          </Menu.Item>
        </Menu>
      </Header>
      <Content style={{ padding: '0 50px' }}>
        <div className="site-layout-content">Welcome to Solar Cleaning Services</div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Solar Cleaning Services ©2024</Footer>
    </Layout>
  );
};

export default HomePage;
