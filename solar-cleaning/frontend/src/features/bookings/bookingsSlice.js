import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from '../../api/axios.js';
const baseURL = process.env.NODE_ENV === 'production' ? 'https://hash1khn.pythonanywhere.com' : 'http://127.0.0.1:5000';

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

export const getAllBookings = createAsyncThunk(
    "bookings/get-all-bookings",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(
                "/api/bookings/all-booking-details"
            );
            console.log('rida ashfaq qureshi');
            console.log(response.data);
            return response.data.map((booking) => ({
                ...booking,
                id: booking.booking_id,
                date: new Date(booking.date).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',}) // Map booking_id to id for consistency
            }));
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

// // Async thunk for fetching bookings
// export const getAllBookings = createAsyncThunk(
//     "bookings/get-all-bookings",
//     async (_, { rejectWithValue }) => {
//         try {
//             const response = await axiosInstance.get(
//                 "/api/bookings/get-all-bookings"
//             );
//             console.log(response.data);
//             return response.data;
//         } catch (error) {
//             return rejectWithValue(error.response.data.message);
//         }
//     }
// );

export const getById = createAsyncThunk(
    "bookings/get-by-id",
    async (id, { rejectWithValue }) => {
        try {
            // Make an API call to fetch booking by ID
            const response = await axiosInstance.get(`/api/bookings/search/booking_id/${id}`);
            console.log("Booking Response:", response.data); // Log the response

            // Return the response data, which will contain the booking details
            return response.data.map((booking) => ({
                ...booking,
                id: booking.booking_id,
                date: new Date(booking.date).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',}) // Map booking_id to id for consistency
            }));
        } catch (error) {
            // Handle and return any errors that occur
            return rejectWithValue(error.response?.data?.message || "Error fetching booking by ID");
        }
    }
);


// Async thunk for fetching bookings by client ID
export const getByClientId = createAsyncThunk(
    "bookings/get-by-client-id",
    async (clientId, { rejectWithValue }) => {
        try {
            // Make the API call to the backend to get bookings by client ID
            const response = await axiosInstance.get(`/api/bookings/search/client/${clientId}`);
            console.log(response.data)
            // Assuming the backend returns the data in the correct structure,
            // we can directly return the response data.
            return response.data.map((booking) => ({
                ...booking,
                id: booking.booking_id,
                date: new Date(booking.date).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',}) // Map booking_id to id for consistency
            }));
        } catch (error) {
            // If there's an error, return a rejected promise with the error message
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const getByWorkerId = createAsyncThunk(
    "bookings/get-by-worker-id",
    async (workerId, { rejectWithValue }) => {
        try {
            // Making the request using axiosInstance
            const response = await axiosInstance.get(`/api/bookings/search/worker/${workerId}`);

            // Axios automatically parses the response as JSON
            return response.data.map((booking) => ({
                ...booking,
                id: booking.booking_id,
                date: new Date(booking.date).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',}) // Map booking_id to id for consistency
            }));
        } catch (error) {
            // Return a more meaningful error message if available
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);



export const getByClientName = createAsyncThunk(
    "bookings/get-by-client-name",
    async (clientName, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/api/bookings/search/client/name/${clientName}`);
            return response.data.map((booking) => ({
                ...booking,
                id: booking.booking_id,
                date: new Date(booking.date).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',}) // Map booking_id to id for consistency
            })); // Directly return the filtered bookings by client name
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);


export const getByWorkerName = createAsyncThunk(
    "bookings/get-by-worker-name",
    async (workerName, { rejectWithValue }) => {
        try {
            // Make the request to the API using the worker name
            const response = await axiosInstance.get(`/api/bookings/search/worker/name/${workerName}`);
            
            // Axios automatically parses the response as JSON
            return response.data.map((booking) => ({
                ...booking,
                id: booking.booking_id,
                date: new Date(booking.date).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',}) // Map booking_id to id for consistency
            }));
        } catch (error) {
            // Return a more meaningful error message if available
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);
export const getByDate = createAsyncThunk(
    "bookings/get-by-date",
    async (date, { rejectWithValue }) => {
        try {
            // Call the backend API to get bookings filtered by date
            const response = await axiosInstance.get(`/api/bookings/search/date/${date}`);
            
            // Axios automatically parses JSON responses, so no need to use `.json()`
            return response.data.map((booking) => ({
                ...booking,
                id: booking.booking_id,
                date: new Date(booking.date).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',}) // Map booking_id to id for consistency
            }));
        } catch (error) {
            // Return a meaningful error message if available
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);
export const getByTodaysDate = createAsyncThunk(
    "bookings/get-by-todays-date",
    async (date, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/api/bookings/search/date/${date}`);
            return response.data.map((booking) => ({
                ...booking,
                id: booking.booking_id,
                date: new Date(booking.date).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',}) // Map booking_id to id for consistency
            }));
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const getByStatus = createAsyncThunk(
    "bookings/get-by-status",
    async (status, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/api/bookings/search/status/${status}`);
            return response.data.map((booking) => ({
                ...booking,
                id: booking.booking_id,
                date: new Date(booking.date).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',}) // Map booking_id to id for consistency
            }));// Directly return the filtered bookings by status
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);


export const getByTimeSlot = createAsyncThunk(
    "bookings/get-by-time-slot",
    async (timeSlot, { rejectWithValue }) => {
        try {
            // Call the backend API to get bookings filtered by time slot
            const response = await axiosInstance.get(`/api/bookings/search/slot/${encodeURIComponent(timeSlot)}`);
            
            return response.data.map((booking) => ({
                ...booking,
                id: booking.booking_id,
                date: new Date(booking.date).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',}) // Map booking_id to id for consistency
            }));
        } catch (error) {
            // Return a meaningful error message if available
            return rejectWithValue(error.response?.data?.message || error.message);
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
