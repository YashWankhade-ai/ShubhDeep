import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Edit, Trash2, Eye, Loader2, Flame, Sparkles } from "lucide-react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { api } from "../../services/api";
import { formatINR } from "../../config/site";
import { toast } from "sonner";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchProducts = () => {
    setLoading(true);
    api.getAdminProducts({
      search: search || undefined,
      category: category || undefined,
      page,
      page_size: 20
    })
      .then((data) => {
        setProducts(data.items);
        setTotal(data.total);
      })
      .catch((err) => toast.error(err.message || "Failed to load products"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    api.getCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [search, category, page]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await api.deleteProduct(id);
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (err) {
      toast.error(err.message || "Failed to delete product");
    }
  };

  const handleSetDeal = async (product) => {
    try {
      await api.setDealOfTheDay(product.id);
      toast.success(`"${product.name}" is now the active Deal of the Day!`);
      fetchProducts();
    } catch (err) {
      toast.error(err.message || "Failed to set Deal of the Day");
    }
  };

  return (
    <AdminLayout
      title="Product Management"
      subtitle="Create, update prices, inventory stock and photographs"
    >
      <div className="space-y-6">
        {/* Top actions bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-1 items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A5A44]" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search products..."
                className="w-full rounded border border-[#C5A15B]/40 bg-white pl-9 pr-4 py-2 text-xs text-[#42121B] focus:border-[#641B25] focus:outline-none"
              />
            </div>

            <select
              value={category}
              onChange={(e) => { setCategory(e.target.value); setPage(1); }}
              className="rounded border border-[#C5A15B]/40 bg-white px-3 py-2 text-xs font-medium text-[#42121B] focus:outline-none"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <Link
            to="/admin/products/new"
            className="flex items-center gap-2 rounded bg-[#641B25] px-5 py-2.5 text-xs font-semibold tracking-wider text-[#C5A15B] uppercase hover:bg-[#42121B] transition shadow"
          >
            <Plus className="h-4 w-4" />
            <span>Add Product</span>
          </Link>
        </div>

        {/* Products Table */}
        <div className="rounded border border-[#C5A15B]/40 bg-white shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-24 text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#641B25]" />
              <p className="mt-3 text-xs tracking-wider uppercase text-[#8A5A44]">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="p-12 text-center text-sm text-[#8A5A44]">
              No products found. Click "Add Product" to create one.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FFF8EC] text-[#8A5A44] uppercase tracking-wider">
                  <tr>
                    <th className="p-4 font-semibold">Image</th>
                    <th className="p-4 font-semibold">Product Name</th>
                    <th className="p-4 font-semibold">Category</th>
                    <th className="p-4 font-semibold">Price</th>
                    <th className="p-4 font-semibold">Stock</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#C5A15B]/20">
                  {products.map((p) => {
                    const thumb = p.images && p.images.length > 0 ? p.images[0].image_url : null;
                    return (
                      <tr key={p.id} className="hover:bg-[#FFF8EC]/40 transition">
                        <td className="p-4">
                          {thumb ? (
                            <img
                              src={thumb}
                              alt={p.name}
                              className="h-12 w-12 rounded border border-[#C5A15B]/40 object-cover"
                            />
                          ) : (
                            <div className="h-12 w-12 rounded border border-dashed border-[#C5A15B]/40 bg-[#FFF8EC] grid place-items-center text-[0.6rem] text-[#8A5A44]">
                              No Img
                            </div>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-[#42121B] block">{p.name}</span>
                            {(p.is_deal || p.badge === "Deal of the Day") && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.6rem] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 shrink-0">
                                <Flame className="h-3 w-3 text-amber-600 fill-amber-500" />
                                <span>Deal</span>
                              </span>
                            )}
                          </div>
                          <span className="text-[0.68rem] text-[#8A5A44]">{p.slug}</span>
                        </td>
                        <td className="p-4 text-[#8A5A44]">{p.category_name || "Uncategorized"}</td>
                        <td className="p-4 font-bold text-[#641B25]">{formatINR(p.price)}</td>
                        <td className="p-4">
                          <span className={`font-semibold ${p.stock_quantity <= 10 ? "text-amber-700 font-bold" : "text-[#42121B]"}`}>
                            {p.stock_quantity}
                          </span>
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[0.65rem] font-bold uppercase tracking-wider ${
                              p.is_available && p.stock_quantity > 0
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {p.is_available && p.stock_quantity > 0 ? "Active" : "Unavailable"}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleSetDeal(p)}
                              className={`p-1 transition ${
                                p.is_deal || p.badge === "Deal of the Day"
                                  ? "text-amber-600 hover:text-amber-700"
                                  : "text-[#8A5A44] hover:text-amber-600"
                              }`}
                              title={p.is_deal ? "Active Deal of the Day" : "Set as Deal of the Day"}
                            >
                              <Flame className={`h-4 w-4 ${p.is_deal ? "fill-amber-500" : ""}`} />
                            </button>
                            <Link
                              to={`/product/${p.slug}`}
                              target="_blank"
                              className="p-1 text-[#8A5A44] hover:text-[#641B25]"
                              title="View Public Page"
                            >
                              <Eye className="h-4 w-4" />
                            </Link>
                            <Link
                              to={`/admin/products/edit/${p.id}`}
                              className="p-1 text-[#8A5A44] hover:text-[#641B25]"
                              title="Edit Product"
                            >
                              <Edit className="h-4 w-4" />
                            </Link>
                            <button
                              onClick={() => handleDelete(p.id, p.name)}
                              className="p-1 text-[#8A5A44] hover:text-red-700"
                              title="Delete Product"
                            >
                              <Trash2 className="h-4 w-4" />
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
      </div>
    </AdminLayout>
  );
};

export default AdminProducts;
