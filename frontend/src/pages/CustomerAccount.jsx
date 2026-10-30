import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  User, 
  ShoppingBag, 
  Package, 
  MapPin, 
  Phone, 
  Mail, 
  LogOut, 
  Clock, 
  CheckCircle2, 
  Truck, 
  PackageCheck, 
  XCircle, 
  ExternalLink,
  MessageCircle,
  Edit2,
  Save,
  Sparkles
} from "lucide-react";
import { useCustomerAuth } from "../context/CustomerAuthContext";
import { api } from "../services/api";
import { formatINR, SITE } from "../config/site";
import { DiyaMark, GoldDivider } from "../components/Ornaments";
import { toast } from "sonner";

const STATUS_BADGES = {
  pending: { bg: "bg-amber-100", text: "text-amber-800", border: "border-amber-300", icon: Clock },
  confirmed: { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-300", icon: CheckCircle2 },
  processing: { bg: "bg-indigo-100", text: "text-indigo-800", border: "border-indigo-300", icon: ShoppingBag },
  shipped: { bg: "bg-purple-100", text: "text-purple-800", border: "border-purple-300", icon: Truck },
  delivered: { bg: "bg-emerald-100", text: "text-emerald-800", border: "border-emerald-300", icon: PackageCheck },
  cancelled: { bg: "bg-rose-100", text: "text-rose-800", border: "border-rose-300", icon: XCircle },
};

export const CustomerAccount = () => {
  const navigate = useNavigate();
  const { customer, isCustomerAuthenticated, customerLoading, customerLogout, updateProfile } = useCustomerAuth();

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Edit profile state
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressInput, setAddressInput] = useState("");
  const [savingAddress, setSavingAddress] = useState(false);

  useEffect(() => {
    if (!customerLoading && !isCustomerAuthenticated) {
      navigate("/login", { replace: true, state: { from: { pathname: "/account" } } });
    }
  }, [customerLoading, isCustomerAuthenticated, navigate]);

  useEffect(() => {
    if (customer) {
      setAddressInput(customer.delivery_address || "");
      fetchOrders();
    }
  }, [customer]);

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      const res = await api.getCustomerOrders();
      setOrders(res || []);
    } catch (err) {
      console.warn("Could not fetch customer orders:", err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    try {
      setSavingAddress(true);
      await updateProfile({ delivery_address: addressInput });
      setIsEditingAddress(false);
      toast.success("Delivery address updated successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to update address");
    } finally {
      setSavingAddress(false);
    }
  };

  const handleLogout = () => {
    customerLogout();
    toast.success("Logged out successfully. ShubhDeep welcomes you back anytime 🙏");
    navigate("/");
  };

  if (customerLoading || !customer) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#FFF8EC]">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#641B25] border-t-transparent mx-auto mb-3" />
          <p className="text-xs uppercase tracking-widest text-[#8A5A44] font-semibold">
            Loading Patron Account...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] bg-[#FFF8EC] py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header Profile Banner */}
        <div className="rounded-2xl border border-[#C5A15B]/40 bg-[#641B25] text-[#FFF8EC] p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="grid h-16 w-16 place-items-center rounded-full border border-[#C5A15B] bg-[#42121B]/80 text-[#C5A15B] shadow-inner">
                <DiyaMark className="h-8 w-8" light={true} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="eyebrow text-[#C5A15B]">Valued Patron</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#D99A35]/20 px-2 py-0.5 text-[0.65rem] font-bold text-[#D99A35] border border-[#D99A35]/40">
                    <Sparkles className="h-3 w-3" />
                    <span>Diwali Club</span>
                  </span>
                </div>
                <h1 className="font-serif-display text-2xl sm:text-3xl font-bold text-[#FFF8EC] mt-0.5">
                  Namaste, {customer.name} 🙏
                </h1>
                <p className="text-xs text-[#FFF8EC]/70 mt-1">
                  Member since {new Date(customer.created_at).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 self-start sm:self-center px-4 py-2 rounded-xl border border-[#C5A15B]/50 bg-[#42121B] text-xs font-semibold text-[#FFF8EC] hover:bg-[#42121B]/80 hover:border-[#C5A15B] transition shadow-sm"
            >
              <LogOut className="h-4 w-4 text-[#C5A15B]" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Two-Column Layout */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Account Details & Saved Address (1 col) */}
          <div className="space-y-6">
            {/* Patron Profile Card */}
            <div className="rounded-2xl border border-[#C5A15B]/30 bg-white p-6 shadow-sm">
              <h3 className="font-serif-display text-lg font-bold text-[#42121B] mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-[#C5A15B]" />
                <span>Patron Profile</span>
              </h3>

              <div className="space-y-3.5 text-xs">
                <div>
                  <span className="text-[#8A5A44] font-medium block">Full Name</span>
                  <p className="font-semibold text-[#42121B] text-sm mt-0.5">{customer.name}</p>
                </div>

                <div>
                  <span className="text-[#8A5A44] font-medium block">Email Address</span>
                  <p className="font-semibold text-[#42121B] mt-0.5 flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-[#C5A15B]" />
                    <span>{customer.email}</span>
                  </p>
                </div>

                <div>
                  <span className="text-[#8A5A44] font-medium block">WhatsApp / Mobile</span>
                  <p className="font-semibold text-[#42121B] mt-0.5 flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-[#C5A15B]" />
                    <span>+91 {customer.phone}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Default Shipping Address Card */}
            <div className="rounded-2xl border border-[#C5A15B]/30 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif-display text-lg font-bold text-[#42121B] flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-[#C5A15B]" />
                  <span>Delivery Address</span>
                </h3>

                {!isEditingAddress && (
                  <button
                    type="button"
                    onClick={() => setIsEditingAddress(true)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#641B25] hover:underline"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                    <span>Edit</span>
                  </button>
                )}
              </div>

              {isEditingAddress ? (
                <form onSubmit={handleSaveAddress} className="space-y-3">
                  <textarea
                    rows={3}
                    required
                    value={addressInput}
                    onChange={(e) => setAddressInput(e.target.value)}
                    placeholder="Enter complete delivery address with pincode"
                    className="w-full rounded-lg border border-[#C5A15B]/40 p-2.5 text-xs text-[#42121B] focus:border-[#641B25] focus:outline-none"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="submit"
                      disabled={savingAddress}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#641B25] px-3.5 py-1.5 text-xs font-bold text-[#FFF8EC] hover:bg-[#42121B] transition disabled:opacity-50"
                    >
                      <Save className="h-3.5 w-3.5" />
                      <span>{savingAddress ? "Saving..." : "Save Address"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditingAddress(false);
                        setAddressInput(customer.delivery_address || "");
                      }}
                      className="rounded-lg border border-[#C5A15B]/30 px-3 py-1.5 text-xs font-medium text-[#8A5A44] hover:bg-[#FFF8EC]"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="rounded-xl bg-[#FFF8EC] p-3.5 border border-[#C5A15B]/20 text-xs">
                  {customer.delivery_address ? (
                    <p className="text-[#42121B] leading-relaxed font-medium">
                      {customer.delivery_address}
                    </p>
                  ) : (
                    <div className="text-center py-2 text-[#8A5A44]">
                      <p>No default address saved yet.</p>
                      <button
                        type="button"
                        onClick={() => setIsEditingAddress(true)}
                        className="mt-2 text-xs font-bold text-[#641B25] hover:underline"
                      >
                        + Add Delivery Address
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Store Support Card */}
            <div className="rounded-2xl border border-emerald-300 bg-emerald-50/50 p-5 text-xs shadow-sm">
              <h4 className="font-serif-display text-sm font-bold text-emerald-950 flex items-center gap-2 mb-2">
                <MessageCircle className="h-4 w-4 text-emerald-700" />
                <span>Boutique Patron Helpline</span>
              </h4>
              <p className="text-emerald-800 text-[0.75rem] leading-relaxed">
                Have questions regarding custom festive diya hampers or bulk corporate gifting? Reach our master artisans directly:
              </p>
              <div className="mt-3 flex items-center justify-between">
                <span className="font-bold text-emerald-900">{SITE.phoneDisplay}</span>
                <a
                  href={`https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(`Namaste ShubhDeep! I am ${customer.name} and I need help with an order.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#25D366] px-3 py-1.5 text-[0.7rem] font-bold text-white shadow-sm hover:bg-[#20ba5a] transition"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Order History (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-[#C5A15B]/30 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6 border-b border-[#C5A15B]/20 pb-4">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-[#C5A15B]" />
                  <h3 className="font-serif-display text-xl font-bold text-[#42121B]">
                    My Orders & Dispatches
                  </h3>
                </div>
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#641B25] hover:text-[#42121B] transition"
                >
                  <span>Explore Diya Collections</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </div>

              {loadingOrders ? (
                <div className="py-12 text-center text-xs text-[#8A5A44]">
                  <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-[#641B25] border-t-transparent mb-2" />
                  <p>Loading your festive orders...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="mx-auto h-12 w-12 rounded-full bg-[#FFF8EC] border border-[#C5A15B]/40 grid place-items-center mb-3">
                    <ShoppingBag className="h-6 w-6 text-[#C5A15B]" />
                  </div>
                  <h4 className="font-serif-display text-base font-bold text-[#42121B]">
                    No Orders Placed Yet
                  </h4>
                  <p className="text-xs text-[#8A5A44] mt-1 max-w-sm mx-auto">
                    Bring the sacred glow of handcrafted clay and brass diyas into your home this festive season.
                  </p>
                  <Link
                    to="/shop"
                    className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-xl bg-[#641B25] text-xs font-bold text-[#FFF8EC] hover:bg-[#42121B] transition shadow"
                  >
                    <span>Browse Festive Collections</span>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((ord) => {
                    const badge = STATUS_BADGES[ord.order_status] || STATUS_BADGES.pending;
                    const BadgeIcon = badge.icon;
                    const dateFormatted = new Date(ord.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric"
                    });

                    return (
                      <div
                        key={ord.id}
                        className="rounded-xl border border-[#C5A15B]/30 bg-[#FFF8EC]/40 p-5 hover:border-[#641B25]/50 transition"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#C5A15B]/20 pb-3">
                          <div>
                            <span className="text-[0.7rem] text-[#8A5A44] uppercase tracking-wider block">
                              Order Reference
                            </span>
                            <span className="font-mono text-sm font-bold text-[#42121B]">
                              {ord.order_number}
                            </span>
                            <span className="text-xs text-[#8A5A44] ml-2">
                              • Placed on {dateFormatted}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.7rem] font-bold uppercase tracking-wider border ${badge.bg} ${badge.text} ${badge.border}`}>
                              <BadgeIcon className="h-3.5 w-3.5" />
                              <span>{ord.order_status}</span>
                            </span>
                          </div>
                        </div>

                        {/* Order Items Preview */}
                        <div className="py-3 space-y-1.5 text-xs">
                          {ord.items?.map((item) => (
                            <div key={item.id} className="flex justify-between text-[#42121B]">
                              <span>
                                • {item.product_name_snapshot} <span className="text-[#8A5A44]">× {item.quantity}</span>
                              </span>
                              <span className="font-semibold">
                                {formatINR(item.line_total)}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Bottom Row: Total & Action Links */}
                        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#C5A15B]/20 pt-3 text-xs">
                          <div>
                            <span className="text-[#8A5A44]">Grand Total: </span>
                            <span className="font-bold text-sm text-[#641B25]">
                              {formatINR(ord.total_amount)}
                            </span>
                            <span className="text-[0.7rem] text-[#8A5A44] ml-2 capitalize">
                              ({ord.payment_status})
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Link
                              to={`/track-order?order=${encodeURIComponent(ord.order_number)}`}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#C5A15B]/40 bg-white font-semibold text-[#42121B] hover:bg-[#FFF8EC] transition shadow-sm"
                            >
                              <Truck className="h-3.5 w-3.5 text-[#C5A15B]" />
                              <span>Live Tracking</span>
                            </Link>

                            <a
                              href={`https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(`Namaste ShubhDeep! Could I get an update regarding my order ${ord.order_number}?`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25D366] font-bold text-white hover:bg-[#20ba5a] transition shadow-sm"
                            >
                              <MessageCircle className="h-3.5 w-3.5" />
                              <span>WhatsApp</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerAccount;
