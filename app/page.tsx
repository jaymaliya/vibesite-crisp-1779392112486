"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../components/CartContext";

const products = [
  {
    id: 1,
    img: "/product-1.jpg",
    name: "red cardboard fast-food",
    description: "A red cardboard fast-food box with a yellow McDonald's logo, overflowing with golden-yellow french fries.",
    price: 199,
  },
  {
    id: 2,
    img: "/product-2.jpg",
    name: "multi-layered double cheeseburger",
    description: "A multi-layered double cheeseburger with sesame bun, two grilled patties, melted yellow cheese, fresh vegetables.",
    price: 30,
  },
  {
    id: 3,
    img: "/product-3.jpg",
    name: "round pepperoni pizza",
    description: "A round pepperoni pizza with a golden-brown crust and gooey melted cheese pulling from a lifted slice.",
    price: 40,
  },
  {
    id: 4,
    img: "/product-4.jpg",
    name: "pile golden-brown crispy",
    description: "A pile of golden-brown crispy fried chicken tenders, one cut open to reveal white meat, with a small white bowl of red dip.",
    price: 50,
  },
];

const sauces = [
  { name: "Classic Ketchup", notes: "Tangy tomato, smoky finish", bg: "#fde8e8", img: "/product-1.jpg" },
  { name: "Smoky BBQ", notes: "Deep caramel, hickory warmth", bg: "#fde8d0", img: "/product-2.jpg" },
  { name: "Garlic Aioli", notes: "Creamy, golden, addictive", bg: "#fdf8e1", img: "/product-3.jpg" },
];

