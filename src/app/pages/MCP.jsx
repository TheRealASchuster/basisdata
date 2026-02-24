// src/app/pages/MCP.jsx
import { useState, useEffect } from "react";
import { COLORS, FONTS } from "../../design-system";
import { apiFetch } from "../../lib/auth";

const TOOLS = [
  { name: "search_companies", desc: "Search companies by name, ticker, or CIK", module: "EDGAR" },
  { name: "get_company", desc: "Get company profile, sector, and filing history", module: "EDGAR" },
  { name: "get_financials", desc: "Income statement, balance sheet, cash flows", module: "EDGAR" },
  { name: "get_metrics", desc: "P/E, EV/EBITDA, margins, growth, leverage ratios", module: "EDGAR" },
  { name: "screen_companies", desc: "Filter companies by financial criteria", module: "EDGAR" },
  { name: "compare_companies", desc: "Side-by-side comparison of up to 5 companies", module: "EDGAR" },
  { name: "get_filings", desc: "Browse SEC filings (10-K, 10-Q, 8-K, etc.)", module: "EDGAR" },
  { name: "search_german_companies", desc: "Search Bundesanzeiger companies", module: "BA" },
  { name: "get_hgb_financials", desc: "German HGB financial statements (Bilanz + GuV)", module: "BA" },
  { name: "get_ba_filings", desc: "Browse Bundesanzeiger filings", module: "BA" },
  { name: "search_funds", desc: "Search credit funds and ETFs by name or strategy", module: "qRate" },
  { name: "get_fund", desc: "Fund profile, share classes, expense ratios", module: "qRate" },
  { name: "get_fund_holdings", desc: "Top holdings and sector allocation", module: "qRate" },
  { name: "get_fund_allocation", desc: "Asset allocation breakdown", module: "qRate" },
  { name: "get_fund_performance", desc: "NAV history and returns", module: "qRate" },
  { name: "screen_funds", desc: "Filter funds by yield, duration, strategy", module: "qRate" },
  { name: "compare_funds", desc: "Side-by-side fund comparison", module: "qRate" },
  { name: "get_standardized_financials", desc: "Normalized financials across US and German companies", module: "Cross" },
];

const MODULE_COLORS = {
  EDGAR: "#2563EB",
  BA: "#059669",
  qRate: "#7C3AED",
  Cross: "#999",
};

function CodeBlock({ children, onCopy, copied }) {
  return (
    <div style={{ position: "relative" }}>
      <pre style={{
        background: COLORS.codeBlock, border: `1px solid ${COLORS.border}`,
        padding: 20, fontFamily: FONTS.mono, fontSize: 12,
        lineHeight: 1.7, color: "#6B6B6B", overflowX: "auto",
      }}>
        {children}
      </pre>
      {onCopy && (
        <button onClick={onCopy} style={{
          position: "absolute", top: 10, right: 10,
          background: "#FFFFFF", border: `1px solid ${COLORS.border}`,
          padding: "5px 12px", fontSize: 11, fontWeight: 500,
          color: copied ? COLORS.success : "#6B6B6B",
        }}>
          {copied ? "Copied" : "Copy"}
        </button>
      )}
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <>
      <div style={{ height: 1, background: COLORS.border, margin: "32px 0 24px" }} />
      <h2 style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#999", marginBottom: 16 }}>
        {children}
      </h2>
    </>
  );
}

