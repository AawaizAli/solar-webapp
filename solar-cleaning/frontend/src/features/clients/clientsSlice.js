import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    clients: [],
    loading: false,
    error: null,
};

const dummyRes = [
    {
        address: "Gulshan e Maymar, Karachi, Pakistan",
        charge_per_clean: 500.0,
        contact_details: "1234567890",
        id: 1,
        latitude: 25.020894,
        longitude: 67.13228131174323,
        name: "Client One",
        subscription_end: "2024-12-31",
        subscription_plan: "monthly",
        subscription_start: "2024-01-01",
        total_panels: 20,
    },
    {
        address: "DHA, Lawhore, Pakistan",
        charge_per_clean: 999999999,
        contact_details: "031313131313",
        id: 3,
        latitude: 24.8684802,
        longitude: 67.05872422961852,
        name: "iznaaaurrr waqaurrrr",
        subscription_end: "2024-12-31",
        subscription_plan: "bimonthly",
        subscription_start: "2024-01-01",
        total_panels: 25,
    },
];

// Create an Axios instance with the base URL
const axiosInstance = axios.create({
    baseURL: "http://127.0.0.1:5000",
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
            console.log(response.data)
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

// Filter clients by a specific field
const filterClients = (clients, field, value) => {
    return clients.filter((client) =>
        client[field].toString().toLowerCase().includes(value.toLowerCase())
    );
};

// Async thunk for fetching clients by ID
export const getById = createAsyncThunk(
    "clients/getById",
    async (id, { getState }) => {
        const clients = getState().clients.clients;
        return filterClients(clients, "id", id);
    }
);

// Async thunk for fetching clients by name
export const getByName = createAsyncThunk(
    "clients/getByName",
    async (name, { getState }) => {
        const clients = getState().clients.clients;
        return filterClients(clients, "name", name);
    }
);

// Async thunk for fetching clients by contact details
export const getByContact = createAsyncThunk(
    "clients/getByContact",
    async (contact, { getState }) => {
        const clients = getState().clients.clients;
        return filterClients(clients, "contact_details", contact);
    }
);

// Async thunk for fetching clients by address
export const getByAddress = createAsyncThunk(
    "clients/getByAddress",
    async (address, { getState }) => {
        const clients = getState().clients.clients;
        console.log(filterClients(clients, "address", address));
        return filterClients(clients, "address", address);
    }
);

export const getByArea = createAsyncThunk(
    "clients/get-by-area",
    async (area, { rejectWithValue, dispatch, getState }) => {
        try {
            const state = getState();
            if (state.workers.workers.length === 0) {
                await dispatch(getAllClients());
            }
            const clients = state.clients.clients.filter(
                (client) =>
                    client.area &&
                    client.area.toLowerCase().includes(area.toLowerCase())
            );
            return clients;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

// Async thunk for fetching clients by total panels
export const getByTotalPanels = createAsyncThunk(
    "clients/getByTotalPanels",
    async (totalPanels, { getState }) => {
        const clients = getState().clients.clients;
        return filterClients(clients, "total_panels", totalPanels);
    }
);

// Async thunk for fetching clients by charges per clean
// Async thunk for fetching clients by charges per clean
export const getByCharges = createAsyncThunk(
    "clients/get-by-charges",
    async (charges, { rejectWithValue, dispatch, getState }) => {
        try {
            const response = await dispatch(getAllClients());
            const clients = response.payload.filter(
                (client) => client.charge_per_clean.toString() === charges
            );
            return clients;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Async thunk for fetching clients by subscription plan
export const getBySubscriptionPlan = createAsyncThunk(
    "clients/get-by-subscription-plan",
    async (subscriptionPlan, { rejectWithValue, dispatch, getState }) => {
        try {
            const response = await dispatch(getAllClients());
            const clients = response.payload.filter(
                (client) =>
                    client.subscription_plan.toString() === subscriptionPlan
            );
            return clients;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Async thunk for creating a client
export const createClient = createAsyncThunk(
    "clients/add-client",
    async (clientData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                "/api/clients/add-client",
                clientData
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

// Async thunk for updating a client
export const updateClient = createAsyncThunk(
    "clients/update-client",
    async ({ id, updatedData }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(
                `/api/clients/update-client/${id}`,
                updatedData
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

// Async thunk for deleting a client
export const deleteClient = createAsyncThunk(
    "clients/delete-client",
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
