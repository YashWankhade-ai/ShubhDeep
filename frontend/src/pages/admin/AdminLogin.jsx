import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Lock, Mail, Loader2, ArrowLeft } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { DiyaMark } from "../../components/Ornaments";
import { toast } from "sonner";

const AdminLogin = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error("Please enter your admin email and password");
      return;
    }

    setLoading(true);
    try {
      await login(email.trim(), password);
      toast.success("Welcome to ShubhDeep Admin");
      navigate("/admin");
    } catch (err) {
      toast.error(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#42121B] px-4 text-[#FFF8EC] mandala-bg">
      <div className="w-full max-w-md rounded-lg border border-[#C5A15B]/40 bg-[#641B25] p-8 shadow-2xl">
        <div className="text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-[#C5A15B] bg-[#42121B]">
            <DiyaMark className="h-8 w-8" light={true} />
          </span>
          <h1 className="font-serif-display mt-4 text-3xl font-bold tracking-wider text-[#FFF8EC]">
            Shubh Deep
          </h1>
          <p className="eyebrow mt-1 text-[#C5A15B]">
            Administrative Portal
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#C5A15B] mb-1">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#C5A15B]/70" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@shubhdeep.in"
                className="w-full rounded border border-[#C5A15B]/40 bg-[#42121B] pl-10 pr-4 py-2.5 text-sm text-[#FFF8EC] focus:border-[#C5A15B] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#C5A15B] mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#C5A15B]/70" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded border border-[#C5A15B]/40 bg-[#42121B] pl-10 pr-4 py-2.5 text-sm text-[#FFF8EC] focus:border-[#C5A15B] focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded bg-[#C5A15B] py-3 text-xs font-bold tracking-widest uppercase text-[#42121B] hover:bg-[#D99A35] transition disabled:opacity-50 shadow-md"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign In to Admin"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-[#FFF8EC]/60 hover:text-[#C5A15B] transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Public Storefront</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
