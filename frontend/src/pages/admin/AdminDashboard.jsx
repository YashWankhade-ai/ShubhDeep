import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  DollarSign, 
  ShoppingBag, 
  Package, 
  AlertTriangle, 
  ArrowUpRight,
  Clock,
  Truck,
  CheckCircle2,
  Loader2
} from "lucide-react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { api } from "../../services/api";
import { formatINR } from "../../config/site";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAdminDashboard()
      .then((data) => setStats(data))
      .catch((err) => console.error("Error loading admin stats:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout
      title="Boutique Overview"
      subtitle="Track sales, order status, product catalogue, and stock levels"
    >
      {loading ? (
        <div className="py-24 text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#641B25]" />
          <p className="mt-3 text-xs tracking-wider uppercase text-[#8A5A44]">Loading metrics...</p>
        </div>
      ) : stats ? (
        <div className="space-y-8">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded border border-[#C5A15B]/40 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#8A5A44]">
                  Total Revenue
                </span>
                <span className="grid h-10 w-10 place-items-center rounded-full bg-[#FFF8EC] text-[#641B25]">
                  <DollarSign className="h-5 w-5 text-[#C5A15B]" />
                </span>
              </div>
              <h3 className="font-serif-display mt-4 text-3xl font-bold text-[#641B25]">
                {formatINR(stats.total_revenue)}
              </h3>
              <p className="mt-1 text-[0.7rem] text-[#8A5A44]">From confirmed orders</p>
            </div>

            <div className="rounded border border-[#C5A15B]/40 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#8A5A44]">
                  Total Orders
                </span>
                <span className="grid h-10 w-10 place-items-center rounded-full bg-[#FFF8EC] text-[#641B25]">
                  <ShoppingBag className="h-5 w-5 text-[#C5A15B]" />
                </span>
              </div>
              <h3 className="font-serif-display mt-4 text-3xl font-bold text-[#42121B]">
                {stats.total_orders}
              </h3>
              <p className="mt-1 text-[0.7rem] text-[#8A5A44]">All customer orders placed</p>
            </div>

            <div className="rounded border border-[#C5A15B]/40 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#8A5A44]">
                  Live Products
                </span>
                <span className="grid h-10 w-10 place-items-center rounded-full bg-[#FFF8EC] text-[#641B25]">
                  <Package className="h-5 w-5 text-[#C5A15B]" />
                </span>
              </div>
              <h3 className="font-serif-display mt-4 text-3xl font-bold text-[#42121B]">
                {stats.total_products}
              </h3>
              <p className="mt-1 text-[0.7rem] text-[#8A5A44]">Diyas, stands & hampers in DB</p>
            </div>

            <div className="rounded border border-[#C5A15B]/40 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#8A5A44]">
                  Low Stock Alert
                </span>
                <span className="grid h-10 w-10 place-items-center rounded-full bg-amber-50 text-amber-700">
                  <AlertTriangle className="h-5 w-5" />
                </span>
              </div>
              <h3 className="font-serif-display mt-4 text-3xl font-bold text-amber-700">
                {stats.low_stock_count}
              </h3>
              <p className="mt-1 text-[0.7rem] text-[#8A5A44]">Items with ≤ 10 units left</p>
            </div>
          </div>

          {/* Order Status Breakdown */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="flex items-center gap-4 rounded border border-[#C5A15B]/30 bg-white p-5">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-amber-100 text-amber-800">
                <Clock className="h-6 w-6" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#8A5A44]">Pending Orders</p>
                <h4 className="text-2xl font-bold text-[#42121B]">{stats.pending_orders}</h4>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded border border-[#C5A15B]/30 bg-white p-5">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-blue-100 text-blue-800">
                <Truck className="h-6 w-6" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#8A5A44]">In Transit / Shipped</p>
                <h4 className="text-2xl font-bold text-[#42121B]">{stats.shipped_orders}</h4>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded border border-[#C5A15B]/30 bg-white p-5">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-emerald-100 text-emerald-800">
                <CheckCircle2 className="h-6 w-6" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#8A5A44]">Delivered</p>
                <h4 className="text-2xl font-bold text-[#42121B]">{stats.delivered_orders}</h4>
              </div>
            </div>
          </div>

          {/* Recent Orders Table */}
          <div className="rounded border border-[#C5A15B]/40 bg-white shadow-sm overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#C5A15B]/20 p-6">
              <h3 className="font-serif-display text-xl text-[#42121B]">Recent Customer Orders</h3>
              <Link
                to="/admin/orders"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#641B25] uppercase tracking-wider hover:underline"
              >
                <span>View All Orders</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            {stats.recent_orders.length === 0 ? (
              <div className="p-8 text-center text-sm text-[#8A5A44]">
                No orders placed yet. Orders created via storefront will appear here instantly.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FFF8EC] text-[#8A5A44] uppercase tracking-wider">
                    <tr>
                      <th className="p-4 font-semibold">Order Ref</th>
                      <th className="p-4 font-semibold">Customer</th>
                      <th className="p-4 font-semibold">Date</th>
                      <th className="p-4 font-semibold">Items</th>
                      <th className="p-4 font-semibold">Total Amount</th>
                      <th className="p-4 font-semibold">Status</th>
                      <th className="p-4 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#C5A15B]/20">
                    {stats.recent_orders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-[#FFF8EC]/40 transition">
                        <td className="p-4 font-bold text-[#641B25]">{ord.order_number}</td>
                        <td className="p-4 font-medium text-[#42121B]">{ord.customer_name}</td>
                        <td className="p-4 text-[#8A5A44]">{new Date(ord.created_at).toLocaleDateString()}</td>
                        <td className="p-4">{ord.items.length} items</td>
                        <td className="p-4 font-bold text-[#641B25]">{formatINR(ord.total_amount)}</td>
                        <td className="p-4">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-full text-[0.65rem] font-bold uppercase tracking-wider ${
                              ord.order_status === "delivered"
                                ? "bg-emerald-100 text-emerald-800"
                                : ord.order_status === "shipped"
                                ? "bg-blue-100 text-blue-800"
                                : ord.order_status === "cancelled"
                                ? "bg-red-100 text-red-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {ord.order_status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <Link
                            to={`/admin/orders/${ord.id}`}
                            className="font-semibold text-[#641B25] hover:underline"
                          >
                            Manage
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </AdminLayout>
  );
};

export default AdminDashboard;
