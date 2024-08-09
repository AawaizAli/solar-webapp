import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios.js';
const baseURL = process.env.NODE_ENV === 'production' ? 'https://hash1khn.pythonanywhere.com' : 'http://127.0.0.1:5000/';

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};


// Create an Axios instance with the base URL
const axiosInstance = axios.create({
  baseURL:baseURL,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  }
});


// Add a request interceptor to include the JWT token in headers
axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);
// Async thunk for login
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/api/login', credentials);
      localStorage.setItem('access_token', response.data.access_token); // Store the token
      console.log(response.data);
      return {
        access_token: response.data.access_token,
        username: response.data.username,
      };
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Async thunk for logout
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/api/logout', {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
      });
      localStorage.removeItem('access_token'); // Remove the token
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Additional reducers if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = { username: action.payload.username };
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logout.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

export default authSlice.reducer;
