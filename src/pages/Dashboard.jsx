// src/pages/Dashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { COLORS, FONTS } from "../design-system";
import { useAuth, apiFetch } from "../lib/auth";
import { supabase } from "../lib/supabase";
import Chat from "./Chat";

function TabBar({ activeTab, onTabChange }) {
  const tabs = [
    { id: "settings", label: "Settings" },
    { id: "chat", label: "Chat" },
  ];
  return (
    <div style={{
      display: "flex",
      gap: 0,
      borderBottom: `1px solid ${COLORS.border}`,
      marginBottom: 40,
    }}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          style={{
            background: "transparent",
            border: "none",
            borderBottom: activeTab === tab.id ? `2px solid ${COLORS.accent}` : "2px solid transparent",
            padding: "12px 24px",
            fontSize: 13,
            fontWeight: activeTab === tab.id ? 600 : 400,
            color: activeTab === tab.id ? COLORS.text : COLORS.textTertiary,
            letterSpacing: "0.02em",
            transition: "all 0.2s",
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

function Section({ title, children, noBorder }) {
  return (
    <div style={{ marginBottom: 0 }}>
      <div style={{
        fontSize: 11, fontWeight: 600, letterSpacing: "0.10em",
        textTransform: "uppercase", color: COLORS.textTertiary, marginBottom: 16,
      }}>
        {title}
      </div>
      {children}
      {!noBorder && <div style={{ height: 1, background: COLORS.border, margin: "28px 0" }} />}
    </div>
  );
}

function SettingsPanel({ profile, keys, usage, newKey, onRegenerate, onSignOut }) {
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedConfig, setCopiedConfig] = useState(false);

  const activeKey = keys.find(k => k.is_active);
  const displayKey = newKey || (activeKey ? `${activeKey.key_prefix}${"•".repeat(24)}` : "No active key");

  const copyKey = () => {
    if (!newKey) return;
    navigator.clipboard.writeText(newKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const mcpConfig = `{
  "mcpServers": {
    "basisdata": {
      "command": "uvx",
      "args": ["basisdata-mcp"],
      "env": {
        "BASISDATA_API_KEY": "${newKey || activeKey?.key_prefix + "..."}"
      }
    }
  }
}`;

  const copyConfig = () => {
    navigator.clipboard.writeText(mcpConfig);
    setCopiedConfig(true);
    setTimeout(() => setCopiedConfig(false), 2000);
  };

  const planLabel = profile?.is_founding_user ? `${profile.plan} (Founding)` : profile?.plan;

  return (
    <>
      {/* New key alert */}
      {newKey && (
        <div style={{
          background: "#F0FDF4", border: "1px solid #BBF7D0",
          padding: "12px 16px", marginBottom: 24, fontSize: 13,
        }}>
          <span style={{ fontWeight: 600, color: "#166534" }}>New API key generated</span>
          <span style={{ color: "#166534", marginLeft: 8 }}>— copy it now, it won't be shown again.</span>
        </div>
      )}

      {/* API Key */}
      <Section title="API Key">
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            flex: 1, fontFamily: FONTS.mono, fontSize: 13,
            color: COLORS.text, background: COLORS.bgCard,
            border: `1px solid ${COLORS.border}`, padding: "10px 14px",
            letterSpacing: "0.02em",
          }}>
            {showKey && newKey ? newKey : displayKey}
          </div>
          {newKey && (
            <>
              <button onClick={() => setShowKey(!showKey)} style={{
                background: "transparent", border: `1px solid ${COLORS.border}`,
                padding: "10px 14px", fontSize: 12, fontWeight: 500,
                color: COLORS.textSecondary, whiteSpace: "nowrap",
              }}>
                {showKey ? "Hide" : "Show"}
              </button>
              <button onClick={copyKey} style={{
                background: "transparent", border: `1px solid ${COLORS.border}`,
                padding: "10px 14px", fontSize: 12, fontWeight: 500,
                color: copied ? COLORS.success : COLORS.textSecondary, whiteSpace: "nowrap",
              }}>
                {copied ? "Copied" : "Copy"}
              </button>
            </>
          )}
        </div>
        {activeKey && (
          <button onClick={() => onRegenerate(activeKey.id)} style={{
            marginTop: 8, background: "transparent", border: "none",
            fontSize: 12, color: COLORS.textTertiary, padding: 0,
          }}>
            Regenerate key →
          </button>
        )}
      </Section>

      {/* Usage — report-style table */}
      <Section title="Usage — Last 30 days">
        <table style={{
          width: "100%", borderCollapse: "collapse",
          fontSize: 13, fontFamily: FONTS.body,
        }}>
          <tbody>
            <tr style={{ borderBottom: `1px solid ${COLORS.borderLight}` }}>
              <td style={{ padding: "8px 0", color: COLORS.textSecondary }}>Total requests</td>
              <td style={{ padding: "8px 0", textAlign: "right", fontFamily: FONTS.mono, color: COLORS.text, fontWeight: 500 }}>
                {(usage?.total_requests || 0).toLocaleString()}
              </td>
            </tr>
            <tr style={{ borderBottom: `1px solid ${COLORS.borderLight}` }}>
              <td style={{ padding: "8px 0", color: COLORS.textSecondary }}>Rate limit</td>
              <td style={{ padding: "8px 0", textAlign: "right", fontFamily: FONTS.mono, color: COLORS.text, fontWeight: 500 }}>
                {profile?.plan === "free" ? "100/day" : "Unlimited"}
              </td>
            </tr>
            <tr style={{ borderBottom: `1px solid ${COLORS.borderLight}` }}>
              <td style={{ padding: "8px 0", color: COLORS.textSecondary }}>Last request</td>
              <td style={{ padding: "8px 0", textAlign: "right", fontFamily: FONTS.mono, color: COLORS.text, fontWeight: 500 }}>
                {usage?.last_request || "Never"}
              </td>
            </tr>
            <tr style={{ borderBottom: `1px solid ${COLORS.borderLight}` }}>
              <td style={{ padding: "8px 0", color: COLORS.textSecondary }}>Edgar</td>
              <td style={{ padding: "8px 0", textAlign: "right", fontFamily: FONTS.mono, color: COLORS.text, fontWeight: 500 }}>
                {usage?.by_module?.edgar || 0}
              </td>
            </tr>
            <tr style={{ borderBottom: `1px solid ${COLORS.borderLight}` }}>
              <td style={{ padding: "8px 0", color: COLORS.textSecondary }}>Bundesanzeiger</td>
              <td style={{ padding: "8px 0", textAlign: "right", fontFamily: FONTS.mono, color: COLORS.text, fontWeight: 500 }}>
                {usage?.by_module?.bundesanzeiger || 0}
              </td>
            </tr>
            <tr>
              <td style={{ padding: "8px 0", color: COLORS.textSecondary }}>qRate</td>
              <td style={{ padding: "8px 0", textAlign: "right", fontFamily: FONTS.mono, color: COLORS.text, fontWeight: 500 }}>
                {usage?.by_module?.qrate || 0}
              </td>
            </tr>
          </tbody>
        </table>
      </Section>

      {/* Plan */}
      <Section title="Plan">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span style={{ fontSize: 14, fontWeight: 500, color: COLORS.text, textTransform: "capitalize" }}>
              {planLabel}
            </span>
            {profile?.is_founding_user && (
              <span style={{ fontSize: 12, color: COLORS.success, marginLeft: 8 }}>
                Founding member
              </span>
            )}
          </div>
          <a href="/pricing" style={{
            fontSize: 12, color: COLORS.textTertiary,
            borderBottom: `1px solid ${COLORS.borderLight}`, paddingBottom: 1,
          }}>
            Manage plan →
          </a>
        </div>
      </Section>

      {/* MCP Setup */}
      <Section title="MCP Setup">
        <p style={{ fontSize: 13, color: COLORS.textSecondary, marginBottom: 12, lineHeight: 1.6 }}>
          Add to your Claude Desktop config and restart.
        </p>
        <div style={{ position: "relative" }}>
          <pre style={{
            background: COLORS.codeBlock, border: `1px solid ${COLORS.border}`,
            padding: 20, fontFamily: FONTS.mono, fontSize: 12,
            lineHeight: 1.7, color: COLORS.textSecondary, overflowX: "auto",
          }}>
            {mcpConfig}
          </pre>
          <button onClick={copyConfig} style={{
            position: "absolute", top: 10, right: 10,
            background: COLORS.bgCard, border: `1px solid ${COLORS.border}`,
            padding: "5px 12px", fontSize: 11, fontWeight: 500,
            color: copiedConfig ? COLORS.success : COLORS.textSecondary,
          }}>
            {copiedConfig ? "Copied" : "Copy"}
          </button>
        </div>
      </Section>

      {/* Account */}
      <Section title="Account" noBorder>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <span style={{ fontSize: 13, color: COLORS.textSecondary }}>
            {profile?.email}
          </span>
          <button onClick={onSignOut} style={{
            background: "transparent", border: "none",
            fontSize: 12, color: COLORS.textTertiary, padding: 0,
          }}>
            Sign out
          </button>
        </div>
      </Section>
    </>
  );
}

export default function Dashboard() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(
    location.hash === "#chat" ? "chat" : "settings"
  );
  const [profile, setProfile] = useState(null);
  const [keys, setKeys] = useState([]);
  const [usage, setUsage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newKey, setNewKey] = useState(null);

  useEffect(() => {
    if (!session) return;
    loadData();
  }, [session]);

  useEffect(() => {
    window.location.hash = activeTab === "chat" ? "#chat" : "";
  }, [activeTab]);

  async function loadData() {
    setLoading(true);
    try {
      const [p, k, u] = await Promise.all([
        apiFetch("/v1/auth/me"),
        apiFetch("/v1/auth/keys"),
        apiFetch("/v1/auth/usage?period=30d"),
      ]);
      setProfile(p);
      setKeys(k.keys || []);
      setUsage(u);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleRegenerate(keyId) {
    if (!confirm("Regenerate this key? The old key will stop working immediately.")) return;
    try {
      const result = await apiFetch(`/v1/auth/keys/${keyId}/regenerate`, { method: "POST" });
      setNewKey(result.api_key);
      await loadData();
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate("/login");
  }

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh", background: COLORS.bg, paddingTop: 120,
        display: "flex", justifyContent: "center",
      }}>
        <div style={{ fontSize: 13, color: COLORS.textTertiary, padding: "120px 0" }}>
          Loading...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: "100vh", background: COLORS.bg, paddingTop: 120 }}>
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 32px 80px" }}>
          <h1 style={{
            fontSize: 28, fontWeight: 600, letterSpacing: "-0.02em",
            color: COLORS.text, marginBottom: 16,
          }}>
            Dashboard
          </h1>
          <div style={{
            background: "#FEF2F2", border: "1px solid #FECACA",
            color: COLORS.error, padding: "12px 16px", fontSize: 13,
          }}>
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: COLORS.bg,
      paddingTop: 100,
    }}>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 32px" }}>
        <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {activeTab === "settings" ? (
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 32px 80px" }}>
          <SettingsPanel
            profile={profile}
            keys={keys}
            usage={usage}
            newKey={newKey}
            onRegenerate={handleRegenerate}
            onSignOut={handleSignOut}
          />
        </div>
      ) : (
        <Chat embedded />
      )}
    </div>
  );
}
