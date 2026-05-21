"use client";
export const dynamic = 'force-dynamic';

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../components/CartContext";

export default function CheckoutPage() {
  const router = useRouter();
  const { items = [], clearCart } = useCart() ?? {};

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pin: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    setCartCount(items.reduce((s, i) => s + i.quantity, 0));
  }, [items]);

  useEffect(() => {
    const handleScroll = () => setNavScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Google Fonts
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
  }, []);

  // Scroll reveal
  const revealRef = useRef<IntersectionObserver | null>(null);
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.6s ease-out, transform 0.6s ease-out; }
      .reveal.visible { opacity: 1; transform: translateY(0); }
    `;
    document.head.appendChild(style);
    revealRef.current = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("visible"); } }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach((el) => revealRef.current!.observe(el));
    return () => revealRef.current?.disconnect();
  }, []);

  const getPrice = (price: number) => price === 0 ? 299 : price;

  const subtotal = items.reduce((sum, item) => sum + getPrice(item.price) * item.quantity, 0);
  const shipping = subtotal === 0 ? 0 : subtotal > 500 ? 0 : 99;
  const total = subtotal + shipping;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Full name is required";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Valid email is required";
    if (!form.phone.trim() || !/^\d{10}$/.test(form.phone)) newErrors.phone = "Enter a valid 10-digit phone number";
    if (!form.address.trim()) newErrors.address = "Address is required";
    if (!form.city.trim()) newErrors.city = "City is required";
    if (!form.state.trim()) newErrors.state = "State is required";
    if (!form.pin.trim() || !/^\d{6}$/.test(form.pin)) newErrors.pin = "Enter a valid 6-digit PIN code";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) {
      setErrors((prev) => { const n = { ...prev }; delete n[e.target.name]; return n; });
    }
  };

  const handlePlaceOrder = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total }),
      });
      const order = await res.json();
      const Razorpay = (window as any).Razorpay;
      if (!Razorpay) {
        await new Promise<void>((resolve) => {
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = () => resolve();
          document.head.appendChild(script);
        });
      }
      const rzp = new (window as any).Razorpay({
        key: "rzp_test_",
        amount: order.amount || total * 100,
        currency: "INR",
        name: "Crisp",
        description: "Your Crisp order",
        handler: () => {
          clearCart?.();
          router.push("/");
        },
        prefill: { name: form.name, email: form.email, contact: form.phone },
        theme: { color: "#c17a3a" },
      });
      rzp.open();
    } catch {
      clearCart?.();
      router.push("/");
    } finally {
      setSubmitting(false);
    }
  };

  const indianStates = ["Andhra Pradesh","Assam","Bihar","Chhattisgarh","Delhi","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal"];

  const fieldStyle = (name: string) => ({
    width: "100%",
    height: "52px",
    padding: "0 16px",
    border: errors[name] ? "1.5px solid #e53e3e" : "1.5px solid #e8e0d6",
    borderRadius: "8px",
    fontSize: "15px",
    fontFamily: "'Inter', sans-serif",
    color: "var(--text)",
    background: "#fff",
    outline: "none",
    boxSizing: "border-box" as const,
    transition: "border-color 0.2s ease",
  });

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "var(--bg)", minHeight: "100vh", color: "var(--text)" }}>

      {/* ── NAV ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: "80px",
        background: navScrolled ? "#fff" : "transparent",
        borderBottom: navScrolled ? "1px solid #EEE" : "none",
        transition: "background 250ms ease-in-out, border-color 250ms ease-in-out",
        display: "flex", alignItems: "center", padding: "0 48px",
        justifyContent: "space-between",
      }}>
        <button
          onClick={() => router.push("/")}
          style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Outfit', sans-serif", fontSize: "28px", fontWeight: 700, color: navScrolled ? "var(--text)" : "#fff", letterSpacing: "-0.03em" }}
        >
          Crisp
        </button>
        {/* Desktop links */}
        <div style={{ display: "flex", gap: "32px", alignItems: "center" }} className="desktop-nav">
          {["Fries", "Sauces", "Bundles"].map((l) => (
            <button key={l} onClick={() => router.push("/shop")}
              style={{ background: "none", border: "none", cursor: "pointer", fontSize: "15px", fontFamily: "'Inter', sans-serif", fontWeight: 500, color: navScrolled ? "var(--text)" : "#fff" }}>
              {l}
            </button>
          ))}
          <button onClick={() => router.push("/shop")}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: "15px", fontFamily: "'Inter', sans-serif", fontWeight: 500, color: navScrolled ? "var(--text)" : "#fff" }}>
            Our Story
          </button>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button onClick={() => router.push("/checkout")} style={{ position: "relative", background: "none", border: "none", cursor: "pointer", color: navScrolled ? "var(--text)" : "#fff" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            {cartCount > 0 && (
              <span style={{ position: "absolute", top: "-8px", right: "-8px", background: "var(--accent)", color: "#fff", borderRadius: "9999px", width: "18px", height: "18px", fontSize: "11px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {cartCount}
              </span>
            )}
          </button>
          {/* Hamburger */}
          <button onClick={() => setMobileMenuOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", color: navScrolled ? "var(--text)" : "#fff", display: "none" }} className="hamburger-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div style={{ position: "fixed", inset: 0, background: "#fff", zIndex: 200, display: "flex", flexDirection: "column", padding: "32px" }}>
          <button onClick={() => setMobileMenuOpen(false)} style={{ alignSelf: "flex-end", background: "none", border: "none", cursor: "pointer", marginBottom: "32px" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text)" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
          {["Fries", "Sauces", "Bundles", "Our Story"].map((l) => (
            <button key={l} onClick={() => { router.push("/shop"); setMobileMenuOpen(false); }}
              style={{ background: "none", border: "none", cursor: "pointer", textAlign: "left", fontSize: "28px", fontFamily: "'Outfit', sans-serif", fontWeight: 600, color: "var(--text)", marginBottom: "24px", padding: 0 }}>
              {l}
            </button>
          ))}
        </div>
      )}

      {/* ── ACCENT BAR — Visual Fingerprint ── */}
      <div style={{ background: "var(--accent)", paddingTop: "120px", paddingBottom: "40px", textAlign: "center" }}>
        <p style={{ fontSize: "11px", fontFamily: "'Inter', sans-serif", fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.75)", marginBottom: "8px" }}>
          Secure Checkout
        </p>
        <h1 style={{ fontSize: "clamp(2.8rem, 6vw, 5rem)", fontFamily: "'Outfit', sans-serif", fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.0, color: "#fff", margin: 0, textShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>
          Almost There.
        </h1>
        <p style={{ fontSize: "16px", fontFamily: "'Inter', sans-serif", color: "rgba(255,255,255,0.85)", marginTop: "12px", fontWeight: 400 }}>
          Your golden crunch is just one step away.
        </p>
      </div>

      {/* ── EMPTY CART STATE ── */}
      {items.length === 0 && (
        <div style={{ maxWidth: "480px", margin: "0 auto", textAlign: "center", padding: "96px 24px" }} className="reveal">
          <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "#f0e8dc", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
          </div>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "2rem", fontWeight: 700, color: "var(--text)", marginBottom: "12px" }}>Your cart is empty</h2>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "16px", lineHeight: 1.7, color: "var(--muted)", marginBottom: "32px" }}>
            Looks like you haven't added any items yet. Explore our menu and find something delicious.
          </p>
          <button
            onClick={() => router.push("/shop")}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.02)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
            onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.98)"; }}
            onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1.02)"; }}
            style={{ padding: "16px 40px", background: "var(--primary)", color: "#fff", border: "none", borderRadius: "8px", fontSize: "16px", fontFamily: "'Outfit', sans-serif", fontWeight: 600, cursor: "pointer", transition: "transform 0.2s ease, box-shadow 0.2s ease", boxShadow: "0 8px 24px -8px rgba(26,26,26,0.4)" }}
          >
            Start Shopping
          </button>
        </div>
      )}

      {/* ── MAIN CHECKOUT LAYOUT ── */}
      {items.length > 0 && (
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "64px 24px 96px", display: "grid", gridTemplateColumns: "1fr", gap: "48px" }} className="checkout-grid">

          {/* LEFT: DELIVERY FORM */}
          <div className="reveal" style={{ order: 1 }}>
            <div style={{ background: "#fff", borderRadius: "16px", padding: "40px", boxShadow: "0 4px 32px rgba(26,26,26,0.08)" }}>

              {/* Section: Personal Info */}
              <div style={{ marginBottom: "40px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ color: "#fff", fontSize: "14px", fontWeight: 700, fontFamily: "'Outfit', sans-serif" }}>1</span>
                  </div>
                  <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "1.375rem", fontWeight: 700, color: "var(--text)", margin: 0 }}>Personal Details</h2>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }} className="form-grid-2">

                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={{ display: "block", fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 600, color: "var(--text)", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: "8px" }}>Full Name *</label>
                    <input name="name" value={form.name} onChange={handleChange} placeholder="Riya Sharma"
                      style={fieldStyle("name")}
                      onFocus={(e) => { if (!errors.name) e.currentTarget.style.borderColor = "var(--accent)"; }}
                      onBlur={(e) => { if (!errors.name) e.currentTarget.style.borderColor = "#e8e0d6"; }}
                    />
                    {errors.name && <p style={{ color: "#e53e3e", fontSize: "13px", marginTop: "6px", fontFamily: "'Inter', sans-serif" }}>{errors.name}</p>}
                  </div>

                  <div>
                    <label style={{ display: "block", fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 600, color: "var(--text)", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: "8px" }}>Email *</label>
                    <input name="email" value={form.email} onChange={handleChange} placeholder="riya@example.com" type="email"
                      style={fieldStyle("email")}
                      onFocus={(e) => { if (!errors.email) e.currentTarget.style.borderColor = "var(--accent)"; }}
                      onBlur={(e) => { if (!errors.email) e.currentTarget.style.borderColor = "#e8e0d6"; }}
                    />
                    {errors.email && <p style={{ color: "#e53e3e", fontSize: "13px", marginTop: "6px", fontFamily: "'Inter', sans-serif" }}>{errors.email}</p>}
                  </div>

                  <div>
                    <label style={{ display: "block", fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 600, color: "var(--text)", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: "8px" }}>Phone *</label>
                    <input name="phone" value={form.phone} onChange={handleChange} placeholder="9876543210" type="tel" maxLength={10}
                      style={fieldStyle("phone")}
                      onFocus={(e) => { if (!errors.phone) e.currentTarget.style.borderColor = "var(--accent)"; }}
                      onBlur={(e) => { if (!errors.phone) e.currentTarget.style.borderColor = "#e8e0d6"; }}
                    />
                    {errors.phone && <p style={{ color: "#e53e3e", fontSize: "13px", marginTop: "6px", fontFamily: "'Inter', sans-serif" }}>{errors.phone}</p>}
                  </div>
                </div>
              </div>

              {/* Section: Delivery Address */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ color: "#fff", fontSize: "14px", fontWeight: 700, fontFamily: "'Outfit', sans-serif" }}>2</span>
                  </div>
                  <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "1.375rem", fontWeight: 700, color: "var(--text)", margin: 0 }}>Delivery Address</h2>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }} className="form-grid-2">

                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={{ display: "block", fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 600, color: "var(--text)", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: "8px" }}>Street Address *</label>
                    <textarea name="address" value={form.address} onChange={handleChange} placeholder="Flat 4B, Tower A, Indiranagar..."
                      rows={3}
                      style={{ ...fieldStyle("address"), height: "auto", padding: "14px 16px", resize: "none" }}
                      onFocus={(e) => { if (!errors.address) e.currentTarget.style.borderColor = "var(--accent)"; }}
                      onBlur={(e) => { if (!errors.address) e.currentTarget.style.borderColor = "#e8e0d6"; }}
                    />
                    {errors.address && <p style={{ color: "#e53e3e", fontSize: "13px", marginTop: "6px", fontFamily: "'Inter', sans-serif" }}>{errors.address}</p>}
                  </div>

                  <div>
                    <label style={{ display: "block", fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 600, color: "var(--text)", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: "8px" }}>City *</label>
                    <input name="city" value={form.city} onChange={handleChange} placeholder="Bengaluru"
                      style={fieldStyle("city")}
                      onFocus={(e) => { if (!errors.city) e.currentTarget.style.borderColor = "var(--accent)"; }}
                      onBlur={(e) => { if (!errors.city) e.currentTarget.style.borderColor = "#e8e0d6"; }}
                    />
                    {errors.city && <p style={{ color: "#e53e3e", fontSize: "13px", marginTop: "6px", fontFamily: "'Inter', sans-serif" }}>{errors.city}</p>}
                  </div>

                  <div>
                    <label style={{ display: "block", fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 600, color: "var(--text)", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: "8px" }}>State *</label>
                    <select name="state" value={form.state} onChange={handleChange}
                      style={{ ...fieldStyle("state"), appearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%231a1a1a' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 16px center", paddingRight: "40px", cursor: "pointer" }}
                      onFocus={(e) => { if (!errors.state) e.currentTarget.style.borderColor = "var(--accent)"; }}
                      onBlur={(e) => { if (!errors.state) e.currentTarget.style.borderColor = "#e8e0d6"; }}
                    >
                      <option value="">Select State</option>
                      {indianStates.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {errors.state && <p style={{ color: "#e53e3e", fontSize: "13px", marginTop: "6px", fontFamily: "'Inter', sans-serif" }}>{errors.state}</p>}
                  </div>

                  <div>
                    <label style={{ display: "block", fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 600, color: "var(--text)", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: "8px" }}>PIN Code *</label>
                    <input name="pin" value={form.pin} onChange={handleChange} placeholder="560001" maxLength={6}
                      style={fieldStyle("pin")}
                      onFocus={(e) => { if (!errors.pin) e.currentTarget.style.borderColor = "var(--accent)"; }}
                      onBlur={(e) => { if (!errors.pin) e.currentTarget.style.borderColor = "#e8e0d6"; }}
                    />
                    {errors.pin && <p style={{ color: "#e53e3e", fontSize: "13px", marginTop: "6px", fontFamily: "'Inter', sans-serif" }}>{errors.pin}</p>}
                  </div>
                </div>
              </div>

              {/* Trust signals */}
              <div style={{ marginTop: "32px", padding: "20px 24px", background: "var(--bg)", borderRadius: "12px", display: "flex", gap: "24px", flexWrap: "wrap", alignItems: "center" }}>
                {[
                  { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, text: "256-bit SSL Secured" },
                  { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>, text: "Safe Payments via Razorpay" },
                  { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>, text: "Fast Delivery" },
                ].map((t, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    {t.icon}
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "var(--muted)", fontWeight: 500 }}>{t.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: ORDER SUMMARY */}
          <div className="reveal" style={{ order: 2 }}>
            <div style={{ background: "#fff", borderRadius: "16px", padding: "40px", boxShadow: "0 4px 32px rgba(26,26,26,0.08)", position: "sticky", top: "100px" }}>
              <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "1.375rem", fontWeight: 700, color: "var(--text)", marginBottom: "28px", letterSpacing: "-0.02em" }}>
                Order Summary
              </h2>

              {/* Items */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                {items.map((item, idx) => (
                  <div key={item.id ?? idx} style={{ display: "flex", gap: "16px", alignItems: "center", padding: "16px 0", borderBottom: idx < items.length - 1 ? "1px solid #f0ece6" : "none" }}>
                    <div style={{ width: "72px", height: "72px", borderRadius: "10px", overflow: "hidden", flexShrink: 0, background: "var(--bg)" }}>
                      <img src={item.image ?? `/product-${item.id ?? 1}.jpg`} alt={item.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "15px", fontWeight: 600, color: "var(--text)", margin: "0 0 4px", textTransform: "capitalize", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {item.name}
                      </p>
                      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "var(--muted)", margin: "0 0 6px" }}>
                        Qty: {item.quantity}
                      </p>
                      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "15px", fontWeight: 700, color: "var(--accent)", margin: 0 }}>
                        ₹{(getPrice(item.price) * item.quantity).toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "var(--muted)", margin: 0 }}>
                        ₹{getPrice(item.price).toLocaleString("en-IN")} ea.
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price breakdown */}
              <div style={{ marginTop: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "15px", color: "var(--muted)" }}>Subtotal</span>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "15px", color: "var(--text)", fontWeight: 500 }}>₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "15px", color: "var(--muted)" }}>Shipping</span>
                  {shipping === 0 ? (
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "15px", color: "#2d8a4e", fontWeight: 600 }}>FREE</span>
                  ) : (
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "15px", color: "var(--text)", fontWeight: 500 }}>₹{shipping}</span>
                  )}
                </div>
                {shipping > 0 && (
                  <div style={{ padding: "10px 14px", background: "#fff8f0", borderRadius: "8px", borderLeft: "3px solid var(--accent)" }}>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "var(--accent)", margin: 0, fontWeight: 500 }}>
                      Add ₹{(500 - subtotal).toLocaleString("en-IN")} more for FREE delivery!
                    </p>
                  </div>
                )}
                <div style={{ height: "1px", background: "#f0ece6", margin: "4px 0" }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: "18px", fontWeight: 700, color: "var(--text)" }}>Total</span>
                  <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: "22px", fontWeight: 700, color: "var(--accent)" }}>₹{total.toLocaleString("en-IN")}</span>
                </div>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", color: "var(--muted)", margin: "0" }}>
                  Inclusive of all taxes
                </p>
              </div>

              {/* Place Order CTA */}
              <button
                onClick={handlePlaceOrder}
                disabled={submitting}
                onMouseEnter={(e) => { if (!submitting) e.currentTarget.style.transform = "scale(1.02)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
                onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.98)"; }}
                onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1.02)"; }}
                style={{
                  marginTop: "24px",
                  width: "100%",
                  height: "60px",
                  background: submitting ? "var(--muted)" : "var(--accent)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "17px",
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 700,
                  cursor: submitting ? "not-allowed" : "pointer",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease",
                  boxShadow: "0 12px 32px -8px rgba(193,122,58,0.45)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  letterSpacing: "-0.01em",
                }}
              >
                {submitting ? (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" style={{ animation: "spin 1s linear infinite" }}>
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
                    </svg>
                    Pay Now — ₹{total.toLocaleString("en-IN")}
                  </>
                )}
              </button>

              {/* Continue Shopping */}
              <button
                onClick={() => router.push("/shop")}
                style={{ marginTop: "12px", width: "100%", height: "44px", background: "transparent", color: "var(--muted)", border: "1.5px solid #e8e0d6", borderRadius: "10px", fontSize: "14px", fontFamily: "'Inter', sans-serif", fontWeight: 500, cursor: "pointer", transition: "color 0.2s ease, border-color 0.2s ease" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e8e0d6"; e.currentTarget.style.color = "var(--muted)"; }}
              >
                ← Continue Shopping
              </button>

              {/* Payment badges */}
              <div style={{ marginTop: "24px", textAlign: "center" }}>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "12px" }}>We accept</p>
                <div style={{ display: "flex", justifyContent: "center", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
                  {/* Visa */}
                  <div style={{ background: "#1a1f71", borderRadius: "4px", padding: "4px 10px", height: "28px", display: "flex", alignItems: "center" }}>
                    <span style={{ color: "#fff", fontSize: "11px", fontWeight: 800, fontFamily: "'Outfit', sans-serif", letterSpacing: "0.02em" }}>VISA</span>
                  </div>
                  {/* Mastercard */}
                  <div style={{ background: "#fff", borderRadius: "4px", padding: "4px 8px", height: "28px", display: "flex", alignItems: "center", gap: "2px", border: "1px solid #eee" }}>
                    <div style={{ width: "16px", height: "16px", borderRadius: "50%", background: "#eb001b" }} />
                    <div style={{ width: "16px", height: "16px", borderRadius: "50%", background: "#f79e1b", marginLeft: "-8px" }} />
                  </div>
                  {/* UPI */}
                  <div style={{ background: "#fff", borderRadius: "4px", padding: "4px 10px", height: "28px", display: "flex", alignItems: "center", border: "1px solid #eee" }}>
                    <span style={{ fontSize: "11px", fontWeight: 700, fontFamily: "'Outfit', sans-serif", color: "#097939" }}>UPI</span>
                  </div>
                  {/* Net Banking */}
                  <div style={{ background: "#fff", borderRadius: "4px", padding: "4px 10px", height: "28px", display: "flex", alignItems: "center", border: "1px solid #eee" }}>
                    <span style={{ fontSize: "11px", fontWeight: 600, fontFamily: "'Inter', sans-serif", color: "var(--text)" }}>Net Banking</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ── ACCENT BAR — second fingerprint ── */}
      {items.length > 0 && (
        <div style={{ background: "var(--primary)", padding: "40px 24px", textAlign: "center" }}>
          <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "clamp(1.5rem, 3vw, 2.5rem)", fontWeight: 700, color: "#fff", margin: 0, letterSpacing: "-0.02em" }}>
            🔒 Your order is protected.
          </p>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "15px", color: "rgba(255,255,255,0.65)", marginTop: "8px" }}>
            100% secure checkout · Easy 7-day returns · Made fresh in India
          </p>
        </div>
      )}

      {/* ── FOOTER ── */}
      <footer style={{ background: "#231F20", color: "rgba(255,255,255,0.8)", padding: "72px 48px 40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "48px", marginBottom: "48px" }} className="footer-grid">
            {/* Col 1 */}
            <div>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: "28px", fontWeight: 700, color: "#fff", marginBottom: "12px", letterSpacing: "-0.03em" }}>Crisp</div>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", lineHeight: 1.7, color: "rgba(255,255,255,0.6)", marginBottom: "20px" }}>Crunch to perfection.</p>
              <div style={{ display: "flex", gap: "16px" }}>
                {[
                  { path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" },
                  { path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" },
                ].map((icon, i) => (
                  <button key={i} style={{ background: "none", border: "none", cursor: "pointer", color: "#fff" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff">
                      <path d={icon.path} />
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            {/* Col 2 — Shop */}
            <div>
              <h4 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "15px", fontWeight: 600, color: "#fff", marginBottom: "20px" }}>Shop</h4>
              {["Fries", "Sauces", "Bundles", "Gift Cards"].map((l) => (
                <button key={l} onClick={() => router.push("/shop")}
                  style={{ display: "block", background: "none", border: "none", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: "14px", color: "rgba(255,255,255,0.7)", lineHeight: 2.2, textAlign: "left", padding: 0, transition: "color 0.2s ease" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}>
                  {l}
                </button>
              ))}
            </div>

            {/* Col 3 — Learn */}
            <div>
              <h4 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "15px", fontWeight: 600, color: "#fff", marginBottom: "20px" }}>Learn</h4>
              {["Our Story", "Sourcing", "FAQs", "Contact Us"].map((l) => (
                <button key={l} onClick={() => router.push("/")}
                  style={{ display: "block", background: "none", border: "none", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: "14px", color: "rgba(255,255,255,0.7)", lineHeight: 2.2, textAlign: "left", padding: 0, transition: "color 0.2s ease" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}>
                  {l}
                </button>
              ))}
            </div>

            {/* Col 4 — Newsletter */}
            <div>
              <h4 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "18px", fontWeight: 600, color: "#fff", marginBottom: "16px" }}>Stay in the loop</h4>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", color: "rgba(255,255,255,0.6)", marginBottom: "16px", lineHeight: 1.6 }}>Get latest drops & deals.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <input type="email" placeholder="your@email.com"
                  style={{ height: "48px", border: "1px solid rgba(255,255,255,0.3)", background: "transparent", color: "#fff", borderRadius: "6px", padding: "0 16px", fontFamily: "'Inter', sans-serif", fontSize: "14px", outline: "none", boxSizing: "border-box" }} />
                <button
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.02)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
                  style={{ height: "48px", background: "var(--accent)", color: "#fff", border: "none", borderRadius: "6px", fontFamily: "'Outfit', sans-serif", fontSize: "15px", fontWeight: 600, cursor: "pointer", transition: "transform 0.2s ease" }}>
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Bottom strip */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.4)", margin: 0 }}>
              © 2026 Crisp Foods Pvt. Ltd. · Privacy Policy · Terms of Service
            </p>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <div style={{ background: "#1a1f71", borderRadius: "3px", padding: "3px 8px", height: "24px", display: "flex", alignItems: "center" }}>
                <span style={{ color: "#fff", fontSize: "10px", fontWeight: 800, fontFamily: "'Outfit', sans-serif" }}>VISA</span>
              </div>
              <div style={{ background: "#fff", borderRadius: "3px", padding: "3px 6px", height: "24px", display: "flex", alignItems: "center", gap: "1px" }}>
                <div style={{ width: "13px", height: "13px", borderRadius: "50%", background: "#eb001b" }} />
                <div style={{ width: "13px", height: "13px", borderRadius: "50%", background: "#f79e1b", marginLeft: "-6px" }} />
              </div>
              <div style={{ background: "#fff", borderRadius: "3px", padding: "3px 8px", height: "24px", display: "flex", alignItems: "center" }}>
                <span style={{ fontSize: "10px", fontWeight: 700, fontFamily: "'Outfit', sans-serif", color: "#097939" }}>UPI</span>
              </div>
              <div style={{ background: "#003087", borderRadius: "3px", padding: "3px 8px", height: "24px", display: "flex", alignItems: "center" }}>
                <span style={{ color: "#fff", fontSize: "10px", fontWeight: 700, fontFamily: "'Outfit', sans-serif" }}>PayPal</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (min-width: 900px) {
          .checkout-grid { grid-template-columns: 60% 1fr !important; }
          .checkout-grid > div:first-child { order: 1 !important; }
          .checkout-grid > div:last-child { order: 2 !important; }
          .desktop-nav { display: flex !important; }
          .hamburger-btn { display: none !important; }
          .footer-grid { grid-template-columns: repeat(4, 1fr) !important; }
          .form-grid-2 { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 899px) {
          .checkout-grid { grid-template-columns: 1fr !important; }
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
          .form-grid-2 { grid-template-columns: 1fr !important; }
          .desktop-nav { display: none !important; }
          .hamburger-btn { display: flex !important; }
        }
        @media (max-width: 599px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
        *:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; border-radius: 4px; }
      `}</style>
    </div>
  );
}