import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from '../../api/axios.js';

const baseURL = process.env.NODE_ENV === 'production' ? 'https://hash1khn.pythonanywhere.com' : 'http://127.0.0.1:5000';

const initialState = {
    clients: [],
    loading: false,
    error: null,
};

// Create an Axios instance with the base URL
const axiosInstance = axios.create({
    baseURL: baseURL,
    headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    },
});

// Add a request interceptor to include the JWT token in headers
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const getAllClients = createAsyncThunk(
    "clients/get-all-clients",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(
                "/api/clients/get-all-clients"
            );
            console.log("getAllClients response:", response.data);
            return response.data;
        } catch (error) {
            console.error("getAllClients error:", error);
            return rejectWithValue(error.response.data.message);
        }
    }
);

// Filter clients by a specific field
const filterClients = (clients, field, value) => {
    console.log(`Filtering clients by ${field} with value: ${value}`);
    const filtered = clients.filter((client) =>
        client[field]?.toString().toLowerCase().includes(value.toLowerCase())
    );
    console.log("Filtered clients:", filtered);
    return filtered;
};

// Async thunk for fetching clients by ID
export const getById = createAsyncThunk(
    "clients/getById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/api/clients/search/id/${id}`);
            const client = response.data;

            // Wrap the client in an array if it's a single object
            return Array.isArray(client) ? client : [client];
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);


// Async thunk for fetching clients by name
export const getByName = createAsyncThunk(
    "clients/getByName",
    async (name, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/api/clients/search/name/${name}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);


// Async thunk for fetching clients by contact details
export const getByContact = createAsyncThunk(
    "clients/getByContact",
    async (contact, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/api/clients/search/contact/${contact}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);


// Async thunk for fetching clients by address
export const getByAddress = createAsyncThunk(
    "clients/getByAddress",
    async (address, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/api/clients/search/address/${address}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);


export const getByArea = createAsyncThunk(
    "clients/getByArea",
    async (area, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/api/clients/search/area/${area}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);


// Async thunk for fetching clients by total panels
export const getByTotalPanels = createAsyncThunk(
    "clients/getByTotalPanels",
    async (totalPanels, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/api/clients/search/total-panels/${totalPanels}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);


// Async thunk for fetching clients by charges per clean
export const getByCharges = createAsyncThunk(
    "clients/getByCharges",
    async (charges, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/api/clients/search/charges/${charges}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);


// Async thunk for fetching clients by subscription plan
export const getBySubscriptionPlan = createAsyncThunk(
    "clients/getBySubscriptionPlan",
    async (plan, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/api/clients/search/subscription-plan/${plan}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);


// Async thunk for creating a client
export const createClient = createAsyncThunk(
    "clients/add-client",
    async (clientData, { rejectWithValue }) => {
        try {
            console.log("Creating a new client:", clientData);
            const response = await axiosInstance.post(
                "/api/clients/add-client",
                clientData
            );
            console.log("Client created:", response.data);
            return response.data;
        } catch (error) {
            console.error("createClient error:", error);
            return rejectWithValue(error.response.data.message);
        }
    }
);

// Async thunk for updating a client
export const updateClient = createAsyncThunk(
    "clients/update-client",
    async ({ id, updatedData }, { rejectWithValue }) => {
        try {
            console.log(`Updating client with ID ${id}:`, updatedData);
            const response = await axiosInstance.put(
                `/api/clients/update-client/${id}`,
                updatedData
            );
            console.log("Client updated:", response.data);
            return response.data;
        } catch (error) {
            console.error("updateClient error:", error);
            return rejectWithValue(error.response.data.message);
        }
    }
);

// Async thunk for deleting a client
export const deleteClient = createAsyncThunk(
    "clients/delete-client",
    async (id, { rejectWithValue }) => {
        try {
            console.log("Deleting client with ID:", id);
            await axiosInstance.delete(`/api/clients/delete-client/${id}`);
            console.log("Client deleted:", id);
            return id;
        } catch (error) {
            console.error("deleteClient error:", error);
            return rejectWithValue(error.response.data.message);
        }
    }
);

const clientsSlice = createSlice({
    name: "clients",
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
            .addCase(getById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getById.fulfilled, (state, action) => {
                state.clients = action.payload;
                state.loading = false;
            })
            .addCase(getById.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
            .addCase(getByName.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getByName.fulfilled, (state, action) => {
                state.clients = action.payload;
                state.loading = false;
            })
            .addCase(getByName.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
            .addCase(getByContact.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getByContact.fulfilled, (state, action) => {
                state.clients = action.payload;
                state.loading = false;
            })
            .addCase(getByContact.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
            .addCase(getByAddress.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getByAddress.fulfilled, (state, action) => {
                state.clients = action.payload;
                state.loading = false;
            })
            .addCase(getByAddress.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
            .addCase(getByArea.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getByArea.fulfilled, (state, action) => {
                state.clients = action.payload;
                state.loading = false;
            })
            .addCase(getByArea.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
            .addCase(getByTotalPanels.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getByTotalPanels.fulfilled, (state, action) => {
                state.clients = action.payload;
                state.loading = false;
            })
            .addCase(getByTotalPanels.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
            .addCase(getByCharges.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getByCharges.fulfilled, (state, action) => {
                state.clients = action.payload;
                state.loading = false;
            })
            .addCase(getByCharges.rejected, (state, action) => {
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
                const index = state.clients.findIndex(
                    (client) => client.id === action.payload.id
                );
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
                state.clients = state.clients.filter(
                    (client) => client.id !== action.payload
                );
                state.loading = false;
            })
            .addCase(deleteClient.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            });
    },
});

export default clientsSlice.reducer;
