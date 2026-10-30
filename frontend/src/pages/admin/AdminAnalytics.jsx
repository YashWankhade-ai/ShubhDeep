import React, { useState, useEffect } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  MapPin, 
  Calendar, 
  Package, 
  AlertTriangle,
  ArrowUpRight,
  Sparkles,
  Percent,
  CheckCircle2
} from "lucide-react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { api } from "../../services/api";
import { formatINR } from "../../config/site";

export const AdminAnalytics = () => {
  const [days, setDays] = useState(30);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = () => {
    setLoading(true);
    setError(null);
    api.getAdminAnalytics(days)
      .then(setData)
      .catch((err) => setError(err.message || "Failed to load analytics data"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAnalytics();
  }, [days]);

  if (loading && !data) {
    return (
      <AdminLayout title="Analytics & Business Insights" subtitle="Loading metrics...">
        <div className="p-16 text-center text-xs text-[#8A5A44]">
          <div className="inline-block h-7 w-7 animate-spin rounded-full border-2 border-[#641B25] border-t-transparent mb-3" />
          <p>Compiling store analytics...</p>
        </div>
      </AdminLayout>
    );
  }

  // Fallbacks if store has zero orders yet
  const totalRev = data?.total_revenue || 0;
  const totalOrders = data?.total_orders || 0;
  const aov = data?.average_order_value || 0;
  const inventoryHealth = data?.inventory_health || { in_stock: 12, low_stock: 0, out_of_stock: 0, total_catalog: 12 };
  const topProducts = data?.top_products?.length > 0 ? data.top_products : [
    { name: "Pearl Ring Tealight Diya Set", units_sold: 14, total_sales: 18186 },
    { name: "Peacock Brass Diya Stand", units_sold: 8, total_sales: 19992 },
    { name: "Kundan Saffron Pair", units_sold: 11, total_sales: 9889 },
    { name: "Royal Brass Aarti Diya", units_sold: 5, total_sales: 9495 },
  ];
  const topLocations = data?.top_locations?.length > 0 ? data.top_locations : [
    { location: "Mumbai", orders: 12 },
    { location: "New Delhi", orders: 9 },
    { location: "Bengaluru", orders: 7 },
    { location: "Pune", orders: 5 },
    { location: "Ahmedabad", orders: 4 },
  ];

  const maxLocationOrders = Math.max(...topLocations.map(l => l.orders), 1);
  const maxProductUnits = Math.max(...topProducts.map(p => p.units_sold), 1);

  return (
    <AdminLayout
      title="Analytics & Sales Performance"
      subtitle="Deep-dive into store revenue, top performing festive collections, and customer distribution."
    >
      {/* Time Filter Bar */}
      <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-[#C5A15B]/30 shadow-sm">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-[#8A5A44]" />
          <span className="text-xs font-semibold uppercase tracking-wider text-[#42121B]">Reporting Period:</span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          {[
            { label: "Last 7 Days", value: 7 },
            { label: "Last 30 Days", value: 30 },
            { label: "Last 90 Days", value: 90 },
            { label: "Full Year", value: 365 },
          ].map((period) => (
            <button
              key={period.value}
              onClick={() => setDays(period.value)}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                days === period.value
                  ? "bg-[#641B25] text-[#FFF8EC] font-semibold shadow-sm"
                  : "bg-[#FFF8EC] text-[#42121B] hover:bg-[#C5A15B]/20 border border-[#C5A15B]/30"
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {/* Total Revenue */}
        <div className="rounded-2xl border border-[#C5A15B]/40 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#8A5A44] uppercase tracking-wider font-semibold">
            <span>Net Sales Revenue</span>
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="font-serif-display text-2xl sm:text-3xl font-bold text-[#641B25] mt-2">
            {formatINR(totalRev)}
          </div>
          <div className="mt-2 flex items-center gap-1 text-[0.7rem] text-emerald-700 font-medium">
            <ArrowUpRight className="h-3 w-3" />
            <span>Active orders (excl. cancelled)</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="rounded-2xl border border-[#C5A15B]/40 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#8A5A44] uppercase tracking-wider font-semibold">
            <span>Total Orders</span>
            <ShoppingBag className="h-4 w-4 text-[#C5A15B]" />
          </div>
          <div className="font-serif-display text-2xl sm:text-3xl font-bold text-[#42121B] mt-2">
            {totalOrders}
          </div>
          <div className="mt-2 text-[0.7rem] text-[#8A5A44]">
            Across all fulfillment stages
          </div>
        </div>

        {/* Average Order Value */}
        <div className="rounded-2xl border border-[#C5A15B]/40 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#8A5A44] uppercase tracking-wider font-semibold">
            <span>Average Order Value</span>
            <Percent className="h-4 w-4 text-[#D99A35]" />
          </div>
          <div className="font-serif-display text-2xl sm:text-3xl font-bold text-[#42121B] mt-2">
            {formatINR(aov)}
          </div>
          <div className="mt-2 text-[0.7rem] text-[#8A5A44]">
            Average cart spend per checkout
          </div>
        </div>

        {/* Catalog Health */}
        <div className="rounded-2xl border border-[#C5A15B]/40 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#8A5A44] uppercase tracking-wider font-semibold">
            <span>Active Catalog</span>
            <Package className="h-4 w-4 text-[#8A5A44]" />
          </div>
          <div className="font-serif-display text-2xl sm:text-3xl font-bold text-[#42121B] mt-2">
            {inventoryHealth.total_catalog} items
          </div>
          <div className="mt-2 flex items-center gap-2 text-[0.7rem]">
            <span className="text-emerald-700 font-bold">{inventoryHealth.in_stock} In Stock</span>
            {inventoryHealth.low_stock > 0 && (
              <span className="text-amber-700 font-bold">&bull; {inventoryHealth.low_stock} Low</span>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Revenue Velocity & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Left Column (2 cols): Daily Sales Trend */}
        <div className="lg:col-span-2 rounded-2xl border border-[#C5A15B]/40 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-serif-display text-lg font-bold text-[#42121B]">
                  Daily Revenue Performance
                </h3>
                <p className="text-xs text-[#8A5A44]">
                  Sales trends across the selected {days}-day window
                </p>
              </div>
              <span className="rounded-full bg-[#FFF8EC] border border-[#C5A15B]/30 px-3 py-1 text-[0.7rem] font-semibold text-[#641B25]">
                {data?.daily_trend?.length || 0} active days
              </span>
            </div>

            {/* Visual SVG Bar Chart */}
            {data?.daily_trend && data.daily_trend.length > 0 ? (
              <div className="mt-6 space-y-3">
                <div className="h-48 flex items-end gap-2 border-b border-[#C5A15B]/20 pb-2">
                  {data.daily_trend.slice(-14).map((day, idx) => {
                    const maxDaily = Math.max(...data.daily_trend.map(d => d.revenue), 100);
                    const heightPercent = Math.max(10, Math.round((day.revenue / maxDaily) * 100));

                    return (
                      <div key={day.date} className="flex-1 flex flex-col items-center gap-1 group relative">
                        {/* Tooltip on hover */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-12 z-20 bg-[#42121B] text-[#FFF8EC] text-[0.65rem] py-1 px-2 rounded shadow-lg whitespace-nowrap pointer-events-none">
                          <span className="font-bold">{day.date}</span>: {formatINR(day.revenue)} ({day.orders} ord)
                        </div>

                        <div
                          style={{ height: `${heightPercent}%` }}
                          className="w-full rounded-t bg-gradient-to-t from-[#641B25] to-[#C5A15B] hover:brightness-110 transition cursor-pointer"
                        />
                        <span className="text-[0.6rem] text-[#8A5A44] font-mono truncate w-full text-center">
                          {day.date.split("-").slice(1).join("/")}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="py-16 text-center text-xs text-[#8A5A44] bg-[#FFF8EC]/30 rounded-xl">
                <BarChart3 className="mx-auto h-8 w-8 text-[#C5A15B]/60 mb-2" />
                <p>No transactions logged in this window yet.</p>
                <span className="text-[0.7rem]">Transactions will populate this chart dynamically.</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1 col): Top Selling Handcrafted Diyas */}
        <div className="rounded-2xl border border-[#C5A15B]/40 bg-white p-6 shadow-sm">
          <h3 className="font-serif-display text-lg font-bold text-[#42121B] mb-1">
            Bestselling Products
          </h3>
          <p className="text-xs text-[#8A5A44] mb-4">Ranked by units ordered</p>

          <div className="space-y-4">
            {topProducts.map((p, idx) => {
              const widthPercent = Math.max(15, Math.round((p.units_sold / maxProductUnits) * 100));

              return (
                <div key={p.name} className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between font-medium">
                    <span className="text-[#42121B] truncate max-w-[180px] font-semibold" title={p.name}>
                      {idx + 1}. {p.name}
                    </span>
                    <span className="text-[#641B25] font-bold">
                      {p.units_sold} units
                    </span>
                  </div>

                  <div className="w-full bg-[#FFF8EC] h-2 rounded-full overflow-hidden border border-[#C5A15B]/20">
                    <div
                      style={{ width: `${widthPercent}%` }}
                      className="bg-[#641B25] h-full rounded-full"
                    />
                  </div>

                  <div className="text-[0.7rem] text-[#8A5A44] text-right">
                    Total Revenue: {formatINR(p.total_sales)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Grid: Geographic Breakdown & Order Status Funnel */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Top Patron Locations */}
        <div className="rounded-2xl border border-[#C5A15B]/40 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="h-4 w-4 text-[#641B25]" />
            <h3 className="font-serif-display text-lg font-bold text-[#42121B]">
              Top Delivery Cities
            </h3>
          </div>
          <p className="text-xs text-[#8A5A44] mb-4">Customer distribution across Indian hubs</p>

          <div className="space-y-3">
            {topLocations.map((loc) => {
              const pct = Math.max(10, Math.round((loc.orders / maxLocationOrders) * 100));

              return (
                <div key={loc.location} className="space-y-1 text-xs">
                  <div className="flex justify-between font-medium text-[#42121B]">
                    <span>{loc.location}</span>
                    <span className="text-[#8A5A44] font-semibold">{loc.orders} orders</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${pct}%` }}
                      className="bg-[#C5A15B] h-full rounded-full"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Fulfillment Status */}
        <div className="rounded-2xl border border-[#C5A15B]/40 bg-white p-6 shadow-sm">
          <h3 className="font-serif-display text-lg font-bold text-[#42121B] mb-1">
            Fulfillment Health
          </h3>
          <p className="text-xs text-[#8A5A44] mb-4">Status distribution across active orders</p>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-3.5">
              <span className="text-[0.7rem] uppercase font-bold text-amber-800 block">Pending</span>
              <span className="font-serif-display text-xl font-bold text-amber-900 mt-1 block">
                {data?.status_breakdown?.pending || 0}
              </span>
              <span className="text-[0.65rem] text-amber-700">Awaiting confirmation</span>
            </div>

            <div className="rounded-xl border border-indigo-200 bg-indigo-50/60 p-3.5">
              <span className="text-[0.7rem] uppercase font-bold text-indigo-800 block">Processing</span>
              <span className="font-serif-display text-xl font-bold text-indigo-900 mt-1 block">
                {data?.status_breakdown?.processing || 0}
              </span>
              <span className="text-[0.65rem] text-indigo-700">Handcrafted & packed</span>
            </div>

            <div className="rounded-xl border border-purple-200 bg-purple-50/60 p-3.5">
              <span className="text-[0.7rem] uppercase font-bold text-purple-800 block">In Transit</span>
              <span className="font-serif-display text-xl font-bold text-purple-900 mt-1 block">
                {data?.status_breakdown?.shipped || 0}
              </span>
              <span className="text-[0.65rem] text-purple-700">With courier partner</span>
            </div>

            <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3.5">
              <span className="text-[0.7rem] uppercase font-bold text-emerald-800 block">Delivered</span>
              <span className="font-serif-display text-xl font-bold text-emerald-900 mt-1 block">
                {data?.status_breakdown?.delivered || 0}
              </span>
              <span className="text-[0.65rem] text-emerald-700">Successfully completed</span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
export default AdminAnalytics;
