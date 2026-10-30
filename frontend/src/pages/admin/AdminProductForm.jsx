import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Upload, Trash2, Plus, Loader2 } from "lucide-react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { api } from "../../services/api";
import { toast } from "sonner";

const AdminProductForm = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const isEdit = !!productId;

  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState([]);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [stockQuantity, setStockQuantity] = useState("10");
  const [isAvailable, setIsAvailable] = useState(true);
  const [badge, setBadge] = useState("");
  const [isNew, setIsNew] = useState(false);
  const [featured, setFeatured] = useState(false);
  const [details, setDetails] = useState([""]);
  const [imageUrls, setImageUrls] = useState([]);
  const [customImageUrl, setCustomImageUrl] = useState("");

  useEffect(() => {
    api.getCategories()
      .then(setCategories)
      .catch(() => {});

    if (isEdit) {
      api.getProduct(productId)
        .then((data) => {
          setName(data.name || "");
          setSlug(data.slug || "");
          setDescription(data.description || "");
          setPrice(data.price?.toString() || "");
          setOldPrice(data.old_price?.toString() || "");
          setCategoryId(data.category_id?.toString() || "");
          setStockQuantity(data.stock_quantity?.toString() || "0");
          setIsAvailable(data.is_available ?? true);
          setBadge(data.badge || "");
          setIsNew(data.is_new ?? false);
          setFeatured(data.featured ?? false);
          setDetails(data.details && data.details.length > 0 ? data.details : [""]);
          
          if (data.images && data.images.length > 0) {
            setImageUrls(data.images.map(img => typeof img === "string" ? img : img.image_url));
          } else if (data.image) {
            setImageUrls([data.image]);
          }
        })
        .catch((err) => {
          toast.error("Failed to load product for editing");
          navigate("/admin/products");
        })
        .finally(() => setLoading(false));
    }
  }, [productId, isEdit]);

  const handleNameChange = (e) => {
    const val = e.target.value;
    setName(val);
    if (!isEdit && !slug) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
    }
  };

  const handleImageFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await api.uploadImage(file);
      setImageUrls((prev) => [...prev, res.url]);
      toast.success("Image uploaded successfully");
    } catch (err) {
      toast.error(err.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleAddCustomImageUrl = () => {
    if (!customImageUrl.trim()) return;
    setImageUrls((prev) => [...prev, customImageUrl.trim()]);
    setCustomImageUrl("");
  };

  const handleRemoveImage = (index) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDetailChange = (index, value) => {
    const updated = [...details];
    updated[index] = value;
    setDetails(updated);
  };

  const handleAddDetail = () => {
    setDetails((prev) => [...prev, ""]);
  };

  const handleRemoveDetail = (index) => {
    setDetails((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim() || !description.trim() || !price) {
      toast.error("Please fill in all required fields (Name, Slug, Price, Description)");
      return;
    }

    setSubmitting(true);
    const payload = {
      name: name.trim(),
      slug: slug.trim(),
      description: description.trim(),
      price: parseFloat(price),
      old_price: oldPrice ? parseFloat(oldPrice) : null,
      category_id: categoryId ? parseInt(categoryId, 10) : null,
      stock_quantity: parseInt(stockQuantity, 10) || 0,
      is_available: isAvailable,
      badge: badge.trim() || null,
      is_new: isNew,
      featured: featured,
      details: details.filter((d) => d.trim().length > 0),
      image_urls: imageUrls,
    };

    try {
      if (isEdit) {
        await api.updateProduct(productId, payload);
        toast.success("Product updated successfully");
      } else {
        await api.createProduct(payload);
        toast.success("Product created successfully");
      }
      navigate("/admin/products");
    } catch (err) {
      toast.error(err.message || "Failed to save product");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout
      title={isEdit ? `Edit: ${name}` : "Add New Diya / Product"}
      subtitle="Fill in the product specifications, inventory, and upload photographs"
    >
      <div className="max-w-4xl space-y-6">
        <Link
          to="/admin/products"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#641B25] uppercase tracking-wider hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Products</span>
        </Link>

        {loading ? (
          <div className="py-24 text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#641B25]" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded border border-[#C5A15B]/40 shadow-sm">
            {/* Basic Info */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#42121B] mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={handleNameChange}
                  placeholder="e.g. Kundan Saffron Diya Pair"
                  className="w-full rounded border border-[#C5A15B]/40 px-3 py-2 text-sm text-[#42121B] focus:border-[#641B25] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#42121B] mb-1">
                  URL Slug *
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. kundan-saffron-pair"
                  className="w-full rounded border border-[#C5A15B]/40 px-3 py-2 text-sm text-[#42121B] focus:border-[#641B25] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#42121B] mb-1">
                  Category
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full rounded border border-[#C5A15B]/40 px-3 py-2 text-sm text-[#42121B] focus:border-[#641B25] focus:outline-none"
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#42121B] mb-1">
                  Badge (Optional)
                </label>
                <input
                  type="text"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  placeholder="e.g. Bestseller, Artisan, Heirloom"
                  className="w-full rounded border border-[#C5A15B]/40 px-3 py-2 text-sm text-[#42121B] focus:border-[#641B25] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#42121B] mb-1">
                  Selling Price (INR) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. 1299"
                  className="w-full rounded border border-[#C5A15B]/40 px-3 py-2 text-sm text-[#42121B] focus:border-[#641B25] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#42121B] mb-1">
                  Original / Strikethrough Price (INR)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={oldPrice}
                  onChange={(e) => setOldPrice(e.target.value)}
                  placeholder="e.g. 1599"
                  className="w-full rounded border border-[#C5A15B]/40 px-3 py-2 text-sm text-[#42121B] focus:border-[#641B25] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#42121B] mb-1">
                  Available Stock Quantity *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(e.target.value)}
                  className="w-full rounded border border-[#C5A15B]/40 px-3 py-2 text-sm text-[#42121B] focus:border-[#641B25] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-6 pt-5">
                <label className="flex items-center gap-2 text-xs font-medium text-[#42121B] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAvailable}
                    onChange={(e) => setIsAvailable(e.target.checked)}
                    className="accent-[#641B25] h-4 w-4"
                  />
                  <span>Is Available for Purchase</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-medium text-[#42121B] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="accent-[#641B25] h-4 w-4"
                  />
                  <span>Featured on Home</span>
                </label>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#42121B] mb-1">
                Description *
              </label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the craftsmanship, materials, warmth, and use of this diya..."
                className="w-full rounded border border-[#C5A15B]/40 px-3 py-2 text-sm text-[#42121B] focus:border-[#641B25] focus:outline-none"
              />
            </div>

            {/* Highlights / Details */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#42121B] mb-2">
                Handcrafted Highlights & Specifications
              </label>
              <div className="space-y-2">
                {details.map((d, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={d}
                      onChange={(e) => handleDetailChange(index, e.target.value)}
                      placeholder="e.g. Set of 6 handcrafted tealight diyas"
                      className="flex-1 rounded border border-[#C5A15B]/40 px-3 py-1.5 text-xs text-[#42121B] focus:border-[#641B25] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveDetail(index)}
                      className="text-[#8A5A44] hover:text-red-700 p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddDetail}
                  className="inline-flex items-center gap-1.5 text-xs text-[#641B25] font-semibold uppercase tracking-wider hover:underline pt-1"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Highlight Bullet</span>
                </button>
              </div>
            </div>

            {/* Photographs & Uploads */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#42121B] mb-2">
                Product Photographs
              </label>

              {/* Upload Box */}
              <div className="flex flex-col sm:flex-row items-center gap-4 rounded border border-dashed border-[#C5A15B] bg-[#FFF8EC]/60 p-6">
                <div className="flex-1 text-center sm:text-left">
                  <p className="text-xs font-semibold text-[#42121B]">Upload photograph from computer</p>
                  <p className="text-[0.7rem] text-[#8A5A44]">Supported: JPG, PNG, WEBP (Max 5MB)</p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer rounded bg-[#641B25] px-4 py-2 text-xs font-semibold text-[#C5A15B] uppercase hover:bg-[#42121B] transition">
                  {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  <span>{uploading ? "Uploading..." : "Choose File"}</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageFileUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Or manual URL */}
              <div className="mt-3 flex gap-2">
                <input
                  type="text"
                  value={customImageUrl}
                  onChange={(e) => setCustomImageUrl(e.target.value)}
                  placeholder="Or enter existing image URL (e.g. /images/3be7aa21a985f477_diya1.jpeg)"
                  className="flex-1 rounded border border-[#C5A15B]/40 px-3 py-1.5 text-xs text-[#42121B] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddCustomImageUrl}
                  className="rounded border border-[#C5A15B] bg-white px-3 py-1.5 text-xs font-semibold text-[#42121B] hover:bg-[#C5A15B]/20"
                >
                  Add URL
                </button>
              </div>

              {/* Image Previews */}
              {imageUrls.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {imageUrls.map((url, idx) => (
                    <div key={idx} className="relative aspect-square rounded border border-[#C5A15B]/40 overflow-hidden bg-[#FFF8EC]">
                      <img src={url} alt="" className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-2 right-2 rounded-full bg-red-800 p-1 text-white shadow hover:bg-red-900"
                        title="Remove image"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Bar */}
            <div className="pt-6 border-t border-[#C5A15B]/30 flex justify-end gap-3">
              <Link
                to="/admin/products"
                className="rounded border border-[#C5A15B]/50 px-6 py-2.5 text-xs font-semibold text-[#42121B] uppercase hover:bg-[#C5A15B]/10"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 rounded bg-[#641B25] px-8 py-2.5 text-xs font-semibold text-[#C5A15B] uppercase hover:bg-[#42121B] transition shadow disabled:opacity-50"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                <span>{isEdit ? "Update Product" : "Save Product"}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminProductForm;
