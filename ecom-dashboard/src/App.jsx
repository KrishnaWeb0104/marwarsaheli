import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { useAuthStore } from "./store/useAdminStore";
import Layout from "./components/layout/Layout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Forgot from "./pages/auth/ForgotPassword";
import DashboardHome from "./pages/dashboard/DashboardHome";
import Products from "./pages/products/Products";
import AddProducts from "./pages/products/AddProducts";
import EditProduct from "./pages/products/EditProduct";
import Category from "./pages/category/Category";
import AddCategories from "./pages/category/AddCategories";
import Brands from "./pages/brands/Brands";
import Orders from "./pages/orders/Orders";
import OrderDetails from "./pages/orders/OrderDetails";
import Customers from "./pages/customers/Customers";
import CustomerDetails from "./pages/customers/CustomerDetails";
import Admins from "./pages/users/Admins";
import AddAdmin from "./pages/users/AddAdmin";
import Users from "./pages/users/Users";
import CMSPages from "./pages/cms/CMSPages";
import AddCMSPage from "./pages/cms/AddCMSPage";
import Reports from "./pages/reports/Reports";
import Payments from "./pages/payments/Payments";
import Notifications from "./pages/notifications/Notifications";
import ShippingManagement from "./pages/shipping/ShippingManagement";
import ChatSupport from "./pages/chat/ChatSupport";
import SettingsPage from "./pages/settings/SettingsPage";
import EditCategory from "./pages/category/EditCategory";
import EditCMSPage from "./pages/cms/EditCMSPage";

// Simple loading screen during auth check
const AuthLoader = () => (
  <div className="flex items-center justify-center h-screen bg-[#1a1a1a]">
    <p className="text-white text-lg">Checking authentication...</p>
  </div>
);

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const { authUser, isAuthCheck } = useAuthStore();

  if (isAuthCheck) return <AuthLoader />;
  if (!authUser) return <Navigate to="/login" replace />;
  if (["SUPER_ADMIN", "ADMIN", "SUB_ADMIN"].includes(authUser.role) === false) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const { isAuthCheck, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isAuthCheck) return <AuthLoader />;

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Navigate to="/dashboard" />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />

          <Route path="products" element={<Products />} />
          <Route path="products/addProducts" element={<AddProducts />} />
          <Route path="products/edit/:productId" element={<EditProduct />} />

          <Route path="category" element={<Category />} />
          <Route path="category/add" element={<AddCategories />} />
          <Route path="category/edit/:id" element={<EditCategory />} />

          {/* <Route path="brands" element={<Brands />} /> */}

          <Route path="orders" element={<Orders />} />
          <Route path="orders/:orderId" element={<OrderDetails />} />

          <Route path="customers" element={<Customers />} />
          <Route path="customers/:customerId" element={<CustomerDetails />} />

          <Route path="users" element={<Users />} />
          <Route path="users/admins" element={<Admins />} />
          <Route path="users/admins/add" element={<AddAdmin />} />

          <Route path="cms" element={<CMSPages />} />
          <Route path="cms/add" element={<AddCMSPage />} />
          <Route path="cms/edit/:slug" element={<EditCMSPage />} />

          <Route path="reports" element={<Reports />} />
          <Route path="payments" element={<Payments />} />
          {/* <Route path="notifications" element={<Notifications />} /> */}

          <Route path="shipping" element={<ShippingManagement />} />

          <Route path="chat" element={<ChatSupport />} />

          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
