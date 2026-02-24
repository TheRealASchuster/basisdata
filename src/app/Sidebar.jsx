// src/app/Sidebar.jsx
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { COLORS } from "../design-system";
import { supabase } from "../lib/supabase";

const navItems = [
  { path: "/app", label: "MCP Server", icon: "\u2699", exact: true },
  { path: "/app/chat", label: "Chat", icon: "\u25C7" },
];

const devItems = [
  { path: "/app/keys", label: "API Keys", icon: "{}" },
  { path: "/app/usage", label: "Usage", icon: "\u25AD" },
  { path: "/docs", label: "Documentation", icon: "\u2197", external: true },
];

const accountItems = [
  { path: "/app/billing", label: "Billing", icon: "$" },
  { path: "/app/settings", label: "Settings", icon: "\u2699" },
];

function NavItem({ item, isActive }) {
  const base = {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "8px 20px",
    fontSize: 14,
    color: isActive ? COLORS.text : "#6B6B6B",
    fontWeight: isActive ? 500 : 400,
    background: isActive ? COLORS.bg : "transparent",
    borderLeft: `2px solid ${isActive ? COLORS.text : "transparent"}`,
    textDecoration: "none",
    transition: "all 0.15s",
  };

  const icon = item.icon ? (
    <span style={{ width: 20, textAlign: "center", fontSize: 13, flexShrink: 0 }}>{item.icon}</span>
  ) : null;

  if (item.external) {
    return <a href={item.path} target="_blank" rel="noopener" style={base}>{icon}{item.label}</a>;
  }
  return <Link to={item.path} style={base}>{icon}{item.label}</Link>;
}

function SectionLabel({ children }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 600, letterSpacing: "0.10em",
      textTransform: "uppercase", color: "#999999",
      padding: "16px 20px 6px",
    }}>
      {children}
    </div>
  );
}

export default function Sidebar({ user }) {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (item) => {
    if (item.exact) return location.pathname === item.path;
    return location.pathname.startsWith(item.path);
  };

  const email = user?.email || "";
  const initials = email.slice(0, 2).toUpperCase();
  const [showMenu, setShowMenu] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div style={{
      width: 240, height: "100vh", position: "fixed", left: 0, top: 0,
      background: "#FFFFFF", borderRight: `1px solid ${COLORS.border}`,
      display: "flex", flexDirection: "column", zIndex: 50,
    }}>
      {/* Logo */}
      <div style={{ padding: "20px 20px 16px" }}>
        <Link to="/app" style={{
          fontSize: 15, fontWeight: 600, letterSpacing: "-0.02em",
          color: COLORS.text, textDecoration: "none",
        }}>
          BasisData
        </Link>
      </div>

      <div style={{ height: 1, background: COLORS.border, margin: "0 20px" }} />

      {/* Main nav */}
      <div style={{ padding: "8px 0" }}>
        {navItems.map(item => (
          <NavItem key={item.path} item={item} isActive={isActive(item)} />
        ))}
      </div>

      <div style={{ height: 1, background: COLORS.border, margin: "0 20px" }} />

      <SectionLabel>Developer</SectionLabel>
      <div style={{ padding: "0 0 8px" }}>
        {devItems.map(item => (
          <NavItem key={item.path} item={item} isActive={isActive(item)} />
        ))}
      </div>

      <div style={{ height: 1, background: COLORS.border, margin: "0 20px" }} />

      <SectionLabel>Account</SectionLabel>
      <div style={{ padding: "0 0 8px" }}>
        {accountItems.map(item => (
          <NavItem key={item.path} item={item} isActive={isActive(item)} />
        ))}
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* User */}
      <div style={{ borderTop: `1px solid ${COLORS.border}`, padding: "16px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, position: "relative" }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            background: COLORS.text, color: "#FFFFFF",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 600,
          }}>
            {initials}
          </div>
          <div
            style={{ flex: 1, minWidth: 0, cursor: "pointer" }}
            onClick={() => setShowMenu(!showMenu)}
          >
            <div style={{
              fontSize: 13, fontWeight: 500, color: COLORS.text,
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>
              {email}
            </div>
            <div style={{ fontSize: 12, color: "#999999" }}>
              {user?.is_founding_user ? "Pro (Founding)" : user?.plan === "pro" ? "Pro" : "Free"}
            </div>
          </div>
        </div>
        {showMenu && (
          <div style={{
            position: "absolute", bottom: 72, left: 20, right: 20,
            background: "#FFFFFF", border: `1px solid ${COLORS.border}`,
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)", zIndex: 100,
          }}>
            <button
              onClick={handleSignOut}
              style={{
                display: "block", width: "100%", padding: "10px 16px",
                fontSize: 13, color: COLORS.text, background: "transparent",
                border: "none", textAlign: "left", cursor: "pointer",
              }}
              onMouseEnter={(e) => e.target.style.background = COLORS.bg}
              onMouseLeave={(e) => e.target.style.background = "transparent"}
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
