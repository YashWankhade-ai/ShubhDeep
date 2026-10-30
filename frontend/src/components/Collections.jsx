import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { COLLECTIONS } from "../data/products";
import { GoldDivider } from "./Ornaments";

export const Collections = () => {
  return (
    <section
      className="bg-[#FFF8EC] py-20 lg:py-28"
      data-testid="collections-section"
      id="collections"
    >
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">Curated Collections</span>
          <h2 className="font-serif-display mt-4 text-3xl text-[#42121B] sm:text-4xl lg:text-5xl">
            Shop by Collection
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#8A5A44]">
            A thoughtfully arranged library of diyas, lamps and festive decor — each piece carries the warmth of an artisan's hand.
          </p>
          <GoldDivider className="mt-6" />
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {COLLECTIONS.map((c, i) => (
            <Link
              key={c.id}
              to={`/shop/${c.id}`}
              data-testid={`collection-card-${c.id}`}
              className="group relative block overflow-hidden bg-white"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden">
                <img
                  src={c.image}
                  alt={c.title}
                  className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#42121B]/80 via-[#42121B]/15 to-transparent" />
                <div className="pointer-events-none absolute inset-3 border border-[#C5A15B]/60" />
              </div>

              <div className="absolute inset-x-6 bottom-6 text-[#FFF8EC]">
                <h3 className="font-serif-display text-2xl leading-tight">
                  {c.title}
                </h3>
                <p className="mt-1.5 text-xs text-[#FFF8EC]/80 line-clamp-2">
                  {c.description}
                </p>
                <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-[#C5A15B] uppercase">
                  <span>Explore Collection</span>
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
