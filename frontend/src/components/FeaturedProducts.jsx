import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { PRODUCTS } from "../data/products";
import { ProductCard } from "./ProductCard";
import { api } from "../services/api";

export const FeaturedProducts = () => {
  const [products, setProducts] = useState(() => PRODUCTS.filter((p) => p.featured).slice(0, 6));

  useEffect(() => {
    api.getProducts({ sort_by: "featured", page_size: 6 })
      .then((res) => {
        if (res && res.items && res.items.length > 0) {
          setProducts(res.items);
        }
      })
      .catch(() => {
        // Fallback already in initial state
      });
  }, []);

  return (
    <section
      className="bg-[#FFF8EC] py-20 lg:py-28"
      data-testid="featured-products-section"
      id="featured"
    >
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-xl">
            <span className="eyebrow">Festive Favourites</span>
            <h2 className="font-serif-display mt-4 text-3xl text-[#42121B] sm:text-4xl lg:text-5xl">
              Pieces our customers light up with.
            </h2>
          </div>
          <Link
            to="/shop"
            data-testid="view-all-products-link"
            className="inline-flex items-center gap-2 border-b border-[#641B25] pb-1 text-[0.78rem] font-semibold tracking-[0.18em] uppercase text-[#641B25] transition hover:text-[#B85C38]"
          >
            <span>View All Products</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.id || p.slug} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
};
