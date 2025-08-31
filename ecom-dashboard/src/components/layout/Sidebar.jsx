import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Settings,
  LogOut,
  Menu,
  X,
  Users,
  Shield,
  FileText,
  BarChart2,
  CreditCard,
  Bell,
  Truck,
  MessageCircle,
} from "lucide-react";
import { useAuthStore } from "../../store/useAdminStore";

const Sidebar = () => {
  const location = useLocation();
  const { logout, authUser, can } = useAuthStore();
  function handleLogout() {
    logout();
    navigate("/login");
  }
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  // If not logged in or role is CUSTOMER, render nothing (ProtectedRoute already handles redirect)
  if (!authUser || ["SUPER_ADMIN","ADMIN","SUB_ADMIN"].includes(authUser.role) === false) {
    return null;
  }

  // Base items everyone with dashboard access can see
  const baseNavigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  ];

  // Permission-gated items
  const permissionItems = [
    { name: "Category", href: "/dashboard/category", icon: ShoppingCart, perm: ["CATEGORIES","VIEW"] },
    { name: "Products", href: "/dashboard/products", icon: Package, perm: ["PRODUCTS","VIEW"] },
    { name: "Orders", href: "/dashboard/orders", icon: ShoppingCart, perm: ["ORDERS","VIEW"] },
    { name: "CMS", href: "/dashboard/cms", icon: FileText, perm: ["CMS","VIEW"] },
    { name: "Reports", href: "/dashboard/reports", icon: BarChart2, perm: ["REPORTS","VIEW"] },
    { name: "Shipping", href: "/dashboard/shipping", icon: Truck, perm: ["SHIPPING","VIEW"] },
    { name: "Users", href: "/dashboard/users", icon: Users, perm: ["CUSTOMERS","VIEW"] },
    // { name: "Payments", href: "/dashboard/payments", icon: CreditCard, perm: ["PAYMENTS","VIEW"] },
    // { name: "Notifications", href: "/dashboard/notifications", icon: Bell, perm: ["NOTIFICATIONS","VIEW"] },
    // { name: "Chat", href: "/dashboard/chat", icon: MessageCircle, perm: ["CHAT","VIEW"] },
  ].filter((item) => authUser.role === "SUPER_ADMIN" || can(item.perm[0], item.perm[1]));

  // Settings is allowed to all admins
  const settingsItem = { name: "Settings", href: "/dashboard/settings", icon: Settings };

  let navigation = [...baseNavigation, ...permissionItems, settingsItem];

  // SUPER_ADMIN-only items
  if (authUser?.role === "SUPER_ADMIN") {
    navigation.push({ name: "Admins", href: "/dashboard/users/admins", icon: Shield });
  }

  return (
    <>
      {/* Mobile Topbar */}
      <div className="md:hidden fixed top-0 left-0 z-50 bg-gray-900 w-full flex items-center justify-between px-4 py-3 text-white shadow-md">
        <Link to="/" className="text-2xl font-extrabold hover:opacity-80">
          E-Dashboard
        </Link>
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`bg-gray-900 text-white w-64 pt-14 pb-4 px-2 fixed inset-y-0 left-0 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:pt-7 md:pb-4 md:translate-x-0 transition-transform duration-200 ease-in-out z-40 flex flex-col overflow-y-auto`}
      >
        {/* Sidebar Header */}
        <div className="hidden md:flex items-center space-x-2 px-4 mb-4">
          <Package className="w-8 h-8" />
          <Link to="/" className="text-2xl font-extrabold hover:opacity-80">
            E-Dashboard
          </Link>
        </div>

        {/* Main Nav */}
        <nav className="flex-1 space-y-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center space-x-2 py-2 px-4 rounded transition duration-200 ${
                location.pathname === item.href
                  ? "bg-gray-700 text-white"
                  : "text-gray-400 hover:bg-gray-700 hover:text-white"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Logout Button - Bottom Aligned */}
        <div className="mt-auto pt-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 py-2 px-4 w-full text-gray-400 hover:bg-gray-700 hover:text-white rounded transition duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
