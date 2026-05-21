"use client";
export const dynamic = 'force-dynamic';

import { useCart } from "../../components/CartContext";
import { useRouter } from "next/navigation";
import { Suspense, useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";

const PRODUCTS = [
  { id: 1, img: "/product-1.jpg", name: "red cardboard fast-food", description: "A red cardboard fast-food box with a yellow McDonald's logo, overflowing with golden-yellow french fries.", price: 199 },
  { id: 2, img: "/product-2.jpg", name: "multi-layered double cheeseburger", description: "A multi-layered double cheeseburger with sesame bun, two grilled patties, melted yellow cheese, fresh vegetables, and crispy toppings.", price: 30 },
  { id: 3, img: "/product-3.jpg", name: "round pepperoni pizza", description: "A round pepperoni pizza with a golden-brown crust and gooey melted cheese pulling from a lifted slice.", price: 40 },
  { id: 4, img: "/product-4.jpg", name: "pile golden-brown crispy", description: "A pile of golden-brown crispy fried chicken tenders, one cut open to reveal white meat, with a small white bowl of red dipping sauce.", price: 50 },
];

const SIZES = ["Regular", "Large", "XL Combo"];
const SIZE_PRICE_ADD: Record<string, number> = { Regular: 0, Large: 40, "XL Combo": 80 };
const ADDONS = [
  { label: "Extra Crispy Seasoning", price: 20 },
  { label: "Cheese Sauce Dip", price: 30 },
  { label: "Spicy Jalapeño Drizzle", price: 25 },
];

const REVIEWS = [
  { name: "Priya M.", date: "14 Jan 2026", rating: 5, text: "Absolutely golden perfection. The fries arrived hot and crispy — I finished the box in under five minutes and immediately wanted another." },
  { name: "Rahul S.", date: "08 Jan 2026", rating: 5, text: "Ordered the XL Combo and it was worth every rupee. The seasoning is just right — not too salty, not too bland. Will order again." },
  { name: "Ananya K.", date: "02 Jan 2026", rating: 4, text: "Great fries, very fresh. Delivery was quick. The cheese sauce dip add-on really takes it to another level — highly recommend it." },
  { name: "Karan T.", date: "28 Dec 2025", rating: 5, text: "Crisp really lives up to its name. The texture, the colour, the smell — everything is exactly what you want from a fry. 10/10." },
];

function StarRating({ count }: { count: number }) {
  return (
    <span style={{ color: "#FFC72C", letterSpacing: "2px", fontSize: "1rem" }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} style={{ opacity: i < count ? 1 : 0.3 }}>★</span>
      ))}
    </span>
  );
}

