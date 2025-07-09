import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tickets: [],
  currentTicket: null,
  loading: false,
  error: null
};

const ticketSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {
    fetchTicketsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchTicketsSuccess(state, action) {
      state.tickets = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchTicketsFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    createTicketStart(state) {
      state.loading = true;
      state.error = null;
    },
    createTicketSuccess(state, action) {
      state.tickets.push(action.payload);
      state.loading = false;
      state.error = null;
    },
    createTicketFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    updateTicketStart(state) {
      state.loading = true;
      state.error = null;
    },
    updateTicketSuccess(state, action) {
      const index = state.tickets.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.tickets[index] = action.payload;
      }
      state.loading = false;
      state.error = null;
    },
    updateTicketFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    setCurrentTicket(state, action) {
      state.currentTicket = action.payload;
    }
  }
});

export const {
  fetchTicketsStart,
  fetchTicketsSuccess,
  fetchTicketsFailure,
  createTicketStart,
  createTicketSuccess,
  createTicketFailure,
  updateTicketStart,
  updateTicketSuccess,
  updateTicketFailure,
  setCurrentTicket
} = ticketSlice.actions;

export default ticketSlice.reducer;