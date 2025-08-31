// src/pages/SignUp.jsx
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";

const SignUp = () => {
  const [form, setForm] = useState({
    fullName: "",
    userName: "",
    email: "",
    phoneNumber: "",
    password: "",
  });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { signup, checkAuth } = useAuthStore();

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Backend expects: { userName, fullName, email, password, phoneNumber }
      await signup(form);
      // Refresh auth state in case backend sets a session/cookie on signup
      await checkAuth();
      navigate("/account", { replace: true });
    } catch {
      // signup already toasts errors in the store
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative bg-white">
      {/* Faint background illustration */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "url('/mnt/data/ca044a48-0d35-416b-89e0-3373fa30dc45.png')",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      />

      <div className="relative z-10 w-full max-w-xl px-6">
        <h1 className="text-center text-2xl md:text-3xl font-semibold mb-8">
          Signup
        </h1>

        <form
          onSubmit={onSubmit}
          className="bg-white/70 backdrop-blur-sm rounded-2xl p-6"
        >
          {/* Full Name */}
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <input
            name="fullName"
            value={form.fullName}
            onChange={onChange}
            placeholder="John Doe"
            className="w-full mb-4 rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 px-4 py-3"
            type="text"
            autoComplete="name"
            required
          />

          {/* Username */}
          <label className="block text-sm font-medium mb-1">Username</label>
          <input
            name="userName"
            value={form.userName}
            onChange={onChange}
            placeholder="john_doe"
            className="w-full mb-4 rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 px-4 py-3"
            type="text"
            autoComplete="username"
            required
          />

          {/* Email */}
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            name="email"
            value={form.email}
            onChange={onChange}
            placeholder="example@email.com"
            className="w-full mb-4 rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 px-4 py-3"
            type="email"
            autoComplete="email"
            required
          />

          {/* Phone number */}
          <label className="block text-sm font-medium mb-1">Phone number</label>
          <input
            name="phoneNumber"
            value={form.phoneNumber}
            onChange={onChange}
            placeholder="+91 9876543210"
            className="w-full mb-4 rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 px-4 py-3"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
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
              autoComplete="new-password"
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

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="mt-8 w-full rounded-xl border border-red-500 text-red-600 hover:bg-red-50 active:scale-[0.99] transition px-4 py-3 font-medium disabled:opacity-60"
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>

          {/* Optional: link to login */}
          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <Link className="text-red-600 underline" to="/login">
              Log in
            </Link>
          </p>
        </form>

        {/* Bottom-right character sticker (optional) */}
        <img
          src="/mnt/data/ca044a48-0d35-416b-89e0-3373fa30dc45.png"
          alt=""
          aria-hidden
          className="select-none pointer-events-none absolute -right-2 -bottom-6 w-20 opacity-80 object-contain"
          style={{ clipPath: "inset(70% 70% 0 70%)" }} // shows a small corner character-ish cut
        />
      </div>
    </div>
  );
};

export default SignUp;
