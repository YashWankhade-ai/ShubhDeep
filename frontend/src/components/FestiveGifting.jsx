import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { GIFTING_IMAGE } from "../data/products";
import { GoldDivider } from "./Ornaments";

export const FestiveGifting = () => {
  return (
    <section
      className="bg-[#FFF8EC] py-20 lg:py-28 paisley-bg"
      data-testid="festive-gifting-section"
      id="gifting"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-5 lg:grid-cols-2 lg:px-8">
        <div>
          <span className="eyebrow">Festive Gifting</span>
          <h2 className="font-serif-display mt-4 text-3xl leading-[1.1] text-[#42121B] sm:text-4xl lg:text-5xl">
            Share the Light.
            <br />
            <em className="not-italic text-[#B85C38]">Celebrate Together.</em>
          </h2>
          <GoldDivider className="mt-6 justify-start" />
          <p className="mt-6 max-w-xl text-base leading-relaxed text-[#8A5A44]">
            Discover thoughtful festive gifts that bring warmth and joy to the people who matter most — from brass urlis for home blessings to khadi-wrapped diya hampers for your corporate list.
          </p>
          <Link
            to="/shop/gift-hampers"
            data-testid="explore-gift-collection-cta"
            className="mt-8 inline-flex items-center gap-3 rounded-sm bg-[#641B25] px-7 py-4 text-[0.78rem] font-semibold tracking-[0.18em] uppercase text-[#C5A15B] transition hover:bg-[#42121B]"
          >
            <span>Explore Gift Collection</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="relative">
          <div className="relative aspect-[5/4] w-full overflow-hidden">
            <div className="absolute inset-0 border border-[#C5A15B]/60" />
            <div className="absolute inset-3 border border-[#C5A15B]/30" />
            <img
              src={GIFTING_IMAGE}
              alt="Elegant Diwali gift hamper with diyas, flowers and sweets"
              className="absolute inset-5 h-[calc(100%-40px)] w-[calc(100%-40px)] object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