export default function MCP() {
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedConfig, setCopiedConfig] = useState(false);
  const [copiedInstall, setCopiedInstall] = useState(false);

  useEffect(() => {
    apiFetch("/v1/auth/keys")
      .then((data) => setKeys(data.keys || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const activeKey = keys.find(k => k.is_active);
  const keyPlaceholder = activeKey ? `${activeKey.key_prefix}...` : "bd_live_YOUR_KEY_HERE";

  const mcpConfig = `{
  "mcpServers": {
    "basisdata": {
      "command": "uvx",
      "args": ["basisdata-mcp"],
      "env": {
        "BASISDATA_API_KEY": "${keyPlaceholder}"
      }
    }
  }
}`;

  const copyConfig = () => {
    navigator.clipboard.writeText(mcpConfig);
    setCopiedConfig(true);
    setTimeout(() => setCopiedConfig(false), 2000);
  };

  const copyInstall = () => {
    navigator.clipboard.writeText("uvx basisdata-mcp");
    setCopiedInstall(true);
    setTimeout(() => setCopiedInstall(false), 2000);
  };

  if (loading) return <div style={{ fontSize: 13, color: "#999", padding: "60px 0" }}>Loading...</div>;

  return (
    <div style={{ maxWidth: 720 }}>
      <h1 style={{ fontSize: 28, fontWeight: 600, letterSpacing: "-0.02em", color: COLORS.text, marginBottom: 8 }}>
        MCP Server
      </h1>
      <p style={{ fontSize: 14, color: COLORS.textSecondary, lineHeight: 1.6, marginBottom: 0 }}>
        Connect BasisData to Claude Desktop, Claude Code, or any MCP-compatible client.
        {" "}{TOOLS.length} tools across EDGAR, Bundesanzeiger, and qRate.
      </p>

      {/* Setup */}
      <SectionTitle>Setup</SectionTitle>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {/* Step 1 */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <span style={{
              width: 24, height: 24, borderRadius: "50%", background: COLORS.text, color: "#fff",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, fontWeight: 600, flexShrink: 0,
            }}>1</span>
            <span style={{ fontSize: 14, fontWeight: 500, color: COLORS.text }}>
              Install uv (if you don't have it)
            </span>
          </div>
          <CodeBlock>curl -LsSf https://astral.sh/uv/install.sh | sh</CodeBlock>
        </div>

        {/* Step 2 */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <span style={{
              width: 24, height: 24, borderRadius: "50%", background: COLORS.text, color: "#fff",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, fontWeight: 600, flexShrink: 0,
            }}>2</span>
            <span style={{ fontSize: 14, fontWeight: 500, color: COLORS.text }}>
              Add to Claude Desktop config
            </span>
          </div>
          <p style={{ fontSize: 13, color: COLORS.textSecondary, marginBottom: 10, lineHeight: 1.5, paddingLeft: 34 }}>
            Open Claude Desktop Settings &rarr; Developer &rarr; Edit Config, then paste:
          </p>
          <CodeBlock onCopy={copyConfig} copied={copiedConfig}>{mcpConfig}</CodeBlock>
        </div>

        {/* Step 3 */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <span style={{
              width: 24, height: 24, borderRadius: "50%", background: COLORS.text, color: "#fff",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, fontWeight: 600, flexShrink: 0,
            }}>3</span>
            <span style={{ fontSize: 14, fontWeight: 500, color: COLORS.text }}>
              Restart Claude Desktop
            </span>
          </div>
          <p style={{ fontSize: 13, color: COLORS.textSecondary, lineHeight: 1.5, paddingLeft: 34 }}>
            Quit fully (Cmd+Q / Ctrl+Q) and reopen. You should see a hammer icon with {TOOLS.length} tools.
          </p>
        </div>
      </div>

      {/* Alternative: CLI */}
      <SectionTitle>Alternative: Claude Code / CLI</SectionTitle>
      <p style={{ fontSize: 13, color: COLORS.textSecondary, marginBottom: 12, lineHeight: 1.6 }}>
        You can also run the MCP server directly:
      </p>
      <CodeBlock onCopy={copyInstall} copied={copiedInstall}>
        {`# Run directly (no install needed)\nBASISDATA_API_KEY=${keyPlaceholder} uvx basisdata-mcp\n\n# Or install globally\npip install basisdata-mcp`}
      </CodeBlock>

      {/* Available Tools */}
      <SectionTitle>Available Tools ({TOOLS.length})</SectionTitle>

      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {TOOLS.map((tool, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "10px 0",
            borderBottom: i < TOOLS.length - 1 ? `1px solid ${COLORS.borderLight}` : "none",
          }}>
            <span style={{
              fontSize: 10, fontWeight: 600, letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: MODULE_COLORS[tool.module] || "#999",
              width: 44, flexShrink: 0,
            }}>
              {tool.module}
            </span>
            <code style={{
              fontFamily: FONTS.mono, fontSize: 13, color: COLORS.text,
              fontWeight: 500, minWidth: 220, flexShrink: 0,
            }}>
              {tool.name}
            </code>
            <span style={{ fontSize: 13, color: COLORS.textSecondary }}>
              {tool.desc}
            </span>
          </div>
        ))}
      </div>

      {/* Example prompts */}
      <SectionTitle>Example Prompts</SectionTitle>
      <p style={{ fontSize: 13, color: COLORS.textSecondary, marginBottom: 16, lineHeight: 1.5 }}>
        Once connected, try asking Claude:
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {[
          "Compare Apple and Microsoft revenue, margins, and FCF over 5 years",
          "Find German companies with revenue above 10M and equity ratio over 30%",
          "Show me high yield ETFs with duration under 3 years",
          "What are the top holdings of PIMCO Income Fund?",
          "Screen for US companies with P/E under 15 and revenue growth above 10%",
        ].map((prompt, i) => (
          <div key={i} style={{
            background: COLORS.bgCard, border: `1px solid ${COLORS.border}`,
            padding: "10px 14px", fontSize: 13, color: COLORS.textSecondary,
            lineHeight: 1.4, fontStyle: "italic",
          }}>
            "{prompt}"
          </div>
        ))}
      </div>

      {/* Package info */}
      <SectionTitle>Package</SectionTitle>
      <table style={{ fontSize: 13, borderCollapse: "collapse" }}>
        <tbody>
          {[
            ["PyPI", "basisdata-mcp"],
            ["Version", "0.3.0"],
            ["Transport", "stdio"],
            ["License", "MIT"],
          ].map(([label, value]) => (
            <tr key={label}>
              <td style={{ padding: "6px 20px 6px 0", color: COLORS.textSecondary }}>{label}</td>
              <td style={{ padding: "6px 0", fontFamily: FONTS.mono, color: COLORS.text }}>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
