import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    schedule: [],
    salary: [],
    expenses: [],
    dailyAccount: [],
    loading: false,
    error: null,
};

const axiosInstance = axios.create({
    baseURL: "http://127.0.0.1:5000",
    headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    },
});

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

const clientsSlice = createSlice({
    name: "clients",
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllSchedules.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllSchedules.fulfilled, (state, action) => {
                state.clients = action.payload;
                state.loading = false;
            })
            .addCase(getAllSchedules.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
    },
});

export default reportsSlice.reducer;
