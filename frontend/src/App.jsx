import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute"; // Import ProtectedRoute
import { useAuthStore } from "./store/useAuthStore";

import LandingPage from "./pages/LandingPage";
import ProductDetails from "./pages/ProductDetails";
import CategoryPage from "./pages/CategoryPage";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Payment from "./pages/Payment";
import ShippingDetails from "./pages/ShippingDetails";
import SavedAddress from "./pages/SavedAddress";
import Terms from "./pages/Terms";
import AboutUs from "./pages/AboutUs";
import Resources from "./pages/Resources";

import AccountLayout from "@/pages/account/AccountLayout";
import MyProfile from "@/pages/account/MyProfile";
import MyOrders from "@/pages/account/MyOrders";
import Wishlist from "@/pages/account/Wishlist";
import ViewOrderDetails from "./pages/account/ViewOrderDetails";
import SignUp from "./pages/SignUp";
import ProductsList from "./pages/ProductsList";
import Policies from "./pages/Policies";
import HelpPage from "./pages/HelpPage";
import FAQ from "./pages/FAQ";

const App = () => {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth(); // Check if user is already logged in
  }, [checkAuth]);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Main Pages */}
        <Route index element={<LandingPage />} />
        <Route path="product/:id" element={<ProductDetails />} />
        <Route path="productsList" element={<ProductsList />} />
        <Route path="category/:slug" element={<CategoryPage />} />

        <Route path="cart" element={<Cart />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="shippingDetails" element={<ShippingDetails />} />
        <Route path="savedAddress" element={<SavedAddress />} />
        <Route path="payment" element={<Payment />} />
        <Route path="terms" element={<Terms />} />
        <Route path="aboutUs" element={<AboutUs />} />
        <Route path="resources" element={<Resources />} />
        <Route path="policies" element={<Policies />} />
        <Route path="help" element={<HelpPage />} />
        <Route path="faq" element={<FAQ />} />

        {/* � Protected Account Routes */}
        <Route
          path="account"
          element={
            <ProtectedRoute>
              <AccountLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<MyProfile />} />
          <Route path="orders" element={<MyOrders />} />
          <Route
            path="orders/viewOrderDetails"
            element={<ViewOrderDetails />}
          />
          <Route path="wishlist" element={<Wishlist />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
