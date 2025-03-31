import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './slices/authSlice';
import dashboardReducer from './slices/dashboardSlice';
import feeReducer from './slices/feeSlice';
import paymentReducer from './slices/paymentSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'] // Only persist auth state
};

const rootReducer = {
  auth: persistReducer(persistConfig, authReducer),
  dashboard: dashboardReducer,
  fees: feeReducer,
  payments: paymentReducer
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST']
      }
    })
});

export const persistor = persistStore(store);
