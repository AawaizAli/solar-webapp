import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from '../../api/axios.js';
const baseURL = process.env.NODE_ENV === 'production' ? 'https://hash1khn.pythonanywhere.com' : 'http://127.0.0.1:5000';

const initialState = {
    bookings: [],
    salary: [],
    expenses: [],
    dailyAccount: [],
    loading: false,
    error: null,
};

const axiosInstance = axios.create({
    baseURL: baseURL,
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

export const getAllReports = createAsyncThunk(
    "reports/getAllReports",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get("/api/reports/get-all-reports");
            console.log(response.data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const updateReportData = createAsyncThunk(
    "reports/updateReportData",
    async (reportData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("/api/reports/update-report", reportData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const deleteReportData = createAsyncThunk(
    "reports/deleteReportData",
    async (reportData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete("/api/reports/delete-report", { data: reportData });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const reportsSlice = createSlice({
    name: "reports",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllReports.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllReports.fulfilled, (state, action) => {
                state.bookings = action?.payload?.bookings;
                state.salary = action?.payload?.salaries;
                state.expenses = action?.payload?.expenses;
                state.dailyAccount = action?.payload?.daily_accounts;
                state.loading = false;
            })
            .addCase(getAllReports.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
            .addCase(updateReportData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateReportData.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(updateReportData.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
            .addCase(deleteReportData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteReportData.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(deleteReportData.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            });
    },
});

export default reportsSlice.reducer;
