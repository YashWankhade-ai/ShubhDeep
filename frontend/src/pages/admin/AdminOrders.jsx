import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Eye, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  Truck, 
  PackageCheck, 
  XCircle,
  AlertCircle,
  MessageCircle
} from "lucide-react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { api } from "../../services/api";
import { buildCustomerWhatsAppUrl } from "../../utils/whatsappTemplates";

const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

const STATUS_BADGES = {
  pending: { bg: "bg-amber-100", text: "text-amber-800", border: "border-amber-300", icon: Clock },
  confirmed: { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-300", icon: CheckCircle2 },
  processing: { bg: "bg-indigo-100", text: "text-indigo-800", border: "border-indigo-300", icon: ShoppingBag },
  shipped: { bg: "bg-purple-100", text: "text-purple-800", border: "border-purple-300", icon: Truck },
  delivered: { bg: "bg-emerald-100", text: "text-emerald-800", border: "border-emerald-300", icon: PackageCheck },
  cancelled: { bg: "bg-rose-100", text: "text-rose-800", border: "border-rose-300", icon: XCircle },
};

export const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters & Pagination
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getAdminOrders({
        page,
        page_size: 15,
        status: statusFilter || undefined,
        search: search.trim() || undefined,
      });
      setOrders(res.items || []);
      setTotalPages(res.total_pages || 1);
      setTotalOrders(res.total || 0);
    } catch (err) {
      setError(err.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchOrders();
  };

  const handleStatusChange = (newStatus) => {
    setStatusFilter(newStatus);
    setPage(1);
  };

  return (
    <AdminLayout
      title="Customer Orders"
      subtitle="Track customer orders, manage status updates, and view delivery details."
    >
      {/* Top Filter Bar */}
      <div className="mb-6 flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-[#C5A15B]/30 shadow-sm">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Order #, Name, Phone..."
            className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-[#C5A15B]/40 focus:border-[#641B25] focus:outline-none focus:ring-1 focus:ring-[#641B25]"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#8A5A44]" />
        </form>

        {/* Status Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <Filter className="h-4 w-4 text-[#8A5A44] shrink-0" />
          <span className="text-xs font-semibold uppercase tracking-wider text-[#8A5A44] shrink-0">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="text-xs rounded-lg border border-[#C5A15B]/40 bg-white px-3 py-2 text-[#42121B] font-medium focus:border-[#641B25] focus:outline-none"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-xs text-red-800">
          <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Orders Table */}
      <div className="rounded-xl border border-[#C5A15B]/30 bg-white shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-sm text-[#8A5A44]">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-[#641B25] border-t-transparent mb-3" />
            <p>Loading customer orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-16 text-center">
            <ShoppingBag className="mx-auto h-12 w-12 text-[#C5A15B]/60 mb-3" />
            <h3 className="font-serif-display text-lg font-bold text-[#42121B]">No orders found</h3>
            <p className="text-xs text-[#8A5A44] mt-1">
              {search || statusFilter ? "Try adjusting your filters or search terms." : "No customer orders have been placed yet."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FFF8EC] border-b border-[#C5A15B]/30 font-semibold tracking-wider uppercase text-[#8A5A44]">
                <tr>
                  <th className="py-3.5 px-4">Order #</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Phone</th>
                  <th className="py-3.5 px-4">Items</th>
                  <th className="py-3.5 px-4">Total</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#C5A15B]/15 text-[#42121B]">
                {orders.map((order) => {
                  const badge = STATUS_BADGES[order.order_status] || STATUS_BADGES.pending;
                  const Icon = badge.icon;
                  const dateStr = new Date(order.created_at).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  });

                  return (
                    <tr key={order.id} className="hover:bg-[#FFF8EC]/40 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#641B25]">
                        <Link to={`/admin/orders/${order.id}`} className="hover:underline">
                          {order.order_number}
                        </Link>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-[#42121B]">
                        {order.customer_name}
                      </td>
                      <td className="py-3.5 px-4 text-[#8A5A44]">
                        {order.customer_phone}
                      </td>
                      <td className="py-3.5 px-4 text-[#8A5A44]">
                        {order.items?.length || 0} item{order.items?.length === 1 ? "" : "s"}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-[#42121B]">
                        ₹{parseFloat(order.total_amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[0.7rem] font-semibold uppercase tracking-wider border ${badge.bg} ${badge.text} ${badge.border}`}>
                          <Icon className="h-3 w-3" />
                          {order.order_status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[#8A5A44] whitespace-nowrap">
                        {dateStr}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <a
                            href={buildCustomerWhatsAppUrl(order)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#25D366] text-white hover:bg-[#20ba5a] transition text-[0.7rem] font-semibold shadow-sm"
                            title={`Send ${order.order_status.toUpperCase()} update on WhatsApp to ${order.customer_name}`}
                          >
                            <MessageCircle className="h-3.5 w-3.5" />
                            <span>WhatsApp</span>
                          </a>

                          <Link
                            to={`/admin/orders/${order.id}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#C5A15B]/50 bg-white text-[#641B25] hover:bg-[#641B25] hover:text-[#FFF8EC] transition text-xs font-semibold"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            <span>View</span>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination bar */}
        {!loading && orders.length > 0 && (
          <div className="flex items-center justify-between border-t border-[#C5A15B]/20 bg-[#FFF8EC]/40 px-4 py-3 text-xs">
            <span className="text-[#8A5A44]">
              Showing <span className="font-semibold text-[#42121B]">{orders.length}</span> of{" "}
              <span className="font-semibold text-[#42121B]">{totalOrders}</span> orders
            </span>

            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="inline-flex items-center gap-1 rounded border border-[#C5A15B]/40 bg-white px-2.5 py-1 font-medium text-[#42121B] hover:bg-[#FFF8EC] disabled:opacity-40"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                <span>Prev</span>
              </button>
              <span className="font-medium text-[#42121B]">
                {page} / {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="inline-flex items-center gap-1 rounded border border-[#C5A15B]/40 bg-white px-2.5 py-1 font-medium text-[#42121B] hover:bg-[#FFF8EC] disabled:opacity-40"
              >
                <span>Next</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
export default AdminOrders;
