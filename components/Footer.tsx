"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function Footer() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [emailError, setEmailError] = useState("");

  const handleSubscribe = () => {
    if (!email.trim()) {
      setEmailError("Please enter your email address.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setEmailError("");
    setSubscribed(true);
    setEmail("");
  };

  const scrollToAbout = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  const quickLinks = [
    { label: "Home", action: () => router.push("/") },
    { label: "Shop", action: () => router.push("/shop") },
    { label: "About", action: scrollToAbout },
    { label: "Contact", action: scrollToAbout },
  ];

  return (
    <footer
      style={{
        backgroundColor: "#faf7f2",
        borderTop: "1px solid rgba(212,180,160,0.40)",
        paddingTop: "96px",
        paddingBottom: "48px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 24px",
        }}
      >
        {/* Top grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "48px",
            marginBottom: "64px",
          }}
        >
          {/* Brand column */}
          <div>
            <button
              onClick={() => router.push("/")}
              aria-label="Crisp — go to homepage"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 700,
                fontSize: "32px",
                letterSpacing: "-0.03em",
                color: "#1a1a1a",
                lineHeight: 1,
                marginBottom: "12px",
                display: "block",
                transition:
                  "opacity 0.2s cubic-bezier(0.4,0,0.2,1)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.opacity = "0.7";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.opacity = "1";
              }}
            >
              Crisp
            </button>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 400,
                fontSize: "15px",
                lineHeight: 1.7,
                color: "#d4b8a0",
                maxWidth: "240px",
                marginTop: "8px",
              }}
            >
              Golden. Fast. Fearlessly simple.
              <br />
              Made in India, with joy.
            </p>

            {/* Social icons */}
            <div
              style={{
                display: "flex",
                gap: "16px",
                marginTop: "24px",
              }}
            >
              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Crisp on Instagram"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "9999px",
                  border: "1.5px solid rgba(193,122,58,0.35)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#c17a3a",
                  transition:
                    "background-color 0.2s cubic-bezier(0.4,0,0.2,1), border-color 0.2s cubic-bezier(0.4,0,0.2,1)",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.backgroundColor = "rgba(193,122,58,0.12)";
                  el.style.borderColor = "#c17a3a";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.backgroundColor = "transparent";
                  el.style.borderColor = "rgba(193,122,58,0.35)";
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#c17a3a"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.5" fill="#c17a3a" stroke="none" />
                </svg>
              </a>

              {/* Twitter / X */}
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Crisp on Twitter"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "9999px",
                  border: "1.5px solid rgba(193,122,58,0.35)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#c17a3a",
                  transition:
                    "background-color 0.2s cubic-bezier(0.4,0,0.2,1), border-color 0.2s cubic-bezier(0.4,0,0.2,1)",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.backgroundColor = "rgba(193,122,58,0.12)";
                  el.style.borderColor = "#c17a3a";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.backgroundColor = "transparent";
                  el.style.borderColor = "rgba(193,122,58,0.35)";
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#c17a3a"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M4 4l16 16M4 20L20 4" />
                </svg>
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat with Crisp on WhatsApp"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "9999px",
                  border: "1.5px solid rgba(193,122,58,0.35)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#c17a3a",
                  transition:
                    "background-color 0.2s cubic-bezier(0.4,0,0.2,1), border-color 0.2s cubic-bezier(0.4,0,0.2,1)",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.backgroundColor = "rgba(193,122,58,0.12)";
                  el.style.borderColor = "#c17a3a";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.backgroundColor = "transparent";
                  el.style.borderColor = "rgba(193,122,58,0.35)";
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#c17a3a"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 600,
                fontSize: "16px",
                color: "#1a1a1a",
                letterSpacing: "-0.01em",
                marginBottom: "20px",
              }}
            >
              Quick Links
            </h3>
            <nav
              aria-label="Footer navigation"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "4px",
              }}
            >
              {quickLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={link.action}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 400,
                    fontSize: "15px",
                    color: "#d4b8a0",
                    padding: "6px 0",
                    textAlign: "left",
                    transition:
                      "color 0.2s cubic-bezier(0.4,0,0.2,1)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.color =
                      "#c17a3a";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.color =
                      "#d4b8a0";
                  }}
                  onFocus={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.outline =
                      "2px solid #c17a3a";
                    (e.currentTarget as HTMLButtonElement).style.outlineOffset =
                      "2px";
                    (e.currentTarget as HTMLButtonElement).style.borderRadius =
                      "4px";
                  }}
                  onBlur={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.outline =
                      "none";
                  }}
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Newsletter */}
          <div>
            <h3
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 600,
                fontSize: "16px",
                color: "#1a1a1a",
                letterSpacing: "-0.01em",
                marginBottom: "8px",
              }}
            >
              Stay in the loop
            </h3>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 400,
                fontSize: "14px",
                color: "#d4b8a0",
                lineHeight: 1.6,
                marginBottom: "16px",
              }}
            >
              New drops, exclusive deals &amp; crispy updates — straight to
              your inbox.
            </p>

            {subscribed ? (
              <div
                role="status"
                aria-live="polite"
                style={{
                  backgroundColor: "rgba(193,122,58,0.12)",
                  border: "1px solid rgba(193,122,58,0.35)",
                  borderRadius: "12px",
                  padding: "14px 16px",
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 500,
                  fontSize: "14px",
                  color: "#c17a3a",
                  lineHeight: 1.5,
                }}
              >
                You're in! Expect good things in your inbox soon.
              </div>
            ) : (
              <div>
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    flexWrap: "wrap",
                  }}
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError("");
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSubscribe();
                    }}
                    placeholder="your@email.com"
                    aria-label="Email address for newsletter"
                    aria-describedby={emailError ? "email-error" : undefined}
                    style={{
                      flex: "1 1 160px",
                      minWidth: "0",
                      height: "44px",
                      padding: "0 16px",
                      borderRadius: "12px",
                      border: emailError
                        ? "1.5px solid #8b3a2f"
                        : "1.5px solid rgba(212,180,160,0.60)",
                      backgroundColor: "#ffffff",
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "14px",
                      color: "#1a1a1a",
                      outline: "none",
                      transition:
                        "border-color 0.2s cubic-bezier(0.4,0,0.2,1)",
                    }}
                    onFocus={(e) => {
                      (e.currentTarget as HTMLInputElement).style.borderColor =
                        "#c17a3a";
                    }}
                    onBlur={(e) => {
                      if (!emailError) {
                        (
                          e.currentTarget as HTMLInputElement
                        ).style.borderColor = "rgba(212,180,160,0.60)";
                      }
                    }}
                  />
                  <button
                    onClick={handleSubscribe}
                    style={{
                      flexShrink: 0,
                      height: "44px",
                      padding: "0 20px",
                      borderRadius: "12px",
                      border: "none",
                      backgroundColor: "#c17a3a",
                      color: "#faf7f2",
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 600,
                      fontSize: "14px",
                      cursor: "pointer",
                      transition:
                        "transform 0.25s cubic-bezier(0.4,0,0.2,1), opacity 0.25s cubic-bezier(0.4,0,0.2,1)",
                      whiteSpace: "nowrap",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.transform =
                        "scale(1.02)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.transform =
                        "scale(1)";
                    }}
                    onMouseDown={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.transform =
                        "scale(0.98)";
                    }}
                    onMouseUp={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.transform =
                        "scale(1.02)";
                    }}
                    onFocus={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.outline =
                        "2px solid #c17a3a";
                      (
                        e.currentTarget as HTMLButtonElement
                      ).style.outlineOffset = "3px";
                    }}
                    onBlur={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.outline =
                        "none";
                    }}
                  >
                    Subscribe
                  </button>
                </div>
                {emailError && (
                  <p
                    id="email-error"
                    role="alert"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "13px",
                      color: "#8b3a2f",
                      marginTop: "6px",
                      lineHeight: 1.5,
                    }}
                  >
                    {emailError}
                  </p>
                )}
              </div>
            )}

            {/* Trust badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                marginTop: "16px",
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#c17a3a"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "12px",
                  color: "#d4b8a0",
                }}
              >
                No spam. Unsubscribe anytime.
              </span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            borderTop: "1px solid rgba(212,180,160,0.35)",
            paddingTop: "32px",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
          }}
        >
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 400,
              fontSize: "13px",
              color: "#d4b8a0",
            }}
          >
            &copy; {new Date().getFullYear()} Crisp. All rights reserved.
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#d4b8a0"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "13px",
                color: "#d4b8a0",
              }}
            >
              Made in India
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}