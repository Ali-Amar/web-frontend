import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { Provider } from 'react-redux';
import { persistor, store } from './store/index.js';
import { PersistGate } from 'redux-persist/integration/react';
import ThemeProvider from './utils/ThemeProvider.jsx';
import DashComments from './components/dashboard/admin/DashComments.jsx';
import DashClientOrder from './components/dashboard/admin/DashClientOrder.jsx';
import DashAddProduct from './components/dashboard/admin/DashAddProduct.jsx';
import CreateListing from './pages/marketplace/CreateListing.jsx';
import Notifications from './pages/profile/Notifications.jsx';
import Settings from './pages/profile/Settings.jsx';
import UserProfile from './pages/profile/UserProfile.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate persistor={persistor} loading={null}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </PersistGate>
  </Provider>
);






