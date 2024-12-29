import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Import reducers
import userReducer from "../features/auth/authSlice";
import themeReducer from "../features/theme/themeSlice";
import authMiddleware from "./middleware/authMiddleware";
import languageReducer from "../features/languageSlice";

// Combine reducers
const rootReducer = combineReducers({
  user: userReducer,
  theme: themeReducer, 
  language: languageReducer
});

// Configure persist options
const persistConfig = {
  key: 'root',
  version: 1,
  storage,
};

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(authMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
});

// Create persistor
export const persistor = persistStore(store);