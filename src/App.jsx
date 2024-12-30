import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "flowbite-react";
import { Link } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";

// Public Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import Support from "./pages/Support";

// Profile Pages
import UserProfile from "./pages/profile/UserProfile";
import Settings from "./pages/profile/Settings";
import Notifications from "./pages/profile/Notifications";

// Marketplace
import Marketplace from "./pages/marketplace/Marketplace";
import Product from "./pages/marketplace/Product";
import ShopProfile from "./pages/marketplace/ShopProfile";
import Cart from "./pages/marketplace/Cart";
import Checkout from "./pages/marketplace/Checkout";
import CreateListing from "./pages/marketplace/CreateListing";
import BuyerOrder from "./pages/buyer/BuyerOrder";

// Training & Mentorship
import Training from "./pages/training/Training";
import CourseDetails from "./pages/training/CourseDetails";
// import ResourceLibrary from "./pages/training/ResourceLibrary";
import Mentorship from "./pages/training/Mentorship";
// import MentorshipSessions from "./pages/training/MentorshipSessions";

// Community
import Community from "./pages/community/Community";
import CommunityPost from "./pages/community/CommunityPost";
import Events from "./pages/community/Events";

// Dashboard Components
import DashboardComp from "./components/dashboard/admin/DashboardComp";
import DashProducts from "./components/dashboard/admin/DashProducts";
import DashProfile from "./components/dashboard/admin/DashProfile";
import DashTransaction from "./components/dashboard/admin/DashTransaction";

// Seller Components
import OrderManager from "./components/dashboard/seller/OrderManager";
import ProductManager from "./components/dashboard/seller/ProductManager";
import SellerProfile from "./components/dashboard/seller/SellerProfile";
import Sales from "./components/dashboard/seller/Sales";
import Orders from "./components/dashboard/seller/Orders";

// Utils & Route Protection
import PrivateRoute from "./utils/PrivateRoute";
import AdminRoute from "./utils/AdminRoute";
import SellerRoute from "./utils/SellerRoute";

function App() {
  const { currentUser } = useSelector((state) => state.user);
  const {language} = useSelector((state) => state.language)

  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/support" element={<Support />} />

          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            {/* Profile Routes */}
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/notifications" element={<Notifications />} />

            {/* Marketplace Routes */}
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/marketplace/product/:id" element={<Product />} />
            <Route path="/marketplace/shop/:id" element={<ShopProfile />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<BuyerOrder />} />
            
            {/* Training Routes */}
            <Route path="/training" element={<Training />} />
            <Route path="/training/course/:id" element={<CourseDetails />} />
            <Route path="/mentorship" element={<Mentorship />} />
            {/* <Route path="/training/resources" element={<ResourceLibrary />} /> */}
            
            {/* Community Routes */}
            <Route path="/community" element={<Community />} />
            <Route path="/community/post/:id" element={<CommunityPost />} />
            <Route path="/community/events" element={<Events />} />
          </Route>

          {/* Seller Routes */}
          <Route element={<SellerRoute />}>
            <Route path="/seller" element={<DashboardComp />} />
            <Route path="/seller/orders" element={<OrderManager />} />
            <Route path="/seller/products" element={<ProductManager />} />
            <Route path="/seller/products/create" element={<CreateListing />} />
            <Route path="/seller/profile" element={<SellerProfile />} />
            <Route path="/seller/sales" element={<Sales />} />
            <Route path="/seller/orders" element={<Orders />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<DashboardComp />} />
            <Route path="/admin/products" element={<DashProducts />} />
            <Route path="/admin/profile" element={<DashProfile />} />
            <Route path="/admin/transactions" element={<DashTransaction />} />
          </Route>

          {/* 404 Route */}
          <Route path="*" element={
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-900 dark:text-white">404</h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 mt-4">
                  {language === 'ur' ? 'صفحہ نہیں ملا' : 'Page not found'}
                </p>
                <Button
                  as={Link}
                  to="/"
                  gradientDuoTone="purpleToBlue"
                  className="mt-6"
                >
                  {language === 'ur' ? 'ہوم پیج پر جائیں' : 'Go to Homepage'}
                </Button>
              </div>
            </div>
          } />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;