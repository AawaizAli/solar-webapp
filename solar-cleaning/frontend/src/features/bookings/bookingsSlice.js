import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from '../../api/axios.js';
const baseURL = process.env.NODE_ENV === 'production' ? 'https://hash1khn.pythonanywhere.com' : 'http://127.0.0.1:5000/';

const initialState = {
    bookings: [],
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

// Async thunk for fetching bookings
export const getAllBookings = createAsyncThunk(
    "bookings/get-all-bookings",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(
                "/api/bookings/get-all-bookings"
            );
            console.log(response.data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const getById = createAsyncThunk(
    "bookings/get-by-id",
    async (id, { rejectWithValue, dispatch, getState }) => {
        try {
            const state = getState();
            if (state.bookings.bookings.length === 0) {
                await dispatch(getAllBookings());
            }
            const booking = state.bookings.bookings.find(
                (booking) => booking.id === parseInt(id, 10)
            );
            if (!booking) {
                throw new Error("Booking not found");
            }
            return booking;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Async thunk for fetching bookings by client ID
export const getByClientId = createAsyncThunk(
    "bookings/get-by-client-id",
    async (clientId, { rejectWithValue, dispatch }) => {
        try {
            const response = await dispatch(getAllBookings());
            const bookings = response.payload.filter(
                (booking) => booking.client_id.toString() === clientId
            );
            return bookings;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Async thunk for fetching bookings by worker ID
export const getByWorkerId = createAsyncThunk(
    "bookings/get-by-worker-id",
    async (workerId, { rejectWithValue, dispatch }) => {
        try {
            const response = await dispatch(getAllBookings());
            const bookings = response.payload.filter(
                (booking) => booking.worker_id.toString() === workerId
            );
            return bookings;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const getByClientName = createAsyncThunk(
    "bookings/get-by-client-name",
    async (clientName, { rejectWithValue, dispatch, getState }) => {
        try {
            const state = getState();
            if (state.bookings.bookings.length === 0) {
                await dispatch(getAllBookings());
            }
            const bookings = state.bookings.bookings.filter((booking) =>
                booking.client.name
                    .toLowerCase()
                    .includes(clientName.toLowerCase())
            );
            return bookings;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const getByWorkerName = createAsyncThunk(
    "bookings/get-by-worker-name",
    async (workerName, { rejectWithValue, dispatch, getState }) => {
        try {
            const state = getState();
            if (state.bookings.bookings.length === 0) {
                await dispatch(getAllBookings());
            }
            const bookings = state.bookings.bookings.filter((booking) =>
                booking.worker.name
                    .toLowerCase()
                    .includes(workerName.toLowerCase())
            );
            return bookings;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const getByStatus = createAsyncThunk(
    "bookings/get-by-status",
    async (status, { rejectWithValue, dispatch, getState }) => {
        try {
            const state = getState();
            if (state.bookings.bookings.length === 0) {
                await dispatch(getAllBookings());
            }
            const bookings = state.bookings.bookings.filter(
                (booking) =>
                    booking.status.toLowerCase() === status.toLowerCase()
            );
            return bookings;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const getByTimeSlot = createAsyncThunk(
    "bookings/get-by-time-slot",
    async (timeSlot, { rejectWithValue, dispatch, getState }) => {
        try {
            const state = getState();
            if (state.bookings.bookings.length === 0) {
                await dispatch(getAllBookings());
            }
            const bookings = state.bookings.bookings.filter(
                (booking) => booking.time_slot === timeSlot
            );
            return bookings;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const getByRecurrence = createAsyncThunk(
    "bookings/get-by-recurrence",
    async (recurrence, { rejectWithValue, dispatch, getState }) => {
        try {
            const state = getState();
            if (state.bookings.bookings.length === 0) {
                await dispatch(getAllBookings());
            }
            const bookings = state.bookings.bookings.filter(
                (booking) => booking.recurrence === recurrence
            );
            return bookings;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

// Async thunk for creating a booking
export const createBooking = createAsyncThunk(
    "bookings/create-booking",
    async (bookingData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                "/api/bookings/create-booking",
                bookingData
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

// Async thunk for updating a booking
export const updateBooking = createAsyncThunk(
    "bookings/update-booking",
    async ({ id, updatedData }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(
                `/api/bookings/update-booking/${id}`,
                updatedData
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

// Async thunk for deleting a booking
export const deleteBooking = createAsyncThunk(
    "bookings/deleteBooking",
    async (id, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/api/bookings/delete-booking/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

const bookingsSlice = createSlice({
    name: "bookings",
    initialState,
    reducers: {
        // Additional reducers if needed
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllBookings.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllBookings.fulfilled, (state, action) => {
                state.bookings = action.payload;
                state.loading = false;
            })
            .addCase(getAllBookings.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
            .addCase(getByClientId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getByClientId.fulfilled, (state, action) => {
                state.bookings = action.payload;
                state.loading = false;
            })
            .addCase(getByClientId.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
            .addCase(getByWorkerId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getByWorkerId.fulfilled, (state, action) => {
                state.bookings = action.payload;
                state.loading = false;
            })
            .addCase(getByWorkerId.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
            .addCase(getByClientName.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getByClientName.fulfilled, (state, action) => {
                state.bookings = action.payload;
                state.loading = false;
            })
            .addCase(getByClientName.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
            .addCase(getByWorkerName.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getByWorkerName.fulfilled, (state, action) => {
                state.bookings = action.payload;
                state.loading = false;
            })
            .addCase(getByWorkerName.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
            .addCase(getByStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getByStatus.fulfilled, (state, action) => {
                state.bookings = action.payload;
                state.loading = false;
            })
            .addCase(getByStatus.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
            .addCase(getByTimeSlot.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getByTimeSlot.fulfilled, (state, action) => {
                state.bookings = action.payload;
                state.loading = false;
            })
            .addCase(getByTimeSlot.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
            .addCase(getByRecurrence.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getByRecurrence.fulfilled, (state, action) => {
                state.bookings = action.payload;
                state.loading = false;
            })
            .addCase(getByRecurrence.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
            .addCase(createBooking.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createBooking.fulfilled, (state, action) => {
                state.bookings.push(action.payload);
                state.loading = false;
            })
            .addCase(createBooking.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
            .addCase(updateBooking.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateBooking.fulfilled, (state, action) => {
                const index = state.bookings.findIndex(
                    (booking) => booking.id === action.payload.id
                );
                if (index !== -1) {
                    state.bookings[index] = action.payload;
                }
                state.loading = false;
            })
            .addCase(updateBooking.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
            .addCase(deleteBooking.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteBooking.fulfilled, (state, action) => {
                state.bookings = state.bookings.filter(
                    (booking) => booking.id !== action.payload
                );
                state.loading = false;
            })
            .addCase(deleteBooking.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            });
    },
});

export default bookingsSlice.reducer;
