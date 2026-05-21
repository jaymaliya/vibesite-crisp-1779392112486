"use client";
export const dynamic = 'force-dynamic';

import { useRouter } from "next/navigation";
import { useCart } from "../../components/CartContext";
import { useState, useEffect, useRef } from "react";

export default function ShopPage() {
  const { addItem } = useCart() ?? { addItem: () => {} };
  const router = useRouter();

  const products = [
  { id: 1, img: "/product-1.jpg", name: "red cardboard fast-food", description: "A red cardboard fast-food box with a yellow McDonald's logo, overflowing with", price: 0, badge: "NEW" },
  { id: 2, img: "/product-2.jpg", name: "multi-layered double cheeseburger", description: "A multi-layered double cheeseburger with sesame bun, two grilled patties, melted yellow", price: 30, badge: "" },
  { id: 3, img: "/product-3.jpg", name: "round pepperoni pizza", description: "A round pepperoni pizza with a golden-brown crust and gooey melted cheese pulling from a", price: 40, badge: "" },
  { id: 4, img: "/product-4.jpg", name: "pile golden-brown crispy", description: "A pile of golden-brown crispy fried chicken tenders, one cut open to reveal white meat,", price: 50, badge: "" }
];

  const [addedIds, setAddedIds] = useState<Record<number, boolean>>({});
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [filtersOpen, setFiltersOpen] = useState<Record<string, boolean>>({ category: true, price: false });
  const [subEmail, setSubEmail] = useState("");
  const [subDone, setSubDone] = useState(false);

  const filters = ["All", "Fries", "Burgers", "Pizza", "Chicken"];

  useEffect(() => {
    const handleScroll = () => setNavScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Changa+One:ital@0;1&family=DM+Sans:wght@400;500;600;700&display=swap');
      .reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.6s ease-out, transform 0.6s ease-out; }
      .reveal.visible { opacity: 1; transform: translateY(0); }
      .reveal-d1 { transition-delay: 0.1s; }
      .reveal-d2 { transition-delay: 0.2s; }
      .reveal-d3 { transition-delay: 0.3s; }
      .reveal-d4 { transition-delay: 0.4s; }
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { background-color: #faf7f2; }
      :focus-visible { outline: 2px solid #c17a3a; outline-offset: 2px; }
      ::-webkit-scrollbar { width: 8px; } ::-webkit-scrollbar-track { background: #faf7f2; } ::-webkit-scrollbar-thumb { background: #d4a574; border-radius: 4px; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleAddToCart = (p: typeof products[0]) => {
    addItem({ id: crypto.randomUUID(), name: p.name, price: p.price, quantity: 1, image: p.img });
    setAddedIds((prev) => ({ ...prev, [p.id]: true }));
    setCartCount((c) => c + 1);
    setTimeout(() => setAddedIds((prev) => ({ ...prev, [p.id]: false })), 1500);
  };

  const toggleFilter = (key: string) => setFiltersOpen((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", backgroundColor: "#faf7f2", color: "#1a1a1a", minHeight: "100vh" }}>

      {/* ── NAV ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: "80px",
        backgroundColor: navScrolled ? "#ffffff" : "transparent",
        borderBottom: navScrolled ? "1px solid #eee" : "none",
        transition: "background-color 250ms ease-in-out, border-bottom 250ms ease-in-out",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 40px",
      }}>
        {/* Logo */}
        <button onClick={() => router.push("/")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontFamily: "'Changa One', sans-serif", fontSize: "32px", color: "#1a1a1a", letterSpacing: "-0.02em", lineHeight: 1 }}>CRISP</span>
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#c17a3a", display: "inline-block", marginBottom: "4px" }} />
        </button>

        {/* Desktop Nav Links */}
        <div style={{ display: "flex", gap: "40px", alignItems: "center" }} className="desktop-nav">
          {["Fries", "Sauces", "Bundles", "Our Story"].map((link) => (
            <button key={link} onClick={() => router.push("/shop")}
              style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: "15px", fontWeight: 500, color: "#1a1a1a", letterSpacing: "0.01em" }}>
              {link}
            </button>
          ))}
        </div>

        {/* Cart + Hamburger */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button onClick={() => router.push("/checkout")} style={{ position: "relative", background: "none", border: "none", cursor: "pointer", padding: "8px" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            {cartCount > 0 && (
              <span style={{ position: "absolute", top: "2px", right: "2px", width: "16px", height: "16px", borderRadius: "50%", backgroundColor: "#c17a3a", color: "#fff", fontSize: "11px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif" }}>
                {cartCount}
              </span>
            )}
          </button>

          {/* Hamburger */}
          <button onClick={() => setMobileNavOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", padding: "8px", display: "flex", flexDirection: "column", gap: "5px" }}>
            <span style={{ display: "block", width: "24px", height: "2px", backgroundColor: "#1a1a1a", borderRadius: "2px" }} />
            <span style={{ display: "block", width: "24px", height: "2px", backgroundColor: "#1a1a1a", borderRadius: "2px" }} />
            <span style={{ display: "block", width: "24px", height: "2px", backgroundColor: "#1a1a1a", borderRadius: "2px" }} />
          </button>
        </div>
      </nav>

      {/* ── MOBILE NAV OVERLAY ── */}
      {mobileNavOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, backgroundColor: "#ffffff", display: "flex", flexDirection: "column", padding: "32px 40px", transform: mobileNavOpen ? "translateX(0)" : "translateX(100%)", transition: "transform 300ms ease-out" }}>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "48px" }}>
            <button onClick={() => setMobileNavOpen(false)} style={{ background: "none", border: "none", cursor: "pointer" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          {["Fries", "Sauces", "Bundles", "Our Story"].map((link) => (
            <button key={link} onClick={() => { router.push("/shop"); setMobileNavOpen(false); }}
              style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: "28px", fontWeight: 600, color: "#1a1a1a", textAlign: "left", marginBottom: "24px" }}>
              {link}
            </button>
          ))}
        </div>
      )}

      {/* ── SHOP BANNER ── */}
      <section style={{ paddingTop: "80px", backgroundColor: "#1a1a1a", overflow: "hidden" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "64px 40px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.15em", color: "#d4b8a0", fontWeight: 500 }}>Our Menu</span>
          <h1 style={{ fontFamily: "'Changa One', sans-serif", fontSize: "clamp(3rem, 7vw, 5.5rem)", letterSpacing: "-0.03em", lineHeight: 1.0, color: "#ffffff" }}>
            The Full<br />
            <span style={{ color: "#c17a3a" }}>Crisp</span> Collection
          </h1>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "17px", lineHeight: 1.7, color: "rgba(255,255,255,0.7)", maxWidth: "480px" }}>
            Every item crafted to perfection. Golden. Fast. Fearlessly delicious.
          </p>
        </div>
      </section>

      {/* ── ACCENT BAR — Visual Fingerprint ── */}
      <div style={{ backgroundColor: "#c17a3a", padding: "0 40px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", minHeight: "80px" }}>
        <span style={{ fontFamily: "'Changa One', sans-serif", fontSize: "clamp(1.2rem, 3vw, 2rem)", letterSpacing: "-0.02em", color: "#ffffff" }}>
          Free delivery on orders above ₹599 — Order now!
        </span>
        <button onClick={() => router.push("/checkout")}
          style={{ background: "#1a1a1a", color: "#ffffff", border: "none", cursor: "pointer", height: "44px", padding: "0 28px", borderRadius: "4px", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "14px", letterSpacing: "0.04em", whiteSpace: "nowrap" }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.02)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}>
          Order Now
        </button>
      </div>

      {/* ── MAIN CONTENT: SIDEBAR + GRID ── */}
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "64px 40px", display: "flex", gap: "48px", alignItems: "flex-start" }}>

        {/* ── SIDEBAR FILTERS ── */}
        <aside style={{ width: "280px", flexShrink: 0, position: "sticky", top: "96px" }} className="reveal">
          <div style={{ backgroundColor: "#ffffff", borderRadius: "16px", padding: "32px", boxShadow: "0 4px 24px rgba(26,26,26,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px" }}>
              <h2 style={{ fontFamily: "'Changa One', sans-serif", fontSize: "20px", color: "#1a1a1a", letterSpacing: "-0.01em" }}>Filters</h2>
              <button onClick={() => setSelectedFilter("All")} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "#c17a3a", fontWeight: 600 }}>
                Clear all
              </button>
            </div>

            {/* Sort */}
            <div style={{ marginBottom: "28px" }}>
              <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, color: "#d4b8a0", display: "block", marginBottom: "12px" }}>Sort By</label>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                style={{ width: "100%", height: "38px", border: "1px solid #e8e0d5", borderRadius: "4px", backgroundColor: "#faf7f2", fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "#1a1a1a", padding: "0 12px", appearance: "none", cursor: "pointer" }}>
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Newest</option>
              </select>
            </div>

            {/* Category Accordion */}
            <div style={{ borderTop: "1px solid #f0e8dc", paddingTop: "24px", marginBottom: "24px" }}>
              <button onClick={() => toggleFilter("category")}
                style={{ width: "100%", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: filtersOpen.category ? "16px" : "0" }}>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, color: "#d4b8a0" }}>Category</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d4b8a0" strokeWidth="2" style={{ transform: filtersOpen.category ? "rotate(180deg)" : "rotate(0)", transition: "transform 200ms ease" }}>
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
              {filtersOpen.category && (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {filters.map((f) => (
                    <label key={f} style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                      <div onClick={() => setSelectedFilter(f)}
                        style={{ width: "16px", height: "16px", borderRadius: "3px", border: selectedFilter === f ? "none" : "1px solid #d4b8a0", backgroundColor: selectedFilter === f ? "#c17a3a" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, cursor: "pointer", transition: "background 200ms ease" }}>
                        {selectedFilter === f && (
                          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                            <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                        )}
                      </div>
                      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: selectedFilter === f ? "#1a1a1a" : "#6b5c4e", fontWeight: selectedFilter === f ? 500 : 400 }}>{f}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Price Accordion */}
            <div style={{ borderTop: "1px solid #f0e8dc", paddingTop: "24px" }}>
              <button onClick={() => toggleFilter("price")}
                style={{ width: "100%", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: filtersOpen.price ? "16px" : "0" }}>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, color: "#d4b8a0" }}>Price Range</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d4b8a0" strokeWidth="2" style={{ transform: filtersOpen.price ? "rotate(180deg)" : "rotate(0)", transition: "transform 200ms ease" }}>
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
              {filtersOpen.price && (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {["Under ₹200", "₹200 – ₹500", "₹500 – ₹1,000", "Above ₹1,000"].map((range) => (
                    <label key={range} style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                      <div style={{ width: "16px", height: "16px", borderRadius: "3px", border: "1px solid #d4b8a0", flexShrink: 0 }} />
                      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "#6b5c4e" }}>{range}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Side trust block */}
          <div style={{ marginTop: "24px", backgroundColor: "#1a1a1a", borderRadius: "16px", padding: "28px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "8px", backgroundColor: "#c17a3a", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </div>
              <div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 600, color: "#ffffff" }}>Fast Delivery</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "#d4b8a0" }}>30 mins or less</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "8px", backgroundColor: "#c17a3a", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              </div>
              <div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 600, color: "#ffffff" }}>4.9 / 5 Rating</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "#d4b8a0" }}>12,000+ reviews</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "8px", backgroundColor: "#c17a3a", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
              </div>
              <div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 600, color: "#ffffff" }}>Made in India</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "#d4b8a0" }}>Local ingredients</div>
              </div>
            </div>
          </div>
        </aside>

        {/* ── PRODUCT GRID ── */}
        <main style={{ flex: 1, minWidth: 0 }}>
          {/* Grid Header */}
          <div className="reveal" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "40px", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.15em", color: "#d4b8a0", display: "block", marginBottom: "4px" }}>Showing all</span>
              <h2 style={{ fontFamily: "'Changa One', sans-serif", fontSize: "clamp(1.8rem, 3vw, 2.8rem)", color: "#1a1a1a", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
                {selectedFilter === "All" ? "All Items" : selectedFilter}
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "16px", fontWeight: 400, color: "#d4b8a0", marginLeft: "12px" }}>({products.length})</span>
              </h2>
            </div>

            {/* Filter Pills (mobile-friendly) */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {filters.map((f) => (
                <button key={f} onClick={() => setSelectedFilter(f)}
                  style={{ height: "36px", padding: "0 18px", borderRadius: "9999px", border: selectedFilter === f ? "none" : "1px solid #e8e0d5", backgroundColor: selectedFilter === f ? "#1a1a1a" : "#ffffff", color: selectedFilter === f ? "#ffffff" : "#1a1a1a", fontFamily: "'DM Sans', sans-serif", fontSize: "14px", fontWeight: 500, cursor: "pointer", transition: "background 200ms ease, color 200ms ease" }}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "28px" }}>
            {products.map((p, i) => (
              <article key={p.id}
                className={`reveal reveal-d${Math.min(i + 1, 4) as 1 | 2 | 3 | 4}`}
                onMouseEnter={() => setHoveredCard(p.id)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "16px",
                  overflow: "hidden",
                  cursor: "pointer",
                  boxShadow: hoveredCard === p.id ? "0 12px 32px rgba(26,26,26,0.14)" : "0 2px 12px rgba(26,26,26,0.07)",
                  transform: hoveredCard === p.id ? "translateY(-4px)" : "translateY(0)",
                  transition: "box-shadow 300ms cubic-bezier(0.4,0,0.2,1), transform 300ms cubic-bezier(0.4,0,0.2,1)",
                  display: "flex",
                  flexDirection: "column",
                }}>
                {/* Image */}
                <div
                  onClick={() => router.push(`/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`)}
                  style={{ overflow: "hidden", position: "relative", aspectRatio: "4/5", flexShrink: 0 }}>
                  <img src={p.img} alt={p.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block",
                      transform: hoveredCard === p.id ? "scale(1.05)" : "scale(1)",
                      transition: "transform 600ms ease" }} />
                  {/* Badge */}
                  {p.id === 1 && (
                    <div style={{ position: "absolute", top: "12px", left: "12px", backgroundColor: "#c17a3a", color: "#ffffff", fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 700, padding: "4px 10px", borderRadius: "9999px", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                      Bestseller
                    </div>
                  )}
                  {p.id === 3 && (
                    <div style={{ position: "absolute", top: "12px", left: "12px", backgroundColor: "#1a1a1a", color: "#ffffff", fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 700, padding: "4px 10px", borderRadius: "9999px", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                      New
                    </div>
                  )}

                  {/* Quick Add overlay */}
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "12px",
                    opacity: hoveredCard === p.id ? 1 : 0,
                    transform: hoveredCard === p.id ? "translateY(0)" : "translateY(10px)",
                    transition: "opacity 200ms ease, transform 200ms ease" }}>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleAddToCart(p); }}
                      style={{ width: "100%", height: "44px", backgroundColor: addedIds[p.id] ? "#4a8c5c" : "#1a1a1a", color: "#ffffff", border: "none", borderRadius: "4px", fontFamily: "'DM Sans', sans-serif", fontSize: "15px", fontWeight: 600, cursor: "pointer", transition: "background 300ms ease" }}
                      onMouseEnter={e => { if (!addedIds[p.id]) (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.01)"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
                      onMouseDown={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.98)"; }}
                      onMouseUp={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}>
                      {addedIds[p.id] ? "Added ✓" : "Quick Add"}
                    </button>
                  </div>
                </div>

                {/* Card Body */}
                <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}
                  onClick={() => router.push(`/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`)}>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.12em", color: "#d4b8a0", fontWeight: 500 }}>
                    {p.id === 1 || p.id === 4 ? "Fries & Snacks" : p.id === 2 ? "Burgers" : "Pizza"}
                  </span>
                  <h3 style={{ fontFamily: "'Changa One', sans-serif", fontSize: "18px", color: "#1a1a1a", letterSpacing: "-0.01em", lineHeight: 1.2, textTransform: "capitalize" }}>
                    {p.name}
                  </h3>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "#8a7060", lineHeight: 1.5, flex: 1 }}>
                    {p.description.length > 60 ? p.description.slice(0, 60) + "…" : p.description}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "8px" }}>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "18px", fontWeight: 700, color: "#c17a3a" }}>
                      ₹{p.price.toLocaleString("en-IN")}
                    </span>
                    <div style={{ display: "flex", gap: "2px" }}>
                      {[1,2,3,4,5].map(s => (
                        <svg key={s} width="12" height="12" viewBox="0 0 24 24" fill="#c17a3a"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Loading indicator */}
          <div style={{ textAlign: "center", padding: "64px 0 32px", color: "#d4b8a0", fontFamily: "'DM Sans', sans-serif", fontSize: "14px" }}>
            <div style={{ width: "32px", height: "32px", border: "2px solid #f0e8dc", borderTop: "2px solid #c17a3a", borderRadius: "50%", margin: "0 auto 12px", animation: "spin 0.8s linear infinite" }} />
            Showing all {products.length} items
          </div>
        </main>
      </div>

      {/* ── ACCENT BAR — Limited Time ── */}
      <section className="reveal" style={{ backgroundColor: "#c17a3a", padding: "40px 40px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "24px" }}>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.2em", color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>Limited Time Only</span>
        <h2 style={{ fontFamily: "'Changa One', sans-serif", fontSize: "clamp(2.5rem, 6vw, 5rem)", letterSpacing: "-0.03em", lineHeight: 1.0, color: "#ffffff" }}>
          Introducing the<br />Monsoon Season Fries!
        </h2>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "17px", color: "rgba(255,255,255,0.85)", maxWidth: "480px", lineHeight: 1.6 }}>
          Rain-kissed spices, farm-fresh potatoes. Available only through the monsoon.
        </p>
        <button onClick={() => router.push("/shop")}
          style={{ height: "52px", minWidth: "200px", backgroundColor: "#1a1a1a", color: "#ffffff", border: "none", borderRadius: "4px", fontFamily: "'DM Sans', sans-serif", fontSize: "16px", fontWeight: 600, cursor: "pointer", padding: "0 32px" }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.02)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 20px rgba(0,0,0,0.25)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "none"; }}
          onMouseDown={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.98)"; }}
          onMouseUp={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}>
          Discover More
        </button>
      </section>

      {/* ── NEWSLETTER ── */}
      <section className="reveal" style={{ backgroundColor: "#faf7f2", padding: "96px 40px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        {/* Playful SVG background */}
        <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", opacity: 0.06, pointerEvents: "none" }} viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice">
          <circle cx="100" cy="80" r="60" fill="#c17a3a"/>
          <circle cx="700" cy="320" r="80" fill="#d4a574"/>
          <rect x="350" y="50" width="40" height="120" rx="20" fill="#c17a3a" transform="rotate(20 370 110)"/>
          <rect x="500" y="200" width="30" height="90" rx="15" fill="#d4a574" transform="rotate(-15 515 245)"/>
          <circle cx="200" cy="300" r="40" fill="#c17a3a"/>
          <circle cx="650" cy="80" r="30" fill="#d4a574"/>
        </svg>

        <div style={{ maxWidth: "640px", margin: "0 auto", position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: "20px", alignItems: "center" }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.2em", color: "#d4b8a0", fontWeight: 500 }}>Stay in the loop</span>
          <h2 style={{ fontFamily: "'Changa One', sans-serif", fontSize: "clamp(2rem, 4.5vw, 3.5rem)", letterSpacing: "-0.02em", lineHeight: 1.05, color: "#1a1a1a" }}>
            Get the Latest<br />Drops &amp; Deals
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "16px", color: "#8a7060", lineHeight: 1.6, maxWidth: "400px" }}>
            New menu items, exclusive offers, and behind-the-scenes from the kitchen — straight to your inbox.
          </p>
          {subDone ? (
            <div style={{ backgroundColor: "#1a1a1a", color: "#ffffff", borderRadius: "8px", padding: "16px 32px", fontFamily: "'DM Sans', sans-serif", fontSize: "15px", fontWeight: 600 }}>
              You're in! Watch your inbox for golden news 🎉
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSubDone(true); }} style={{ display: "flex", gap: "12px", width: "100%", maxWidth: "480px", flexWrap: "wrap" }}>
              <input type="email" value={subEmail} onChange={e => setSubEmail(e.target.value)} required placeholder="Your email address"
                style={{ flex: 1, minWidth: "200px", height: "50px", border: "1px solid #e8e0d5", borderRadius: "4px", padding: "0 16px", fontFamily: "'DM Sans', sans-serif", fontSize: "16px", backgroundColor: "#ffffff", color: "#1a1a1a", outline: "none" }} />
              <button type="submit"
                style={{ height: "50px", padding: "0 28px", backgroundColor: "#c17a3a", color: "#1a1a1a", border: "none", borderRadius: "4px", fontFamily: "'Changa One', sans-serif", fontSize: "16px", cursor: "pointer", whiteSpace: "nowrap", fontWeight: 600 }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.02)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}>
                Subscribe
              </button>
            </form>
          )}
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "#d4b8a0" }}>No spam. Unsubscribe at any time.</p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ backgroundColor: "#1a1a1a", color: "rgba(255,255,255,0.8)", padding: "80px 40px 0" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "48px", paddingBottom: "64px" }}>
          {/* Col 1 */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <button onClick={() => router.push("/")} style={{ background: "none", border: "none", cursor: "pointer", alignSelf: "flex-start" }}>
              <span style={{ fontFamily: "'Changa One', sans-serif", fontSize: "36px", color: "#ffffff", letterSpacing: "-0.02em" }}>CRISP</span>
            </button>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", lineHeight: 1.6, color: "rgba(255,255,255,0.6)", maxWidth: "200px" }}>Crunch to perfection.</p>
            <div style={{ display: "flex", gap: "16px", marginTop: "8px" }}>
              {/* Instagram */}
              <button style={{ background: "none", border: "none", cursor: "pointer" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </button>
              {/* Facebook */}
              <button style={{ background: "none", border: "none", cursor: "pointer" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
              </button>
              {/* TikTok placeholder */}
              <button style={{ background: "none", border: "none", cursor: "pointer" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2"><path d="M9 12a4 4 0 100 8 4 4 0 000-8z"/><path d="M9 12V4h4a4 4 0 004 4"/></svg>
              </button>
            </div>
          </div>

          {/* Col 2 — Shop */}
          <div>
            <h4 style={{ fontFamily: "'Changa One', sans-serif", fontSize: "15px", color: "#ffffff", marginBottom: "20px", letterSpacing: "0.02em" }}>Shop</h4>
            {["Fries", "Sauces", "Bundles", "Gift Cards"].map((l) => (
              <button key={l} onClick={() => router.push("/shop")}
                style={{ display: "block", background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "rgba(255,255,255,0.65)", lineHeight: "2.2", padding: 0, textAlign: "left" }}>
                {l}
              </button>
            ))}
          </div>

          {/* Col 3 — Learn */}
          <div>
            <h4 style={{ fontFamily: "'Changa One', sans-serif", fontSize: "15px", color: "#ffffff", marginBottom: "20px", letterSpacing: "0.02em" }}>Learn</h4>
            {["Our Story", "Sourcing", "FAQs", "Contact Us"].map((l) => (
              <button key={l} onClick={() => router.push("/")}
                style={{ display: "block", background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "rgba(255,255,255,0.65)", lineHeight: "2.2", padding: 0, textAlign: "left" }}>
                {l}
              </button>
            ))}
          </div>

          {/* Col 4 — Newsletter */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <h4 style={{ fontFamily: "'Changa One', sans-serif", fontSize: "18px", color: "#ffffff", letterSpacing: "0.01em" }}>Stay in the loop</h4>
            <input type="email" placeholder="Enter your email"
              style={{ height: "48px", border: "1px solid rgba(255,255,255,0.25)", backgroundColor: "transparent", color: "#ffffff", borderRadius: "4px", padding: "0 16px", fontFamily: "'DM Sans', sans-serif", fontSize: "14px", outline: "none" }} />
            <button
              style={{ height: "48px", width: "120px", backgroundColor: "#c17a3a", color: "#1a1a1a", border: "none", borderRadius: "4px", fontFamily: "'Changa One', sans-serif", fontSize: "15px", fontWeight: 600, cursor: "pointer" }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.02)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}>
              Subscribe
            </button>
          </div>
        </div>

        {/* Bottom strip */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", padding: "24px 0", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", maxWidth: "1280px", margin: "0 auto" }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>
            © 2026 Crisp, LLC · Privacy Policy · Terms of Service
          </span>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            {["VISA", "MC", "AMEX", "UPI"].map((p) => (
              <div key={p} style={{ height: "28px", padding: "0 8px", backgroundColor: "rgba(255,255,255,0.1)", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", fontWeight: 700, color: "rgba(255,255,255,0.6)", letterSpacing: "0.05em" }}>{p}</span>
              </div>
            ))}
          </div>
        </div>
      </footer>

      {/* Spinner keyframes via style trick (single-use, safe) */}
      <div style={{ display: "none" }}>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}