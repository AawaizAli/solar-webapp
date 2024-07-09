import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../features/auth/authSlice';

const LogoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      try {
        await dispatch(logout());
        navigate('/');
      } catch (error) {
        console.error('Failed to log out:', error);
      }
    };

    performLogout();
  }, [dispatch, navigate]);

  return <div>Logging out...</div>;
};

export default LogoutPage;
