import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice'; 
import bookingsReducer from '../features/bookings/bookingsSlice';

const store = configureStore({
  reducer: {
    auth: authReducer, 
    bookings: bookingsReducer,
  },
});

export default store;
