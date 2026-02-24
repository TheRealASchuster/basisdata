// src/app/pages/ApiSetup.jsx
import { useState, useEffect } from "react";
import { COLORS, FONTS } from "../../design-system";
import { apiFetch } from "../../lib/auth";

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

const ENDPOINTS = [
  { method: "GET", path: "/v1/companies/search?q={query}", desc: "Search companies by name or ticker" },
  { method: "GET", path: "/v1/companies/{cik}", desc: "Company profile" },
  { method: "GET", path: "/v1/financials/{cik}", desc: "Standardized financials (income, balance, cashflow)" },
  { method: "GET", path: "/v1/metrics/{cik}", desc: "Derived ratios and growth metrics" },
  { method: "GET", path: "/v1/filings/{cik}", desc: "SEC filing history" },
  { method: "GET", path: "/v1/screener", desc: "Screen companies by financial criteria" },
  { method: "GET", path: "/v1/compare", desc: "Side-by-side company comparison" },
  { method: "GET", path: "/v1/hgb/{company_id}", desc: "German HGB financial statements" },
  { method: "GET", path: "/v1/funds/search?q={query}", desc: "Search funds by name or strategy" },
  { method: "GET", path: "/v1/funds/{fund_id}", desc: "Fund profile and share classes" },
  { method: "GET", path: "/v1/funds/{fund_id}/holdings", desc: "Fund top holdings" },
  { method: "GET", path: "/v1/funds/{fund_id}/performance", desc: "NAV history and returns" },
  { method: "GET", path: "/v1/funds/screen", desc: "Screen funds by yield, duration, strategy" },
];

export default function ApiSetup() {
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCurl, setCopiedCurl] = useState(false);

  useEffect(() => {
    apiFetch("/v1/auth/keys")
      .then((data) => setKeys(data.keys || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const activeKey = keys.find(k => k.is_active);
  const keyPlaceholder = activeKey ? `${activeKey.key_prefix}...` : "bd_live_YOUR_KEY";

  const curlExample = `curl -H "Authorization: Bearer ${keyPlaceholder}" \\
  https://api.basisdata.dev/v1/companies/search?q=apple`;

  const copyCurl = () => {
    navigator.clipboard.writeText(curlExample);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  if (loading) return <div style={{ fontSize: 13, color: "#999", padding: "60px 0" }}>Loading...</div>;

  return (
    <div style={{ maxWidth: 720 }}>
      <h1 style={{ fontSize: 28, fontWeight: 600, letterSpacing: "-0.02em", color: COLORS.text, marginBottom: 8 }}>
        API Setup
      </h1>
      <p style={{ fontSize: 14, color: COLORS.textSecondary, lineHeight: 1.6 }}>
        REST API for programmatic access to EDGAR, Bundesanzeiger, and qRate data.
      </p>

      {/* Connection */}
      <SectionTitle>Connection</SectionTitle>
      <table style={{ fontSize: 13, borderCollapse: "collapse" }}>
        <tbody>
          <tr>
            <td style={{ padding: "6px 20px 6px 0", color: "#6B6B6B" }}>Base URL</td>
            <td style={{ padding: "6px 0", fontFamily: FONTS.mono, color: COLORS.text }}>https://api.basisdata.dev/v1</td>
          </tr>
          <tr>
            <td style={{ padding: "6px 20px 6px 0", color: "#6B6B6B" }}>Auth</td>
            <td style={{ padding: "6px 0", fontFamily: FONTS.mono, color: COLORS.text }}>Authorization: Bearer {keyPlaceholder}</td>
          </tr>
          <tr>
            <td style={{ padding: "6px 20px 6px 0", color: "#6B6B6B" }}>Format</td>
            <td style={{ padding: "6px 0", fontFamily: FONTS.mono, color: COLORS.text }}>JSON</td>
          </tr>
          <tr>
            <td style={{ padding: "6px 20px 6px 0", color: "#6B6B6B" }}>Rate limit</td>
            <td style={{ padding: "6px 0", color: COLORS.text }}>Free: 100/day &middot; Pro: 60/min</td>
          </tr>
        </tbody>
      </table>

      {/* Quick test */}
      <SectionTitle>Quick Test</SectionTitle>
      <p style={{ fontSize: 13, color: COLORS.textSecondary, marginBottom: 12, lineHeight: 1.5 }}>
        Try this in your terminal:
      </p>
      <CodeBlock onCopy={copyCurl} copied={copiedCurl}>{curlExample}</CodeBlock>

      {/* Endpoints */}
      <SectionTitle>Endpoints</SectionTitle>
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {ENDPOINTS.map((ep, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "baseline", gap: 10,
            padding: "8px 0",
            borderBottom: i < ENDPOINTS.length - 1 ? `1px solid ${COLORS.borderLight}` : "none",
          }}>
            <span style={{
              fontFamily: FONTS.mono, fontSize: 11, fontWeight: 600,
              color: ep.method === "GET" ? "#2563EB" : "#059669",
              width: 32, flexShrink: 0,
            }}>
              {ep.method}
            </span>
            <code style={{
              fontFamily: FONTS.mono, fontSize: 12, color: COLORS.text,
              minWidth: 280, flexShrink: 0,
            }}>
              {ep.path}
            </code>
            <span style={{ fontSize: 12, color: COLORS.textSecondary }}>
              {ep.desc}
            </span>
          </div>
        ))}
      </div>

      {/* Python example */}
      <SectionTitle>Python Example</SectionTitle>
      <CodeBlock>{`import requests

API_KEY = "${keyPlaceholder}"
BASE = "https://api.basisdata.dev/v1"
headers = {"Authorization": f"Bearer {API_KEY}"}

# Search for a company
companies = requests.get(f"{BASE}/companies/search",
    params={"q": "apple"}, headers=headers).json()

# Get financials
cik = companies[0]["cik"]
financials = requests.get(f"{BASE}/financials/{cik}",
    headers=headers).json()`}</CodeBlock>

      {/* JavaScript example */}
      <SectionTitle>JavaScript Example</SectionTitle>
      <CodeBlock>{`const API_KEY = "${keyPlaceholder}";
const BASE = "https://api.basisdata.dev/v1";
const headers = { Authorization: \`Bearer \${API_KEY}\` };

// Search for a company
const res = await fetch(\`\${BASE}/companies/search?q=apple\`,
  { headers });
const companies = await res.json();

// Get financials
const cik = companies[0].cik;
const fin = await fetch(\`\${BASE}/financials/\${cik}\`,
  { headers }).then(r => r.json());`}</CodeBlock>

      <div style={{ marginTop: 32 }}>
        <a href="/docs" target="_blank" rel="noopener" style={{
          display: "inline-block",
          fontSize: 13, fontWeight: 500, color: COLORS.text,
          borderBottom: `1px solid ${COLORS.border}`, paddingBottom: 2,
        }}>
          View full API documentation &rarr;
        </a>
      </div>
    </div>
  );
}
