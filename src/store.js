import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import ticketReducer from './features/ticketSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tickets: ticketReducer
  }
});