import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  ShoppingBag, 
  User, 
  Phone, 
  MapPin, 
  Calendar, 
  CreditCard, 
  CheckCircle, 
  AlertCircle,
  Truck,
  MessageCircle,
  Save,
  Clock,
  CheckCircle2,
  PackageCheck,
  XCircle,
  Copy,
  ExternalLink,
  Sparkles,
  Printer,
  FileText
} from "lucide-react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { api } from "../../services/api";
import { generateWhatsAppMessage, buildCustomerWhatsAppUrl } from "../../utils/whatsappTemplates";
import { SITE, formatINR } from "../../config/site";
import { toast } from "sonner";

const STATUS_FLOW = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["processing", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped: ["delivered", "cancelled"],
  delivered: [],
  cancelled: [],
};

const STATUS_BADGES = {
  pending: { bg: "bg-amber-100", text: "text-amber-800", border: "border-amber-300", icon: Clock },
  confirmed: { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-300", icon: CheckCircle2 },
  processing: { bg: "bg-indigo-100", text: "text-indigo-800", border: "border-indigo-300", icon: ShoppingBag },
  shipped: { bg: "bg-purple-100", text: "text-purple-800", border: "border-purple-300", icon: Truck },
  delivered: { bg: "bg-emerald-100", text: "text-emerald-800", border: "border-emerald-300", icon: PackageCheck },
  cancelled: { bg: "bg-rose-100", text: "text-rose-800", border: "border-rose-300", icon: XCircle },
};

export const AdminOrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const [selectedStatus, setSelectedStatus] = useState("");
  const [savingStatus, setSavingStatus] = useState(false);
  const [customNote, setCustomNote] = useState("");
  const [copied, setCopied] = useState(false);
  const [showBillModal, setShowBillModal] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getAdminOrder(orderId);
      setOrder(res);
      setSelectedStatus(res.order_status);
    } catch (err) {
      setError(err.message || "Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    if (selectedStatus === order.order_status) return;

    try {
      setSavingStatus(true);
      setError(null);
      setSuccessMsg(null);
      const updated = await api.updateOrderStatus(order.id, {
        order_status: selectedStatus,
        payment_status: selectedStatus === "delivered" ? "paid" : order.payment_status
      });
      setOrder(updated);
      setSelectedStatus(updated.order_status);
      setSuccessMsg(`Order status successfully updated to "${updated.order_status.toUpperCase()}".`);
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      setError(err.message || "Failed to update order status");
    } finally {
      setSavingStatus(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Order Details" subtitle="Loading customer order...">
        <div className="p-16 text-center text-sm text-[#8A5A44]">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-[#641B25] border-t-transparent mb-3" />
          <p>Loading order data...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error && !order) {
    return (
      <AdminLayout title="Order Details" subtitle="Error loading order">
        <div className="p-8 max-w-xl mx-auto rounded-xl border border-red-200 bg-red-50 text-center">
          <AlertCircle className="mx-auto h-10 w-10 text-red-600 mb-2" />
          <h3 className="font-semibold text-red-900 mb-1">Failed to Load Order</h3>
          <p className="text-xs text-red-700 mb-4">{error}</p>
          <Link
            to="/admin/orders"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#641B25] text-[#FFF8EC] text-xs font-semibold"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Orders</span>
          </Link>
        </div>
      </AdminLayout>
    );
  }

  const badge = STATUS_BADGES[order.order_status] || STATUS_BADGES.pending;
  const BadgeIcon = badge.icon;
  const allowedNext = STATUS_FLOW[order.order_status] || [];
  const dateStr = new Date(order.created_at).toLocaleString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });

  // Generated WhatsApp Customer Message based on current order status
  const generatedMessage = generateWhatsAppMessage(order, customNote);
  const whatsappUrl = buildCustomerWhatsAppUrl(order, customNote);

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(generatedMessage);
    setCopied(true);
    toast.success("WhatsApp update message copied to clipboard!");
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <AdminLayout
      title={`Order ${order.order_number}`}
      subtitle={`Placed on ${dateStr}`}
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link
          to="/admin/orders"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#8A5A44] hover:text-[#641B25] transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to All Orders</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowBillModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#C5A15B]/50 bg-white text-[#42121B] text-xs font-bold hover:bg-[#FFF8EC] transition shadow-sm"
          >
            <Printer className="h-4 w-4 text-[#C5A15B]" />
            <span>Print Bill / Invoice</span>
          </button>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] text-white text-xs font-bold hover:bg-[#20ba5a] transition shadow-md"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Send Live Update on WhatsApp</span>
          </a>
        </div>
      </div>

      {successMsg && (
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-800">
          <CheckCircle className="h-5 w-5 shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-xs text-red-800">
          <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Order Items & Pricing (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items Card */}
          <div className="rounded-xl border border-[#C5A15B]/30 bg-white p-6 shadow-sm">
            <h3 className="font-serif-display text-lg font-bold text-[#42121B] mb-4 flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-[#C5A15B]" />
              <span>Ordered Items ({order.items?.length || 0})</span>
            </h3>

            <div className="divide-y divide-[#C5A15B]/20">
              {order.items?.map((item) => (
                <div key={item.id} className="py-4 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="font-medium text-sm text-[#42121B]">{item.product_name_snapshot}</h4>
                    <span className="text-xs text-[#8A5A44]">
                      ₹{parseFloat(item.unit_price).toFixed(2)} × {item.quantity}
                    </span>
                  </div>
                  <div className="font-semibold text-sm text-[#641B25]">
                    ₹{parseFloat(item.line_total).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            {/* Financial Totals */}
            <div className="mt-6 border-t border-[#C5A15B]/30 pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-[#8A5A44]">
                <span>Items Subtotal:</span>
                <span>₹{parseFloat(order.subtotal).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#8A5A44]">
                <span>Delivery & Handling:</span>
                <span>
                  {parseFloat(order.delivery_fee) === 0 ? "FREE" : `₹${parseFloat(order.delivery_fee).toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#42121B] border-t border-[#C5A15B]/20 pt-3">
                <span>Total Amount:</span>
                <span className="text-[#641B25]">₹{parseFloat(order.total_amount).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Delivery & Customer Info Card */}
          <div className="rounded-xl border border-[#C5A15B]/30 bg-white p-6 shadow-sm">
            <h3 className="font-serif-display text-lg font-bold text-[#42121B] mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-[#C5A15B]" />
              <span>Customer & Shipping Details</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[#8A5A44] font-medium block">Customer Name</span>
                <p className="text-[#42121B] text-sm font-semibold mt-0.5">{order.customer_name}</p>
              </div>

              <div>
                <span className="text-[#8A5A44] font-medium block">Phone Number</span>
                <p className="text-[#42121B] text-sm font-semibold mt-0.5 flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-[#8A5A44]" />
                  <span>{order.customer_phone}</span>
                </p>
              </div>

              <div className="md:col-span-2">
                <span className="text-[#8A5A44] font-medium block">Delivery Address</span>
                <p className="text-[#42121B] text-xs font-medium mt-1 leading-relaxed bg-[#FFF8EC] p-3 rounded-lg border border-[#C5A15B]/20">
                  {order.delivery_address}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Status & Actions (1 col) */}
        <div className="space-y-6">
          {/* Current Status Card */}
          <div className="rounded-xl border border-[#C5A15B]/30 bg-white p-6 shadow-sm">
            <h3 className="font-serif-display text-lg font-bold text-[#42121B] mb-3">
              Order Status
            </h3>

            <div className="mb-4">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${badge.bg} ${badge.text} ${badge.border}`}>
                <BadgeIcon className="h-4 w-4" />
                {order.order_status}
              </span>
            </div>

            {/* Status Change Form */}
            {allowedNext.length > 0 ? (
              <form onSubmit={handleStatusUpdate} className="space-y-4 border-t border-[#C5A15B]/20 pt-4">
                <label className="block text-xs font-semibold text-[#42121B]">
                  Update Status To:
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full text-xs rounded-lg border border-[#C5A15B]/40 bg-white px-3 py-2.5 text-[#42121B] font-medium focus:border-[#641B25] focus:outline-none"
                >
                  <option value={order.order_status}>Keep as ({order.order_status.toUpperCase()})</option>
                  {allowedNext.map((st) => (
                    <option key={st} value={st}>
                      Mark as {st.toUpperCase()}
                    </option>
                  ))}
                </select>

                {selectedStatus === "cancelled" && (
                  <p className="text-[0.7rem] text-rose-700 bg-rose-50 p-2.5 rounded border border-rose-200">
                    Warning: Cancelling this order will automatically restore reserved stock to inventory.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={savingStatus || selectedStatus === order.order_status}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#641B25] px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#FFF8EC] hover:bg-[#42121B] transition disabled:opacity-50"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>{savingStatus ? "Saving Status..." : "Save Status Change"}</span>
                </button>
              </form>
            ) : (
              <p className="text-xs text-[#8A5A44] border-t border-[#C5A15B]/20 pt-3">
                This order is in a final state (<span className="font-semibold">{order.order_status}</span>) and cannot be modified further.
              </p>
            )}
          </div>

          {/* WhatsApp Direct Patron Communication Card */}
          <div className="rounded-xl border border-emerald-300 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
                <MessageCircle className="h-4 w-4" />
              </span>
              <div>
                <h3 className="font-serif-display text-base font-bold text-[#42121B]">
                  Send Update on WhatsApp
                </h3>
                <span className="text-[0.7rem] text-[#8A5A44]">
                  Automated tailored update for status: <span className="font-bold text-emerald-800 uppercase">{order.order_status}</span>
                </span>
              </div>
            </div>

            {/* Custom courier / artisan note input */}
            <div className="my-3 text-xs">
              <label className="block text-[0.7rem] font-semibold uppercase tracking-wider text-[#42121B] mb-1">
                Optional Tracking / Courier Note:
              </label>
              <input
                type="text"
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                placeholder="e.g. Dispatched via BlueDart AWB: 987654321"
                className="w-full rounded-lg border border-[#C5A15B]/40 px-3 py-2 text-xs text-[#42121B] focus:border-[#641B25] focus:outline-none"
              />
            </div>

            {/* Live Message Preview */}
            <div className="rounded-lg bg-[#FFF8EC] border border-[#C5A15B]/30 p-3 text-[0.7rem] font-mono whitespace-pre-wrap max-h-40 overflow-y-auto text-[#42121B] leading-relaxed">
              {generatedMessage}
            </div>

            {/* WhatsApp Buttons */}
            <div className="mt-4 flex flex-col sm:flex-row gap-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#25D366] px-3 py-2 text-xs font-bold text-white uppercase tracking-wider hover:bg-[#20ba5a] transition shadow-sm"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Send on WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={handleCopyMessage}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#C5A15B]/50 bg-white px-3 py-2 text-xs font-semibold text-[#42121B] hover:bg-[#FFF8EC] transition"
              >
                <Copy className="h-3.5 w-3.5" />
                <span>{copied ? "Copied!" : "Copy Text"}</span>
              </button>
            </div>
          </div>

          {/* Payment Status Card */}
          <div className="rounded-xl border border-[#C5A15B]/30 bg-white p-6 shadow-sm">
            <h3 className="font-serif-display text-lg font-bold text-[#42121B] mb-2 flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-[#C5A15B]" />
              <span>Payment Details</span>
            </h3>
            <p className="text-xs text-[#8A5A44] mb-3">
              Payment mode: Cash on Delivery / WhatsApp Payment Confirmation
            </p>
            <div className="inline-block px-3 py-1 rounded bg-[#FFF8EC] border border-[#C5A15B]/30 text-xs font-semibold text-[#641B25] uppercase tracking-wider">
              Payment Status: {order.payment_status}
            </div>
          </div>
        </div>
      </div>

      {/* Printable Bill / Invoice Modal */}
      {showBillModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-8 shadow-2xl border border-[#C5A15B]/40">
            {/* Action Bar (hidden when printing) */}
            <div className="mb-6 flex items-center justify-between border-b border-[#C5A15B]/30 pb-4 print:hidden">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#641B25]" />
                <h3 className="font-serif-display text-lg font-bold text-[#42121B]">
                  Customer Tax Invoice & Bill
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#641B25] px-4 py-2 text-xs font-bold text-[#FFF8EC] hover:bg-[#42121B] transition shadow"
                >
                  <Printer className="h-4 w-4" />
                  <span>Print / Save PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowBillModal(false)}
                  className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 transition"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Printable Invoice Sheet */}
            <div className="p-4 bg-[#FFF8EC]/30 rounded-xl border border-[#C5A15B]/30 print:border-none print:p-0">
              {/* Boutique Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b-2 border-[#641B25] pb-4">
                <div>
                  <h2 className="font-serif-display text-2xl font-bold text-[#641B25] tracking-wide">
                    {SITE.brand}
                  </h2>
                  <p className="text-xs font-semibold text-[#C5A15B] uppercase tracking-wider">
                    {SITE.tagline}
                  </p>
                  <p className="text-[0.75rem] text-[#8A5A44] mt-1">{SITE.address}</p>
                </div>
                <div className="sm:text-right text-xs text-[#42121B]">
                  <div className="inline-block bg-[#641B25] text-[#FFF8EC] px-2.5 py-1 rounded text-[0.7rem] font-bold uppercase tracking-wider mb-1">
                    Official Retail Invoice
                  </div>
                  <p className="font-bold text-sm text-[#42121B]">Bill / Order #{order.order_number}</p>
                  <p className="text-[#8A5A44] text-[0.75rem]">Date: {dateStr}</p>
                  <p className="text-[#8A5A44] text-[0.75rem] font-semibold mt-1">
                    Billing & Support Helpline: <span className="text-[#641B25] font-bold">{SITE.phoneDisplay}</span>
                  </p>
                  <p className="text-[#8A5A44] text-[0.75rem]">Email: {SITE.email}</p>
                </div>
              </div>

              {/* Bill To Info */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-white p-3.5 rounded-lg border border-[#C5A15B]/20">
                <div>
                  <span className="text-[#8A5A44] font-semibold uppercase tracking-wider text-[0.65rem] block">
                    Billed & Delivered To:
                  </span>
                  <p className="font-bold text-[#42121B] text-sm mt-0.5">{order.customer_name}</p>
                  <p className="text-[#641B25] font-semibold mt-0.5">📞 {order.customer_phone}</p>
                  <p className="text-gray-600 mt-1 leading-relaxed text-[0.75rem]">
                    {order.delivery_address}
                  </p>
                </div>
                <div className="sm:text-right">
                  <span className="text-[#8A5A44] font-semibold uppercase tracking-wider text-[0.65rem] block">
                    Payment & Delivery Terms:
                  </span>
                  <p className="font-semibold text-[#42121B] mt-0.5 capitalize">
                    Payment: <span className="text-[#641B25]">{order.payment_status}</span>
                  </p>
                  <p className="font-semibold text-[#42121B] capitalize">
                    Order Status: <span className="text-emerald-800">{order.order_status}</span>
                  </p>
                  <p className="text-[0.7rem] text-[#8A5A44] mt-1">
                    Authentic Handmade Indian Teracotta & Brass Diya Ware
                  </p>
                </div>
              </div>

              {/* Itemized Table */}
              <table className="mt-4 w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#C5A15B]/40 text-[#42121B] font-bold bg-[#641B25]/5">
                    <th className="py-2.5 px-3">Item Description</th>
                    <th className="py-2.5 px-3 text-center">Qty</th>
                    <th className="py-2.5 px-3 text-right">Unit Price</th>
                    <th className="py-2.5 px-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#C5A15B]/20 bg-white">
                  {order.items?.map((item, idx) => (
                    <tr key={item.id || idx}>
                      <td className="py-2.5 px-3 font-medium text-[#42121B]">
                        {item.product_name_snapshot}
                      </td>
                      <td className="py-2.5 px-3 text-center text-gray-700">
                        {item.quantity}
                      </td>
                      <td className="py-2.5 px-3 text-right text-gray-700">
                        ₹{parseFloat(item.unit_price).toFixed(2)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-semibold text-[#42121B]">
                        ₹{parseFloat(item.line_total).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals Summary */}
              <div className="mt-4 border-t-2 border-[#641B25]/30 pt-3 flex justify-end">
                <div className="w-64 space-y-1.5 text-xs">
                  <div className="flex justify-between text-[#8A5A44]">
                    <span>Items Subtotal:</span>
                    <span>₹{parseFloat(order.subtotal).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[#8A5A44]">
                    <span>Shipping & Handling:</span>
                    <span>{parseFloat(order.delivery_fee) === 0 ? "FREE" : `₹${parseFloat(order.delivery_fee).toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-[#641B25] border-t border-[#C5A15B]/30 pt-1.5">
                    <span>Grand Total:</span>
                    <span>₹{parseFloat(order.total_amount).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Footer Note */}
              <div className="mt-6 border-t border-[#C5A15B]/30 pt-3 text-center text-[0.7rem] text-[#8A5A44] leading-relaxed">
                <p className="font-semibold text-[#641B25]">
                  Thank you for illuminating your home with ShubhDeep's handcrafted festive lamps! 🪔
                </p>
                <p className="mt-0.5">
                  For billing inquiries, exchange support or bulk orders, contact Helpline: <span className="font-bold text-[#42121B]">{SITE.phoneDisplay}</span> or WhatsApp <span className="font-bold text-[#42121B]">+{SITE.whatsappNumber}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
export default AdminOrderDetails;