function Nav() {
  const router = useRouter();
  const { items } = useCart() ?? { items: [] };
  const cartCount = items?.reduce((s: number, i: { quantity: number }) => s + i.quantity, 0) ?? 0;
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navStyle: React.CSSProperties = {
    position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
    height: "80px", display: "flex", alignItems: "center",
    justifyContent: "space-between", padding: "0 40px",
    backgroundColor: scrolled ? "#ffffff" : "transparent",
    borderBottom: scrolled ? "1px solid #EEE" : "none",
    transition: "background-color 250ms ease-in-out, border-bottom 250ms ease-in-out",
  };

  const linkColor = scrolled ? "#1a1a1a" : "#ffffff";

  return (
    <>
      <nav style={navStyle}>
        <button onClick={() => router.push("/")} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Changa One', sans-serif", fontSize: "2rem", color: linkColor, letterSpacing: "-0.02em", transition: "color 250ms ease-in-out" }}>
          Crisp
        </button>
        <div style={{ display: "flex", gap: "32px", alignItems: "center" }} className="desktop-nav">
          {["Fries", "Sauces", "Bundles", "Our Story"].map(link => (
            <button key={link} onClick={() => router.push("/shop")} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: "15px", fontWeight: 500, color: linkColor, transition: "color 250ms ease-in-out", letterSpacing: "0.01em" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#c17a3a")}
              onMouseLeave={e => (e.currentTarget.style.color = linkColor)}>
              {link}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button onClick={() => router.push("/checkout")} style={{ background: "none", border: "none", cursor: "pointer", position: "relative", padding: "4px" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={linkColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "stroke 250ms ease-in-out" }}>
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            {cartCount > 0 && (
              <span style={{ position: "absolute", top: "-4px", right: "-4px", background: "#c17a3a", color: "#fff", borderRadius: "9999px", width: "16px", height: "16px", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "11px" }}>{cartCount}</span>
            )}
          </button>
          <button onClick={() => setMobileOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", display: "none" }} className="hamburger-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={linkColor} strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "#fff", display: "flex", flexDirection: "column", padding: "32px 40px", transition: "transform 300ms ease-out" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "48px" }}>
            <span style={{ fontFamily: "'Changa One', sans-serif", fontSize: "1.8rem", color: "#1a1a1a" }}>Crisp</span>
            <button onClick={() => setMobileOpen(false)} style={{ background: "none", border: "none", cursor: "pointer" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          {["Fries", "Sauces", "Bundles", "Our Story"].map(link => (
            <button key={link} onClick={() => { router.push("/shop"); setMobileOpen(false); }} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: "28px", fontWeight: 600, color: "#1a1a1a", textAlign: "left", marginBottom: "24px", padding: 0 }}>
              {link}
            </button>
          ))}
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Changa+One:ital@0;1&family=DM+Sans:wght@400;500;600;700&display=swap');
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger-btn { display: block !important; }
        }
        .reveal { opacity: 0; transform: translateY(24px); transition: opacity 600ms ease-out, transform 600ms ease-out; }
        .reveal.visible { opacity: 1; transform: translateY(0); }
        .mobile-hide { display: flex; }
        .mobile-show { display: none; }
        @media (max-width: 768px) {
          .mobile-hide { display: none !important; }
          .mobile-show { display: flex !important; }
          .product-grid { grid-template-columns: 1fr !important; }
          .reviews-grid { grid-template-columns: 1fr !important; }
          .related-scroll { gap: 16px !important; }
        }
      `}</style>
    </>
  );
}

function Footer() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [subDone, setSubDone] = useState(false);

  return (
    <footer style={{ background: "#231F20", color: "rgba(255,255,255,0.8)", padding: "64px 40px 32px" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "48px", marginBottom: "48px" }}>
        <div>
          <div style={{ fontFamily: "'Changa One', sans-serif", fontSize: "2rem", color: "#fff", marginBottom: "12px" }}>Crisp</div>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", lineHeight: 1.7, marginBottom: "20px" }}>Crunch to perfection.</p>
          <div style={{ display: "flex", gap: "16px" }}>
            {["instagram", "facebook", "tiktok"].map(s => (
              <button key={s} style={{ background: "none", border: "none", cursor: "pointer", color: "#fff" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {s === "instagram" && <><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/></>}
                  {s === "facebook" && <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>}
                  {s === "tiktok" && <><path d="M9 12a4 4 0 104 4V4a5 5 0 005 5"/></>}
                </svg>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h4 style={{ fontFamily: "'Changa One', sans-serif", fontSize: "15px", color: "#fff", marginBottom: "20px", letterSpacing: "0.05em" }}>Shop</h4>
          {["Fries", "Sauces", "Bundles", "Gift Cards"].map(l => (
            <button key={l} onClick={() => router.push("/shop")} style={{ display: "block", background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "rgba(255,255,255,0.8)", lineHeight: 2, textAlign: "left", padding: 0 }}>{l}</button>
          ))}
        </div>

        <div>
          <h4 style={{ fontFamily: "'Changa One', sans-serif", fontSize: "15px", color: "#fff", marginBottom: "20px", letterSpacing: "0.05em" }}>Learn</h4>
          {["Our Story", "Sourcing", "FAQs", "Contact Us"].map(l => (
            <button key={l} onClick={() => router.push("/")} style={{ display: "block", background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "rgba(255,255,255,0.8)", lineHeight: 2, textAlign: "left", padding: 0 }}>{l}</button>
          ))}
        </div>

        <div>
          <h4 style={{ fontFamily: "'Changa One', sans-serif", fontSize: "18px", color: "#fff", marginBottom: "16px" }}>Stay in the loop</h4>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" style={{ height: "48px", flex: 1, minWidth: "160px", border: "1px solid rgba(255,255,255,0.3)", background: "transparent", color: "#fff", borderRadius: "4px", padding: "0 16px", fontFamily: "'DM Sans', sans-serif", fontSize: "14px", outline: "none" }} />
            <button onClick={() => { if (email) { setSubDone(true); setEmail(""); } }} style={{ height: "48px", padding: "0 20px", background: "#c17a3a", color: "#231F20", border: "none", borderRadius: "4px", cursor: "pointer", fontFamily: "'Changa One', sans-serif", fontSize: "15px", letterSpacing: "0.03em" }}>
              {subDone ? "Done!" : "Subscribe"}
            </button>
          </div>
        </div>
      </div>

      <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>© 2026 Crisp Foods Pvt Ltd · Privacy Policy · Terms of Service</p>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          {["VISA", "MC", "AMEX", "UPI"].map(p => (
            <span key={p} style={{ background: "rgba(255,255,255,0.1)", padding: "4px 8px", borderRadius: "4px", fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 600, color: "#fff", letterSpacing: "0.05em" }}>{p}</span>
          ))}
        </div>
      </div>
    </footer>
  );
}

function ProductContent() {
  const searchParams = useSearchParams();
  const paramImg   = searchParams.get("img")   ? decodeURIComponent(searchParams.get("img")!)   : null;
  const paramName  = searchParams.get("name")  ? decodeURIComponent(searchParams.get("name")!)  : null;
  const paramPrice = searchParams.get("price") ? Number(searchParams.get("price"))                : null;

  const displayImg = paramImg ?? "/product-1.jpg";
  const displayName = paramName ?? "red cardboard fast-food";
  const basePrice = paramPrice && paramPrice > 0 ? paramPrice : 199;

  const { addItem } = useCart() ?? { addItem: () => {} };
  const router = useRouter();

  const thumbnails = [displayImg, "/product-2.jpg", "/product-3.jpg", "/product-4.jpg"];
  const [activeThumb, setActiveThumb] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [selectedSize, setSelectedSize] = useState("Regular");
  const [checkedAddons, setCheckedAddons] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [addedState, setAddedState] = useState(false);
  const [buyState, setBuyState] = useState(false);

  const totalPrice = basePrice + SIZE_PRICE_ADD[selectedSize] + checkedAddons.reduce((s, a) => {
    const found = ADDONS.find(x => x.label === a);
    return s + (found ? found.price : 0);
  }, 0);

  const toggleAddon = (label: string) => {
    setCheckedAddons(prev => prev.includes(label) ? prev.filter(x => x !== label) : [...prev, label]);
  };

  const handleAddToCart = () => {
    addItem({ id: `product-${Date.now()}`, name: displayName, price: totalPrice, quantity, image: displayImg });
    setAddedState(true);
    setTimeout(() => setAddedState(false), 1500);
  };

  const handleBuyNow = () => {
    addItem({ id: `product-${Date.now()}`, name: displayName, price: totalPrice, quantity, image: displayImg });
    setBuyState(true);
    setTimeout(() => { setBuyState(false); router.push("/checkout"); }, 400);
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.15 }
    );
    document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const mainImg = thumbnails[activeThumb];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'DM Sans', sans-serif" }}>
      <Nav />

      {/* LIGHTBOX */}
      {lightbox && (
        <div onClick={() => setLightbox(false)} style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
          <button onClick={() => setLightbox(false)} style={{ position: "absolute", top: "24px", right: "24px", background: "none", border: "none", cursor: "pointer", color: "#fff" }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
          <img src={mainImg} alt={displayName} style={{ maxHeight: "90vh", maxWidth: "90vw", objectFit: "contain", borderRadius: "8px" }} onClick={e => e.stopPropagation()} />
        </div>
      )}

      {/* PRODUCT SECTION */}
      <div style={{ paddingTop: "80px" }}>
        <div className="product-grid" style={{ maxWidth: "1280px", margin: "0 auto", display: "grid", gridTemplateColumns: "55% 45%", minHeight: "calc(100vh - 80px)" }}>
          
          {/* LEFT: IMAGE GALLERY */}
          <div style={{ padding: "48px 40px 48px 48px", position: "sticky", top: "80px", height: "calc(100vh - 80px)", display: "flex", flexDirection: "column", gap: "16px" }}>
            <div onClick={() => setLightbox(true)} style={{ cursor: "zoom-in", overflow: "hidden", borderRadius: "8px", flex: 1, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
              <img src={mainImg} alt={displayName} style={{ width: "100%", height: "100%", objectFit: "cover", aspectRatio: "4/5", transition: "transform 300ms ease" }}
                onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.02)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")} />
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              {thumbnails.map((t, i) => (
                <button key={i} onClick={() => setActiveThumb(i)} style={{ width: "80px", height: "80px", border: i === activeThumb ? "2px solid #c17a3a" : "2px solid transparent", borderRadius: "4px", overflow: "hidden", cursor: "pointer", padding: 0, background: "none", flexShrink: 0 }}>
                  <img src={t} alt={`View ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: PRODUCT INFO */}
          <div style={{ padding: "48px 48px 48px 24px", overflowY: "auto" }}>
            {/* Eyebrow */}
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.15em", color: "#999", marginBottom: "8px" }}>Crisp Originals</p>

            {/* Title */}
            <h1 style={{ fontFamily: "'Changa One', sans-serif", fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 400, lineHeight: 1.1, letterSpacing: "-0.02em", color: "#231F20", marginBottom: "16px", textTransform: "capitalize" }}>
              {displayName.replace(/-/g, " ")}
            </h1>

            {/* Rating */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
              <StarRating count={5} />
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "#777" }}>4.9 · 2,140 reviews</span>
            </div>

            {/* Price */}
            <div style={{ marginBottom: "24px" }}>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "2rem", fontWeight: 700, color: "#c17a3a" }}>
                ₹{(totalPrice * quantity).toLocaleString("en-IN")}
              </span>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "#999", marginLeft: "12px" }}>incl. GST · Free delivery above ₹499</span>
            </div>

            {/* Trust badges */}
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "28px" }}>
              {["🌿 Made Fresh Daily", "🚚 Ships in 30 min", "⭐ 4.9/5 Rating"].map(t => (
                <span key={t} style={{ background: "#faf7f2", border: "1px solid #e8ddd0", borderRadius: "9999px", padding: "6px 14px", fontFamily: "'DM Sans', sans-serif", fontSize: "12px", fontWeight: 500, color: "#5a4a3a" }}>{t}</span>
              ))}
            </div>

            {/* Description */}
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "16px", lineHeight: 1.7, color: "#555", marginBottom: "32px" }}>
              {PRODUCTS.find(p => p.name === displayName)?.description ?? "Golden-yellow french fries, freshly made and perfectly seasoned for that irresistible crunch with every bite."}
            </p>

            {/* Divider */}
            <div style={{ height: "1px", background: "#e8ddd0", marginBottom: "28px" }} />

            {/* SIZE SELECTOR */}
            <div style={{ marginBottom: "28px" }}>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "#1a1a1a", marginBottom: "12px" }}>Size</p>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {SIZES.map(size => (
                  <button key={size} onClick={() => setSelectedSize(size)} style={{ borderRadius: "9999px", height: "36px", padding: "0 18px", border: selectedSize === size ? "none" : "1px solid #CCC", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "14px", background: selectedSize === size ? "#c17a3a" : "#F0EDE8", color: "#231F20", transition: "background 200ms ease, transform 180ms ease", transform: "scale(1)" }}
                    onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.03)")}
                    onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}>
                    {size} {SIZE_PRICE_ADD[size] > 0 ? `+₹${SIZE_PRICE_ADD[size]}` : ""}
                  </button>
                ))}
              </div>
            </div>

            {/* ADD-ONS */}
            <div style={{ marginBottom: "28px" }}>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "#1a1a1a", marginBottom: "12px" }}>Add-ons</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {ADDONS.map(addon => (
                  <label key={addon.label} style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
                    <span style={{ width: "20px", height: "20px", border: checkedAddons.includes(addon.label) ? "none" : "2px solid #CCC", background: checkedAddons.includes(addon.label) ? "#c17a3a" : "#fff", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background 180ms ease" }}
                      onClick={() => toggleAddon(addon.label)}>
                      {checkedAddons.includes(addon.label) && (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      )}
                    </span>
                    <span onClick={() => toggleAddon(addon.label)} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "16px", color: "#333", flex: 1 }}>{addon.label}</span>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "#c17a3a", fontWeight: 600 }}>+₹{addon.price}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* QUANTITY */}
            <div style={{ marginBottom: "28px" }}>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "#1a1a1a", marginBottom: "12px" }}>Quantity</p>
              <div style={{ display: "flex", alignItems: "center", height: "48px", width: "136px", border: "1px solid #CCC", borderRadius: "4px", overflow: "hidden" }}>
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} style={{ width: "44px", height: "100%", background: "none", border: "none", cursor: "pointer", fontSize: "20px", color: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 500 }}>−</button>
                <span style={{ flex: 1, textAlign: "center", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "16px", color: "#1a1a1a" }}>{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} style={{ width: "44px", height: "100%", background: "none", border: "none", cursor: "pointer", fontSize: "20px", color: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 500 }}>+</button>
              </div>
            </div>

            {/* CTA BUTTONS */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "32px" }}>
              <button onClick={handleAddToCart} style={{ width: "100%", height: "60px", background: addedState ? "#2a7a3a" : "#c17a3a", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "18px", letterSpacing: "0.02em", transition: "background 200ms ease, transform 180ms ease", transform: addedState ? "scale(1.01)" : "scale(1)" }}
                onMouseEnter={e => { if (!addedState) e.currentTarget.style.background = "#a8662e"; }}
                onMouseLeave={e => { if (!addedState) e.currentTarget.style.background = "#c17a3a"; }}>
                {addedState ? "✓ Added to Cart!" : "Add to Cart"}
              </button>
              <button onClick={handleBuyNow} style={{ width: "100%", height: "60px", background: "#231F20", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "18px", letterSpacing: "0.02em", transition: "background 200ms ease, transform 180ms ease" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#3a3535")}
                onMouseLeave={e => (e.currentTarget.style.background = "#231F20")}>
                {buyState ? "Taking you there..." : "Buy Now"}
              </button>
            </div>

            {/* ADDITIONAL INFO */}
            <div style={{ borderTop: "1px solid #e8ddd0", paddingTop: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                { icon: "truck", text: "Free delivery on orders above ₹499" },
                { icon: "shield", text: "100% freshness guarantee or full refund" },
                { icon: "clock", text: "Delivered hot within 30 minutes" },
              ].map(item => (
                <div key={item.text} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c17a3a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {item.icon === "truck" && <><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></>}
                    {item.icon === "shield" && <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>}
                    {item.icon === "clock" && <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>}
                  </svg>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "#555", lineHeight: 1.5 }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ACCENT BAR — Visual Fingerprint */}
      <div className="reveal" style={{ background: "#FFC72C", padding: "56px 40px", textAlign: "center" }}>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.15em", color: "#231F20", marginBottom: "12px", opacity: 0.7 }}>Limited Time</p>
        <h2 style={{ fontFamily: "'Changa One', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontWeight: 400, letterSpacing: "-0.03em", lineHeight: 1.0, color: "#231F20", marginBottom: "28px" }}>
          Introducing the Monsoon Masala Fries!
        </h2>
        <button onClick={() => router.push("/shop")} style={{ height: "52px", minWidth: "200px", padding: "0 32px", background: "#231F20", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "16px", transition: "transform 180ms ease, background 200ms ease" }}
          onMouseEnter={e => { e.currentTarget.style.background = "#3a3535"; e.currentTarget.style.transform = "scale(1.02)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "#231F20"; e.currentTarget.style.transform = "scale(1)"; }}>
          Discover More
        </button>
      </div>

      {/* REVIEWS SECTION */}
      <section style={{ padding: "96px 40px", maxWidth: "1280px", margin: "0 auto" }} className="reveal">
        <div style={{ marginBottom: "48px" }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.15em", color: "#999", marginBottom: "8px" }}>What our fans say</p>
          <h2 style={{ fontFamily: "'Changa One', sans-serif", fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 400, letterSpacing: "-0.02em", color: "#231F20", lineHeight: 1.1 }}>Golden Reviews</h2>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "16px" }}>
            <StarRating count={5} />
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "#777" }}>4.9 average from 2,140 customers</span>
          </div>
        </div>

        <div className="reviews-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "24px" }}>
          {REVIEWS.map((r, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: "12px", padding: "28px", boxShadow: "0 2px 12px rgba(26,26,26,0.06)", transition: "transform 300ms cubic-bezier(0.4,0,0.2,1), box-shadow 300ms ease" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 32px rgba(193,122,58,0.15)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 12px rgba(26,26,26,0.06)"; }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                <div>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "15px", color: "#231F20", marginBottom: "2px" }}>{r.name}</p>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "#999" }}>{r.date}</p>
                </div>
                <StarRating count={r.rating} />
              </div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "15px", lineHeight: 1.7, color: "#555" }}>{r.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* RELATED PRODUCTS */}
      <section style={{ padding: "80px 0 96px", background: "#f5f0e8" }} className="reveal">
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 40px" }}>
          <div style={{ marginBottom: "40px" }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.15em", color: "#999", marginBottom: "8px" }}>You might also love</p>
            <h2 style={{ fontFamily: "'Changa One', sans-serif", fontSize: "clamp(1.8rem, 3vw, 2.8rem)", fontWeight: 400, letterSpacing: "-0.02em", color: "#231F20", lineHeight: 1.1 }}>More from Crisp</h2>
          </div>

          <div className="related-scroll" style={{ display: "flex", gap: "24px", overflowX: "auto", paddingBottom: "16px", scrollbarWidth: "none" }}>
            {PRODUCTS.filter(p => p.img !== displayImg).map((p) => (
              <article key={p.id} onClick={() => router.push(`/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`)}
                style={{ cursor: "pointer", minWidth: "280px", maxWidth: "280px", flexShrink: 0, transition: "transform 300ms cubic-bezier(0.4,0,0.2,1)" }}
                onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-4px)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}>
                <div style={{ overflow: "hidden", borderRadius: "8px", background: "#fff", boxShadow: "0 4px 16px rgba(0,0,0,0.08)", marginBottom: "14px" }}>
                  <img src={p.img} alt={p.name} style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", transition: "transform 600ms ease" }}
                    onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
                    onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")} />
                </div>
                <h3 style={{ fontFamily: "'Changa One', sans-serif", fontSize: "18px", fontWeight: 400, color: "#231F20", marginBottom: "6px", textTransform: "capitalize" }}>{p.name.replace(/-/g, " ")}</h3>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "15px", color: "#777", lineHeight: 1.5, marginBottom: "10px" }}>{p.description.slice(0, 60)}...</p>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "16px", color: "#c17a3a" }}>₹{(p.price > 0 ? p.price : 199).toLocaleString("en-IN")}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* BRAND STORY ACCENT BAR */}
      <div className="reveal" style={{ background: "#231F20", padding: "80px 40px", textAlign: "center" }}>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(255,255,255,0.5)", marginBottom: "16px" }}>Our Promise</p>
        <h2 style={{ fontFamily: "'Changa One', sans-serif", fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 400, letterSpacing: "-0.03em", lineHeight: 1.05, color: "#FFC72C", marginBottom: "20px", maxWidth: "720px", margin: "0 auto 20px" }}>
          Every Fry, Freshly Made. Every Time.
        </h2>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "17px", lineHeight: 1.7, color: "rgba(255,255,255,0.75)", maxWidth: "560px", margin: "0 auto 36px" }}>
          We source locally grown potatoes, slice them fresh every morning, and cook each batch to golden perfection. No freezing. No shortcuts. Just honest, great fries.
        </p>
        <button onClick={() => router.push("/")} style={{ height: "52px", minWidth: "180px", padding: "0 28px", background: "#fff", color: "#231F20", border: "none", borderRadius: "4px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "15px", transition: "transform 180ms ease, box-shadow 200ms ease" }}
          onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.2)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "none"; }}>
          Our Mission
        </button>
      </div>

      {/* NEWSLETTER */}
      <section style={{ padding: "96px 40px", background: "#faf7f2", textAlign: "center" }} className="reveal">
        <div style={{ maxWidth: "560px", margin: "0 auto" }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.15em", color: "#999", marginBottom: "12px" }}>Stay in the loop</p>
          <h2 style={{ fontFamily: "'Changa One', sans-serif", fontSize: "clamp(2rem, 4.5vw, 3.2rem)", fontWeight: 400, letterSpacing: "-0.02em", color: "#231F20", marginBottom: "16px", lineHeight: 1.1 }}>
            Get the Latest Drops & Deals
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "16px", color: "#777", lineHeight: 1.6, marginBottom: "32px" }}>
            Be the first to know about new flavours, limited drops, and exclusive offers. No spam — ever.
          </p>
          <NewsletterForm />
        </div>
      </section>

      <Footer />

      {/* STICKY MOBILE BOTTOM BAR */}
      <div className="mobile-show" style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 150, background: "#fff", borderTop: "1px solid #e8ddd0", padding: "12px 20px", alignItems: "center", gap: "16px", boxShadow: "0 -4px 16px rgba(0,0,0,0.08)" }}>
        <div>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "#999", margin: 0 }}>Total</p>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "20px", color: "#c17a3a", margin: 0 }}>₹{(totalPrice * quantity).toLocaleString("en-IN")}</p>
        </div>
        <button onClick={handleAddToCart} style={{ flex: 1, height: "52px", background: addedState ? "#2a7a3a" : "#c17a3a", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "16px", transition: "background 200ms ease" }}>
          {addedState ? "✓ Added!" : "Add to Cart"}
        </button>
        <button onClick={handleBuyNow} style={{ height: "52px", padding: "0 20px", background: "#231F20", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "15px", transition: "background 200ms ease", whiteSpace: "nowrap" }}>
          Buy Now
        </button>
      </div>
    </div>
  );
}

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return done ? (
    <div style={{ padding: "20px", background: "#c17a3a", borderRadius: "8px", fontFamily: "'DM Sans', sans-serif", color: "#fff", fontWeight: 600, fontSize: "16px" }}>
      You're on the list! 🎉 Watch your inbox for golden drops.
    </div>
  ) : (
    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" style={{ height: "50px", flex: 1, minWidth: "200px", border: "1px solid #CCC", borderRadius: "4px", padding: "0 16px", fontFamily: "'DM Sans', sans-serif", fontSize: "16px", outline: "none", color: "#1a1a1a", background: "#fff" }} />
      <button onClick={() => { if (email) setDone(true); }} style={{ height: "50px", padding: "0 28px", background: "#c17a3a", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontFamily: "'Changa One', sans-serif", fontSize: "16px", letterSpacing: "0.03em", transition: "background 200ms ease, transform 180ms ease" }}
        onMouseEnter={e => { e.currentTarget.style.background = "#a8662e"; e.currentTarget.style.transform = "scale(1.02)"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "#c17a3a"; e.currentTarget.style.transform = "scale(1)"; }}>
        Subscribe
      </button>
    </div>
  );
}

export default function ProductPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "var(--bg)" }} />}>
      <ProductContent />
    </Suspense>
  );
}