"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "./CartContext";

export default function Navbar() {
  const router = useRouter();
  const { totalItems } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [badgePop, setBadgePop] = useState(false);
  const prevTotalRef = useRef(totalItems);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 8);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (totalItems !== prevTotalRef.current) {
      setBadgePop(true);
      const t = setTimeout(() => setBadgePop(false), 400);
      prevTotalRef.current = totalItems;
      return () => clearTimeout(t);
    }
  }, [totalItems]);

  const scrollToAbout = () => {
    setMenuOpen(false);
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  const navLinks = [
    {
      label: "Shop",
      action: () => {
        setMenuOpen(false);
        router.push("/shop");
      },
    },
    {
      label: "About",
      action: scrollToAbout,
    },
    {
      label: "Contact",
      action: scrollToAbout,
    },
  ];

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backgroundColor: "#faf7f2",
        transition:
          "box-shadow 0.3s cubic-bezier(0.4,0,0.2,1)",
        boxShadow: scrolled
          ? "0 2px 24px 0 rgba(26,26,26,0.10)"
          : "none",
      }}
    >
      <nav
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 24px",
          height: "72px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
        aria-label="Main navigation"
      >
        {/* Logo */}
        <button
          onClick={() => router.push("/")}
          aria-label="Crisp — go to homepage"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "4px 0",
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 700,
            fontSize: "28px",
            letterSpacing: "-0.03em",
            color: "#1a1a1a",
            lineHeight: 1,
            transition:
              "opacity 0.2s cubic-bezier(0.4,0,0.2,1)",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.opacity = "0.75")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.opacity = "1")
          }
        >
          Crisp
        </button>

        {/* Desktop nav links */}
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
          className="hidden-mobile"
          aria-label="Site sections"
        >
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={link.action}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
                fontSize: "15px",
                color: "#1a1a1a",
                padding: "8px 16px",
                borderRadius: "9999px",
                transition:
                  "background-color 0.2s cubic-bezier(0.4,0,0.2,1), color 0.2s cubic-bezier(0.4,0,0.2,1)",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.backgroundColor = "rgba(193,122,58,0.10)";
                el.style.color = "#c17a3a";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.backgroundColor = "transparent";
                el.style.color = "#1a1a1a";
              }}
              onFocus={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.outline = "2px solid #c17a3a";
                el.style.outlineOffset = "2px";
              }}
              onBlur={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.outline = "none";
              }}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Right controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {/* Cart button */}
          <button
            onClick={() => router.push("/checkout")}
            aria-label={`Cart — ${totalItems} item${totalItems !== 1 ? "s" : ""}`}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              position: "relative",
              width: "44px",
              height: "44px",
              borderRadius: "9999px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition:
                "background-color 0.2s cubic-bezier(0.4,0,0.2,1)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "rgba(193,122,58,0.10)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "transparent";
            }}
            onFocus={(e) => {
              (e.currentTarget as HTMLButtonElement).style.outline =
                "2px solid #c17a3a";
              (e.currentTarget as HTMLButtonElement).style.outlineOffset = "2px";
            }}
            onBlur={(e) => {
              (e.currentTarget as HTMLButtonElement).style.outline = "none";
            }}
          >
            {/* Cart SVG */}
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#1a1a1a"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>

            {/* Badge */}
            {totalItems > 0 && (
              <span
                aria-hidden="true"
                style={{
                  position: "absolute",
                  top: "4px",
                  right: "4px",
                  minWidth: "18px",
                  height: "18px",
                  backgroundColor: "#c17a3a",
                  color: "#faf7f2",
                  borderRadius: "9999px",
                  fontSize: "10px",
                  fontWeight: 700,
                  fontFamily: "'Inter', sans-serif",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0 4px",
                  lineHeight: 1,
                  transition:
                    "transform 0.25s cubic-bezier(0.4,0,0.2,1), opacity 0.25s cubic-bezier(0.4,0,0.2,1)",
                  transform: badgePop ? "scale(1.35)" : "scale(1)",
                }}
              >
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </button>

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="show-mobile"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              width: "44px",
              height: "44px",
              borderRadius: "9999px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition:
                "background-color 0.2s cubic-bezier(0.4,0,0.2,1)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "rgba(193,122,58,0.10)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "transparent";
            }}
          >
            {menuOpen ? (
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#1a1a1a"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#1a1a1a"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <line x1="3" y1="7" x2="21" y2="7" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="17" x2="21" y2="17" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile overlay menu */}
      <div
        role="dialog"
        aria-label="Mobile navigation menu"
        aria-modal="true"
        style={{
          position: "fixed",
          inset: 0,
          top: "72px",
          backgroundColor: "#faf7f2",
          zIndex: 49,
          display: "flex",
          flexDirection: "column",
          padding: "32px 24px",
          gap: "8px",
          transition:
            "opacity 0.25s cubic-bezier(0.4,0,0.2,1), transform 0.25s cubic-bezier(0.4,0,0.2,1)",
          opacity: menuOpen ? 1 : 0,
          transform: menuOpen ? "translateY(0)" : "translateY(-12px)",
          pointerEvents: menuOpen ? "auto" : "none",
        }}
        className="show-mobile"
      >
        {navLinks.map((link) => (
          <button
            key={link.label}
            onClick={link.action}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "'Inter', sans-serif",
              fontWeight: 500,
              fontSize: "20px",
              color: "#1a1a1a",
              padding: "16px 0",
              textAlign: "left",
              borderBottom: "1px solid rgba(212,180,160,0.35)",
              transition:
                "color 0.2s cubic-bezier(0.4,0,0.2,1)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "#c17a3a";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "#1a1a1a";
            }}
          >
            {link.label}
          </button>
        ))}

        <button
          onClick={() => {
            setMenuOpen(false);
            router.push("/checkout");
          }}
          style={{
            marginTop: "16px",
            backgroundColor: "#c17a3a",
            border: "none",
            cursor: "pointer",
            fontFamily: "'Inter', sans-serif",
            fontWeight: 600,
            fontSize: "16px",
            color: "#faf7f2",
            padding: "14px 24px",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            transition:
              "transform 0.25s cubic-bezier(0.4,0,0.2,1), opacity 0.25s cubic-bezier(0.4,0,0.2,1)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform =
              "scale(1.02)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
          }}
          onMouseDown={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform =
              "scale(0.98)";
          }}
          onMouseUp={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform =
              "scale(1.02)";
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#faf7f2"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 01-8 0" />
          </svg>
          View Cart
          {totalItems > 0 && (
            <span
              style={{
                backgroundColor: "#faf7f2",
                color: "#c17a3a",
                borderRadius: "9999px",
                fontSize: "12px",
                fontWeight: 700,
                padding: "1px 7px",
                lineHeight: "1.5",
              }}
            >
              {totalItems}
            </span>
          )}
        </button>
      </div>

      {/* Scoped responsive utilities — injected via globals.css, mimicked via Tailwind-equivalent inline approach */}
      <style
        // This is a server-rendered <style> in a layout/server context only;
        // placed here as a last-resort responsive toggle since Tailwind
        // md: classes can't target custom class names like .show-mobile
        // Without this, hamburger visibility can't be toggled at breakpoints.
        // NOTE: This <style> is intentional for purely static, non-hydrating
        // display:none rules — zero dynamic values, zero hydration mismatch risk.
        dangerouslySetInnerHTML={{
          __html: `
            @media (min-width: 768px) {
              .show-mobile { display: none !important; }
            }
            @media (max-width: 767px) {
              .hidden-mobile { display: none !important; }
            }
          `,
        }}
      />
    </header>
  );
}