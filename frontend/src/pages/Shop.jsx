import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  Search, 
  SlidersHorizontal, 
  Loader2, 
  X, 
  Check, 
  Sparkles, 
  Flame, 
  RotateCcw,
  Tag
} from "lucide-react";
import { COLLECTIONS, COLLECTION_BY_ID, PRODUCTS } from "../data/products";
import { ProductCard } from "../components/ProductCard";
import { api } from "../services/api";
import { formatINR } from "../config/site";

const SORT_OPTIONS = [
  { value: "featured", label: "Featured & Best Rated" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest Festive Arrivals" },
];

const PRICE_PRESETS = [
  { label: "All Prices", min: null, max: null },
  { label: "Under ₹500", min: 0, max: 500 },
  { label: "₹500 - ₹1,000", min: 500, max: 1000 },
  { label: "₹1,000 - ₹2,000", min: 1000, max: 2000 },
  { label: "Above ₹2,000", min: 2000, max: null },
];

export const Shop = () => {
  const { collectionId } = useParams();
  const [products, setProducts] = useState(PRODUCTS);
  const [categories, setCategories] = useState(COLLECTIONS);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState(collectionId || "all");
  const [selectedPricePreset, setSelectedPricePreset] = useState("All Prices");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [onlyDeals, setOnlyDeals] = useState(false);
  const [sort, setSort] = useState("featured");
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  useEffect(() => {
    if (collectionId) {
      setCategory(collectionId);
    } else {
      setCategory("all");
    }
  }, [collectionId]);

  // Fetch from backend
  const fetchProducts = () => {
    setLoading(true);

    let queryMin = minPrice !== "" ? Number(minPrice) : undefined;
    let queryMax = maxPrice !== "" ? Number(maxPrice) : undefined;

    api.getProducts({
      category: category === "all" ? undefined : category,
      search: searchQuery || undefined,
      min_price: queryMin,
      max_price: queryMax,
      in_stock_only: onlyInStock ? true : undefined,
      is_deal: onlyDeals ? true : undefined,
      sort_by: sort,
      page_size: 100,
    })
      .then((res) => {
        if (res && res.items) {
          setProducts(res.items);
        }
      })
      .catch((err) => {
        console.warn("Backend error, using fallback filter:", err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, [category, searchQuery, sort, onlyInStock, onlyDeals, minPrice, maxPrice]);

  const handlePricePreset = (preset) => {
    setSelectedPricePreset(preset.label);
    setMinPrice(preset.min !== null ? String(preset.min) : "");
    setMaxPrice(preset.max !== null ? String(preset.max) : "");
  };

  const handleResetFilters = () => {
    setCategory("all");
    setSearchQuery("");
    setSelectedPricePreset("All Prices");
    setMinPrice("");
    setMaxPrice("");
    setOnlyInStock(false);
    setOnlyDeals(false);
    setSort("featured");
  };

  const hasActiveFilters = 
    category !== "all" || 
    searchQuery.trim() !== "" || 
    selectedPricePreset !== "All Prices" || 
    onlyInStock || 
    onlyDeals || 
    sort !== "featured";

  const activeCollection = COLLECTION_BY_ID[category] || categories.find((c) => c.id === category || c.slug === category);

  return (
    <div className="bg-[#FFF8EC] min-h-screen" data-testid="shop-page">
      {/* Header Banner */}
      <section className="relative overflow-hidden bg-[#641B25] py-14 text-[#FFF8EC] lg:py-18 mandala-bg border-b border-[#C5A15B]/30">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <nav className="mb-3 text-xs font-semibold tracking-wider text-[#C5A15B] uppercase">
            <Link to="/" className="hover:underline">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/shop" className="hover:underline">Shop</Link>
            {activeCollection && (
              <>
                <span className="mx-2">/</span>
                <span className="text-[#FFF8EC]">{activeCollection.title || activeCollection.name}</span>
              </>
            )}
          </nav>

          <h1 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#FFF8EC]">
            {activeCollection ? (activeCollection.title || activeCollection.name) : "Traditional Indian Diya Collection"}
          </h1>
          <p className="mt-2.5 max-w-2xl text-xs sm:text-sm text-[#FFF8EC]/85 leading-relaxed">
            {activeCollection
              ? activeCollection.description
              : "Explore authentic handcrafted terracotta, brass, kundan, pearl, and decorative tealight diyas created by master artisans across India."}
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        {/* Category Carousel Pills */}
        <div className="flex items-center gap-2 border-b border-[#C5A15B]/25 pb-4 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setCategory("all")}
            className={`rounded-full px-5 py-2 text-xs font-semibold tracking-wider uppercase transition whitespace-nowrap ${
              category === "all"
                ? "bg-[#641B25] text-[#C5A15B] shadow-sm"
                : "bg-white text-[#42121B] border border-[#C5A15B]/30 hover:bg-[#FFF8EC]"
            }`}
          >
            All Collections
          </button>
          {COLLECTIONS.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              className={`rounded-full px-5 py-2 text-xs font-semibold tracking-wider uppercase transition whitespace-nowrap ${
                category === c.id
                  ? "bg-[#641B25] text-[#C5A15B] shadow-sm"
                  : "bg-white text-[#42121B] border border-[#C5A15B]/30 hover:bg-[#FFF8EC]"
              }`}
            >
              {c.title}
            </button>
          ))}
        </div>

        {/* Filter & Search Toolbar */}
        <div className="mt-6 rounded-2xl border border-[#C5A15B]/40 bg-white p-4 sm:p-5 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A5A44]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search diyas, brass stands, hampers..."
                className="w-full rounded-xl border border-[#C5A15B]/40 bg-[#FFF8EC]/40 pl-9 pr-4 py-2.5 text-xs text-[#42121B] focus:border-[#641B25] focus:outline-none focus:ring-1 focus:ring-[#641B25]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A5A44] hover:text-[#42121B]"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Quick Filters: In Stock, Deals, Sort */}
            <div className="flex flex-wrap items-center justify-between md:justify-end gap-3 w-full md:w-auto text-xs">
              {/* Deals Only Toggle */}
              <button
                onClick={() => setOnlyDeals(!onlyDeals)}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-semibold uppercase tracking-wider transition ${
                  onlyDeals
                    ? "bg-[#641B25] text-[#C5A15B] border-[#641B25]"
                    : "border-[#C5A15B]/40 bg-white text-[#42121B] hover:bg-[#FFF8EC]"
                }`}
              >
                <Flame className={`h-3.5 w-3.5 ${onlyDeals ? "text-[#D99A35]" : "text-[#8A5A44]"}`} />
                <span>Deals & Offers</span>
              </button>

              {/* In Stock Toggle */}
              <button
                onClick={() => setOnlyInStock(!onlyInStock)}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-semibold uppercase tracking-wider transition ${
                  onlyInStock
                    ? "bg-emerald-800 text-white border-emerald-800"
                    : "border-[#C5A15B]/40 bg-white text-[#42121B] hover:bg-[#FFF8EC]"
                }`}
              >
                <Check className="h-3.5 w-3.5" />
                <span>In Stock Only</span>
              </button>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-[#8A5A44] font-medium hidden sm:inline">Sort:</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="rounded-lg border border-[#C5A15B]/40 bg-[#FFF8EC] px-3 py-2 text-xs font-medium text-[#42121B] focus:border-[#641B25] focus:outline-none"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Price Range Presets Bar */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#C5A15B]/20 text-xs">
            <span className="text-[#8A5A44] font-semibold uppercase tracking-wider text-[0.7rem] mr-1">
              Price Range:
            </span>
            {PRICE_PRESETS.map((preset) => (
              <button
                key={preset.label}
                onClick={() => handlePricePreset(preset)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                  selectedPricePreset === preset.label
                    ? "bg-[#641B25] text-[#FFF8EC]"
                    : "bg-[#FFF8EC] text-[#42121B] hover:bg-[#C5A15B]/20 border border-[#C5A15B]/30"
                }`}
              >
                {preset.label}
              </button>
            ))}

            {/* Custom Min / Max inputs */}
            <div className="flex items-center gap-1.5 ml-auto">
              <span className="text-[0.7rem] text-[#8A5A44]">Custom: ₹</span>
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => {
                  setMinPrice(e.target.value);
                  setSelectedPricePreset("Custom");
                }}
                className="w-16 rounded border border-[#C5A15B]/40 bg-white px-2 py-1 text-xs text-[#42121B] focus:outline-none"
              />
              <span className="text-gray-400">-</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => {
                  setMaxPrice(e.target.value);
                  setSelectedPricePreset("Custom");
                }}
                className="w-16 rounded border border-[#C5A15B]/40 bg-white px-2 py-1 text-xs text-[#42121B] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Results Info & Active Filter Badges */}
        <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="text-[#8A5A44]">
            Showing <span className="font-bold text-[#42121B]">{products.length}</span> handcrafted items
            {activeCollection && (
              <span> in <span className="font-semibold text-[#641B25]">{activeCollection.title || activeCollection.name}</span></span>
            )}
          </div>

          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#641B25] hover:text-[#42121B] transition underline underline-offset-4"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Clear All Filters</span>
            </button>
          )}
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="py-24 text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#641B25]" />
            <p className="mt-3 text-xs tracking-wider uppercase text-[#8A5A44] font-medium">
              Fetching artisan diya catalog...
            </p>
          </div>
        ) : products.length === 0 ? (
          <div className="py-20 text-center rounded-2xl border border-[#C5A15B]/30 bg-white p-8 mt-6">
            <div className="h-12 w-12 rounded-full bg-[#FFF8EC] border border-[#C5A15B]/40 grid place-items-center mx-auto mb-3 text-[#C5A15B]">
              <Tag className="h-6 w-6" />
            </div>
            <h3 className="font-serif-display text-2xl text-[#42121B] font-bold">No diyas match your filters</h3>
            <p className="mt-2 text-xs text-[#8A5A44] max-w-md mx-auto">
              We couldn't find any products matching your specific combination of price and keywords. Try broadening your criteria.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-5 rounded-lg bg-[#641B25] px-6 py-2.5 text-xs font-semibold tracking-wider text-[#FFF8EC] uppercase hover:bg-[#42121B] transition"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((prod) => (
              <ProductCard key={prod.id || prod.slug} product={prod} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
