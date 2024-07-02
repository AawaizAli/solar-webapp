import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../features/auth/authSlice';

const LogoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      await dispatch(logout());
      navigate('/');
    };
    performLogout();
  }, [dispatch, navigate]);

  return <div>Logging out...</div>;
};

export default LogoutPage;
