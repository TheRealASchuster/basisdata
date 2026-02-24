// src/app/pages/Keys.jsx
import { useState, useEffect } from "react";
import { COLORS, FONTS } from "../../design-system";
import { apiFetch } from "../../lib/auth";

export default function Keys() {
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newKey, setNewKey] = useState(null);
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedConfig, setCopiedConfig] = useState(false);

  useEffect(() => { loadKeys(); }, []);

  async function loadKeys() {
    try {
      const data = await apiFetch("/v1/auth/keys");
      setKeys(data.keys || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  async function handleRegenerate(keyId) {
    if (!confirm("Regenerate this key? The old key will stop working immediately.")) return;
    try {
      const result = await apiFetch(`/v1/auth/keys/${keyId}/regenerate`, { method: "POST" });
      setNewKey(result.api_key);
      setShowKey(true);
      await loadKeys();
    } catch (err) { alert(err.message); }
  }

  const copyKey = () => {
    if (!newKey) return;
    navigator.clipboard.writeText(newKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const activeKey = keys.find(k => k.is_active);
  const displayKey = newKey || (activeKey ? `${activeKey.key_prefix}${"...".padStart(24, "\u2022")}` : "No active key");

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

  if (loading) return <div style={{ fontSize: 13, color: "#999", padding: "60px 0" }}>Loading...</div>;

  return (
    <div style={{ maxWidth: 680 }}>
      <h1 style={{ fontSize: 28, fontWeight: 600, letterSpacing: "-0.02em", color: COLORS.text, marginBottom: 32 }}>
        API Keys
      </h1>

      {/* New key alert */}
      {newKey && (
        <div style={{
          background: "#F0FDF4", border: "1px solid #BBF7D0",
          padding: "12px 16px", marginBottom: 24, fontSize: 13,
        }}>
          <span style={{ fontWeight: 600, color: "#166534" }}>New API key generated</span>
          <span style={{ color: "#166534", marginLeft: 8 }}>Copy it now, it won't be shown again.</span>
        </div>
      )}

      {/* Key display */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <div style={{
          flex: 1, fontFamily: FONTS.mono, fontSize: 13,
          color: COLORS.text, background: "#FFFFFF",
          border: `1px solid ${COLORS.border}`, padding: "10px 14px",
        }}>
          {showKey && newKey ? newKey : displayKey}
        </div>
        {newKey && (
          <>
            <button onClick={() => setShowKey(!showKey)} style={{
              background: "transparent", border: `1px solid ${COLORS.border}`,
              padding: "10px 14px", fontSize: 12, fontWeight: 500, color: "#6B6B6B",
            }}>
              {showKey ? "Hide" : "Show"}
            </button>
            <button onClick={copyKey} style={{
              background: "transparent", border: `1px solid ${COLORS.border}`,
              padding: "10px 14px", fontSize: 12, fontWeight: 500,
              color: copied ? COLORS.success : "#6B6B6B",
            }}>
              {copied ? "Copied" : "Copy"}
            </button>
          </>
        )}
      </div>

      {activeKey && (
        <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 4 }}>
          <span style={{ fontSize: 12, color: "#999" }}>
            Created: {activeKey.created_at?.split("T")[0] || "—"}
          </span>
          <button onClick={() => handleRegenerate(activeKey.id)} style={{
            background: "transparent", border: "none",
            fontSize: 12, color: "#999", padding: 0, cursor: "pointer",
          }}>
            Regenerate &rarr;
          </button>
        </div>
      )}

      {/* MCP Setup */}
      <div style={{ height: 1, background: COLORS.border, margin: "32px 0 24px" }} />
      <h2 style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#999", marginBottom: 16 }}>
        MCP Setup
      </h2>
      <p style={{ fontSize: 13, color: "#6B6B6B", marginBottom: 12, lineHeight: 1.6 }}>
        Add to your Claude Desktop config and restart:
      </p>
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

      {/* REST API */}
      <div style={{ height: 1, background: COLORS.border, margin: "32px 0 24px" }} />
      <h2 style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#999", marginBottom: 16 }}>
        REST API
      </h2>
      <table style={{ fontSize: 13, borderCollapse: "collapse" }}>
        <tbody>
          <tr>
            <td style={{ padding: "6px 16px 6px 0", color: "#6B6B6B" }}>Base URL</td>
            <td style={{ padding: "6px 0", fontFamily: FONTS.mono, color: COLORS.text }}>https://api.basisdata.dev/v1</td>
          </tr>
          <tr>
            <td style={{ padding: "6px 16px 6px 0", color: "#6B6B6B" }}>Auth header</td>
            <td style={{ padding: "6px 0", fontFamily: FONTS.mono, color: COLORS.text }}>Authorization: Bearer bd_live_...</td>
          </tr>
        </tbody>
      </table>
      <a href="/docs" target="_blank" rel="noopener" style={{
        display: "inline-block", marginTop: 12,
        fontSize: 12, color: "#999", borderBottom: "1px solid #E0DFDB", paddingBottom: 1,
      }}>
        View full API documentation &rarr;
      </a>
    </div>
  );
}
