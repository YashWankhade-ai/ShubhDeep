import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Users, 
  Search, 
  Phone, 
  MapPin, 
  ShoppingBag, 
  MessageCircle, 
  ExternalLink,
  Calendar,
  X,
  CreditCard,
  UserCheck,
  TrendingUp,
  Clock
} from "lucide-react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { api } from "../../services/api";
import { formatINR } from "../../config/site";

export const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);

  // Modal / Drawer state for single customer details
  const [selectedPhone, setSelectedPhone] = useState(null);
  const [customerDetails, setCustomerDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const fetchCustomers = () => {
    setLoading(true);
    setError(null);
    api.getAdminCustomers(search.trim())
      .then(setCustomers)
      .catch((err) => setError(err.message || "Failed to load customers"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCustomers();
  }, [search]);

  const handleOpenDetails = (phone) => {
    setSelectedPhone(phone);
    setDetailsLoading(true);
    api.getAdminCustomerDetails(phone)
      .then(setCustomerDetails)
      .catch((err) => setError(err.message || "Failed to load customer details"))
      .finally(() => setDetailsLoading(false));
  };

  const handleCloseDetails = () => {
    setSelectedPhone(null);
    setCustomerDetails(null);
  };

  // Aggregated metrics
  const totalCustomers = customers.length;
  const repeatCustomers = customers.filter((c) => c.total_orders > 1).length;
  const totalCustomerSpend = customers.reduce((sum, c) => sum + parseFloat(c.total_spent || 0), 0);
  const averageLTV = totalCustomers > 0 ? totalCustomerSpend / totalCustomers : 0;

  return (
    <AdminLayout
      title="Customer Management"
      subtitle="View customer purchase history, lifetime value, and initiate direct communication."
    >
      {/* Top Overview KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
        <div className="rounded-xl border border-[#C5A15B]/30 bg-white p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#8A5A44]">
              Total Ordering Patrons
            </span>
            <div className="font-serif-display text-2xl font-bold text-[#42121B] mt-1">
              {totalCustomers}
            </div>
            <span className="text-[0.7rem] text-emerald-700 font-medium">Unique verified buyers</span>
          </div>
          <Users className="h-8 w-8 text-[#C5A15B]/70" />
        </div>

        <div className="rounded-xl border border-[#C5A15B]/30 bg-white p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#8A5A44]">
              Repeat Patrons
            </span>
            <div className="font-serif-display text-2xl font-bold text-[#641B25] mt-1">
              {repeatCustomers}
            </div>
            <span className="text-[0.7rem] text-[#8A5A44]">
              {totalCustomers > 0 ? `${Math.round((repeatCustomers / totalCustomers) * 100)}% retention rate` : "0%"}
            </span>
          </div>
          <UserCheck className="h-8 w-8 text-[#641B25]/70" />
        </div>

        <div className="rounded-xl border border-[#C5A15B]/30 bg-white p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#8A5A44]">
              Avg. Lifetime Value (LTV)
            </span>
            <div className="font-serif-display text-2xl font-bold text-[#42121B] mt-1">
              {formatINR(averageLTV)}
            </div>
            <span className="text-[0.7rem] text-emerald-700 font-medium">Per customer average spend</span>
          </div>
          <TrendingUp className="h-8 w-8 text-emerald-600/70" />
        </div>
      </div>

      {/* Search and Action Bar */}
      <div className="mb-6 flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-[#C5A15B]/30 shadow-sm">
        <div className="relative w-full md:w-96">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer name, phone, or city..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-lg border border-[#C5A15B]/40 focus:border-[#641B25] focus:outline-none focus:ring-1 focus:ring-[#641B25]"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#8A5A44]" />
        </div>

        <span className="text-xs text-[#8A5A44]">
          Showing <span className="font-semibold text-[#42121B]">{customers.length}</span> customer profiles
        </span>
      </div>

      {/* Customers Table */}
      <div className="rounded-xl border border-[#C5A15B]/30 bg-white shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-[#8A5A44]">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-[#641B25] border-t-transparent mb-3" />
            <p>Loading patrons directory...</p>
          </div>
        ) : customers.length === 0 ? (
          <div className="p-16 text-center">
            <Users className="mx-auto h-12 w-12 text-[#C5A15B]/50 mb-3" />
            <h3 className="font-serif-display text-lg font-bold text-[#42121B]">No customers found</h3>
            <p className="text-xs text-[#8A5A44] mt-1">
              Customers will appear here automatically when orders are placed.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FFF8EC] border-b border-[#C5A15B]/30 font-semibold tracking-wider uppercase text-[#8A5A44]">
                <tr>
                  <th className="py-3.5 px-4">Patron Name</th>
                  <th className="py-3.5 px-4">Phone / WhatsApp</th>
                  <th className="py-3.5 px-4">Primary Destination</th>
                  <th className="py-3.5 px-4 text-center">Orders</th>
                  <th className="py-3.5 px-4">Total Spent</th>
                  <th className="py-3.5 px-4">Last Order</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#C5A15B]/15 text-[#42121B]">
                {customers.map((c) => {
                  const cleanPhone = c.phone.replace(/\D/g, "");
                  const whatsappPhone = cleanPhone.startsWith("91") ? cleanPhone : `91${cleanPhone}`;
                  const waUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                    `Namaste ${c.name}, warm greetings from ShubhDeep Diya Store! How may we assist you today?`
                  )}`;

                  return (
                    <tr key={c.phone} className="hover:bg-[#FFF8EC]/40 transition">
                      <td className="py-3.5 px-4 font-semibold text-[#42121B]">
                        <button
                          onClick={() => handleOpenDetails(c.phone)}
                          className="hover:text-[#641B25] hover:underline text-left font-medium text-sm"
                        >
                          {c.name}
                        </button>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[#8A5A44]">
                        {c.phone}
                      </td>

                      <td className="py-3.5 px-4 text-[#8A5A44] max-w-xs truncate" title={c.address}>
                        {c.address}
                      </td>

                      <td className="py-3.5 px-4 text-center font-mono font-bold">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs ${
                          c.total_orders > 1 ? "bg-amber-100 text-amber-900 border border-amber-300" : "bg-gray-100 text-gray-800"
                        }`}>
                          {c.total_orders}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-[#641B25]">
                        {formatINR(c.total_spent)}
                      </td>

                      <td className="py-3.5 px-4 text-[#8A5A44] whitespace-nowrap">
                        {new Date(c.last_order_date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        })}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 rounded bg-emerald-600 px-2.5 py-1 text-[0.7rem] font-semibold text-white hover:bg-emerald-700 transition"
                            title="Chat on WhatsApp"
                          >
                            <MessageCircle className="h-3 w-3" />
                            <span>Chat</span>
                          </a>

                          <button
                            onClick={() => handleOpenDetails(c.phone)}
                            className="inline-flex items-center gap-1 rounded border border-[#C5A15B]/50 bg-white px-2.5 py-1 text-[0.7rem] font-semibold text-[#641B25] hover:bg-[#641B25] hover:text-[#FFF8EC] transition"
                          >
                            <span>History</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Customer Order History Modal */}
      {selectedPhone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-[#C5A15B]/50 bg-white p-6 shadow-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-[#C5A15B]/20 pb-4 mb-4">
              <div>
                <h3 className="font-serif-display text-xl font-bold text-[#42121B]">
                  {customerDetails?.name || "Customer Profile"}
                </h3>
                <span className="font-mono text-xs text-[#8A5A44]">{selectedPhone}</span>
              </div>
              <button
                onClick={handleCloseDetails}
                className="text-[#8A5A44] hover:text-[#42121B] p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {detailsLoading ? (
              <div className="p-12 text-center text-xs text-[#8A5A44]">
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-[#641B25] border-t-transparent mb-3" />
                <p>Loading patron history...</p>
              </div>
            ) : customerDetails ? (
              <div className="flex-1 overflow-y-auto space-y-5 pr-1">
                {/* Stats Bar */}
                <div className="grid grid-cols-3 gap-3 bg-[#FFF8EC] p-3.5 rounded-xl border border-[#C5A15B]/30 text-xs text-center">
                  <div>
                    <span className="text-[#8A5A44] block text-[0.7rem] uppercase">Total Orders</span>
                    <span className="font-bold text-sm text-[#42121B]">{customerDetails.total_orders}</span>
                  </div>
                  <div>
                    <span className="text-[#8A5A44] block text-[0.7rem] uppercase">Lifetime Value</span>
                    <span className="font-bold text-sm text-[#641B25]">{formatINR(customerDetails.total_spent)}</span>
                  </div>
                  <div>
                    <span className="text-[#8A5A44] block text-[0.7rem] uppercase">Average Order</span>
                    <span className="font-bold text-sm text-[#42121B]">{formatINR(customerDetails.average_order_value)}</span>
                  </div>
                </div>

                {/* Shipping address */}
                <div className="text-xs">
                  <span className="font-semibold uppercase tracking-wider text-[#8A5A44] block mb-1">
                    Delivery Address
                  </span>
                  <p className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-[#42121B]">
                    {customerDetails.primary_address}
                  </p>
                </div>

                {/* Orders Timeline */}
                <div>
                  <h4 className="font-serif-display text-base font-bold text-[#42121B] mb-3">
                    Order History ({customerDetails.orders?.length || 0})
                  </h4>

                  <div className="space-y-3">
                    {customerDetails.orders?.map((ord) => (
                      <div
                        key={ord.id}
                        className="rounded-xl border border-[#C5A15B]/30 bg-white p-4 text-xs shadow-sm flex items-center justify-between"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-[#641B25]">{ord.order_number}</span>
                            <span className="px-2 py-0.5 rounded-full text-[0.65rem] font-bold uppercase tracking-wider bg-[#FFF8EC] border border-[#C5A15B]/40 text-[#8A5A44]">
                              {ord.order_status}
                            </span>
                          </div>
                          <span className="text-[0.7rem] text-[#8A5A44] mt-1 block">
                            {new Date(ord.created_at).toLocaleString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit"
                            })} &bull; {ord.items?.length || 0} items
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="font-bold text-sm text-[#42121B] block">
                            {formatINR(ord.total_amount)}
                          </span>
                          <Link
                            to={`/admin/orders/${ord.id}`}
                            className="inline-flex items-center gap-1 text-[0.7rem] text-[#641B25] hover:underline font-semibold mt-0.5"
                          >
                            <span>View Order</span>
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
export default AdminCustomers;
