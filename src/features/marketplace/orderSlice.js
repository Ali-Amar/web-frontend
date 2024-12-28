import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
  stats: {
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0
  }
};

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    // Fetch orders start
    fetchOrdersStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchOrdersSuccess: (state, action) => {
      state.loading = false;
      state.orders = action.payload.orders;
      state.stats = action.payload.stats;
    },
    fetchOrdersFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Create order
    createOrderStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    createOrderSuccess: (state, action) => {
      state.loading = false;
      state.orders.unshift(action.payload);
      state.stats.totalOrders += 1;
      state.stats.pendingOrders += 1;
    },
    createOrderFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Update order status
    updateOrderStatusStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateOrderStatusSuccess: (state, action) => {
      state.loading = false;
      const index = state.orders.findIndex(order => order._id === action.payload._id);
      if (index !== -1) {
        const oldStatus = state.orders[index].status;
        const newStatus = action.payload.status;
        
        // Update order
        state.orders[index] = action.payload;
        
        // Update stats
        if (oldStatus === 'pending' && newStatus === 'completed') {
          state.stats.pendingOrders -= 1;
          state.stats.completedOrders += 1;
        }
      }
    },
    updateOrderStatusFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Set current order
    setCurrentOrder: (state, action) => {
      state.currentOrder = action.payload;
    },

    // Clear order errors
    clearError: (state) => {
      state.error = null;
    },

    // Reset order state
    resetOrders: () => initialState
  }
});

export const {
  fetchOrdersStart,
  fetchOrdersSuccess,
  fetchOrdersFailure,
  createOrderStart,
  createOrderSuccess,
  createOrderFailure,
  updateOrderStatusStart,
  updateOrderStatusSuccess,
  updateOrderStatusFailure,
  setCurrentOrder,
  clearError,
  resetOrders
} = orderSlice.actions;

export default orderSlice.reducer;