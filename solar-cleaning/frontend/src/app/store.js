import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import bookingsReducer from "../features/bookings/bookingsSlice";
import clientsReducer from "../features/clients/clientsSlice";
import workersReducer from "../features/workers/workersSlice";
import reportsReducer from "../features/reports/reportsSlice";
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore ,FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,} from 'redux-persist';
import { combineReducers } from "@reduxjs/toolkit";
const persistConfig = {
    key: 'root',
    storage,
  }
  const reducers = combineReducers({
    auth: authReducer,
    bookings: bookingsReducer,
    clients: clientsReducer,
    workers: workersReducer,
    reports: reportsReducer,
});

  const persistedReducer = persistReducer(persistConfig, reducers)


export const store = configureStore({
    reducer: persistedReducer,
    devTools: process.env.NODE_ENV !== 'production',
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  })
  
  export const persistor = persistStore(store)
