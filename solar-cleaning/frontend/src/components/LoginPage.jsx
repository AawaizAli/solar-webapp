import React, { useState } from 'react';
import { Form, Input, Button, Checkbox } from 'antd';
import { UserOutlined, LockOutlined, EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons';
import './LoginPage.css';
import { useDispatch } from 'react-redux';
import { setLoading, setError } from '../features/auth/authSlice'; // Import necessary actions

const LoginPage = () => {
  const dispatch = useDispatch();
  const [passwordVisible, setPasswordVisible] = useState(false);

  const onFinish = (values) => {
    console.log('Received values of form: ', values);
    // Dispatch setLoading action to set loading state
    dispatch(setLoading());

    // Simulate API call for login (replace with actual logic)
    // Example: Replace with actual login API call using Axios or fetch
    setTimeout(() => {
      // Simulating successful login
      const user = { email: values.email }; // Replace with actual user data
      console.log('Login successful for user:', user);
      // Clear loading state after successful login
      dispatch(setLoading(false));
    }, 1000); // Simulated delay for loading

    // Simulate error handling (replace with actual error handling logic)
    // Example: Replace with error handling for failed login
    // setTimeout(() => {
    //   dispatch(setError('Failed to log in. Invalid credentials.'));
    // }, 2000); // Simulated delay for error handling
  };

  return (
    <div className="login-container">
      <Form
        name="login"
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item
          name="email"
          rules={[{ required: true, message: 'Please input your Email!' }]}
        >
          <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your Password!' }]}
        >
          <Input.Password
            prefix={<LockOutlined className="site-form-item-icon" />}
            type={passwordVisible ? 'text' : 'password'}
            placeholder="Password"
            iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            onClick={() => setPasswordVisible(!passwordVisible)}
          />
        </Form.Item>
        <Form.Item>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>
          <a className="login-form-forgot" href="">
            Forgot password
          </a>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button">
            Log in
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginPage;