export default function HomePage() {
  const router = useRouter();
  const { addItem, items } = useCart();
  const cartCount = items.reduce((a, b) => a + b.quantity, 0);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [addedId, setAddedId] = useState<number | null>(null);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleAddToCart = (p: typeof products[0]) => {
    addItem({ id: String(p.id), name: p.name, price: p.price, quantity: 1, image: p.img });
    setAddedId(p.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  const scrollCarousel = (dir: "left" | "right") => {
    if (!carouselRef.current) return;
    carouselRef.current.scrollBy({ left: dir === "right" ? 340 : -340, behavior: "smooth" });
  };

  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Changa+One:ital@0;1&family=DM+Sans:wght@400;500;600;700&display=swap"
      />
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0;}
        :root{--bg:#faf7f2;--surface:#d4a574;--primary:#1a1a1a;--accent:#c17a3a;--text:#1a1a1a;--muted:#d4b8a0;}
        body{background:var(--bg);color:var(--text);font-family:'DM Sans',sans-serif;}
        .reveal{opacity:0;transform:translateY(28px);transition:opacity 0.6s ease,transform 0.6s ease;}
        .reveal.revealed{opacity:1;transform:translateY(0);}
        .stagger-1{transition-delay:0.1s;}
        .stagger-2{transition-delay:0.2s;}
        .stagger-3{transition-delay:0.3s;}
        .stagger-4{transition-delay:0.4s;}
        ::-webkit-scrollbar{height:4px;width:4px;}
        ::-webkit-scrollbar-thumb{background:var(--muted);border-radius:99px;}
        button:focus-visible,a:focus-visible{outline:2px solid var(--accent);outline-offset:2px;}
        @media(max-width:768px){
          .hero-title{font-size:clamp(2.6rem,10vw,4.5rem)!important;}
          .craft-grid{grid-template-columns:1fr!important;}
          .sauce-grid{grid-template-columns:1fr!important;}
          .footer-grid{grid-template-columns:1fr!important;}
          .nav-links{display:none!important;}
          .hamburger{display:flex!important;}
          .section-pad{padding:64px 24px!important;}
          .carousel-btn{display:none!important;}
        }
      `}</style>

      {/* NAV */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        height: "80px", display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 48px",
        backgroundColor: scrolled ? "#ffffff" : "transparent",
        borderBottom: scrolled ? "1px solid #EEE" : "none",
        transition: "background-color 250ms ease-in-out, border-color 250ms ease-in-out",
      }}>
        <button
          className="hamburger"
          onClick={() => setMobileOpen(true)}
          style={{
            display: "none", flexDirection: "column", gap: "5px", background: "none", border: "none",
            cursor: "pointer", padding: "8px",
          }}
          aria-label="Open menu"
        >
          {[0, 1, 2].map((i) => (
            <span key={i} style={{ width: "24px", height: "2px", background: scrolled ? "#1a1a1a" : "#fff", display: "block", borderRadius: "2px", transition: "background 250ms" }} />
          ))}
        </button>

        <button
          onClick={() => router.push("/")}
          style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Changa One',sans-serif", fontSize: "28px", letterSpacing: "-0.02em", color: scrolled ? "#1a1a1a" : "#ffffff", lineHeight: 1 }}
          aria-label="Crisp home"
        >
          Crisp
        </button>

        <div className="nav-links" style={{ display: "flex", gap: "40px", alignItems: "center" }}>
          {["Fries", "Sauces", "Bundles", "Our Story"].map((link) => (
            <button
              key={link}
              onClick={() => router.push("/shop")}
              style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: "15px", fontWeight: 500, color: scrolled ? "#1a1a1a" : "#ffffff", transition: "opacity 200ms", opacity: 0.9 }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.9")}
            >
              {link}
            </button>
          ))}
        </div>

        <button
          onClick={() => router.push("/checkout")}
          style={{ position: "relative", background: "none", border: "none", cursor: "pointer", padding: "8px" }}
          aria-label="View cart"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={scrolled ? "#1a1a1a" : "#ffffff"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
          </svg>
          {cartCount > 0 && (
            <span style={{ position: "absolute", top: "2px", right: "2px", width: "16px", height: "16px", borderRadius: "50%", background: "var(--accent)", color: "#fff", fontSize: "10px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans',sans-serif" }}>
              {cartCount}
            </span>
          )}
        </button>
      </nav>

      {/* MOBILE NAV OVERLAY */}
      {mobileOpen && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 200, background: "#ffffff",
          display: "flex", flexDirection: "column", padding: "32px 32px",
          animation: "slideIn 300ms ease-out",
        }}>
          <style>{`@keyframes slideIn{from{transform:translateX(100%)}to{transform:translateX(0)}}`}</style>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "48px" }}>
            <span style={{ fontFamily: "'Changa One',sans-serif", fontSize: "28px", color: "#1a1a1a" }}>Crisp</span>
            <button onClick={() => setMobileOpen(false)} style={{ background: "none", border: "none", cursor: "pointer" }} aria-label="Close menu">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          </div>
          {["Fries", "Sauces", "Bundles", "Our Story"].map((link) => (
            <button
              key={link}
              onClick={() => { setMobileOpen(false); router.push("/shop"); }}
              style={{ background: "none", border: "none", cursor: "pointer", textAlign: "left", fontFamily: "'DM Sans',sans-serif", fontSize: "28px", fontWeight: 600, color: "#1a1a1a", marginBottom: "24px", padding: 0 }}
            >
              {link}
            </button>
          ))}
          <div style={{ marginTop: "auto" }}>
            <button
              onClick={() => { setMobileOpen(false); router.push("/checkout"); }}
              style={{ display: "flex", alignItems: "center", gap: "8px", background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: "16px", fontWeight: 600, color: "#1a1a1a" }}
            >
              Cart {cartCount > 0 && <span style={{ width: "20px", height: "20px", borderRadius: "50%", background: "var(--accent)", color: "#fff", fontSize: "11px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{cartCount}</span>}
            </button>
          </div>
        </div>
      )}

      {/* HERO */}
      <section style={{ position: "relative", width: "100%", height: "100vh", minHeight: "600px", overflow: "hidden" }}>
        <img
          src="/product-1.jpg"
          alt="Red cardboard fast-food box overflowing with golden french fries"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.5) 100%)",
        }} />
        <div style={{
          position: "relative", zIndex: 2, height: "100%",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          textAlign: "center", padding: "0 24px",
        }}>
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.18em", color: "rgba(255,255,255,0.75)", marginBottom: "24px", fontWeight: 500 }}>
            Golden · Fast · Fearlessly Simple
          </span>
          <h1
            className="hero-title"
            style={{
              fontFamily: "'Changa One',sans-serif",
              fontSize: "clamp(3.5rem, 8vw, 6.5rem)",
              lineHeight: 1.0, letterSpacing: "-0.04em",
              color: "#ffffff", textShadow: "0 2px 8px rgba(0,0,0,0.3)",
              marginBottom: "16px", maxWidth: "900px",
            }}
          >
            Every Bite,<br />Pure Gold.
          </h1>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "14px", color: "rgba(255,255,255,0.8)", marginBottom: "40px", lineHeight: 1.6 }}>
            Sourced locally, crafted fresh daily
          </p>

          <div style={{ display: "flex", gap: "32px", alignItems: "center", flexWrap: "wrap", justifyContent: "center", marginBottom: "48px" }}>
            {[
              { label: "★ 4.9 / 5", sub: "12,000+ happy fans" },
              { label: "Made in India", sub: "Locally sourced" },
              { label: "Free delivery", sub: "On orders ₹499+" },
            ].map((t) => (
              <div key={t.label} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "13px", fontWeight: 700, color: "#ffffff" }}>{t.label}</div>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.65)" }}>{t.sub}</div>
              </div>
            ))}
          </div>

          <button
            onClick={() => router.push("/shop")}
            style={{
              height: "60px", minWidth: "240px", padding: "0 40px",
              background: "#FFC72C", border: "none", borderRadius: "4px",
              fontFamily: "'Changa One',sans-serif", fontSize: "18px", color: "#231F20",
              cursor: "pointer", letterSpacing: "0.01em",
              boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
              transition: "transform 180ms ease, box-shadow 180ms ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,0.3)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.25)"; }}
            onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
          >
            Order Now
          </button>
        </div>

        {/* Scroll cue */}
        <div style={{ position: "absolute", bottom: "32px", left: "50%", transform: "translateX(-50%)", zIndex: 2 }}>
          <div style={{ width: "24px", height: "40px", border: "2px solid rgba(255,255,255,0.5)", borderRadius: "12px", display: "flex", justifyContent: "center", paddingTop: "6px" }}>
            <div style={{
              width: "3px", height: "8px", background: "rgba(255,255,255,0.7)", borderRadius: "2px",
              animation: "scrollPulse 1.8s ease-in-out infinite",
            }} />
          </div>
          <style>{`@keyframes scrollPulse{0%,100%{transform:translateY(0);opacity:0.7}50%{transform:translateY(10px);opacity:0.2}}`}</style>
        </div>
      </section>

      {/* A TASTE OF OUR CRAFT */}
      <section className="section-pad" style={{ padding: "96px 48px", background: "#F8F8F8" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <p className="reveal" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.15em", color: "#999", marginBottom: "8px" }}>
            Our Philosophy
          </p>
          <h2 className="reveal" style={{ fontFamily: "'Changa One',sans-serif", fontSize: "clamp(2.2rem,4vw,3.5rem)", color: "#231F20", marginBottom: "64px", letterSpacing: "-0.02em", lineHeight: 1.05 }}>
            A Taste of Our Craft
          </h2>

          {/* Block 1 — image left */}
          <div className="craft-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px", alignItems: "center", marginBottom: "80px" }}>
            <div className="reveal" style={{ overflow: "hidden", borderRadius: "8px" }}>
              <img
                src="/product-2.jpg"
                alt="Artisanal burger crafted with care"
                style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", transition: "transform 300ms ease" }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              />
            </div>
            <div className="reveal stagger-1" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <h3 style={{ fontFamily: "'Changa One',sans-serif", fontSize: "clamp(2rem,4vw,3.5rem)", lineHeight: 1.1, color: "#231F20", letterSpacing: "-0.02em" }}>
                From field to fry in 24 hours.
              </h3>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "18px", lineHeight: 1.6, color: "#555", maxWidth: "480px" }}>
                We partner directly with potato farms in Agra and Pune. No cold storage, no compromise. Every fry you taste was harvested within a day of arriving at our kitchen. That's our non-negotiable promise of freshness.
              </p>
              <button
                onClick={() => router.push("/shop")}
                style={{ alignSelf: "flex-start", padding: "14px 32px", background: "#231F20", color: "#fff", border: "none", borderRadius: "4px", fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: "15px", cursor: "pointer", transition: "transform 180ms ease" }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                Shop All Fries
              </button>
            </div>
          </div>

          {/* Block 2 — image right */}
          <div className="craft-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px", alignItems: "center" }}>
            <div className="reveal stagger-1" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <h3 style={{ fontFamily: "'Changa One',sans-serif", fontSize: "clamp(2rem,4vw,3.5rem)", lineHeight: 1.1, color: "#231F20", letterSpacing: "-0.02em" }}>
                The double-fry method. No shortcuts.
              </h3>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "18px", lineHeight: 1.6, color: "#555", maxWidth: "480px" }}>
                Every batch is blanched at 150°C, rested, then finished at 180°C for that glass-shard crunch. We use cold-pressed sunflower oil, changed every four hours. Science + obsession = the perfect fry.
              </p>
            </div>
            <div className="reveal" style={{ overflow: "hidden", borderRadius: "8px" }}>
              <img
                src="/product-4.jpg"
                alt="Golden crispy fried chicken tenders — the double-fry method"
                style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", transition: "transform 300ms ease" }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              />
            </div>
          </div>
        </div>
      </section>

      {/* OUR SIGNATURE FRIES — Carousel */}
      <section className="section-pad" style={{ padding: "96px 0 96px 48px", background: "var(--bg)", overflow: "hidden" }}>
        <div style={{ maxWidth: "1200px", marginLeft: "auto", marginRight: "auto", paddingRight: "48px", marginBottom: "48px" }}>
          <p className="reveal" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.15em", color: "#999", marginBottom: "8px" }}>
            The Menu
          </p>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
            <h2 className="reveal" style={{ fontFamily: "'Changa One',sans-serif", fontSize: "clamp(2.2rem,4vw,3.5rem)", color: "#231F20", letterSpacing: "-0.02em", lineHeight: 1.05 }}>
              Our Signature Fries
            </h2>
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                className="carousel-btn"
                onClick={() => scrollCarousel("left")}
                style={{ width: "44px", height: "44px", borderRadius: "50%", background: "var(--accent)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", transition: "transform 180ms ease" }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                aria-label="Scroll left"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
              </button>
              <button
                className="carousel-btn"
                onClick={() => scrollCarousel("right")}
                style={{ width: "44px", height: "44px", borderRadius: "50%", background: "var(--accent)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", transition: "transform 180ms ease" }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                aria-label="Scroll right"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
              </button>
            </div>
          </div>
        </div>

        <div
          ref={carouselRef}
          style={{ display: "flex", gap: "24px", overflowX: "auto", scrollSnapType: "x mandatory", paddingBottom: "16px", paddingRight: "48px", WebkitOverflowScrolling: "touch" }}
        >
          {products.map((p, i) => (
            <article
              key={p.id}
              className={`reveal stagger-${i + 1}`}
              style={{ flex: "0 0 300px", scrollSnapAlign: "start", cursor: "pointer" }}
              onClick={() => router.push(`/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`)}
            >
              <div style={{ background: "#ffffff", borderRadius: "4px", overflow: "hidden", boxShadow: "0 8px 24px rgba(0,0,0,0.10)", transition: "transform 250ms cubic-bezier(0.4,0,0.2,1), box-shadow 250ms cubic-bezier(0.4,0,0.2,1)" }}
                onMouseEnter={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.transform = "translateY(-4px)"; el.style.boxShadow = "0 16px 40px rgba(193,122,58,0.25)"; }}
                onMouseLeave={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.transform = "translateY(0)"; el.style.boxShadow = "0 8px 24px rgba(0,0,0,0.10)"; }}
              >
                <div style={{ overflow: "hidden", aspectRatio: "1/1" }}>
                  <img
                    src={p.img}
                    alt={p.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 600ms ease" }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  />
                </div>
                <div style={{ padding: "20px" }}>
                  <h3 style={{ fontFamily: "'Changa One',sans-serif", fontSize: "20px", color: "#231F20", marginBottom: "8px", lineHeight: 1.2, textTransform: "capitalize" }}>{p.name}</h3>
                  <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "14px", color: "#777", lineHeight: 1.5, marginBottom: "16px" }}>{p.description.slice(0, 80)}…</p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: "17px", color: "var(--accent)" }}>₹{p.price.toLocaleString("en-IN")}</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleAddToCart(p); }}
                      style={{
                        padding: "8px 18px", background: addedId === p.id ? "#2e7d32" : "#231F20", color: "#fff", border: "none",
                        borderRadius: "4px", fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: "13px",
                        cursor: "pointer", transition: "transform 180ms ease, background 200ms",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    >
                      {addedId === p.id ? "✓ Added" : "Add to Cart"}
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* LIMITED TIME CRUNCH — Visual Fingerprint Accent Bar */}
      <section style={{ background: "#FFC72C", padding: "64px 48px", textAlign: "center" }}>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.15em", color: "#6b3f00", marginBottom: "16px", fontWeight: 500 }}>
          Limited Drop · While Stocks Last
        </p>
        <h2 style={{ fontFamily: "'Changa One',sans-serif", fontSize: "clamp(2.5rem,6vw,5rem)", color: "#231F20", letterSpacing: "-0.03em", lineHeight: 1.0, marginBottom: "12px" }}>
          Introducing the<br />Monsoon Masala Fries!
        </h2>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "16px", color: "#4a2e00", lineHeight: 1.6, marginBottom: "40px", maxWidth: "520px", marginLeft: "auto", marginRight: "auto" }}>
          A seasonal special spiced with chaat masala, amchur, and a hint of Kashmiri chilli. Available only this July.
        </p>
        <button
          onClick={() => router.push("/shop")}
          style={{
            height: "52px", minWidth: "200px", padding: "0 40px", background: "#231F20", color: "#ffffff",
            border: "none", borderRadius: "4px", fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: "16px",
            cursor: "pointer", transition: "transform 180ms ease, box-shadow 180ms ease",
            boxShadow: "0 4px 16px rgba(35,31,32,0.25)",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(35,31,32,0.35)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(35,31,32,0.25)"; }}
          onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
          onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
        >
          Discover More
        </button>
      </section>

      {/* OUR DELICIOUS DIPPING SAUCES */}
      <section className="section-pad" style={{ padding: "96px 48px", background: "var(--bg)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <p className="reveal" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.15em", color: "#999", marginBottom: "8px", textAlign: "center" }}>
            Pair Perfect
          </p>
          <h2 className="reveal" style={{ fontFamily: "'Changa One',sans-serif", fontSize: "clamp(2.2rem,4vw,3.5rem)", color: "#231F20", textAlign: "center", marginBottom: "64px", letterSpacing: "-0.02em", lineHeight: 1.05 }}>
            Our Delicious Dipping Sauces
          </h2>
          <div className="sauce-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "32px" }}>
            {sauces.map((s, i) => (
              <article
                key={s.name}
                className={`reveal stagger-${i + 1}`}
                style={{
                  borderRadius: "12px", overflow: "hidden", cursor: "pointer",
                  transition: "transform 250ms cubic-bezier(0.4,0,0.2,1), box-shadow 250ms cubic-bezier(0.4,0,0.2,1)",
                  boxShadow: "0 4px 16px rgba(193,122,58,0.12)",
                }}
                onClick={() => router.push("/shop")}
                onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.transform = "translateY(-4px)"; el.style.boxShadow = "0 16px 40px rgba(193,122,58,0.22)"; }}
                onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.transform = "translateY(0)"; el.style.boxShadow = "0 4px 16px rgba(193,122,58,0.12)"; }}
              >
                <div style={{ background: s.bg, padding: "40px 24px 0", display: "flex", justifyContent: "center", clipPath: "polygon(0 0,100% 0,100% 85%,50% 100%,0 85%)" }}>
                  <div style={{ overflow: "hidden", width: "200px", height: "200px", borderRadius: "8px" }}>
                    <img
                      src={s.img}
                      alt={`${s.name} dipping sauce`}
                      style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 600ms ease" }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    />
                  </div>
                </div>
                <div style={{ padding: "32px 24px 28px", background: "#ffffff" }}>
                  <h3 style={{ fontFamily: "'Changa One',sans-serif", fontSize: "20px", color: "#231F20", marginBottom: "8px" }}>{s.name}</h3>
                  <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "14px", color: "#777", lineHeight: 1.5 }}>{s.notes}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* THE STORY BEHIND THE CRUNCH */}
      <section style={{ position: "relative", padding: "120px 48px", overflow: "hidden" }}>
        <img
          src="/product-3.jpg"
          alt="The story behind Crisp — our kitchen and commitment"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.72))" }} />
        <div className="reveal" style={{ position: "relative", zIndex: 2, maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.18em", color: "rgba(255,255,255,0.65)", marginBottom: "16px" }}>
            Our Mission
          </p>
          <h2 style={{ fontFamily: "'Changa One',sans-serif", fontSize: "clamp(2.2rem,4vw,3.8rem)", color: "#ffffff", letterSpacing: "-0.02em", lineHeight: 1.05, marginBottom: "24px" }}>
            The Story Behind the Crunch
          </h2>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "17px", lineHeight: 1.75, color: "rgba(255,255,255,0.88)", marginBottom: "40px" }}>
            Crisp was born in a 200 sq ft kitchen in Pune in 2021. Two founders. One obsession: the perfect fry. We sourced, tested, fried, tasted, and failed — hundreds of times. Until we didn't. Today, we serve over 12,000 happy customers across India with the same obsessive precision. Every bag of fries is a love letter to simplicity done perfectly.
          </p>
          <button
            onClick={() => router.push("/shop")}
            style={{
              height: "48px", padding: "0 36px", background: "#ffffff", color: "#231F20",
              border: "none", borderRadius: "4px", fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: "15px",
              cursor: "pointer", transition: "transform 180ms ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            Our Mission
          </button>
        </div>
      </section>

      {/* FUEL YOUR FRENZY — Newsletter */}
      <section className="section-pad" style={{ padding: "96px 48px", background: "#e8f4f0", position: "relative", overflow: "hidden" }}>
        {/* SVG background illustration */}
        <svg
          aria-hidden="true"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.18 }}
          viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice"
        >
          {[...Array(18)].map((_, i) => (
            <g key={i} transform={`translate(${60 + (i % 6) * 200},${80 + Math.floor(i / 6) * 180}) rotate(${-15 + i * 7})`}>
              <rect x={-4} y={-40} width={8} height={80} rx={4} fill="#c17a3a" />
            </g>
          ))}
          {[...Array(6)].map((_, i) => (
            <ellipse key={`box-${i}`} cx={100 + i * 200} cy={520} rx={40} ry={25} fill="#e74c3c" opacity={0.5} />
          ))}
        </svg>

        <div className="reveal" style={{ position: "relative", zIndex: 2, maxWidth: "640px", margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.15em", color: "#777", marginBottom: "12px" }}>
            Stay in the loop
          </p>
          <h2 style={{ fontFamily: "'Changa One',sans-serif", fontSize: "clamp(2rem,4.5vw,3.8rem)", color: "#231F20", letterSpacing: "-0.02em", lineHeight: 1.05, marginBottom: "16px" }}>
            Fuel Your Frenzy
          </h2>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "16px", color: "#555", lineHeight: 1.65, marginBottom: "40px" }}>
            Get the latest drops, exclusive deals, and early access to new flavours — straight to your inbox.
          </p>

          {subscribed ? (
            <div style={{ padding: "24px 32px", background: "#ffffff", borderRadius: "8px", fontFamily: "'Changa One',sans-serif", fontSize: "20px", color: "#2e7d32" }}>
              🎉 You're in! Expect crispy news soon.
            </div>
          ) : (
            <form
              onSubmit={(e) => { e.preventDefault(); if (email.trim()) setSubscribed(true); }}
              style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}
            >
              <input
                type="email"
                required
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  height: "50px", flex: "1 1 260px", maxWidth: "360px",
                  border: "1px solid #CCC", borderRadius: "4px", padding: "0 16px",
                  fontFamily: "'DM Sans',sans-serif", fontSize: "16px", background: "#ffffff", color: "#1a1a1a",
                  outline: "none",
                }}
              />
              <button
                type="submit"
                style={{
                  height: "50px", padding: "0 32px", background: "#FFC72C", color: "#231F20", border: "none",
                  borderRadius: "4px", fontFamily: "'Changa One',sans-serif", fontSize: "16px", cursor: "pointer",
                  transition: "transform 180ms ease",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#231F20", color: "rgba(255,255,255,0.8)", padding: "72px 48px 0" }}>
        <div className="footer-grid" style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1.4fr", gap: "48px", maxWidth: "1200px", margin: "0 auto", paddingBottom: "64px" }}>
          {/* Col 1 */}
          <div>
            <button onClick={() => router.push("/")} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Changa One',sans-serif", fontSize: "32px", color: "#ffffff", marginBottom: "12px", display: "block", letterSpacing: "-0.02em" }}>
              Crisp
            </button>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "14px", lineHeight: 1.65, marginBottom: "24px", color: "rgba(255,255,255,0.65)" }}>
              Crunch to perfection.
            </p>
            <div style={{ display: "flex", gap: "16px" }}>
              {[
                { label: "Instagram", path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" },
                { label: "Facebook", path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" },
                { label: "TikTok", path: "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" },
              ].map((social) => (
                <button
                  key={social.label}
                  onClick={() => {}}
                  style={{ width: "36px", height: "36px", background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 180ms" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.2)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
                  aria-label={social.label}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#ffffff"><path d={social.path} /></svg>
                </button>
              ))}
            </div>
          </div>

          {/* Col 2 — Shop */}
          <div>
            <h4 style={{ fontFamily: "'Changa One',sans-serif", fontSize: "15px", color: "#ffffff", marginBottom: "20px", letterSpacing: "0.02em" }}>Shop</h4>
            {["Fries", "Sauces", "Bundles", "Gift Cards"].map((l) => (
              <button key={l} onClick={() => router.push("/shop")} style={{ display: "block", background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: "14px", color: "rgba(255,255,255,0.7)", lineHeight: 2, textAlign: "left", padding: 0, transition: "color 180ms" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
              >{l}</button>
            ))}
          </div>

          {/* Col 3 — Learn */}
          <div>
            <h4 style={{ fontFamily: "'Changa One',sans-serif", fontSize: "15px", color: "#ffffff", marginBottom: "20px", letterSpacing: "0.02em" }}>Learn</h4>
            {["Our Story", "Sourcing", "FAQs", "Contact Us"].map((l) => (
              <button key={l} onClick={() => router.push("/shop")} style={{ display: "block", background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: "14px", color: "rgba(255,255,255,0.7)", lineHeight: 2, textAlign: "left", padding: 0, transition: "color 180ms" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
              >{l}</button>
            ))}
          </div>

          {/* Col 4 — Newsletter */}
          <div>
            <h4 style={{ fontFamily: "'Changa One',sans-serif", fontSize: "18px", color: "#ffffff", marginBottom: "16px" }}>Stay in the loop</h4>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.6)", marginBottom: "16px", lineHeight: 1.6 }}>New drops and deals, direct to your inbox.</p>
            <input
              type="email"
              placeholder="your@email.com"
              style={{
                width: "100%", height: "48px", marginBottom: "10px",
                border: "1px solid rgba(255,255,255,0.3)", borderRadius: "4px",
                background: "transparent", color: "#ffffff", padding: "0 16px",
                fontFamily: "'DM Sans',sans-serif", fontSize: "14px", outline: "none",
              }}
            />
            <button
              style={{
                width: "120px", height: "48px", background: "#FFC72C", color: "#231F20",
                border: "none", borderRadius: "4px", fontFamily: "'Changa One',sans-serif",
                fontSize: "15px", cursor: "pointer", transition: "transform 180ms ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              onClick={() => {}}
            >
              Subscribe
            </button>
          </div>
        </div>

        {/* Bottom strip */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", maxWidth: "1200px", margin: "0 auto", padding: "24px 0", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.45)" }}>
            © 2026 Crisp Foods Pvt. Ltd. · Privacy Policy · Terms of Service
          </p>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            {["Visa", "MC", "Amex", "UPI"].map((card) => (
              <div
                key={card}
                style={{ height: "28px", minWidth: "44px", background: "rgba(255,255,255,0.12)", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans',sans-serif", fontSize: "10px", fontWeight: 700, color: "rgba(255,255,255,0.7)", padding: "0 8px" }}
              >
                {card}
              </div>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
}