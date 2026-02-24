// src/components/Nav.jsx
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { COLORS } from "../design-system";

export function Nav({ user }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const isActive = (path) => location.pathname === path;

  const navLink = (to, label) => (
    <Link to={to} style={{
      color: isActive(to) ? COLORS.text : COLORS.textSecondary,
      fontWeight: isActive(to) ? 500 : 400,
      transition: "color 0.2s",
    }}>
      {label}
    </Link>
  );

  return (
    <>
      <nav style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: scrolled || menuOpen ? "rgba(247,246,243,0.96)" : "transparent",
        backdropFilter: scrolled || menuOpen ? "blur(20px)" : "none",
        borderBottom: scrolled ? `1px solid ${COLORS.border}` : "1px solid transparent",
        transition: "all 0.3s ease",
      }}>
        <div style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <Link to="/" style={{
            fontSize: 17,
            fontWeight: 600,
            letterSpacing: "-0.02em",
            color: COLORS.text,
          }}>
            BasisData
          </Link>
          {/* Desktop nav */}
          <div className="nav-links" style={{
            display: "flex",
            gap: 28,
            alignItems: "center",
            fontSize: 14,
          }}>
            {navLink("/edgar", "Edgar")}
            {navLink("/bundesanzeiger", "Bundesanzeiger")}
            {navLink("/qrate", "qRate")}
            {navLink("/docs", "Docs")}
            {navLink("/pricing", "Pricing")}
            {user ? (
              <Link to="/app" style={{
                background: COLORS.accent,
                color: COLORS.bg,
                border: "none",
                padding: "8px 20px",
                fontSize: 13,
                fontWeight: 500,
                display: "inline-block",
              }}>
                Dashboard
              </Link>
            ) : (
              <Link to="/login" style={{
                background: COLORS.accent,
                color: COLORS.bg,
                border: "none",
                padding: "8px 20px",
                fontSize: 13,
                fontWeight: 500,
                display: "inline-block",
              }}>
                Sign In
              </Link>
            )}
          </div>
          {/* Mobile hamburger */}
          <button
            className="nav-mobile-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              display: "none",
              background: "none",
              border: "none",
              padding: 8,
              flexDirection: "column",
              gap: 5,
              cursor: "pointer",
            }}
          >
            <span style={{ width: 20, height: 1.5, background: COLORS.text, display: "block", transition: "all 0.2s", transform: menuOpen ? "rotate(45deg) translateY(6.5px)" : "none" }} />
            <span style={{ width: 20, height: 1.5, background: COLORS.text, display: "block", transition: "all 0.2s", opacity: menuOpen ? 0 : 1 }} />
            <span style={{ width: 20, height: 1.5, background: COLORS.text, display: "block", transition: "all 0.2s", transform: menuOpen ? "rotate(-45deg) translateY(-6.5px)" : "none" }} />
          </button>
        </div>
      </nav>
      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          position: "fixed",
          top: 64,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 99,
          background: "rgba(247,246,243,0.98)",
          backdropFilter: "blur(20px)",
          padding: "32px 24px",
          display: "flex",
          flexDirection: "column",
          gap: 24,
          fontSize: 18,
        }}>
          <Link to="/edgar" style={{ color: COLORS.text, fontWeight: 500 }}>Edgar</Link>
          <Link to="/bundesanzeiger" style={{ color: COLORS.text, fontWeight: 500 }}>Bundesanzeiger</Link>
          <Link to="/qrate" style={{ color: COLORS.text, fontWeight: 500 }}>qRate</Link>
          <Link to="/docs" style={{ color: COLORS.text, fontWeight: 500 }}>Docs</Link>
          <Link to="/pricing" style={{ color: COLORS.text, fontWeight: 500 }}>Pricing</Link>
          <div style={{ height: 1, background: COLORS.border }} />
          <Link to={user ? "/app" : "/login"} style={{
            background: COLORS.accent,
            color: COLORS.bg,
            padding: "14px 0",
            textAlign: "center",
            fontSize: 15,
            fontWeight: 500,
          }}>
            {user ? "Dashboard" : "Sign In"}
          </Link>
        </div>
      )}
    </>
  );
}

// src/components/Footer.jsx
export function Footer() {
  return (
    <footer style={{
      maxWidth: 1200,
      margin: "0 auto",
      padding: "64px 24px 48px",
    }}>
      <div style={{ height: 1, background: COLORS.border, marginBottom: 48 }} />
      <div className="footer-columns" style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.01em", color: COLORS.text, marginBottom: 8 }}>
            BasisData
          </div>
          <div style={{ fontSize: 13, color: COLORS.textTertiary, lineHeight: 1.6 }}>
            Made in New York.
          </div>
        </div>
        {[
          { title: "Modules", items: [["Edgar", "/edgar"], ["Bundesanzeiger", "/bundesanzeiger"], ["qRate", "/qrate"]] },
          { title: "Resources", items: [["Documentation", "/docs"], ["GitHub", "https://github.com/TheRealASchuster/basisdata"], ["Chat", "/app/chat"]] },
          { title: "Legal", items: [["Privacy", "/privacy"], ["Terms", "/terms"], ["Imprint", "/imprint"]] },
        ].map((col, i) => (
          <div key={i}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: COLORS.textTertiary, marginBottom: 16 }}>
              {col.title}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {col.items.map(([label, href], j) => (
                href.startsWith("http") ? (
                  <a key={j} href={href} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: COLORS.textSecondary }}>
                    {label}
                  </a>
                ) : (
                  <Link key={j} to={href} style={{ fontSize: 13, color: COLORS.textSecondary }}>
                    {label}
                  </Link>
                )
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 48, fontSize: 12, color: COLORS.textTertiary }}>
        © 2026 BasisData. All rights reserved.
      </div>
    </footer>
  );
}
