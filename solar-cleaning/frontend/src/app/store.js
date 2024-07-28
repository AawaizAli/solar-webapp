import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import bookingsReducer from "../features/bookings/bookingsSlice";
import clientsReducer from "../features/clients/clientsSlice";
import workersReducer from "../features/workers/workersSlice";
import reportsReducer from "../features/reports/reportsSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        bookings: bookingsReducer,
        clients: clientsReducer,
        workers: workersReducer,
        reports: reportsReducer,
    },
});

export default store;
