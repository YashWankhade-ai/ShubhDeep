import React from "react";
import { Link } from "react-router-dom";
import { BRAND_STORY_IMAGE } from "../data/products";
import { GoldDivider, PaisleyCorner } from "./Ornaments";

export const BrandStory = () => {
  return (
    <section
      className="relative overflow-hidden bg-[#641B25] py-20 text-[#FFF8EC] lg:py-28 mandala-bg"
      data-testid="brand-story-section"
    >
      <PaisleyCorner className="pointer-events-none absolute top-0 right-0 h-56 w-56 opacity-30 rotate-90" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-5 lg:grid-cols-2 lg:px-8">
        <div className="relative order-2 lg:order-1">
          <div className="relative aspect-[4/5] w-full max-w-[520px] overflow-hidden">
            <div className="absolute inset-0 border border-[#C5A15B]/55" />
            <div className="absolute inset-3 border border-[#C5A15B]/30" />
            <img
              src={BRAND_STORY_IMAGE}
              alt="A traditional arrangement of glowing diyas"
              className="absolute inset-5 h-[calc(100%-40px)] w-[calc(100%-40px)] object-cover"
              loading="lazy"
            />
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <span className="eyebrow text-[#C5A15B]">Our Little Lights</span>
          <h2 className="font-serif-display mt-5 text-3xl leading-[1.1] text-[#FFF8EC] sm:text-4xl lg:text-5xl">
            Every Diya Tells
            <br />
            <em className="not-italic text-[#D99A35]">a Story.</em>
          </h2>
          <GoldDivider light={true} className="mt-6 justify-start" />
          <p className="mt-6 max-w-xl text-base leading-relaxed text-[#FFF8EC]/85">
            From the warmth of the earth to the glow of a festive evening, every diya we curate celebrates the beauty of Indian traditions. They are shaped by potters in dusty courtyards, wrapped with silk thread by women in quiet lanes, and finished with pearls, kundan and marigolds. Discover the little lights that make Diwali unforgettable.
          </p>
          <div className="mt-8">
            <Link
              to="/our-story"
              data-testid="read-full-story-cta"
              className="inline-flex items-center gap-3 rounded-sm border border-[#C5A15B] bg-[#42121B] px-7 py-3.5 text-[0.78rem] font-semibold tracking-[0.18em] uppercase text-[#C5A15B] transition hover:bg-[#C5A15B] hover:text-[#42121B]"
            >
              Read Our Full Story
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
