import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  MessageCircle, 
  Minus, 
  Plus, 
  Trash2, 
  X, 
  CheckCircle2, 
  Loader2, 
  ShoppingBag, 
  User, 
  Sparkles, 
  MapPin, 
  Phone, 
  Edit2, 
  ShieldCheck 
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useCustomerAuth } from "../context/CustomerAuthContext";
import { SITE, formatINR, buildWhatsAppUrl } from "../config/site";
import { DiyaMark } from "./Ornaments";
import { api } from "../services/api";
import { toast } from "sonner";

export const CartDrawer = () => {
  const {
    isOpen,
    closeCart,
    items,
    updateQty,
    removeItem,
    subtotal,
    clear,
  } = useCart();
  const { customer, isCustomerAuthenticated } = useCustomerAuth();
  const navigate = useNavigate();

  const [checkoutStep, setCheckoutStep] = useState("cart"); // "cart" | "form" | "confirmed"
  const [loading, setLoading] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  useEffect(() => {
    if (customer) {
      if (!customerName && customer.name) setCustomerName(customer.name);
      if (!customerPhone && customer.phone) setCustomerPhone(customer.phone);
      if (!deliveryAddress && customer.delivery_address) setDeliveryAddress(customer.delivery_address);
    }
  }, [customer, checkoutStep]);

  const deliveryFee = subtotal >= 1499 ? 0 : (items.length > 0 ? 99 : 0);
  const totalAmount = subtotal + deliveryFee;

  const handleOnlineCheckout = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    const finalName = customerName.trim() || (customer?.name || "");
    const finalPhone = customerPhone.trim() || (customer?.phone || "");
    const finalAddress = deliveryAddress.trim() || (customer?.delivery_address || "");

    if (!finalName || !finalPhone || !finalAddress) {
      toast.error("Please provide your delivery address");
      return;
    }

    setLoading(true);
    try {
      const orderPayload = {
        customer_name: finalName,
        customer_phone: finalPhone,
        delivery_address: finalAddress,
        items: items.map((i) => ({
          product_id: typeof i.id === "number" ? i.id : 1, // Fallback if mock
          quantity: i.qty,
          size: i.size || null,
          color: i.color || null,
        })),
        idempotency_key: `cart_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      };

      const res = await api.createOrder(orderPayload);
      
      // If customer was missing default address, save this address to profile automatically
      if (isCustomerAuthenticated && customer && !customer.delivery_address) {
        api.updateCustomerProfile({ delivery_address: finalAddress }).catch(() => {});
      }

      setConfirmedOrder(res);
      clear();
      setCheckoutStep("confirmed");
      toast.success(
        isCustomerAuthenticated
          ? "Order placed with your saved patron profile! No info needed ✨"
          : "Order placed successfully!"
      );
    } catch (err) {
      toast.error(err.message || "Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetAndClose = () => {
    setCheckoutStep("cart");
    setConfirmedOrder(null);
    closeCart();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleResetAndClose}
        className={`fixed inset-0 z-50 bg-[#42121B]/60 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!isOpen}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 z-50 flex h-full w-full max-w-md flex-col bg-[#FFF8EC] shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-label="Shopping cart"
        data-testid="cart-drawer"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#C5A15B]/40 bg-[#641B25] px-6 py-5 text-[#FFF8EC]">
          <div className="flex items-center gap-3">
            <DiyaMark className="h-6 w-6" light={true} />
            <div>
              <p className="eyebrow text-[#C5A15B]">Your Diya Thali</p>
              <h3 className="font-serif-display text-xl">
                {checkoutStep === "confirmed"
                  ? "Order Placed"
                  : checkoutStep === "form"
                  ? "Delivery Details"
                  : "Shopping Cart"}
              </h3>
            </div>
          </div>
          <button
            data-testid="cart-close-button"
            onClick={handleResetAndClose}
            className="grid h-10 w-10 place-items-center rounded-full border border-[#C5A15B]/40 hover:bg-[#C5A15B]/15 transition"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        {checkoutStep === "confirmed" && confirmedOrder ? (
          <div className="flex flex-1 flex-col justify-between overflow-y-auto p-6 text-center">
            <div className="my-auto py-6">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#25D366]/20 border border-[#25D366]">
                <CheckCircle2 className="h-9 w-9 text-[#25D366]" />
              </div>
              <h4 className="font-serif-display mt-5 text-2xl text-[#42121B]">
                Shubh Deepam! Order Received.
              </h4>
              <p className="mt-2 text-xs text-[#8A5A44]">
                Your festive order has been placed successfully.
              </p>

              <div className="mt-6 rounded border border-[#C5A15B]/40 bg-white p-4 text-left text-sm">
                <div className="flex justify-between border-b border-[#C5A15B]/20 pb-2">
                  <span className="text-xs text-[#8A5A44]">Order Reference</span>
                  <span className="font-bold text-[#641B25]">{confirmedOrder.order_number}</span>
                </div>
                <div className="flex justify-between border-b border-[#C5A15B]/20 py-2">
                  <span className="text-xs text-[#8A5A44]">Customer</span>
                  <span className="font-medium text-[#42121B]">{confirmedOrder.customer_name}</span>
                </div>
                <div className="flex justify-between border-b border-[#C5A15B]/20 py-2">
                  <span className="text-xs text-[#8A5A44]">Total Amount</span>
                  <span className="font-bold text-[#641B25]">{formatINR(confirmedOrder.total_amount)}</span>
                </div>
                <div className="pt-2 text-xs text-[#8A5A44]">
                  <span>Delivery to: </span>
                  <span className="text-[#42121B]">{confirmedOrder.delivery_address}</span>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <a
                  href={buildWhatsAppUrl(
                    `🪔 *ShubhDeep — New Order Confirmation*\n\nNamaste! I just placed order *${confirmedOrder.order_number}* on ShubhDeep Diya Store for ${formatINR(
                      confirmedOrder.total_amount
                    )}.\n\n👤 *Customer:* ${confirmedOrder.customer_name}\n📞 *WhatsApp:* ${confirmedOrder.customer_phone}\n📍 *Delivery Address:* ${confirmedOrder.delivery_address}\n\nPlease confirm my order and share all dispatch and delivery updates directly on this WhatsApp chat!`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3.5 text-xs font-bold tracking-wider text-white uppercase hover:bg-[#20ba5a] transition shadow-md"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Receive All Updates on WhatsApp</span>
                </a>
                <p className="text-[0.68rem] text-center text-[#8A5A44]">
                  Tap above to connect with the artisan store and receive live WhatsApp notifications.
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-2">
              <button
                onClick={() => {
                  handleResetAndClose();
                  navigate("/track-order");
                }}
                className="w-full rounded border border-[#C5A15B] py-2.5 text-xs font-semibold tracking-wider text-[#641B25] uppercase hover:bg-[#FFF8EC] transition"
              >
                Track This Order
              </button>
              <button
                onClick={handleResetAndClose}
                className="w-full bg-[#641B25] py-3 text-xs font-semibold tracking-wider text-[#C5A15B] uppercase hover:bg-[#42121B] transition"
              >
                Back to Boutique
              </button>
            </div>
          </div>
        ) : checkoutStep === "form" ? (
          <form onSubmit={handleOnlineCheckout} className="flex flex-1 flex-col justify-between overflow-y-auto p-6">
            <div className="space-y-4">
              {/* Option A: Registered Patron with Saved Info (ZERO INFO NEEDED) */}
              {isCustomerAuthenticated && customer && customer.delivery_address && !isEditingAddress ? (
                <div className="rounded-xl border border-emerald-300 bg-emerald-50/70 p-4">
                  <div className="flex items-center justify-between mb-3 border-b border-emerald-200 pb-2.5">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="text-[0.65rem] font-bold uppercase tracking-wider text-emerald-800 block">
                          Registered Patron Verified
                        </span>
                        <h4 className="font-bold text-xs text-emerald-950">
                          1-Click Express Dispatch
                        </h4>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsEditingAddress(true)}
                      className="inline-flex items-center gap-1 text-[0.7rem] font-bold text-[#641B25] hover:underline"
                    >
                      <Edit2 className="h-3 w-3" />
                      <span>Change Address</span>
                    </button>
                  </div>

                  <div className="space-y-1.5 text-xs text-[#42121B]">
                    <p className="font-bold text-sm text-[#42121B] flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-[#C5A15B]" />
                      <span>{customer.name}</span>
                    </p>
                    <p className="text-[#8A5A44] flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-[#C5A15B]" />
                      <span>+91 {customer.phone}</span>
                    </p>
                    <p className="text-[#42121B] font-medium flex items-start gap-1.5 pt-1 bg-white/80 p-2.5 rounded-lg border border-emerald-200/60 leading-relaxed">
                      <MapPin className="h-4 w-4 text-[#641B25] shrink-0 mt-0.5" />
                      <span>{customer.delivery_address}</span>
                    </p>
                  </div>

                  <div className="mt-3 flex items-center gap-1.5 text-[0.7rem] text-emerald-800 font-semibold bg-emerald-100/60 p-2 rounded">
                    <Sparkles className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
                    <span>All info on file from your registration — zero typing required!</span>
                  </div>
                </div>
              ) : (
                /* Option B: Guest or Editing Address */
                <>
                  {isCustomerAuthenticated ? (
                    <div className="flex items-center justify-between rounded-lg bg-emerald-50 border border-emerald-200 p-2.5 text-xs text-emerald-800">
                      <span>Editing delivery address for this order</span>
                      {customer?.delivery_address && (
                        <button
                          type="button"
                          onClick={() => {
                            setDeliveryAddress(customer.delivery_address);
                            setIsEditingAddress(false);
                          }}
                          className="font-bold text-[#641B25] hover:underline"
                        >
                          Use Saved Address
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-between rounded-lg bg-[#FFF8EC] border border-[#C5A15B]/30 p-2.5 text-xs text-[#8A5A44]">
                      <span>Registered patron?</span>
                      <Link
                        to="/login"
                        onClick={closeCart}
                        className="font-bold text-[#641B25] hover:underline"
                      >
                        Sign in for 1-Click Checkout →
                      </Link>
                    </div>
                  )}

                  <p className="text-xs text-[#8A5A44]">
                    Enter your details to confirm your order. Cash on Delivery and Direct Confirmation available.
                  </p>

                  <div>
                    <label className="block text-xs font-medium text-[#42121B] uppercase tracking-wider mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Meera Sharma"
                      className="w-full rounded border border-[#C5A15B]/50 bg-white px-3 py-2 text-sm text-[#42121B] focus:border-[#641B25] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#42121B] uppercase tracking-wider mb-1">
                      WhatsApp / Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="e.g. 9876543210"
                      className="w-full rounded border border-[#C5A15B]/50 bg-white px-3 py-2 text-sm text-[#42121B] focus:border-[#641B25] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#42121B] uppercase tracking-wider mb-1">
                      Delivery Address & Pincode *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="House/Flat No., Street, Area, City, State, PIN"
                      className="w-full rounded border border-[#C5A15B]/50 bg-white px-3 py-2 text-sm text-[#42121B] focus:border-[#641B25] focus:outline-none"
                    />
                  </div>
                </>
              )}

              {/* Order items snapshot */}
              <div className="rounded border border-[#C5A15B]/30 bg-white p-3 text-xs">
                <div className="flex justify-between text-[#8A5A44]">
                  <span>Items ({items.length})</span>
                  <span>{formatINR(subtotal)}</span>
                </div>
                <div className="flex justify-between text-[#8A5A44] mt-1">
                  <span>Shipping</span>
                  <span>{deliveryFee === 0 ? "FREE" : formatINR(deliveryFee)}</span>
                </div>
                <div className="flex justify-between font-bold text-[#641B25] mt-2 pt-2 border-t border-[#C5A15B]/20">
                  <span>Total Amount</span>
                  <span>{formatINR(totalAmount)}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 bg-[#641B25] py-3.5 text-xs font-semibold tracking-wider text-[#C5A15B] uppercase hover:bg-[#42121B] disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-[#C5A15B]" />
                ) : isCustomerAuthenticated && customer?.delivery_address && !isEditingAddress ? (
                  <>
                    <Sparkles className="h-4 w-4 text-[#C5A15B]" />
                    <span>Confirm & Place Order (1-Click Express)</span>
                  </>
                ) : (
                  "Confirm & Place Order"
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setCheckoutStep("cart");
                  setIsEditingAddress(false);
                }}
                className="w-full border border-[#C5A15B]/50 py-2.5 text-xs font-medium text-[#42121B] uppercase hover:bg-[#C5A15B]/10"
              >
                Back to Cart
              </button>
            </div>
          </form>
        ) : items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <DiyaMark className="h-14 w-14" />
            <h4 className="font-serif-display mt-4 text-2xl text-[#42121B]">
              Your cart is still unlit.
            </h4>
            <p className="mt-2 text-sm text-[#8A5A44]">
              Browse our festive collection and add a glow to your Diwali.
            </p>
            <Link
              to="/shop"
              onClick={closeCart}
              data-testid="cart-empty-shop-link"
              className="mt-8 inline-flex items-center gap-2 bg-[#641B25] px-6 py-3 text-xs font-semibold tracking-[0.18em] uppercase text-[#C5A15B] hover:bg-[#42121B]"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-1 flex-col justify-between overflow-y-auto">
            {/* Items List */}
            <div className="divide-y divide-[#C5A15B]/20 p-6 space-y-4">
              {items.map((item) => (
                <div key={item.key} className="flex gap-4 pt-4 first:pt-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-20 w-20 rounded border border-[#C5A15B]/40 object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif-display text-base text-[#42121B] truncate">
                      {item.name}
                    </h4>
                    {(item.size || item.color) && (
                      <p className="text-xs text-[#8A5A44]">
                        {[item.size, item.color].filter(Boolean).join(" · ")}
                      </p>
                    )}
                    <p className="mt-1 text-sm font-semibold text-[#641B25]">
                      {formatINR(item.price)}
                    </p>

                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center rounded border border-[#C5A15B]/50 bg-white">
                        <button
                          onClick={() => updateQty(item.key, -1)}
                          className="px-2 py-1 text-[#42121B] hover:bg-[#FFF8EC]"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-2 text-xs font-semibold text-[#42121B]">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateQty(item.key, 1)}
                          className="px-2 py-1 text-[#42121B] hover:bg-[#FFF8EC]"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.key)}
                        className="text-[#8A5A44] hover:text-[#641B25] p-1"
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Summary & Checkout Options */}
            <div className="border-t border-[#C5A15B]/40 bg-white p-6">
              <div className="space-y-1.5 text-xs text-[#8A5A44]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-[#42121B]">{formatINR(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-medium text-[#42121B]">
                    {deliveryFee === 0 ? "FREE (Orders above ₹1,499)" : formatINR(deliveryFee)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#641B25] pt-2 border-t border-[#C5A15B]/20">
                  <span>Estimated Total</span>
                  <span>{formatINR(totalAmount)}</span>
                </div>
              </div>

              <div className="mt-5 space-y-2.5">
                {/* Registered Patron 1-Click Status or Guest Sign In prompt */}
                {isCustomerAuthenticated && customer ? (
                  <div className="rounded-lg border border-emerald-300 bg-emerald-50/80 p-2.5 text-xs text-emerald-950 flex items-center justify-between">
                    <div className="flex items-center gap-2 truncate">
                      <ShieldCheck className="h-4 w-4 text-emerald-700 shrink-0" />
                      <span className="truncate">
                        Delivering to: <strong>{customer.name}</strong>
                      </span>
                    </div>
                    <span className="shrink-0 rounded bg-emerald-200/80 px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-emerald-800">
                      1-Click Express
                    </span>
                  </div>
                ) : (
                  <div className="rounded-lg border border-[#C5A15B]/30 bg-[#FFF8EC] p-2 text-center text-xs text-[#8A5A44]">
                    <span>Registered patron? </span>
                    <Link
                      to="/login"
                      onClick={closeCart}
                      className="font-bold text-[#641B25] hover:underline"
                    >
                      Sign In for 1-Click Checkout
                    </Link>
                  </div>
                )}

                {/* Option 1: Direct Order Form */}
                <button
                  onClick={() => setCheckoutStep("form")}
                  data-testid="checkout-button"
                  className="flex w-full items-center justify-center gap-2 rounded-sm bg-[#641B25] py-3.5 text-xs font-semibold tracking-wider text-[#C5A15B] uppercase hover:bg-[#42121B] transition shadow"
                >
                  {isCustomerAuthenticated && customer?.delivery_address ? (
                    <>
                      <Sparkles className="h-4 w-4 text-[#C5A15B]" />
                      <span>1-Click Express Checkout</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="h-4 w-4" />
                      <span>Proceed to Checkout</span>
                    </>
                  )}
                </button>
              </div>

              <p className="mt-3 text-center text-[0.68rem] text-[#8A5A44]">
                Prices and stock are revalidated securely upon checkout.
              </p>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};
