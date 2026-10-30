import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { HERO_IMAGE } from "../data/products";
import { GoldDivider, PaisleyCorner } from "./Ornaments";

export const Hero = () => {
  return (
    <section
      className="relative overflow-hidden bg-[#641B25] text-[#FFF8EC] mandala-bg"
      data-testid="hero-section"
    >
      <PaisleyCorner className="pointer-events-none absolute -top-6 -left-6 h-56 w-56 opacity-50" />
      <PaisleyCorner className="pointer-events-none absolute -right-10 -bottom-10 h-72 w-72 opacity-40 rotate-180" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-5 py-20 lg:grid-cols-2 lg:px-8 lg:py-28">
        <div className="fade-up">
          <span className="eyebrow block text-[#C5A15B]">
            The Festival of Lights
          </span>
          <h1 className="font-serif-display mt-5 text-4xl leading-[1.08] tracking-tight text-[#FFF8EC] sm:text-5xl lg:text-6xl">
            Light Up Your Diwali,
            <br />
            <em className="not-italic text-[#D99A35]">The Traditional Way.</em>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-[#FFF8EC]/80 sm:text-lg">
            Discover beautiful diyas and festive decorations that bring warmth, tradition, and timeless beauty to your home — handcrafted by Indian artisans, lit by the stories of a thousand Diwalis.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              to="/shop"
              data-testid="hero-explore-collection-cta"
              className="group inline-flex items-center gap-3 rounded-sm bg-[#C5A15B] px-7 py-4 text-[0.8rem] font-semibold tracking-[0.18em] uppercase text-[#42121B] diya-glow transition hover:bg-[#D99A35]"
            >
              <span>Explore Our Collection</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/our-story"
              data-testid="hero-our-story-cta"
              className="inline-flex items-center gap-2 border-b border-[#C5A15B]/70 pb-1 text-[0.8rem] font-medium tracking-[0.18em] uppercase text-[#FFF8EC] transition hover:border-[#D99A35] hover:text-[#D99A35]"
            >
              Discover Our Story
            </Link>
          </div>

          <p className="mt-8 text-[0.72rem] tracking-[0.3em] uppercase text-[#C5A15B]/85">
            Traditional Designs · Festive Favourites · Made With Love
          </p>
        </div>

        <div
          className="relative fade-up"
          style={{ animationDelay: "180ms" }}
        >
          <div className="relative aspect-[4/5] w-full max-w-[520px] mx-auto overflow-hidden">
            <div className="absolute inset-0 border border-[#C5A15B]/60" />
            <div className="absolute inset-3 border border-[#C5A15B]/35" />
            <img
              src={HERO_IMAGE}
              alt="Glowing traditional clay diyas arranged with marigold petals for Diwali"
              className="absolute inset-5 h-[calc(100%-40px)] w-[calc(100%-40px)] object-cover"
              loading="eager"
            />
            <div className="absolute inset-5 bg-gradient-to-t from-[#42121B]/60 via-transparent to-transparent" />
          </div>

          <div className="absolute -bottom-6 left-1/2 hidden -translate-x-1/2 bg-[#641B25] px-6 py-3 sm:block">
            <GoldDivider light={true} className="w-56" />
          </div>
        </div>
      </div>
    </section>
  );
};
