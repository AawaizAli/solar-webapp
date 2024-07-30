import React from 'react';
import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../features/auth/authSlice';
import { Navigate } from 'react-router-dom';
import './LoginPage.css';
import Header from './Header';
import Footer from './Footer';

const LoginPage = () => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth.loading);
  const error = useSelector((state) => state.auth.error);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const onFinish = (values) => {
    dispatch(login({ username: values.email, password: values.password }));
  };

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <>
      {/* Header and Navbar */}
      <Header />

      {/* Login Form */}
      <div className="login-container">
        <Form
          name="login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Please input your Username!' }]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="Password"
            />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button" loading={loading}>
              Log in
            </Button>
          </Form.Item>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </Form>
      </div>

      {/* Footer */}
      <Footer />
    </>
  );
};

export default LoginPage;
