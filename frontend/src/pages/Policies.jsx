import React from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { GoldDivider } from "../components/Ornaments";

const CONTENT = {
  shipping: {
    title: "Shipping Policy",
    body: [
      "We dispatch pan-India within 2–4 working days of order confirmation.",
      "Shipping charges are transparently calculated at checkout based on cart total — orders above ₹1,499 ship FREE pan-India.",
      "Fragile pieces are hand-packed in multi-layer bubble wrap, khadi lining and double-walled corrugated festive boxes.",
      "Tracking updates are sent via WhatsApp and SMS upon courier dispatch."
    ]
  },
  returns: {
    title: "Returns & Refunds",
    body: [
      "Because our pieces are handcrafted in small batches, we accept returns only when a piece arrives damaged in transit.",
      "In case of a damaged piece, please share an unboxing video or photographs within 24 hours of delivery on WhatsApp or email.",
      "Verified damaged orders will be replaced promptly or refunded within 7–10 working days."
    ]
  },
  privacy: {
    title: "Privacy Policy",
    body: [
      "We collect only the details needed to fulfill and ship your order — customer name, delivery address, phone number, and optional email.",
      "Your details are strictly confidential and never sold, shared, or exploited for third-party marketing.",
      "We do not store financial payment information on our servers."
    ]
  },
  terms: {
    title: "Terms & Conditions",
    body: [
      "All prices are quoted in INR and are inclusive of all applicable taxes.",
      "Authoritative pricing and inventory availability are verified securely by our server upon order submission.",
      "Because pieces are handcrafted using traditional clay, embroidery, and brass casting, subtle natural variations in colour and texture are hallmarks of authentic Indian handiwork."
    ]
  }
};

const Policies = () => {
  const { policyId } = useParams();
  const data = CONTENT[policyId];

  if (!data) return <Navigate to="/policies/shipping" replace />;

  return (
    <div className="bg-[#FFF8EC]" data-testid={`policy-${policyId}-page`}>
      <section className="bg-[#641B25] py-16 text-[#FFF8EC] mandala-bg">
        <div className="mx-auto max-w-3xl px-5 text-center lg:px-8">
          <span className="eyebrow text-[#C5A15B]">Boutique Information</span>
          <h1 className="font-serif-display mt-4 text-4xl text-[#FFF8EC] sm:text-5xl">
            {data.title}
          </h1>
          <GoldDivider light={true} className="mt-6" />
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-5 py-16 lg:px-8">
        <div className="rounded border border-[#C5A15B]/40 bg-white p-8 sm:p-10 shadow-sm space-y-6">
          {data.body.map((para, i) => (
            <p key={i} className="text-sm leading-relaxed text-[#42121B]/90">
              {para}
            </p>
          ))}

          <div className="pt-6 border-t border-[#C5A15B]/30 flex flex-wrap gap-4 text-xs font-semibold uppercase tracking-wider text-[#641B25]">
            <Link to="/policies/shipping" className="hover:underline">Shipping</Link>
            <span>•</span>
            <Link to="/policies/returns" className="hover:underline">Returns & Refunds</Link>
            <span>•</span>
            <Link to="/policies/privacy" className="hover:underline">Privacy</Link>
            <span>•</span>
            <Link to="/policies/terms" className="hover:underline">Terms</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Policies;
