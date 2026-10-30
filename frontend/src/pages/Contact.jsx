import React, { useState } from "react";
import { Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import { SITE, buildWhatsAppUrl } from "../config/site";
import { GoldDivider } from "../components/Ornaments";
import { toast } from "sonner";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: ""
  });

  const onSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Please fill in your name, email and message.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    const msg = `*Message · ${SITE.brand}*\n\nFrom: ${form.name} (${form.email})\n\n${form.message}`;
    window.open(buildWhatsAppUrl(msg), "_blank", "noopener");
    toast.success("Opening WhatsApp — we will reply shortly 🙏");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="bg-[#FFF8EC]" data-testid="contact-page">
      {/* Hero */}
      <section className="bg-[#641B25] py-20 text-[#FFF8EC] mandala-bg">
        <div className="mx-auto max-w-3xl px-5 text-center lg:px-8">
          <span className="eyebrow text-[#C5A15B]">Reach Out</span>
          <h1 className="font-serif-display mt-4 text-4xl text-[#FFF8EC] sm:text-5xl lg:text-6xl">
            We'd love to hear from you.
          </h1>
          <GoldDivider light={true} className="mt-6" />
          <p className="mt-6 text-base text-[#FFF8EC]/85 sm:text-lg">
            Have a question about a diya, bespoke corporate hampers, or bulk festive orders? Send us a message or chat on WhatsApp.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Form */}
          <div className="rounded border border-[#C5A15B]/40 bg-white p-8 shadow-sm">
            <h2 className="font-serif-display text-2xl text-[#42121B]">Send a Message</h2>
            <p className="mt-2 text-xs text-[#8A5A44]">
              We usually respond within a few hours on business days.
            </p>

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#42121B] mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Ananya Sen"
                  className="w-full rounded border border-[#C5A15B]/50 px-3.5 py-2.5 text-sm text-[#42121B] focus:border-[#641B25] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#42121B] mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="e.g. ananya@example.com"
                  className="w-full rounded border border-[#C5A15B]/50 px-3.5 py-2.5 text-sm text-[#42121B] focus:border-[#641B25] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#42121B] mb-1">
                  Your Message or Inquiry *
                </label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell us what you are looking for..."
                  className="w-full rounded border border-[#C5A15B]/50 px-3.5 py-2.5 text-sm text-[#42121B] focus:border-[#641B25] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded bg-[#641B25] py-3 text-xs font-semibold tracking-wider text-[#C5A15B] uppercase hover:bg-[#42121B] transition shadow"
              >
                <Send className="h-4 w-4" />
                <span>Send via WhatsApp</span>
              </button>
            </form>
          </div>

          {/* Contact Details & Direct WhatsApp CTA */}
          <div className="flex flex-col justify-between">
            <div className="space-y-6">
              <h2 className="font-serif-display text-3xl text-[#42121B]">Boutique Studio</h2>
              <p className="text-base leading-relaxed text-[#8A5A44]">
                Our studio is located in the craft heart of Jaipur. We curate, inspect, and ship all collections directly from here.
              </p>

              <div className="space-y-4 pt-4 text-sm text-[#42121B]">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-1 h-5 w-5 text-[#C5A15B] shrink-0" />
                  <span>{SITE.address}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-[#C5A15B] shrink-0" />
                  <a href={`mailto:${SITE.email}`} className="hover:text-[#641B25] underline">
                    {SITE.email}
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-[#C5A15B] shrink-0" />
                  <span>{SITE.phoneDisplay}</span>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Callout */}
            <div className="mt-10 rounded border border-[#25D366]/40 bg-[#25D366]/10 p-6 text-center">
              <MessageCircle className="mx-auto h-8 w-8 text-[#25D366]" />
              <h3 className="font-serif-display mt-3 text-xl text-[#42121B]">Instant Assistance on WhatsApp</h3>
              <p className="mt-2 text-xs text-[#8A5A44]">
                Need help picking colors, checking pincode deliverability, or ordering hampers?
              </p>
              <a
                href={buildWhatsAppUrl("Namaste! I have a question regarding ShubhDeep collections.")}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded bg-[#25D366] px-6 py-2.5 text-xs font-semibold text-white uppercase tracking-wider hover:bg-[#20ba5a] transition"
              >
                <span>Chat Directly</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
