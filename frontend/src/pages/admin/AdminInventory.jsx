import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Warehouse, 
  Search, 
  AlertTriangle, 
  CheckCircle, 
  Save, 
  ExternalLink, 
  PackageX,
  PackageCheck,
  RefreshCw
} from "lucide-react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { api } from "../../services/api";

export const AdminInventory = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  
  // Track modified stocks: { [productId]: newStockNumber }
  const [stockChanges, setStockChanges] = useState({});
  const [savingId, setSavingId] = useState(null);
  const [successToast, setSuccessToast] = useState(null);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getInventory();
      setItems(res || []);
      setStockChanges({});
    } catch (err) {
      setError(err.message || "Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleStockInputChange = (id, value) => {
    const num = parseInt(value, 10);
    setStockChanges((prev) => ({
      ...prev,
      [id]: isNaN(num) || num < 0 ? 0 : num,
    }));
  };

  const handleQuickSave = async (item) => {
    const newStock = stockChanges[item.id] !== undefined ? stockChanges[item.id] : item.stock_quantity;
    try {
      setSavingId(item.id);
      setError(null);
      await api.updateInventory(item.id, newStock);
      setItems((prev) =>
        prev.map((p) =>
          p.id === item.id
            ? { ...p, stock_quantity: newStock, is_available: newStock > 0 }
            : p
        )
      );
      // Remove from pending changes
      setStockChanges((prev) => {
        const copy = { ...prev };
        delete copy[item.id];
        return copy;
      });
      setSuccessToast(`Stock for "${item.name}" updated to ${newStock}.`);
      setTimeout(() => setSuccessToast(null), 3000);
    } catch (err) {
      setError(err.message || "Failed to update stock");
    } finally {
      setSavingId(null);
    }
  };

  const handleToggleAvailability = async (item) => {
    try {
      setSavingId(item.id);
      setError(null);
      const nextAvailable = !item.is_available;
      await api.updateInventory(item.id, item.stock_quantity, nextAvailable);
      setItems((prev) =>
        prev.map((p) =>
          p.id === item.id ? { ...p, is_available: nextAvailable } : p
        )
      );
      setSuccessToast(`Updated availability for "${item.name}".`);
      setTimeout(() => setSuccessToast(null), 3000);
    } catch (err) {
      setError(err.message || "Failed to update availability");
    } finally {
      setSavingId(null);
    }
  };

  // Filter items by search
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    (item.category_name && item.category_name.toLowerCase().includes(search.toLowerCase()))
  );

  const outOfStockCount = items.filter((p) => p.stock_quantity === 0).length;
  const lowStockCount = items.filter((p) => p.stock_quantity > 0 && p.stock_quantity <= 10).length;

  return (
    <AdminLayout
      title="Inventory Management"
      subtitle="Monitor stock levels, set instant quantity changes, and prevent overselling."
    >
      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="rounded-xl border border-[#C5A15B]/30 bg-white p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#8A5A44]">Total Products</span>
            <div className="font-serif-display text-2xl font-bold text-[#42121B] mt-1">{items.length}</div>
          </div>
          <Warehouse className="h-8 w-8 text-[#C5A15B]/70" />
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-800">Low Stock (&le; 10 units)</span>
            <div className="font-serif-display text-2xl font-bold text-amber-900 mt-1">{lowStockCount}</div>
          </div>
          <AlertTriangle className="h-8 w-8 text-amber-500" />
        </div>

        <div className="rounded-xl border border-rose-200 bg-rose-50/60 p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-800">Out of Stock</span>
            <div className="font-serif-display text-2xl font-bold text-rose-900 mt-1">{outOfStockCount}</div>
          </div>
          <PackageX className="h-8 w-8 text-rose-500" />
        </div>
      </div>

      {/* Action bar */}
      <div className="mb-6 flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-[#C5A15B]/30 shadow-sm">
        <div className="relative w-full md:w-96">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search inventory by product or category..."
            className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-[#C5A15B]/40 focus:border-[#641B25] focus:outline-none focus:ring-1 focus:ring-[#641B25]"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#8A5A44]" />
        </div>

        <button
          onClick={fetchInventory}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#C5A15B]/50 bg-white text-[#641B25] hover:bg-[#FFF8EC] text-xs font-semibold transition"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Refresh Stock</span>
        </button>
      </div>

      {/* Feedback messages */}
      {successToast && (
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-800">
          <CheckCircle className="h-5 w-5 shrink-0 text-emerald-600" />
          <span>{successToast}</span>
        </div>
      )}

      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-xs text-red-800">
          <AlertTriangle className="h-5 w-5 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Inventory Table */}
      <div className="rounded-xl border border-[#C5A15B]/30 bg-white shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-sm text-[#8A5A44]">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-[#641B25] border-t-transparent mb-3" />
            <p>Loading inventory balances...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="p-12 text-center text-sm text-[#8A5A44]">
            No inventory items matching your search.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FFF8EC] border-b border-[#C5A15B]/30 font-semibold tracking-wider uppercase text-[#8A5A44]">
                <tr>
                  <th className="py-3.5 px-4">Product</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Current Stock</th>
                  <th className="py-3.5 px-4">Quick Update</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#C5A15B]/15 text-[#42121B]">
                {filteredItems.map((item) => {
                  const pendingValue = stockChanges[item.id];
                  const displayStock = pendingValue !== undefined ? pendingValue : item.stock_quantity;
                  const isDirty = pendingValue !== undefined && pendingValue !== item.stock_quantity;
                  const isLow = item.stock_quantity > 0 && item.stock_quantity <= 10;
                  const isOut = item.stock_quantity === 0;

                  return (
                    <tr key={item.id} className="hover:bg-[#FFF8EC]/40 transition">
                      <td className="py-3.5 px-4 font-medium text-[#42121B] flex items-center gap-3">
                        {item.thumbnail ? (
                          <img
                            src={item.thumbnail}
                            alt={item.name}
                            className="h-10 w-10 rounded-md object-cover border border-[#C5A15B]/30 shrink-0"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-md bg-[#FFF8EC] border border-[#C5A15B]/30 flex items-center justify-center shrink-0">
                            <Warehouse className="h-5 w-5 text-[#C5A15B]" />
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-sm">{item.name}</div>
                          <span className="text-[0.7rem] text-[#8A5A44] font-mono">ID: {item.id}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-[#8A5A44]">
                        {item.category_name || "Uncategorized"}
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-[#641B25]">
                        ₹{parseFloat(item.price).toFixed(2)}
                      </td>

                      <td className="py-3.5 px-4">
                        {isOut ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[0.7rem] font-bold uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-300">
                            Out of Stock
                          </span>
                        ) : isLow ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[0.7rem] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-300">
                            Low: {item.stock_quantity} left
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[0.7rem] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                            In Stock
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-sm">
                        {item.stock_quantity}
                      </td>

                      {/* Quick stock input */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            value={displayStock}
                            onChange={(e) => handleStockInputChange(item.id, e.target.value)}
                            className={`w-20 rounded border px-2.5 py-1 text-xs font-mono font-medium focus:outline-none ${
                              isDirty
                                ? "border-amber-500 bg-amber-50/50"
                                : "border-[#C5A15B]/40 bg-white"
                            }`}
                          />
                          {isDirty && (
                            <button
                              disabled={savingId === item.id}
                              onClick={() => handleQuickSave(item)}
                              className="inline-flex items-center gap-1 rounded bg-[#641B25] px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-wider text-[#FFF8EC] hover:bg-[#42121B] transition"
                            >
                              <Save className="h-3 w-3" />
                              <span>Save</span>
                            </button>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleToggleAvailability(item)}
                            disabled={savingId === item.id}
                            className={`px-2.5 py-1 rounded text-[0.7rem] font-semibold uppercase tracking-wider border transition ${
                              item.is_available
                                ? "border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-rose-50 hover:text-rose-800 hover:border-rose-300"
                                : "border-rose-300 bg-rose-50 text-rose-800 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300"
                            }`}
                            title="Toggle whether customer can purchase this item"
                          >
                            {item.is_available ? "Enabled" : "Disabled"}
                          </button>

                          <Link
                            to={`/admin/products/edit/${item.id}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-[#C5A15B]/40 bg-white text-[#8A5A44] hover:text-[#641B25] text-[0.7rem] font-semibold"
                          >
                            <span>Edit</span>
                            <ExternalLink className="h-3 w-3" />
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
      </div>
    </AdminLayout>
  );
};
export default AdminInventory;
