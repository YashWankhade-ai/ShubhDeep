import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  User, 
  Mail, 
  Lock, 
  Phone, 
  MapPin, 
  Eye, 
  EyeOff, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Package, 
  ShieldCheck,
  AlertCircle
} from "lucide-react";
import { useCustomerAuth } from "../context/CustomerAuthContext";
import { DiyaMark, GoldDivider } from "../components/Ornaments";
import { toast } from "sonner";

export const UserLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { customerLogin, customerRegister, isCustomerAuthenticated, customer } = useCustomerAuth();

  // Tab: "login" or "register"
  const [activeTab, setActiveTab] = useState(
    location.state?.tab === "register" ? "register" : "login"
  );

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Register form state
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regAddress, setRegAddress] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState("");

  // Target destination after successful auth
  const redirectPath = location.state?.from?.pathname || "/account";

  // If already authenticated, redirect
  if (isCustomerAuthenticated && customer) {
    navigate(redirectPath, { replace: true });
    return null;
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");

    if (!loginIdentifier.trim()) {
      setLoginError("Please enter your email or mobile number.");
      return;
    }
    if (!loginPassword) {
      setLoginError("Please enter your password.");
      return;
    }

    try {
      setLoginLoading(true);
      await customerLogin(loginIdentifier.trim(), loginPassword);
      toast.success("Welcome back to ShubhDeep! 🙏");
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setLoginError(err.message || "Failed to sign in. Please verify your credentials.");
      toast.error(err.message || "Sign in failed");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegError("");

    if (!regName.trim()) {
      setRegError("Please enter your full name.");
      return;
    }
    if (!regEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regEmail.trim())) {
      setRegError("Please enter a valid email address.");
      return;
    }
    const cleanPhone = regPhone.replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      setRegError("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (regPassword.length < 6) {
      setRegError("Password must be at least 6 characters long.");
      return;
    }
    if (!regAddress.trim()) {
      setRegError("Please provide your delivery address so you never have to enter info again when ordering.");
      return;
    }

    try {
      setRegLoading(true);
      await customerRegister({
        name: regName.trim(),
        email: regEmail.trim(),
        phone: cleanPhone.slice(-10),
        password: regPassword,
        delivery_address: regAddress.trim(),
      });
      toast.success("Account created successfully! Welcome to ShubhDeep ✨");
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setRegError(err.message || "Failed to create account. Please try again.");
      toast.error(err.message || "Registration failed");
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-[#FFF8EC] py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      {/* Container */}
      <div className="mx-auto w-full max-w-xl">
        {/* Decorative Top Branding Card */}
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-[#C5A15B] bg-[#641B25] shadow-lg mb-3">
            <DiyaMark className="h-8 w-8" light={true} />
          </div>
          <span className="eyebrow block text-[#641B25]">ShubhDeep Boutique</span>
          <h1 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#42121B] mt-1">
            {activeTab === "login" ? "Namaste & Welcome Back" : "Join the ShubhDeep Family"}
          </h1>
          <p className="mt-2 text-xs text-[#8A5A44] max-w-md mx-auto">
            {activeTab === "login"
              ? "Access your saved addresses, view live orders, and experience festive artisanal collections."
              : "Create your patron account for expedited Diwali checkout and personal order management."}
          </p>
          <GoldDivider className="mt-4 max-w-xs mx-auto" />
        </div>

        {/* Main Form Box */}
        <div className="rounded-2xl border border-[#C5A15B]/40 bg-white p-6 sm:p-8 shadow-xl">
          {/* Tab Selector */}
          <div className="flex border-b border-[#C5A15B]/30 mb-6">
            <button
              type="button"
              onClick={() => {
                setActiveTab("login");
                setLoginError("");
              }}
              className={`flex-1 py-3 text-center text-xs font-bold uppercase tracking-wider transition border-b-2 ${
                activeTab === "login"
                  ? "border-[#641B25] text-[#641B25]"
                  : "border-transparent text-[#8A5A44] hover:text-[#42121B]"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("register");
                setRegError("");
              }}
              className={`flex-1 py-3 text-center text-xs font-bold uppercase tracking-wider transition border-b-2 ${
                activeTab === "register"
                  ? "border-[#641B25] text-[#641B25]"
                  : "border-transparent text-[#8A5A44] hover:text-[#42121B]"
              }`}
            >
              Create Account
            </button>
          </div>

          {/* ================= SIGN IN FORM ================= */}
          {activeTab === "login" && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {loginError && (
                <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                  <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                  <span>{loginError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#42121B] mb-1">
                  Email Address or 10-Digit Mobile *
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#8A5A44]">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="e.g. aditi@example.com or 9811122233"
                    className="w-full rounded-lg border border-[#C5A15B]/40 bg-white py-2.5 pl-10 pr-3 text-xs text-[#42121B] focus:border-[#641B25] focus:outline-none focus:ring-1 focus:ring-[#641B25]"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#42121B]">
                    Password *
                  </label>
                </div>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#8A5A44]">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showLoginPassword ? "text" : "password"}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-lg border border-[#C5A15B]/40 bg-white py-2.5 pl-10 pr-10 text-xs text-[#42121B] focus:border-[#641B25] focus:outline-none focus:ring-1 focus:ring-[#641B25]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#8A5A44] hover:text-[#42121B]"
                  >
                    {showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-[#8A5A44]">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-[#C5A15B] text-[#641B25] focus:ring-[#641B25]"
                  />
                  <span>Remember me</span>
                </label>

                <Link
                  to="/track-order"
                  className="text-xs text-[#C5A15B] hover:text-[#641B25] font-medium transition"
                >
                  Track Order without Login →
                </Link>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full mt-4 flex items-center justify-center gap-2 rounded-xl bg-[#641B25] py-3 text-xs font-bold uppercase tracking-wider text-[#FFF8EC] hover:bg-[#42121B] transition shadow-md disabled:opacity-50"
              >
                {loginLoading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#FFF8EC] border-t-transparent" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Account</span>
                    <ArrowRight className="h-4 w-4 text-[#C5A15B]" />
                  </>
                )}
              </button>

              <div className="text-center pt-3">
                <p className="text-xs text-[#8A5A44]">
                  Don't have an account yet?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("register");
                      setRegError("");
                    }}
                    className="font-bold text-[#641B25] hover:underline"
                  >
                    Create Account here
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* ================= REGISTER FORM ================= */}
          {activeTab === "register" && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {regError && (
                <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                  <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                  <span>{regError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#42121B] mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#8A5A44]">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Aditi Sharma"
                    className="w-full rounded-lg border border-[#C5A15B]/40 bg-white py-2.5 pl-10 pr-3 text-xs text-[#42121B] focus:border-[#641B25] focus:outline-none focus:ring-1 focus:ring-[#641B25]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#42121B] mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#8A5A44]">
                      <Mail className="h-4 w-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="aditi@example.com"
                      className="w-full rounded-lg border border-[#C5A15B]/40 bg-white py-2.5 pl-10 pr-3 text-xs text-[#42121B] focus:border-[#641B25] focus:outline-none focus:ring-1 focus:ring-[#641B25]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#42121B] mb-1">
                    WhatsApp / Mobile *
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#8A5A44]">
                      <Phone className="h-4 w-4" />
                    </div>
                    <input
                      type="tel"
                      required
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="9811122233"
                      className="w-full rounded-lg border border-[#C5A15B]/40 bg-white py-2.5 pl-10 pr-3 text-xs text-[#42121B] focus:border-[#641B25] focus:outline-none focus:ring-1 focus:ring-[#641B25]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#42121B] mb-1 flex items-center justify-between">
                  <span>Complete Delivery Address & Pincode *</span>
                  <span className="text-[0.65rem] text-emerald-700 font-bold">1-Click ordering forever</span>
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute top-3 left-3 text-[#8A5A44]">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <textarea
                    rows={2}
                    required
                    value={regAddress}
                    onChange={(e) => setRegAddress(e.target.value)}
                    placeholder="House / Flat No., Society / Street, City, State, Pincode"
                    className="w-full rounded-lg border border-[#C5A15B]/40 bg-white py-2.5 pl-10 pr-3 text-xs text-[#42121B] focus:border-[#641B25] focus:outline-none focus:ring-1 focus:ring-[#641B25]"
                  />
                </div>
                <p className="mt-1 text-[0.68rem] text-[#8A5A44]">
                  ✨ Saved securely to your patron profile. You will never need to enter your details again while ordering.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#42121B] mb-1">
                  Create Password (min. 6 characters) *
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#8A5A44]">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showRegPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Create a secure password"
                    className="w-full rounded-lg border border-[#C5A15B]/40 bg-white py-2.5 pl-10 pr-10 text-xs text-[#42121B] focus:border-[#641B25] focus:outline-none focus:ring-1 focus:ring-[#641B25]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#8A5A44] hover:text-[#42121B]"
                  >
                    {showRegPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={regLoading}
                className="w-full mt-4 flex items-center justify-center gap-2 rounded-xl bg-[#641B25] py-3 text-xs font-bold uppercase tracking-wider text-[#FFF8EC] hover:bg-[#42121B] transition shadow-md disabled:opacity-50"
              >
                {regLoading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#FFF8EC] border-t-transparent" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Patron Account</span>
                    <Sparkles className="h-4 w-4 text-[#C5A15B]" />
                  </>
                )}
              </button>

              <div className="text-center pt-3">
                <p className="text-xs text-[#8A5A44]">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("login");
                      setLoginError("");
                    }}
                    className="font-bold text-[#641B25] hover:underline"
                  >
                    Sign In here
                  </button>
                </p>
              </div>
            </form>
          )}
        </div>

        {/* Benefits Pill Cards */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-xl border border-[#C5A15B]/30 bg-white/70 p-3.5 text-center backdrop-blur-sm">
            <CheckCircle2 className="mx-auto h-5 w-5 text-[#C5A15B] mb-1.5" />
            <h4 className="text-xs font-bold text-[#42121B]">1-Click Checkout</h4>
            <p className="text-[0.68rem] text-[#8A5A44] mt-0.5">Saved address pre-fills your festive thali cart</p>
          </div>

          <div className="rounded-xl border border-[#C5A15B]/30 bg-white/70 p-3.5 text-center backdrop-blur-sm">
            <Package className="mx-auto h-5 w-5 text-[#C5A15B] mb-1.5" />
            <h4 className="text-xs font-bold text-[#42121B]">Order History</h4>
            <p className="text-[0.68rem] text-[#8A5A44] mt-0.5">Track all current and past Diwali orders in one view</p>
          </div>

          <div className="rounded-xl border border-[#C5A15B]/30 bg-white/70 p-3.5 text-center backdrop-blur-sm">
            <ShieldCheck className="mx-auto h-5 w-5 text-[#C5A15B] mb-1.5" />
            <h4 className="text-xs font-bold text-[#42121B]">WhatsApp Updates</h4>
            <p className="text-[0.68rem] text-[#8A5A44] mt-0.5">Receive courier & packing alerts on WhatsApp</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
