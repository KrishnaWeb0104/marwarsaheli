import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore.js";

const AccountLayout = () => {
  const navItems = [
    { name: "My Profile", path: "/account" },
    { name: "My Orders", path: "/account/orders" },
    { name: "Wish listed", path: "/account/wishlist" },
  ];

  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login"); // redirect after logout
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 flex gap-10">
      {/* Sidebar */}
      <aside className="w-1/4 border-r pr-6 shadow-2xl p-6">
        <h2 className="text-lg font-semibold mb-4">My Account</h2>
        <ul className="space-y-3">
          {navItems.map((item, idx) => (
            <li key={idx}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  isActive
                    ? "text-red-600 font-medium"
                    : "text-gray-700 hover:text-red-500"
                }
              >
                {item.name}
              </NavLink>
            </li>
          ))}

          {/* Logout */}
          <li>
            <button
              onClick={handleLogout}
              className="text-gray-700 hover:text-red-500 font-medium"
            >
              Logout
            </button>
          </li>
        </ul>
      </aside>

      {/* Right Content */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default AccountLayout;
