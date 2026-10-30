import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { 
  PackageCheck, 
  Search, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Truck, 
  ShoppingBag,
  ArrowRight,
  Phone,
  MessageCircle,
  HelpCircle,
  Sparkles
} from "lucide-react";
import { api } from "../services/api";
import { formatINR, buildWhatsAppUrl } from "../config/site";

const STATUS_STEPS = [
  { key: "pending", label: "Received", icon: Clock, desc: "Order recorded & verified" },
  { key: "confirmed", label: "Confirmed", icon: CheckCircle2, desc: "Order accepted by artisan" },
  { key: "processing", label: "Crafting & Packing", icon: ShoppingBag, desc: "Handcrafted with festive care" },
  { key: "shipped", label: "In Transit", icon: Truck, desc: "Handed over to courier partner" },
  { key: "delivered", label: "Delivered", icon: PackageCheck, desc: "Safely reached destination" },
];

const STATUS_RANK = {
  pending: 0,
  confirmed: 1,
  processing: 2,
  shipped: 3,
  delivered: 4,
  cancelled: -1,
};

export const TrackOrder = () => {
  const [searchParams] = useSearchParams();
  const [trackMode, setTrackMode] = useState("order"); // "order" | "phone"
  
  const [orderNumber, setOrderNumber] = useState(searchParams.get("order") || "");
  const [phoneInput, setPhoneInput] = useState(searchParams.get("phone") || "");
  const [phoneForSearch, setPhoneForSearch] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const [phoneOrdersList, setPhoneOrdersList] = useState([]);
  const [error, setError] = useState(null);

  // Auto-search if query param present
  useEffect(() => {
    const qOrder = searchParams.get("order");
    if (qOrder) {
      setOrderNumber(qOrder);
      executeOrderLookup(qOrder, searchParams.get("phone") || "");
    }
  }, [searchParams]);

  const executeOrderLookup = async (orderRef, phoneVal = "") => {
    if (!orderRef.trim()) {
      setError("Please enter your Order Reference Number (e.g. SD-20261025-XXXX).");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setOrder(null);
      setPhoneOrdersList([]);
      const res = await api.trackOrder(orderRef.trim(), phoneVal.trim());
      setOrder(res);
    } catch (err) {
      setError(err.message || "No order found matching this reference. Please check your confirmation message.");
    } finally {
      setLoading(false);
    }
  };

  const handleTrackByOrder = (e) => {
    e.preventDefault();
    executeOrderLookup(orderNumber, phoneInput);
  };

  const handleTrackByPhone = async (e) => {
    e.preventDefault();
    const cleanPhone = phoneForSearch.replace(/\D/g, "");
    if (cleanPhone.length < 6) {
      setError("Please enter at least 6 digits of your phone number.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setOrder(null);
      setPhoneOrdersList([]);
      const results = await api.getOrdersByPhone(cleanPhone);
      if (results.length === 0) {
        setError(`No orders found associated with phone number ending in ${cleanPhone.slice(-4)}.`);
      } else if (results.length === 1) {
        setOrder(results[0]);
      } else {
        setPhoneOrdersList(results);
      }
    } catch (err) {
      setError(err.message || "Failed to search orders by phone number.");
    } finally {
      setLoading(false);
    }
  };

  const handleSampleOrderClick = (sampleNum, samplePhone = "") => {
    setTrackMode("order");
    setOrderNumber(sampleNum);
    setPhoneInput(samplePhone);
    executeOrderLookup(sampleNum, samplePhone);
  };

  const currentRank = order ? (STATUS_RANK[order.order_status] ?? 0) : 0;
  const isCancelled = order?.order_status === "cancelled";

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-[#FFF8EC]">
      <div className="mx-auto max-w-2xl">
        {/* Page Heading */}
        <div className="text-center mb-8">
          <span className="eyebrow text-[#8A5A44]">Fulfillment Status</span>
          <h1 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#42121B] mt-1">
            Track Your Diya Order
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[#8A5A44]">
            Follow your handcrafted festive order step-by-step from our artisan workshop to your home.
          </p>

          {/* Quick Demo Order Pills */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-[#8A5A44] font-medium">Quick Test:</span>
            <button
              type="button"
              onClick={() => handleSampleOrderClick("SD-20261025-DIYA1", "9876543210")}
              className="px-3 py-1 rounded-full bg-white border border-[#C5A15B]/50 text-[#641B25] hover:bg-[#641B25] hover:text-[#FFF8EC] font-mono text-[0.7rem] transition shadow-sm"
            >
              SD-20261025-DIYA1 (Shipped)
            </button>
            <button
              type="button"
              onClick={() => handleSampleOrderClick("SD-20261025-DIYA2", "9123456789")}
              className="px-3 py-1 rounded-full bg-white border border-[#C5A15B]/50 text-[#641B25] hover:bg-[#641B25] hover:text-[#FFF8EC] font-mono text-[0.7rem] transition shadow-sm"
            >
              SD-20261025-DIYA2 (Crafting)
            </button>
          </div>
        </div>

        {/* Tracking Tabs (By Order # vs By Phone) */}
        <div className="rounded-2xl border border-[#C5A15B]/40 bg-white p-6 sm:p-8 shadow-md">
          <div className="flex border-b border-[#C5A15B]/20 mb-6">
            <button
              onClick={() => { setTrackMode("order"); setError(null); }}
              className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider transition border-b-2 text-center ${
                trackMode === "order"
                  ? "border-[#641B25] text-[#641B25]"
                  : "border-transparent text-[#8A5A44] hover:text-[#42121B]"
              }`}
            >
              By Order Reference
            </button>
            <button
              onClick={() => { setTrackMode("phone"); setError(null); }}
              className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider transition border-b-2 text-center ${
                trackMode === "phone"
                  ? "border-[#641B25] text-[#641B25]"
                  : "border-transparent text-[#8A5A44] hover:text-[#42121B]"
              }`}
            >
              By Mobile Number
            </button>
          </div>

          {trackMode === "order" ? (
            <form onSubmit={handleTrackByOrder} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#42121B] mb-1">
                  Order Reference Number *
                </label>
                <input
                  type="text"
                  required
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
                  placeholder="e.g. SD-20261025-DIYA1"
                  className="w-full font-mono uppercase tracking-wider rounded-lg border border-[#C5A15B]/50 px-4 py-2.5 text-sm text-[#42121B] focus:border-[#641B25] focus:outline-none focus:ring-1 focus:ring-[#641B25]"
                />
                <span className="text-[0.7rem] text-[#8A5A44] mt-1 block">
                  Found on your order confirmation screen or WhatsApp message.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#42121B] mb-1">
                  Phone Number <span className="text-[#8A5A44] font-normal normal-case">(Optional - for extra verification)</span>
                </label>
                <input
                  type="text"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  placeholder="e.g. 9876543210 or last 4 digits"
                  className="w-full font-mono tracking-wider rounded-lg border border-[#C5A15B]/50 px-4 py-2.5 text-sm text-[#42121B] focus:border-[#641B25] focus:outline-none focus:ring-1 focus:ring-[#641B25]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#641B25] px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[#FFF8EC] hover:bg-[#42121B] transition shadow-sm disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#FFF8EC] border-t-transparent" />
                    <span>Locating Order Details...</span>
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4" />
                    <span>Check Order Status</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleTrackByPhone} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#42121B] mb-1">
                  Registered Mobile / WhatsApp Number *
                </label>
                <input
                  type="tel"
                  required
                  value={phoneForSearch}
                  onChange={(e) => setPhoneForSearch(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full font-mono tracking-wider rounded-lg border border-[#C5A15B]/50 px-4 py-2.5 text-sm text-[#42121B] focus:border-[#641B25] focus:outline-none focus:ring-1 focus:ring-[#641B25]"
                />
                <span className="text-[0.7rem] text-[#8A5A44] mt-1 block">
                  Enter the phone number provided during checkout.
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#641B25] px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[#FFF8EC] hover:bg-[#42121B] transition shadow-sm disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#FFF8EC] border-t-transparent" />
                    <span>Searching Orders by Phone...</span>
                  </>
                ) : (
                  <>
                    <Phone className="h-4 w-4" />
                    <span>Find My Orders</span>
                  </>
                )}
              </button>
            </form>
          )}

          {error && (
            <div className="mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-800">
              <AlertCircle className="h-5 w-5 shrink-0 text-red-600 mt-0.5" />
              <div>
                <span className="font-semibold block">Order Lookup Notice</span>
                <p className="mt-0.5">{error}</p>
                <div className="mt-2 text-[0.7rem] text-red-700">
                  Tip: If you haven't placed an order yet, you can test with sample order{" "}
                  <button
                    type="button"
                    onClick={() => handleSampleOrderClick("SD-20261025-DIYA1")}
                    className="font-bold underline"
                  >
                    SD-20261025-DIYA1
                  </button>.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Multiple Orders Found by Phone Picker */}
        {phoneOrdersList.length > 1 && (
          <div className="mt-8 rounded-2xl border border-[#C5A15B]/50 bg-white p-6 shadow-md">
            <h3 className="font-serif-display text-lg font-bold text-[#42121B] mb-2">
              Orders Found for Your Number ({phoneOrdersList.length})
            </h3>
            <p className="text-xs text-[#8A5A44] mb-4">
              Select an order to view its real-time shipping status:
            </p>

            <div className="space-y-3">
              {phoneOrdersList.map((po) => (
                <button
                  key={po.id}
                  onClick={() => setOrder(po)}
                  className="w-full p-4 rounded-xl border border-[#C5A15B]/30 hover:border-[#641B25] hover:bg-[#FFF8EC]/40 text-left transition flex items-center justify-between"
                >
                  <div>
                    <span className="font-mono font-bold text-sm text-[#641B25] block">
                      {po.order_number}
                    </span>
                    <span className="text-xs text-[#8A5A44]">
                      {new Date(po.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                      })} &bull; {po.items?.length || 0} items
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="font-semibold text-sm text-[#42121B] block">
                      {formatINR(po.total_amount)}
                    </span>
                    <span className="inline-block px-2 py-0.5 rounded-full text-[0.65rem] font-bold uppercase tracking-wider bg-[#FFF8EC] text-[#641B25] border border-[#C5A15B]/40">
                      {po.order_status}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Order Details Result */}
        {order && (
          <div className="mt-8 rounded-2xl border border-[#C5A15B]/50 bg-white p-6 sm:p-8 shadow-lg space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#C5A15B]/20 pb-4">
              <div>
                <span className="text-[0.7rem] uppercase tracking-wider font-semibold text-[#8A5A44]">
                  Order Reference
                </span>
                <h3 className="font-mono text-xl sm:text-2xl font-bold text-[#641B25]">
                  {order.order_number}
                </h3>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[0.7rem] uppercase tracking-wider text-[#8A5A44]">
                  Order Date
                </span>
                <p className="text-xs font-semibold text-[#42121B]">
                  {new Date(order.created_at).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                  })}
                </p>
              </div>
            </div>

            {/* Stepper / Timeline */}
            {isCancelled ? (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-center">
                <p className="font-serif-display text-base font-bold text-rose-900">
                  This order was cancelled.
                </p>
                <p className="text-xs text-rose-700 mt-1">
                  Please reach out to customer care on WhatsApp if you have questions or wish to place a new order.
                </p>
              </div>
            ) : (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#42121B] mb-4">
                  Delivery Progress
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {STATUS_STEPS.map((step, idx) => {
                    const Icon = step.icon;
                    const isDone = currentRank >= idx;
                    const isCurrent = currentRank === idx;

                    return (
                      <div
                        key={step.key}
                        className={`flex flex-col items-center text-center p-3 rounded-xl border transition ${
                          isCurrent
                            ? "border-[#641B25] bg-[#FFF8EC] text-[#641B25] shadow-sm font-semibold"
                            : isDone
                            ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                            : "border-gray-200 bg-gray-50 text-gray-400 opacity-60"
                        }`}
                      >
                        <div
                          className={`grid h-8 w-8 place-items-center rounded-full mb-1.5 ${
                            isCurrent
                              ? "bg-[#641B25] text-[#FFF8EC]"
                              : isDone
                              ? "bg-emerald-600 text-white"
                              : "bg-gray-200 text-gray-500"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="text-[0.68rem] tracking-wider uppercase font-semibold">
                          {step.label}
                        </span>
                        <span className="text-[0.6rem] text-[#8A5A44] mt-0.5 hidden sm:block">
                          {step.desc}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Items Summary */}
            <div className="border-t border-[#C5A15B]/20 pt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#42121B] mb-3">
                Items in This Order ({order.items?.length || 0})
              </h4>
              <div className="divide-y divide-[#C5A15B]/15">
                {order.items?.map((item) => (
                  <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-[#42121B]">{item.product_name_snapshot}</span>
                      <span className="text-[#8A5A44] ml-2">Qty: {item.quantity}</span>
                    </div>
                    <span className="font-semibold text-[#641B25]">
                      {formatINR(item.line_total)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-3 flex justify-between border-t border-[#C5A15B]/20 pt-3 text-sm font-bold text-[#42121B]">
                <span>Total Amount:</span>
                <span className="text-[#641B25]">{formatINR(order.total_amount)}</span>
              </div>
            </div>

            {/* Delivery destination */}
            <div className="border-t border-[#C5A15B]/20 pt-4 text-xs">
              <span className="text-[#8A5A44] font-semibold uppercase tracking-wider block mb-1">
                Delivery Address:
              </span>
              <p className="text-[#42121B] bg-[#FFF8EC] p-3 rounded-lg border border-[#C5A15B]/30 leading-relaxed">
                <span className="font-bold">{order.customer_name}</span> &bull; {order.delivery_address}
              </p>
            </div>

            {/* WhatsApp Inquiry Button */}
            <div className="border-t border-[#C5A15B]/20 pt-4">
              <a
                href={buildWhatsAppUrl(
                  `Namaste! I am checking my ShubhDeep order *${order.order_number}*. Current status is ${order.order_status}. Please provide latest updates.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-xs font-bold tracking-wider text-white uppercase hover:bg-[#20ba5a] transition shadow-sm"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Inquire About Order On WhatsApp</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default TrackOrder;
