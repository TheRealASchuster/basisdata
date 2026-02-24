// src/app/pages/Overview.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { COLORS, FONTS } from "../../design-system";
import { apiFetch } from "../../lib/auth";

function ModuleCard({ label, calls, sub }) {
  return (
    <div style={{
      background: "#FFFFFF", border: `1px solid ${COLORS.border}`,
      padding: "20px 24px", flex: 1, minWidth: 180,
    }}>
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.10em", textTransform: "uppercase", color: "#999" }}>
        {label}
      </div>
      <div style={{ fontSize: 13, color: COLORS.success, marginTop: 8, fontWeight: 500 }}>
        Active
      </div>
      {sub && <div style={{ fontSize: 12, color: "#999", marginTop: 6 }}>{sub}</div>}
      <div style={{ fontSize: 20, fontWeight: 600, color: COLORS.text, marginTop: 4, fontFamily: FONTS.mono }}>
        {calls.toLocaleString()}
      </div>
      <div style={{ fontSize: 12, color: "#999" }}>calls this month</div>
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <>
      <div style={{ height: 1, background: COLORS.border, margin: "32px 0 24px" }} />
      <h2 style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#999", marginBottom: 20 }}>
        {children}
      </h2>
    </>
  );
}

export default function Overview() {
  const [profile, setProfile] = useState(null);
  const [keys, setKeys] = useState([]);
  const [usage, setUsage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [copiedConfig, setCopiedConfig] = useState(false);

  useEffect(() => {
    Promise.all([
      apiFetch("/v1/auth/me"),
      apiFetch("/v1/auth/keys"),
      apiFetch("/v1/auth/usage?period=30d"),
    ]).then(([p, k, u]) => {
      setProfile(p);
      setKeys(k.keys || []);
      setUsage(u);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div style={{ fontSize: 13, color: "#999", padding: "60px 0" }}>Loading...</div>;
  }

  const activeKey = keys.find(k => k.is_active);
  const keyDisplay = activeKey ? `${activeKey.key_prefix}${"...".padStart(24, "\u2022")}` : "No key";

  const mcpConfig = `{
  "mcpServers": {
    "basisdata": {
      "command": "uvx",
      "args": ["basisdata-mcp"],
      "env": {
        "BASISDATA_API_KEY": "${activeKey?.key_prefix || "bd_live_"}..."
      }
    }
  }
}`;

  const copyKey = () => {
    if (!activeKey) return;
    navigator.clipboard.writeText(activeKey.key_prefix + "...");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyConfig = () => {
    navigator.clipboard.writeText(mcpConfig);
    setCopiedConfig(true);
    setTimeout(() => setCopiedConfig(false), 2000);
  };

  const edgar = usage?.by_module?.edgar || 0;
  const ba = usage?.by_module?.bundesanzeiger || 0;
  const qrate = usage?.by_module?.qrate || 0;
  const total = usage?.total_requests || 0;

  return (
    <div style={{ maxWidth: 800 }}>
      <h1 style={{ fontSize: 28, fontWeight: 600, letterSpacing: "-0.02em", color: COLORS.text, marginBottom: 24 }}>
        Overview
      </h1>

      {/* Module stats */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <ModuleCard label="EDGAR" calls={edgar} sub="US public companies" />
        <ModuleCard label="Bundesanzeiger" calls={ba} sub="German Mittelstand" />
        <ModuleCard label="qRate" calls={qrate} sub="Credit funds" />
      </div>

      <SectionTitle>Your API Key</SectionTitle>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{
          flex: 1, fontFamily: FONTS.mono, fontSize: 13,
          color: COLORS.text, background: "#FFFFFF",
          border: `1px solid ${COLORS.border}`, padding: "10px 14px",
        }}>
          {keyDisplay}
        </div>
        <button onClick={copyKey} style={{
          background: "transparent", border: `1px solid ${COLORS.border}`,
          padding: "10px 14px", fontSize: 12, fontWeight: 500,
          color: copied ? COLORS.success : "#6B6B6B",
        }}>
          {copied ? "Copied" : "Copy"}
        </button>
        <Link to="/app/keys" style={{
          background: "transparent", border: `1px solid ${COLORS.border}`,
          padding: "10px 14px", fontSize: 12, fontWeight: 500,
          color: "#6B6B6B", textDecoration: "none",
        }}>
          Manage
        </Link>
      </div>

      <SectionTitle>MCP Config (Claude Desktop)</SectionTitle>
      <div style={{ position: "relative" }}>
        <pre style={{
          background: COLORS.codeBlock, border: `1px solid ${COLORS.border}`,
          padding: 20, fontFamily: FONTS.mono, fontSize: 12,
          lineHeight: 1.7, color: "#6B6B6B", overflowX: "auto",
        }}>
          {mcpConfig}
        </pre>
        <button onClick={copyConfig} style={{
          position: "absolute", top: 10, right: 10,
          background: "#FFFFFF", border: `1px solid ${COLORS.border}`,
          padding: "5px 12px", fontSize: 11, fontWeight: 500,
          color: copiedConfig ? COLORS.success : "#6B6B6B",
        }}>
          {copiedConfig ? "Copied" : "Copy"}
        </button>
      </div>

      <SectionTitle>Quick Actions</SectionTitle>
      <div style={{ display: "flex", gap: 12 }}>
        {[
          { to: "/app/chat", label: "Open Chat" },
          { to: "/docs", label: "API Documentation", external: true },
          { to: "/app/keys", label: "Manage Keys" },
        ].map(a => (
          a.external ? (
            <a key={a.label} href={a.to} target="_blank" rel="noopener" style={{
              background: "transparent", border: `1px solid ${COLORS.border}`,
              padding: "10px 20px", fontSize: 13, fontWeight: 500,
              color: COLORS.text, textDecoration: "none", transition: "border-color 0.15s",
            }}>
              {a.label} &rarr;
            </a>
          ) : (
            <Link key={a.label} to={a.to} style={{
              background: "transparent", border: `1px solid ${COLORS.border}`,
              padding: "10px 20px", fontSize: 13, fontWeight: 500,
              color: COLORS.text, textDecoration: "none", transition: "border-color 0.15s",
            }}>
              {a.label} &rarr;
            </Link>
          )
        ))}
      </div>
    </div>
  );
}
