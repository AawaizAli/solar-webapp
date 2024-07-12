import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  clients: [],
  loading: false,
  error: null,
};

// Create an Axios instance with the base URL
const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:5000',
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

// Async thunk for fetching clients
export const getAllClients = createAsyncThunk(
  'clients/get-all-clients',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/api/clients/get-all-clients');
      console.log(response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Async thunk for creating a client
export const createClient = createAsyncThunk(
  'clients/createClient',
  async (clientData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/api/clients', clientData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Async thunk for updating a client
export const updateClient = createAsyncThunk(
  'clients/updateClient',
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/api/clients/${id}`, updatedData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Async thunk for deleting a client
export const deleteClient = createAsyncThunk(
  'clients/delete-client',
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/api/clients/delete-client/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const clientsSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    // Additional reducers if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllClients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllClients.fulfilled, (state, action) => {
        state.clients = action.payload;
        state.loading = false;
      })
      .addCase(getAllClients.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(createClient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createClient.fulfilled, (state, action) => {
        state.clients.push(action.payload);
        state.loading = false;
      })
      .addCase(createClient.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(updateClient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateClient.fulfilled, (state, action) => {
        const index = state.clients.findIndex(client => client.id === action.payload.id);
        if (index !== -1) {
          state.clients[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(updateClient.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(deleteClient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteClient.fulfilled, (state, action) => {
        state.clients = state.clients.filter(client => client.id !== action.payload);
        state.loading = false;
      })
      .addCase(deleteClient.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  }
});

export default clientsSlice.reducer;
