// src/pages/Login.jsx
import React, { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore.js"; // ✅ use the Zustand store

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [showPwd, setShowPwd] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Get the redirect path from state (where user was trying to go)
  const from = location.state?.from || "/account";

  const { signin, isSignIn, authUser } = useAuthStore();

  const onChange = (e) => {
    const { name, type, checked, value } = e.target;
    setForm((s) => ({ ...s, [name]: type === "checkbox" ? checked : value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    // quick guard
    if (!form.email || !form.password) return;

    try {
      // call your API via store (httpOnly cookies handled by axiosInstance)
      await signin({ email: form.email.trim(), password: form.password });

      // store “remember me” if you want to tweak UX later
      if (form.remember) {
        localStorage.setItem("remember_me", "1");
      } else {
        localStorage.removeItem("remember_me");
      }

      // redirect
      navigate(from, { replace: true });
    } catch {
      // toast already handled inside the store; no-op here
    }
  };

  // already signed in? yeet to redirect
  useEffect(() => {
    if (authUser) navigate(from, { replace: true });
  }, [authUser]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative bg-white">
      <div aria-hidden className="pointer-events-none absolute inset-0" />
      <div className="relative z-10 w-full max-w-xl px-6">
        <h1 className="text-center text-2xl md:text-3xl font-semibold mb-8">
          Login
        </h1>

        <form
          onSubmit={onSubmit}
          className="bg-white/70 backdrop-blur-sm rounded-2xl p-6"
        >
          {/* Email */}
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            name="email"
            value={form.email}
            onChange={onChange}
            placeholder="you@example.com"
            className="w-full mb-4 rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 px-4 py-3"
            type="email"
            autoComplete="email"
            required
          />

          {/* Password */}
          <label className="block text-sm font-medium mb-1">Password</label>
          <div className="relative">
            <input
              name="password"
              value={form.password}
              onChange={onChange}
              className="w-full rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 px-4 py-3 pr-12"
              type={showPwd ? "text" : "password"}
              autoComplete="current-password"
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPwd((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-gray-100 focus:outline-none"
              aria-label={showPwd ? "Hide password" : "Show password"}
            >
              {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Remember + Forgot */}
          <div className="flex justify-between items-center text-sm mt-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="remember"
                checked={form.remember}
                onChange={onChange}
                className="accent-orange-600"
              />
              <span>Remember me</span>
            </label>
            <Link to="/forgot" className="text-green-700 underline">
              Forgot password?
            </Link>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isSignIn}
            className="mt-8 w-full rounded-xl border border-red-500 text-red-600 bg-white hover:bg-red-50 active:scale-[0.99] transition px-4 py-3 font-medium disabled:opacity-60"
          >
            {isSignIn ? "Logging in..." : "Login"}
          </Button>

          {/* Link to Sign Up */}
          <p className="text-center text-sm text-gray-600 mt-4">
            New here?{" "}
            <Link className="text-red-600 underline" to="/signup">
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
