import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Minus, Plus, ShoppingBag, CheckCircle, ArrowLeft, Loader2, Sparkles } from "lucide-react";
import { PRODUCT_BY_ID, PRODUCTS } from "../data/products";
import { formatINR, SITE } from "../config/site";
import { useCart } from "../context/CartContext";
import { ProductCard } from "../components/ProductCard";
import { GoldDivider } from "../components/Ornaments";
import { api } from "../services/api";

const ProductDetails = () => {
  const { productId } = useParams();
  const { addToCart, openCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);

  useEffect(() => {
    setLoading(true);
    api.getProduct(productId)
      .then((data) => {
        setProduct(data);
        if (data.sizes && data.sizes.length > 0) setSelectedSize(data.sizes[0]);
        if (data.colors && data.colors.length > 0) setSelectedColor(data.colors[0]);
        setSelectedImage(0);
      })
      .catch(() => {
        const fallback = PRODUCT_BY_ID[productId] || PRODUCTS.find((p) => p.id === productId || p.slug === productId);
        setProduct(fallback || null);
        if (fallback?.sizes?.length > 0) setSelectedSize(fallback.sizes[0]);
        if (fallback?.colors?.length > 0) setSelectedColor(fallback.colors[0]);
      })
      .finally(() => setLoading(false));
  }, [productId]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#FFF8EC]">
        <Loader2 className="h-8 w-8 animate-spin text-[#641B25]" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-[#FFF8EC] text-center px-4">
        <h2 className="font-serif-display text-3xl text-[#42121B]">Product Not Found</h2>
        <p className="mt-2 text-sm text-[#8A5A44]">The diya you are looking for is no longer available.</p>
        <Link
          to="/shop"
          className="mt-6 inline-flex items-center gap-2 bg-[#641B25] px-6 py-3 text-xs font-semibold tracking-wider text-[#C5A15B] uppercase hover:bg-[#42121B]"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Collection</span>
        </Link>
      </div>
    );
  }

  const rawImages = product.images && product.images.length > 0
    ? product.images.map((img) => (typeof img === "string" ? img : img.image_url))
    : [product.image || "/images/3be7aa21a985f477_diya1.jpeg"];

  const isOutOfStock = product.stock_quantity === 0 || product.is_available === false;
  const isLimited = product.availability === "limited" || (product.stock_quantity > 0 && product.stock_quantity <= 10);

  const handleAddToCart = () => {
    addToCart(product, qty, selectedSize, selectedColor);
  };

  const handleBuyNow = () => {
    addToCart(product, qty, selectedSize, selectedColor);
    openCart();
  };

  const related = PRODUCTS.filter(
    (p) => (p.collection === product.collection || p.category_slug === product.category_slug) && p.id !== product.id
  ).slice(0, 4);

  return (
    <div className="bg-[#FFF8EC] py-12 lg:py-16" data-testid="product-details-page">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8 text-xs font-semibold tracking-wider text-[#C5A15B] uppercase">
          <Link to="/" className="hover:underline">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/shop" className="hover:underline">Shop</Link>
          <span className="mx-2">/</span>
          <span className="text-[#42121B]">{product.name}</span>
        </nav>

        {/* Product Grid */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square w-full overflow-hidden rounded bg-white shadow">
              <img
                src={rawImages[selectedImage] || rawImages[0]}
                alt={product.name}
                className="h-full w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-3 border border-[#C5A15B]/50" />
            </div>

            {/* Thumbnail row */}
            {rawImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {rawImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative h-20 w-20 overflow-hidden rounded border transition ${
                      selectedImage === idx ? "border-[#641B25] ring-2 ring-[#C5A15B]" : "border-[#C5A15B]/40 hover:opacity-80"
                    }`}
                  >
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Column */}
          <div className="flex flex-col">
            {product.badge && (
              <span className="eyebrow inline-block self-start rounded bg-[#42121B] px-3 py-1 text-[#D99A35]">
                {product.badge}
              </span>
            )}

            <h1 className="font-serif-display mt-3 text-3xl text-[#42121B] sm:text-4xl lg:text-5xl">
              {product.name}
            </h1>

            <div className="mt-4 flex items-baseline gap-4">
              <span className="text-2xl font-bold text-[#641B25]">
                {formatINR(product.price)}
              </span>
              {(product.oldPrice || product.old_price) && (
                <span className="text-base text-[#8A5A44] line-through">
                  {formatINR(product.oldPrice || product.old_price)}
                </span>
              )}
            </div>

            {/* Stock status indicator */}
            <div className="mt-3 flex items-center gap-2 text-xs">
              {isOutOfStock ? (
                <span className="font-semibold text-red-700">Currently Out of Stock</span>
              ) : isLimited ? (
                <span className="font-semibold text-[#B85C38]">
                  Only {product.stock_quantity || "a few"} left in stock — order soon!
                </span>
              ) : (
                <span className="flex items-center gap-1 font-medium text-emerald-800">
                  <CheckCircle className="h-4 w-4 text-emerald-700" />
                  In Stock & Ready for Festive Dispatch
                </span>
              )}
            </div>

            <p className="mt-6 text-sm leading-relaxed text-[#42121B]/90">
              {product.description}
            </p>

            {/* Sizes / Pack options */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mt-6">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#8A5A44] mb-2">
                  Set Size: {selectedSize}
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`rounded px-4 py-2 text-xs font-semibold uppercase tracking-wider transition ${
                        selectedSize === s
                          ? "bg-[#641B25] text-[#C5A15B] border border-[#C5A15B]"
                          : "border border-[#C5A15B]/50 bg-white text-[#42121B] hover:bg-[#C5A15B]/15"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="mt-5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#8A5A44] mb-2">
                  Colorway: {selectedColor}
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      className={`rounded px-4 py-2 text-xs font-semibold uppercase tracking-wider transition ${
                        selectedColor === c
                          ? "bg-[#641B25] text-[#C5A15B] border border-[#C5A15B]"
                          : "border border-[#C5A15B]/50 bg-white text-[#42121B] hover:bg-[#C5A15B]/15"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and Actions */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <div className="flex items-center rounded border border-[#C5A15B] bg-white">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="px-3 py-3 text-[#42121B] hover:bg-[#FFF8EC]"
                  aria-label="Decrease quantity"
                  disabled={isOutOfStock}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-4 text-sm font-semibold text-[#42121B]">{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min((product.stock_quantity || 99), q + 1))}
                  className="px-3 py-3 text-[#42121B] hover:bg-[#FFF8EC]"
                  aria-label="Increase quantity"
                  disabled={isOutOfStock}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                data-testid="product-add-to-cart-button"
                className="flex-1 min-w-[150px] flex items-center justify-center gap-2 rounded border border-[#641B25] bg-transparent py-3.5 px-6 text-xs font-semibold tracking-wider text-[#641B25] uppercase hover:bg-[#641B25]/5 disabled:opacity-50 transition"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>{isOutOfStock ? "Sold Out" : "Add to Thali"}</span>
              </button>

              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                data-testid="product-buy-now-button"
                className="flex-1 min-w-[150px] flex items-center justify-center gap-2 rounded bg-[#641B25] py-3.5 px-6 text-xs font-bold tracking-wider text-[#C5A15B] uppercase hover:bg-[#42121B] disabled:opacity-50 transition shadow"
              >
                <Sparkles className="h-4 w-4" />
                <span>{isOutOfStock ? "Unavailable" : "Buy Now"}</span>
              </button>
            </div>

            {/* Handcrafted Details Box */}
            {product.details && product.details.length > 0 && (
              <div className="mt-10 rounded border border-[#C5A15B]/40 bg-white p-6">
                <h4 className="font-serif-display text-lg text-[#42121B]">Product Highlights</h4>
                <ul className="mt-4 space-y-2 text-xs text-[#8A5A44]">
                  {product.details.map((d, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#D99A35] font-bold">•</span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-20 pt-12 border-t border-[#C5A15B]/30">
            <div className="text-center mb-10">
              <span className="eyebrow">Complementary Pieces</span>
              <h3 className="font-serif-display text-3xl text-[#42121B] mt-2">
                You May Also Cherish
              </h3>
              <GoldDivider className="mt-4" />
            </div>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
