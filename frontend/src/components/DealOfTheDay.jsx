import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Sparkles, 
  Clock, 
  Flame, 
  ShoppingBag, 
  Check, 
  ArrowRight,
  ShieldCheck,
  Tag
} from "lucide-react";
import { api } from "../services/api";
import { useCart } from "../context/CartContext";
import { formatINR } from "../config/site";
import { toast } from "sonner";

export const DealOfTheDay = () => {
  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addItem, openCart } = useCart();
  const [added, setAdded] = useState(false);

  // Countdown timer state (hours, minutes, seconds)
  const [timeLeft, setTimeLeft] = useState({
    hours: 11,
    minutes: 42,
    seconds: 19,
  });

  useEffect(() => {
    api.getDealOfTheDay()
      .then((data) => {
        if (data) setDeal(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Countdown ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          // Reset loop for 24 hours deal freshness
          return { hours: 23, minutes: 59, seconds: 59 };
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (loading || !deal) return null;

  const price = parseFloat(deal.price);
  const oldPrice = deal.old_price ? parseFloat(deal.old_price) : price * 1.35;
  const savings = Math.max(0, oldPrice - price);
  const discountPercent = oldPrice > price ? Math.round(((oldPrice - price) / oldPrice) * 100) : 25;

  const imageUrl = Array.isArray(deal.images) && deal.images.length > 0
    ? deal.images[0].image_url
    : (deal.image || "/images/3be7aa21a985f477_diya1.jpeg");

  const handleClaimDeal = () => {
    addItem(deal, 1);
    setAdded(true);
    toast.success(`Claimed Deal: ${deal.name} added to cart!`);
    openCart();
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <section className="relative overflow-hidden py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#FFF8EC] to-[#FCEFDA] border-y border-[#C5A15B]/30">
      {/* Background Indian ornamental motif accents */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-[#C5A15B]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 h-64 w-64 rounded-full bg-[#641B25]/10 blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl">
        {/* Deal Section Badge & Title */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#641B25] text-[#C5A15B] text-xs font-bold tracking-widest uppercase border border-[#C5A15B]/40 shadow-sm">
            <Flame className="h-3.5 w-3.5 text-[#D99A35] animate-pulse" />
            <span>Festive Limited-Time Special</span>
          </div>

          <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#42121B] mt-3">
            Deal of the Day
          </h2>
          <p className="mt-2 text-sm text-[#8A5A44] max-w-xl mx-auto">
            Exclusive handcrafted festival collection piece with special price savings. Refreshed daily for our patrons.
          </p>
        </div>

        {/* Main Deal Card */}
        <div className="mx-auto max-w-5xl rounded-3xl border-2 border-[#C5A15B]/60 bg-white shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-8 items-center p-6 sm:p-10">
          {/* Left Column: Product Imagery */}
          <div className="relative group">
            <div className="aspect-square w-full rounded-2xl overflow-hidden bg-[#FFF8EC] border border-[#C5A15B]/30 relative">
              <img
                src={imageUrl}
                alt={deal.name}
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
              />

              {/* Discount Ribbon */}
              <div className="absolute top-4 left-4 rounded-full bg-[#641B25] text-[#FFF8EC] px-3.5 py-1 text-xs font-bold tracking-wider uppercase border border-[#C5A15B] shadow-md flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5 text-[#D99A35]" />
                <span>Save {discountPercent}%</span>
              </div>

              {/* Low stock pill */}
              <div className="absolute bottom-4 left-4 rounded-lg bg-black/70 backdrop-blur-sm text-[#FFF8EC] px-3 py-1.5 text-[0.7rem] font-medium border border-white/20">
                <span className="text-[#D99A35] font-bold">Only {deal.stock_quantity || 7} sets</span> available for this deal
              </div>
            </div>
          </div>

          {/* Right Column: Deal Details & Timer */}
          <div className="flex flex-col justify-between space-y-6">
            <div>
              {/* Category pill */}
              <span className="text-xs uppercase font-bold tracking-wider text-[#D99A35]">
                {deal.category_name || "Artisan Handcrafted"}
              </span>

              <h3 className="font-serif-display text-2xl sm:text-3xl font-bold text-[#42121B] mt-1 hover:text-[#641B25] transition">
                <Link to={`/product/${deal.slug || deal.id}`}>
                  {deal.name}
                </Link>
              </h3>

              <p className="mt-3 text-xs sm:text-sm text-[#8A5A44] leading-relaxed line-clamp-3">
                {deal.description}
              </p>
            </div>

            {/* Price Box */}
            <div className="rounded-xl bg-[#FFF8EC] border border-[#C5A15B]/40 p-4 flex items-center justify-between">
              <div>
                <span className="text-[0.7rem] uppercase tracking-wider text-[#8A5A44] font-medium block">
                  Today's Festive Price
                </span>
                <div className="flex items-baseline gap-3 mt-0.5">
                  <span className="font-serif-display text-3xl font-bold text-[#641B25]">
                    {formatINR(price)}
                  </span>
                  <span className="text-sm line-through text-[#8A5A44]">
                    {formatINR(oldPrice)}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="inline-block rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-[0.7rem] font-bold px-2.5 py-1">
                  You Save {formatINR(savings)}
                </span>
              </div>
            </div>

            {/* Countdown Timer */}
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#42121B] mb-2.5">
                <Clock className="h-4 w-4 text-[#D99A35]" />
                <span>Deal Expires In:</span>
              </div>

              <div className="grid grid-cols-3 gap-3 max-w-xs text-center font-mono">
                <div className="rounded-lg bg-[#42121B] text-[#FFF8EC] py-2 border border-[#C5A15B]/40 shadow-sm">
                  <span className="block text-2xl font-bold">
                    {String(timeLeft.hours).padStart(2, "0")}
                  </span>
                  <span className="text-[0.65rem] tracking-widest text-[#C5A15B] uppercase font-sans">Hours</span>
                </div>

                <div className="rounded-lg bg-[#42121B] text-[#FFF8EC] py-2 border border-[#C5A15B]/40 shadow-sm">
                  <span className="block text-2xl font-bold">
                    {String(timeLeft.minutes).padStart(2, "0")}
                  </span>
                  <span className="text-[0.65rem] tracking-widest text-[#C5A15B] uppercase font-sans">Mins</span>
                </div>

                <div className="rounded-lg bg-[#42121B] text-[#FFF8EC] py-2 border border-[#C5A15B]/40 shadow-sm">
                  <span className="block text-2xl font-bold text-[#D99A35]">
                    {String(timeLeft.seconds).padStart(2, "0")}
                  </span>
                  <span className="text-[0.65rem] tracking-widest text-[#C5A15B] uppercase font-sans">Secs</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={handleClaimDeal}
                className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#641B25] px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#FFF8EC] hover:bg-[#42121B] transition shadow-md hover:shadow-lg"
              >
                {added ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-400" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-4 w-4 text-[#C5A15B]" />
                    <span>Claim Deal & Add to Cart</span>
                  </>
                )}
              </button>

              <Link
                to={`/product/${deal.slug || deal.id}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#C5A15B]/60 bg-white px-5 py-3.5 text-xs font-semibold text-[#42121B] hover:bg-[#FFF8EC] transition"
              >
                <span>View Details</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default DealOfTheDay;
