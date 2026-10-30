import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { BRAND_STORY_IMAGE } from "../data/products";
import { GoldDivider, PaisleyCorner } from "../components/Ornaments";

const OurStory = () => {
  return (
    <div data-testid="our-story-page" className="bg-[#FFF8EC]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#641B25] py-20 text-[#FFF8EC] mandala-bg">
        <PaisleyCorner className="pointer-events-none absolute top-0 left-0 h-64 w-64 opacity-30" />
        <PaisleyCorner className="pointer-events-none absolute right-0 bottom-0 h-64 w-64 opacity-30 rotate-180" />

        <div className="relative mx-auto max-w-3xl px-5 text-center lg:px-8">
          <span className="eyebrow text-[#C5A15B]">Our Story</span>
          <h1 className="font-serif-display mt-4 text-4xl leading-tight sm:text-5xl lg:text-6xl">
            Little lights, lovingly made.
          </h1>
          <GoldDivider light={true} className="mt-6" />
          <p className="mt-6 text-base leading-relaxed text-[#FFF8EC]/85 sm:text-lg">
            Shubh Deep began as a quiet Diwali gift for a grandmother — a tray of clay diyas sourced from a village potter, finished with silk thread and pearls at a dining table. One Diwali led to another, one grandmother led to many, and a small boutique was born.
          </p>
        </div>
      </section>

      {/* Narrative Section */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-5 py-20 lg:grid-cols-2 lg:px-8">
        <div>
          <h2 className="font-serif-display text-3xl text-[#42121B] sm:text-4xl">
            Rooted in craft, lit by tradition.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-[#8A5A44]">
            Every diya at Shubh Deep is made in small batches by Indian artisans — potters in Rajasthan, brass-casters in Moradabad, silk-thread artisans in Jaipur, and women who crochet lace in Lucknow lanes. We choose pieces that feel heirloom even when they are brand new.
          </p>
          <p className="mt-4 text-base leading-relaxed text-[#8A5A44]">
            Our collections change gently with the festive calendar, and our customer base is as warm as a courtyard full of diyas. We ship pan-India, confirm every order personally on WhatsApp, and pack every piece as if it were a gift for our own home.
          </p>
          <div className="mt-8">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 rounded bg-[#641B25] px-6 py-3.5 text-xs font-semibold tracking-wider text-[#C5A15B] uppercase hover:bg-[#42121B] transition"
            >
              <span>Explore The Boutique</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="relative aspect-[4/5] overflow-hidden">
            <div className="absolute inset-0 border border-[#C5A15B]/60" />
            <div className="absolute inset-3 border border-[#C5A15B]/30" />
            <img
              src={BRAND_STORY_IMAGE}
              alt="Traditional diyas glowing on a brass thali"
              className="absolute inset-5 h-[calc(100%-40px)] w-[calc(100%-40px)] object-cover"
            />
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="bg-[#641B25] py-20 text-[#FFF8EC]">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            {[
              {
                k: "Artisan-made",
                v: "Every piece is finished by hand — never machine-stamped."
              },
              {
                k: "Small-batch",
                v: "Collections release in limited quantities, so each piece feels special."
              },
              {
                k: "Fair-paid",
                v: "We work directly with artisan clusters and women-led co-operatives."
              }
            ].map((b) => (
              <div
                key={b.k}
                className="border border-[#C5A15B]/40 p-7 bg-[#42121B]/40"
                data-testid={`our-story-pillar-${b.k.toLowerCase()}`}
              >
                <h3 className="font-serif-display text-2xl text-[#D99A35]">
                  {b.k}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#FFF8EC]/80">
                  {b.v}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default OurStory;
