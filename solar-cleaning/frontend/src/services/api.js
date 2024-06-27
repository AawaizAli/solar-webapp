import { configureStore } from '@reduxjs/toolkit';
import bookingsReducer from '../features/bookings/bookingsSlice';
import workersReducer from '../features/workers/workersSlice';
import authReducer from '../features/auth/authSlice';

export const store = configureStore({
  reducer: {
    bookings: bookingsReducer,
    workers: workersReducer,
    auth: authReducer,
  },
});
