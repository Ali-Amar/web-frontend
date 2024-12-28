import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
  selectedProduct: null,
  loading: false,
  error: null,
  filters: {
    category: '',
    priceRange: [0, 0],
    craftType: '',
    region: '',
    sortBy: 'latest'
  },
  stats: {
    totalProducts: 0,
    activeProducts: 0,
    outOfStock: 0,
    totalViews: 0
  }
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    // Fetch products start
    fetchProductsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchProductsSuccess: (state, action) => {
      state.loading = false;
      state.products = action.payload.products;
      state.stats = action.payload.stats;
    },
    fetchProductsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Create product
    createProductStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    createProductSuccess: (state, action) => {
      state.loading = false;
      state.products.unshift(action.payload);
      state.stats.totalProducts += 1;
      state.stats.activeProducts += 1;
    },
    createProductFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Update product
    updateProductStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateProductSuccess: (state, action) => {
      state.loading = false;
      const index = state.products.findIndex(product => product._id === action.payload._id);
      if (index !== -1) {
        // Track stock status changes for stats
        const wasOutOfStock = state.products[index].stock === 0;
        const isOutOfStock = action.payload.stock === 0;
        
        // Update product
        state.products[index] = action.payload;
        
        // Update stats if stock status changed
        if (wasOutOfStock && !isOutOfStock) {
          state.stats.outOfStock -= 1;
          state.stats.activeProducts += 1;
        } else if (!wasOutOfStock && isOutOfStock) {
          state.stats.outOfStock += 1;
          state.stats.activeProducts -= 1;
        }
      }
    },
    updateProductFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Delete product
    deleteProductStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteProductSuccess: (state, action) => {
      state.loading = false;
      const product = state.products.find(p => p._id === action.payload);
      state.products = state.products.filter(p => p._id !== action.payload);
      
      // Update stats
      state.stats.totalProducts -= 1;
      if (product?.stock === 0) {
        state.stats.outOfStock -= 1;
      } else {
        state.stats.activeProducts -= 1;
      }
    },
    deleteProductFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Set selected product
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },

    // Update product views
    incrementProductViews: (state, action) => {
      const product = state.products.find(p => p._id === action.payload);
      if (product) {
        product.views = (product.views || 0) + 1;
        state.stats.totalViews += 1;
      }
    },

    // Update filters
    updateFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload
      };
    },

    // Clear filters
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },

    // Clear errors
    clearError: (state) => {
      state.error = null;
    },

    // Reset product state
    resetProducts: () => initialState
  }
});

export const {
  fetchProductsStart,
  fetchProductsSuccess,
  fetchProductsFailure,
  createProductStart,
  createProductSuccess,
  createProductFailure,
  updateProductStart,
  updateProductSuccess,
  updateProductFailure,
  deleteProductStart,
  deleteProductSuccess,
  deleteProductFailure,
  setSelectedProduct,
  incrementProductViews,
  updateFilters,
  clearFilters,
  clearError,
  resetProducts
} = productSlice.actions;

export default productSlice.reducer;