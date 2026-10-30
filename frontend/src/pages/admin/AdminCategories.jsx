import React, { useState, useEffect } from "react";
import { 
  Tags, 
  Plus, 
  Edit2, 
  Check, 
  X, 
  AlertCircle, 
  CheckCircle,
  FolderTree,
  Package
} from "lucide-react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { api } from "../../services/api";

export const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successToast, setSuccessToast] = useState(null);

  // Modal / Form state
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    is_active: true,
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getCategories();
      setCategories(res || []);
    } catch (err) {
      setError(err.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openAddModal = () => {
    setEditingCategory(null);
    setFormData({
      name: "",
      slug: "",
      description: "",
      is_active: true,
    });
    setShowModal(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || "",
      is_active: cat.is_active !== undefined ? cat.is_active : true,
    });
    setShowModal(true);
  };

  const handleNameChange = (val) => {
    const autoSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    setFormData((prev) => ({
      ...prev,
      name: val,
      slug: !editingCategory ? autoSlug : prev.slug,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError(null);

      if (editingCategory) {
        await api.updateCategory(editingCategory.id, formData);
        setSuccessToast(`Collection "${formData.name}" updated successfully.`);
      } else {
        await api.createCategory(formData);
        setSuccessToast(`Collection "${formData.name}" created successfully.`);
      }

      setShowModal(false);
      fetchCategories();
      setTimeout(() => setSuccessToast(null), 3500);
    } catch (err) {
      setError(err.message || "Failed to save category");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout
      title="Category & Collection Management"
      subtitle="Organize festival diya collections, manage slugs, and toggle storefront categories."
    >
      {/* Action Header */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-xs text-[#8A5A44]">
          Categories define customer storefront collections and navigation filters.
        </p>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 rounded-lg bg-[#641B25] px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#FFF8EC] hover:bg-[#42121B] transition shadow-sm"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Collection</span>
        </button>
      </div>

      {/* Messages */}
      {successToast && (
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-800">
          <CheckCircle className="h-5 w-5 shrink-0 text-emerald-600" />
          <span>{successToast}</span>
        </div>
      )}

      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-xs text-red-800">
          <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full p-12 text-center text-sm text-[#8A5A44]">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-[#641B25] border-t-transparent mb-3" />
            <p>Loading categories...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="col-span-full p-12 text-center text-sm text-[#8A5A44]">
            No collections defined yet.
          </div>
        ) : (
          categories.map((cat) => (
            <div
              key={cat.id}
              className="rounded-xl border border-[#C5A15B]/30 bg-white p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-lg bg-[#FFF8EC] text-[#641B25] border border-[#C5A15B]/30">
                      <FolderTree className="h-4 w-4" />
                    </span>
                    <div>
                      <h3 className="font-serif-display text-base font-bold text-[#42121B]">
                        {cat.name}
                      </h3>
                      <span className="font-mono text-[0.7rem] text-[#8A5A44]">
                        slug: /{cat.slug}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`inline-flex px-2 py-0.5 rounded-full text-[0.65rem] font-bold uppercase tracking-wider border ${
                      cat.is_active !== false
                        ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                        : "bg-rose-50 text-rose-800 border-rose-300"
                    }`}
                  >
                    {cat.is_active !== false ? "Active" : "Disabled"}
                  </span>
                </div>

                <p className="text-xs text-[#8A5A44] line-clamp-3 mb-4">
                  {cat.description || "No description provided."}
                </p>
              </div>

              <div className="border-t border-[#C5A15B]/20 pt-3 flex items-center justify-between text-xs">
                <span className="text-[#8A5A44] flex items-center gap-1.5 font-medium">
                  <Package className="h-3.5 w-3.5" />
                  <span>{cat.product_count !== undefined ? `${cat.product_count} products` : "Collection"}</span>
                </span>

                <button
                  onClick={() => openEditModal(cat)}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded border border-[#C5A15B]/50 bg-white text-[#641B25] hover:bg-[#641B25] hover:text-[#FFF8EC] text-xs font-semibold transition"
                >
                  <Edit2 className="h-3 w-3" />
                  <span>Edit</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Category Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-[#C5A15B]/50 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#C5A15B]/20 pb-4 mb-4">
              <h3 className="font-serif-display text-lg font-bold text-[#42121B]">
                {editingCategory ? "Edit Category" : "Add New Category"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-[#8A5A44] hover:text-[#42121B]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#42121B] mb-1">
                  Collection Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Akhand Diya"
                  className="w-full rounded-lg border border-[#C5A15B]/40 px-3 py-2 text-sm text-[#42121B] focus:border-[#641B25] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#42121B] mb-1">
                  URL Slug *
                </label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="e.g. akhand-diya"
                  className="w-full font-mono rounded-lg border border-[#C5A15B]/40 px-3 py-2 text-sm text-[#42121B] focus:border-[#641B25] focus:outline-none"
                />
                <span className="text-[0.7rem] text-[#8A5A44] mt-0.5 block">
                  Used in storefront URLs: /shop/[slug]
                </span>
              </div>

              <div>
                <label className="block font-semibold text-[#42121B] mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Briefly describe this diya collection..."
                  className="w-full rounded-lg border border-[#C5A15B]/40 px-3 py-2 text-sm text-[#42121B] focus:border-[#641B25] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="cat_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="h-4 w-4 rounded border-[#C5A15B] text-[#641B25] focus:ring-[#641B25]"
                />
                <label htmlFor="cat_active" className="font-semibold text-[#42121B] cursor-pointer">
                  Display this category on customer storefront
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#C5A15B]/20">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg border border-[#C5A15B]/40 font-semibold text-[#8A5A44] hover:bg-[#FFF8EC]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-lg bg-[#641B25] font-semibold text-[#FFF8EC] hover:bg-[#42121B] disabled:opacity-50"
                >
                  {submitting ? "Saving..." : editingCategory ? "Save Changes" : "Create Collection"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
export default AdminCategories;
