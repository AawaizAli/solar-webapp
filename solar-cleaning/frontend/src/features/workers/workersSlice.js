import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from '../../api/axios.js';
const baseURL = process.env.NODE_ENV === 'production' ? 'https://hash1khn.pythonanywhere.com' : 'http://127.0.0.1:5000/';
const initialState = {
    workers: [],
    loading: false,
    error: null,
};

// Create an Axios instance with the base URL
const axiosInstance = axios.create({
    baseURL:baseURL,
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

export const getAllWorkers = createAsyncThunk(
    "workers/get-all-workers",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(
                "/api/workers/get-all-workers"
            );
            console.log(
                response.data.map((worker) => ({
                    ...worker,
                    availability:
                        typeof worker.availability === "string"
                            ? JSON.parse(worker.availability)
                            : worker.availability,
                }))
            );
            return response.data.map((worker) => ({
                ...worker,
                availability:
                    typeof worker.availability === "string"
                        ? JSON.parse(worker.availability)
                        : worker.availability,
            }));
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const getById = createAsyncThunk(
    "workers/get-by-id",
    async (id, { rejectWithValue, dispatch, getState }) => {
        try {
            const state = getState();
            if (state.workers.workers.length === 0) {
                await dispatch(getAllWorkers());
            }
            const worker = state.workers.workers.find((worker) => worker.id === parseInt(id, 10));
            return worker ? [worker] : [];
        } catch (error) {
            return rejectWithValue(error.response ? error.response.data.message : error.message);
        }
    }
);

export const getByName = createAsyncThunk(
    "workers/get-by-name",
    async (name, { rejectWithValue, dispatch, getState }) => {
        try {
            const state = getState();
            if (state.workers.workers.length === 0) {
                await dispatch(getAllWorkers());
            }
            const workers = state.workers.workers.filter((worker) =>
                worker.name.toLowerCase().includes(name.toLowerCase())
            );
            return workers;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const getByArea = createAsyncThunk(
    "workers/get-by-area",
    async (area, { rejectWithValue, dispatch, getState }) => {
        try {
            const state = getState();
            if (state.workers.workers.length === 0) {
                await dispatch(getAllWorkers());
            }
            const workers = state.workers.workers.filter(
                (worker) =>
                    worker.area &&
                    worker.area.toLowerCase().includes(area.toLowerCase())
            );
            return workers;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

// Async thunk for creating a worker
export const createWorker = createAsyncThunk(
    "workers/create-worker",
    async (workerData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                "/api/workers/create-worker",
                workerData
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

// Async thunk for updating a worker
export const updateWorker = createAsyncThunk(
    "workers/update-worker",
    async ({ id, updatedData }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(
                `/api/workers/update-worker/${id}`,
                updatedData
            );
            console.log(response.data)
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

// Async thunk for deleting a worker
export const deleteWorker = createAsyncThunk(
    "workers/deleteWorker",
    async (id, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/api/workers/delete-worker/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

const workersSlice = createSlice({
    name: "workers",
    initialState,
    reducers: {
        // Additional reducers if needed
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllWorkers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllWorkers.fulfilled, (state, action) => {
                state.workers = action.payload;
                state.loading = false;
            })
            .addCase(getAllWorkers.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
            .addCase(getById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getById.fulfilled, (state, action) => {
                state.workers = action.payload;
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
                state.workers = action.payload;
                state.loading = false;
            })
            .addCase(getByName.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
            .addCase(getByArea.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getByArea.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.length > 0) {
                    state.workers = action.payload;
                }
            })
            .addCase(getByArea.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
            .addCase(createWorker.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createWorker.fulfilled, (state, action) => {
                state.workers.push(action.payload);
                state.loading = false;
            })
            .addCase(createWorker.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
            .addCase(updateWorker.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateWorker.fulfilled, (state, action) => {
                const index = state.workers.findIndex(
                    (worker) => worker.id === action.payload.id
                );
                if (index !== -1) {
                    state.workers[index] = action.payload;
                }
                state.loading = false;
            })
            .addCase(updateWorker.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
            .addCase(deleteWorker.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteWorker.fulfilled, (state, action) => {
                state.workers = state.workers.filter(
                    (worker) => worker.id !== action.payload
                );
                state.loading = false;
            })
            .addCase(deleteWorker.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            });
    },
});

export default workersSlice.reducer;
