// src/pages/Docs.jsx
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { COLORS, FONTS } from "../design-system";

const API_BASE = "https://api.basisdata.dev";

function SideNav({ sections, active }) {
  return (
    <nav className="docs-sidenav" style={{
      position: "sticky", top: 88, width: 200, flexShrink: 0,
      alignSelf: "flex-start", paddingRight: 24,
    }}>
      {sections.map((s) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          style={{
            display: "block", fontSize: 13, lineHeight: 1.4,
            padding: "6px 0", color: active === s.id ? COLORS.text : COLORS.textTertiary,
            fontWeight: active === s.id ? 500 : 400,
            borderLeft: active === s.id ? `2px solid ${COLORS.accent}` : "2px solid transparent",
            paddingLeft: 12, transition: "all 0.15s",
          }}
        >
          {s.label}
        </a>
      ))}
    </nav>
  );
}

function Endpoint({ method, path, description, params, example, response }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <span style={{
          fontFamily: FONTS.mono, fontSize: 11, fontWeight: 600,
          padding: "3px 8px", letterSpacing: "0.04em",
          background: method === "GET" ? "#E8F5E9" : "#E3F2FD",
          color: method === "GET" ? "#2E7D32" : "#1565C0",
        }}>
          {method}
        </span>
        <code style={{
          fontFamily: FONTS.mono, fontSize: 13, color: COLORS.text, fontWeight: 500,
        }}>
          {path}
        </code>
      </div>
      <p style={{ fontSize: 14, color: COLORS.textSecondary, lineHeight: 1.6, marginBottom: 12 }}>
        {description}
      </p>
      {params && params.length > 0 && (
        <table style={{
          width: "100%", borderCollapse: "collapse", fontSize: 13, marginBottom: 12,
        }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${COLORS.border}` }}>
              <th style={{ textAlign: "left", padding: "6px 8px 6px 0", color: COLORS.textTertiary, fontSize: 11, fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase" }}>Parameter</th>
              <th style={{ textAlign: "left", padding: "6px 8px", color: COLORS.textTertiary, fontSize: 11, fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase" }}>Type</th>
              <th style={{ textAlign: "left", padding: "6px 8px", color: COLORS.textTertiary, fontSize: 11, fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase" }}>Description</th>
            </tr>
          </thead>
          <tbody>
            {params.map((p, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${COLORS.borderLight}` }}>
                <td style={{ padding: "6px 8px 6px 0", fontFamily: FONTS.mono, color: COLORS.text, fontWeight: 500 }}>
                  {p.name}{p.required && <span style={{ color: COLORS.error, marginLeft: 2 }}>*</span>}
                </td>
                <td style={{ padding: "6px 8px", color: COLORS.textTertiary }}>{p.type}</td>
                <td style={{ padding: "6px 8px", color: COLORS.textSecondary, lineHeight: 1.5 }}>{p.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {example && (
        <pre style={{
          background: COLORS.codeBlock, border: `1px solid ${COLORS.border}`,
          padding: 16, fontFamily: FONTS.mono, fontSize: 12,
          lineHeight: 1.6, color: COLORS.textSecondary,
          overflowX: "auto", whiteSpace: "pre-wrap", wordBreak: "break-all",
        }}>
          {example}
        </pre>
      )}
    </div>
  );
}

function DocSection({ id, title, children }) {
  return (
    <section id={id} style={{ marginBottom: 56, scrollMarginTop: 100 }}>
      <h2 style={{
        fontSize: 11, fontWeight: 600, letterSpacing: "0.12em",
        textTransform: "uppercase", color: COLORS.textTertiary, marginBottom: 24,
      }}>
        {title}
      </h2>
      {children}
    </section>
  );
}

const sections = [
  { id: "quickstart", label: "Quick Start" },
  { id: "auth", label: "Authentication" },
  { id: "companies", label: "Companies" },
  { id: "financials", label: "Financials" },
  { id: "filings", label: "Filings" },
  { id: "metrics", label: "Metrics & Screener" },
  { id: "hgb", label: "Bundesanzeiger" },
  { id: "funds", label: "Credit Funds" },
  { id: "mcp", label: "MCP Server" },
];

export default function Docs() {
  const [active, setActive] = useState("quickstart");
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      setActive(location.hash.slice(1));
    }
  }, [location.hash]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        }
      },
      { rootMargin: "-100px 0px -60% 0px", threshold: 0 }
    );
    sections.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, paddingTop: 100 }}>
      <div className="docs-layout" style={{
        maxWidth: 1000, margin: "0 auto", padding: "40px 32px 100px",
        display: "flex", gap: 48,
      }}>
        <SideNav sections={sections} active={active} />

        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{
            fontSize: 36, fontWeight: 600, letterSpacing: "-0.03em",
            color: COLORS.text, marginBottom: 12,
          }}>
            API Documentation
          </h1>
          <p style={{
            fontSize: 16, color: COLORS.textSecondary, lineHeight: 1.6, marginBottom: 56,
          }}>
            REST API reference for all BasisData modules. Base URL: <code style={{ fontFamily: FONTS.mono, fontSize: 14 }}>{API_BASE}</code>
          </p>

          {/* Quick Start */}
          <DocSection id="quickstart" title="Quick Start">
            <p style={{ fontSize: 14, color: COLORS.textSecondary, lineHeight: 1.7, marginBottom: 20 }}>
              Get your API key from the <a href="/app/keys" style={{ color: COLORS.text, borderBottom: `1px solid ${COLORS.border}` }}>dashboard</a>, then start querying:
            </p>
            <pre style={{
              background: COLORS.codeBlock, border: `1px solid ${COLORS.border}`,
              padding: 20, fontFamily: FONTS.mono, fontSize: 12,
              lineHeight: 1.7, color: COLORS.textSecondary, overflowX: "auto",
              marginBottom: 24, whiteSpace: "pre-wrap", wordBreak: "break-all",
            }}>
{`curl ${API_BASE}/v1/companies/AAPL/financials/annual?years=3 \\
  -H "Authorization: Bearer bd_live_your_key_here"`}
            </pre>
            <p style={{ fontSize: 14, color: COLORS.textSecondary, lineHeight: 1.7, marginBottom: 16 }}>
              Or add to Claude Desktop for natural language access:
            </p>
            <pre style={{
              background: COLORS.codeBlock, border: `1px solid ${COLORS.border}`,
              padding: 20, fontFamily: FONTS.mono, fontSize: 12,
              lineHeight: 1.7, color: COLORS.textSecondary, overflowX: "auto",
              whiteSpace: "pre-wrap",
            }}>
{`// claude_desktop_config.json
{
  "mcpServers": {
    "basisdata": {
      "command": "uvx",
      "args": ["basisdata-mcp"],
      "env": { "BASISDATA_API_KEY": "bd_live_..." }
    }
  }
}`}
            </pre>
          </DocSection>

          {/* Authentication */}
          <DocSection id="auth" title="Authentication">
            <p style={{ fontSize: 14, color: COLORS.textSecondary, lineHeight: 1.7, marginBottom: 16 }}>
              All API requests require a Bearer token. Include your API key in the <code style={{ fontFamily: FONTS.mono }}>Authorization</code> header:
            </p>
            <pre style={{
              background: COLORS.codeBlock, border: `1px solid ${COLORS.border}`,
              padding: 16, fontFamily: FONTS.mono, fontSize: 12,
              lineHeight: 1.6, color: COLORS.textSecondary, overflowX: "auto",
              marginBottom: 16, whiteSpace: "pre-wrap",
            }}>
{`Authorization: Bearer bd_live_your_key_here`}
            </pre>
            <div style={{ fontSize: 14, color: COLORS.textSecondary, lineHeight: 1.7 }}>
              <p style={{ marginBottom: 8 }}><strong style={{ color: COLORS.text }}>Free plan:</strong> EDGAR module only, 100 requests/day.</p>
              <p style={{ marginBottom: 8 }}><strong style={{ color: COLORS.text }}>Pro plan:</strong> All modules (EDGAR + Bundesanzeiger + qRate + Chat), unlimited requests.</p>
              <p><strong style={{ color: COLORS.text }}>Enterprise:</strong> Everything in Pro plus bulk data access, SLA, and redistribution rights.</p>
            </div>
          </DocSection>

          {/* Companies */}
          <DocSection id="companies" title="Companies">
            <Endpoint
              method="GET" path="/v1/companies"
              description="Search and list companies. Supports US (EDGAR) and German (Bundesanzeiger) companies."
              params={[
                { name: "search", type: "string", desc: "Search by ticker, name, or CIK" },
                { name: "exchange", type: "string", desc: "Filter by exchange (NYSE, Nasdaq)" },
                { name: "sic", type: "string", desc: "Filter by SIC industry code" },
                { name: "country", type: "string", desc: "US or DE" },
                { name: "limit", type: "int", desc: "Results per page (1-100, default 25)" },
                { name: "offset", type: "int", desc: "Pagination offset (default 0)" },
              ]}
              example={`curl "${API_BASE}/v1/companies?search=apple&country=US" \\
  -H "Authorization: Bearer bd_live_..."`}
            />
            <Endpoint
              method="GET" path="/v1/companies/{identifier}"
              description="Get company details by ticker symbol or CIK number."
              params={[
                { name: "identifier", type: "string", desc: "Ticker (AAPL) or numeric CIK", required: true },
              ]}
              example={`curl "${API_BASE}/v1/companies/AAPL" \\
  -H "Authorization: Bearer bd_live_..."`}
            />
          </DocSection>

          {/* Financials */}
          <DocSection id="financials" title="Financials">
            <Endpoint
              method="GET" path="/v1/companies/{ticker}/financials/annual"
              description="Get annual standardized financial statements. Revenue, net income, EBITDA, EPS, balance sheet, cash flows."
              params={[
                { name: "ticker", type: "string", desc: "Company ticker or CIK", required: true },
                { name: "years", type: "int", desc: "Number of years (1-20, default 5)" },
              ]}
              example={`curl "${API_BASE}/v1/companies/MSFT/financials/annual?years=10" \\
  -H "Authorization: Bearer bd_live_..."`}
            />
            <Endpoint
              method="GET" path="/v1/companies/{ticker}/financials/quarterly"
              description="Get quarterly standardized financial statements."
              params={[
                { name: "ticker", type: "string", desc: "Company ticker or CIK", required: true },
                { name: "quarters", type: "int", desc: "Number of quarters (1-40, default 8)" },
              ]}
            />
            <Endpoint
              method="GET" path="/v1/companies/{ticker}/financials/raw"
              description="Access raw XBRL financial facts — every line item the company reported to the SEC, not just the 30 everyone standardizes."
              params={[
                { name: "ticker", type: "string", desc: "Company ticker or CIK", required: true },
                { name: "tag", type: "string", desc: "Exact XBRL tag (e.g. LaborAndRelatedExpense)" },
                { name: "tag_search", type: "string", desc: "Substring search across tag names" },
                { name: "unit", type: "string", desc: "USD, shares, or USD-per-share" },
                { name: "fiscal_year", type: "int", desc: "Filter by fiscal year" },
                { name: "period_type", type: "string", desc: "Q (quarterly) or A/FY (annual)" },
                { name: "limit", type: "int", desc: "Results per page (1-1000, default 100)" },
                { name: "offset", type: "int", desc: "Pagination offset" },
              ]}
              example={`curl "${API_BASE}/v1/companies/AAPL/financials/raw?tag=LaborAndRelatedExpense&period_type=A" \\
  -H "Authorization: Bearer bd_live_..."`}
            />
            <Endpoint
              method="GET" path="/v1/companies/{ticker}/financials/raw/tags"
              description="List all available XBRL tags for a company with record counts."
              params={[
                { name: "ticker", type: "string", desc: "Company ticker or CIK", required: true },
                { name: "search", type: "string", desc: "Substring search in tag names" },
                { name: "unit", type: "string", desc: "Filter by unit type" },
              ]}
            />
          </DocSection>

          {/* Filings */}
          <DocSection id="filings" title="Filings">
            <Endpoint
              method="GET" path="/v1/companies/{ticker}/filings"
              description="Get filing history for a company."
              params={[
                { name: "ticker", type: "string", desc: "Company ticker or CIK", required: true },
                { name: "form_type", type: "string", desc: "Filter by form type (10-K, 10-Q, 8-K, etc.)" },
                { name: "limit", type: "int", desc: "Results per page (1-100, default 20)" },
                { name: "offset", type: "int", desc: "Pagination offset" },
              ]}
            />
            <Endpoint
              method="GET" path="/v1/filings/search"
              description="Full-text search across 4.8 million SEC filings."
              params={[
                { name: "q", type: "string", desc: "Search query", required: true },
                { name: "ticker", type: "string", desc: "Filter by company" },
                { name: "form_type", type: "string", desc: "Filter by form type" },
                { name: "filed_after", type: "date", desc: "Filed after date (YYYY-MM-DD)" },
                { name: "filed_before", type: "date", desc: "Filed before date (YYYY-MM-DD)" },
                { name: "limit", type: "int", desc: "Results per page (1-100, default 25)" },
              ]}
              example={`curl "${API_BASE}/v1/filings/search?q=restructuring&form_type=8-K&filed_after=2024-01-01" \\
  -H "Authorization: Bearer bd_live_..."`}
            />
            <Endpoint
              method="GET" path="/v1/filings/{accession_number}"
              description="Get a single filing by its SEC accession number."
              params={[
                { name: "accession_number", type: "string", desc: "SEC accession number", required: true },
              ]}
            />
          </DocSection>

          {/* Metrics & Screener */}
          <DocSection id="metrics" title="Metrics & Screener">
            <Endpoint
              method="GET" path="/v1/companies/{ticker}/ratios"
              description="Computed financial ratios and live valuation metrics. Uses TTM data + real-time market prices."
              params={[
                { name: "ticker", type: "string", desc: "Company ticker or CIK", required: true },
              ]}
              example={`curl "${API_BASE}/v1/companies/TSLA/ratios" \\
  -H "Authorization: Bearer bd_live_..."`}
            />
            <Endpoint
              method="GET" path="/v1/compare"
              description="Side-by-side comparison of 2-10 companies on financial metrics."
              params={[
                { name: "tickers", type: "string", desc: "Comma-separated tickers (e.g. AAPL,MSFT,GOOGL)", required: true },
                { name: "metrics", type: "string", desc: "Comma-separated metric names (optional, defaults to all)" },
                { name: "format", type: "string", desc: "columns (per-company) or rows (per-metric)" },
              ]}
              example={`curl "${API_BASE}/v1/compare?tickers=AAPL,MSFT,GOOGL&metrics=revenue,net_margin,pe_ratio" \\
  -H "Authorization: Bearer bd_live_..."`}
            />
            <Endpoint
              method="GET" path="/v1/screener"
              description="Screen companies by financial criteria. Combine multiple filters."
              params={[
                { name: "revenue_gt", type: "number", desc: "Minimum revenue" },
                { name: "revenue_lt", type: "number", desc: "Maximum revenue" },
                { name: "net_margin_gt", type: "number", desc: "Minimum net margin (decimal, e.g. 0.15)" },
                { name: "gross_margin_gt", type: "number", desc: "Minimum gross margin" },
                { name: "roe_gt", type: "number", desc: "Minimum return on equity" },
                { name: "debt_to_equity_lt", type: "number", desc: "Maximum debt/equity ratio" },
                { name: "country", type: "string", desc: "US or DE" },
                { name: "sort_by", type: "string", desc: "Sort field (default: revenue)" },
                { name: "sort_dir", type: "string", desc: "asc or desc (default: desc)" },
                { name: "limit", type: "int", desc: "Results per page (1-100, default 25)" },
              ]}
              example={`curl "${API_BASE}/v1/screener?revenue_gt=1000000000&net_margin_gt=0.20&country=US&sort_by=revenue" \\
  -H "Authorization: Bearer bd_live_..."`}
            />
            <Endpoint
              method="GET" path="/v1/metrics/available"
              description="List all available metric names grouped by category (valuation, profitability, returns, growth, leverage)."
            />
          </DocSection>

          {/* Bundesanzeiger / HGB */}
          <DocSection id="hgb" title="Bundesanzeiger (German Companies)">
            <div style={{
              background: "#FFF8E1", border: "1px solid #FFE082",
              padding: "12px 16px", fontSize: 13, color: "#E65100",
              marginBottom: 24, lineHeight: 1.6,
            }}>
              Pro plan required. Bundesanzeiger and HGB endpoints are not available on the Free plan.
            </div>
            <Endpoint
              method="GET" path="/v1/companies/{identifier}/hgb"
              description="HGB financial statements (Bilanz + GuV) for German companies. Native German field names."
              params={[
                { name: "identifier", type: "string", desc: "CIK number or company name", required: true },
                { name: "fiscal_year", type: "int", desc: "Filter by fiscal year" },
                { name: "report_type", type: "string", desc: "Jahresabschluss or Konzernabschluss" },
                { name: "limit", type: "int", desc: "Results per page (1-100, default 20)" },
              ]}
              example={`curl "${API_BASE}/v1/companies/9000001/hgb?fiscal_year=2023" \\
  -H "Authorization: Bearer bd_live_..."`}
            />
            <Endpoint
              method="GET" path="/v1/companies/{identifier}/ba-filings"
              description="Bundesanzeiger filing index for a German company."
              params={[
                { name: "identifier", type: "string", desc: "CIK number or company name", required: true },
                { name: "report_type", type: "string", desc: "Filter by report type" },
                { name: "limit", type: "int", desc: "Results per page (1-200, default 50)" },
                { name: "offset", type: "int", desc: "Pagination offset" },
              ]}
            />
            <p style={{ fontSize: 14, color: COLORS.textSecondary, lineHeight: 1.7, marginTop: 16 }}>
              German companies can also be searched and screened through the standard <code style={{ fontFamily: FONTS.mono }}>/v1/companies</code> and <code style={{ fontFamily: FONTS.mono }}>/v1/screener</code> endpoints using <code style={{ fontFamily: FONTS.mono }}>country=DE</code>.
              Standardized financials (revenue, assets, equity, net income) are available via <code style={{ fontFamily: FONTS.mono }}>/v1/companies/{"{ticker}"}/financials</code> for cross-country comparisons.
            </p>
          </DocSection>

          {/* Credit Funds */}
          <DocSection id="funds" title="Credit Funds (qRate)">
            <div style={{
              background: "#FFF8E1", border: "1px solid #FFE082",
              padding: "12px 16px", fontSize: 13, color: "#E65100",
              marginBottom: 24, lineHeight: 1.6,
            }}>
              Pro plan required. Fund endpoints are not available on the Free plan.
            </div>
            <Endpoint
              method="GET" path="/v1/funds"
              description="Search credit funds by name, ticker, strategy, or manager."
              params={[
                { name: "search", type: "string", desc: "Ticker, fund name, or manager name" },
                { name: "strategy", type: "string", desc: "high_yield, investment_grade, bank_loan, multi_sector_credit, etc." },
                { name: "fund_type", type: "string", desc: "mutual_fund, etf, bdc, closed_end" },
                { name: "manager", type: "string", desc: "Manager name (PIMCO, BlackRock, etc.)" },
                { name: "limit", type: "int", desc: "Results per page (1-100, default 25)" },
                { name: "offset", type: "int", desc: "Pagination offset" },
              ]}
              example={`curl "${API_BASE}/v1/funds?strategy=high_yield&fund_type=etf" \\
  -H "Authorization: Bearer bd_live_..."`}
            />
            <Endpoint
              method="GET" path="/v1/funds/{identifier}"
              description="Get fund details including all share classes."
              params={[
                { name: "identifier", type: "string", desc: "Fund ticker, portfolio ID, or share class ticker", required: true },
              ]}
            />
            <Endpoint
              method="GET" path="/v1/funds/screen"
              description="Screen funds by multiple criteria."
              params={[
                { name: "strategy", type: "string", desc: "Fund strategy filter" },
                { name: "fund_type", type: "string", desc: "Vehicle type filter" },
                { name: "manager", type: "string", desc: "Manager name filter" },
                { name: "min_aum", type: "number", desc: "Minimum total net assets" },
                { name: "max_expense", type: "number", desc: "Maximum expense ratio" },
                { name: "sort_by", type: "string", desc: "Sort field (default: total_net_assets)" },
                { name: "limit", type: "int", desc: "Results per page (1-100, default 25)" },
              ]}
            />
            <Endpoint
              method="GET" path="/v1/funds/compare"
              description="Side-by-side comparison of 2-10 funds."
              params={[
                { name: "tickers", type: "string", desc: "Comma-separated tickers (e.g. HYG,JNK,USHY)", required: true },
              ]}
              example={`curl "${API_BASE}/v1/funds/compare?tickers=HYG,JNK,USHY" \\
  -H "Authorization: Bearer bd_live_..."`}
            />
            <Endpoint
              method="GET" path="/v1/funds/{identifier}/holdings"
              description="Position-level holdings from N-PORT filings with credit ratings and weights."
              params={[
                { name: "identifier", type: "string", desc: "Fund ticker or ID", required: true },
                { name: "report_date", type: "date", desc: "Report date (YYYY-MM-DD, defaults to latest)" },
                { name: "asset_type", type: "string", desc: "DE (debt) or EC (equity)" },
                { name: "min_weight", type: "number", desc: "Minimum portfolio weight (%)" },
                { name: "limit", type: "int", desc: "Results per page (1-500, default 50)" },
              ]}
              example={`curl "${API_BASE}/v1/funds/PIMIX/holdings?asset_type=DE&limit=20" \\
  -H "Authorization: Bearer bd_live_..."`}
            />
            <Endpoint
              method="GET" path="/v1/funds/{identifier}/allocation"
              description="Portfolio allocation breakdown by dimension (credit quality, sector, asset type, etc.)."
              params={[
                { name: "identifier", type: "string", desc: "Fund ticker or ID", required: true },
                { name: "dimension", type: "string", desc: "credit_quality, sector, asset_type, maturity, or country (default: credit_quality)" },
                { name: "report_date", type: "date", desc: "Report date (defaults to latest)" },
              ]}
            />
            <Endpoint
              method="GET" path="/v1/funds/{identifier}/performance"
              description="Returns, risk metrics, Sharpe, Sortino, drawdown, and volatility."
              params={[
                { name: "identifier", type: "string", desc: "Fund ticker or ID", required: true },
              ]}
            />
            <Endpoint
              method="GET" path="/v1/funds/{identifier}/nav"
              description="NAV time series history."
              params={[
                { name: "identifier", type: "string", desc: "Fund ticker or ID", required: true },
                { name: "period", type: "string", desc: "1w, 1m, 3m, 6m, 1y, or all (default: 1y)" },
              ]}
            />
            <Endpoint
              method="GET" path="/v1/funds/strategies"
              description="List all available fund strategies with portfolio counts."
            />
          </DocSection>

          {/* MCP Server */}
          <DocSection id="mcp" title="MCP Server">
            <p style={{ fontSize: 14, color: COLORS.textSecondary, lineHeight: 1.7, marginBottom: 20 }}>
              The BasisData MCP server provides 19 tools for AI agents. Install via PyPI:
            </p>
            <pre style={{
              background: COLORS.codeBlock, border: `1px solid ${COLORS.border}`,
              padding: 16, fontFamily: FONTS.mono, fontSize: 12,
              lineHeight: 1.6, color: COLORS.textSecondary, overflowX: "auto",
              marginBottom: 24,
            }}>
{`pip install basisdata-mcp
# or run directly:
uvx basisdata-mcp`}
            </pre>

            <h3 style={{
              fontSize: 15, fontWeight: 600, color: COLORS.text, marginBottom: 16,
            }}>
              Available Tools
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {[
                { name: "search_companies", desc: "Search by name, ticker, or CIK number" },
                { name: "get_company", desc: "Company metadata — SIC code, exchange, fiscal year end" },
                { name: "get_financials", desc: "Quarterly financial statements" },
                { name: "get_annual_financials", desc: "Annual statements for multi-year trend analysis" },
                { name: "get_ratios", desc: "Live valuation and profitability ratios" },
                { name: "compare_companies", desc: "Side-by-side comparison of 2-10 companies" },
                { name: "screen_companies", desc: "Multi-criteria screening by revenue, margins, growth" },
                { name: "get_raw_facts", desc: "Any XBRL tag the company has ever filed" },
                { name: "search_filings", desc: "Full-text search across SEC filings" },
                { name: "get_filing", desc: "Individual filing details" },
                { name: "search_de_companies", desc: "Search German companies" },
                { name: "get_de_financials", desc: "HGB financial statements (GuV + Bilanz)" },
                { name: "screen_de_companies", desc: "Screen German companies by revenue, margins, equity ratio" },
                { name: "search_funds", desc: "Search credit funds by name, ticker, manager, or strategy" },
                { name: "get_fund", desc: "Fund details including share classes" },
                { name: "get_fund_holdings", desc: "Position-level holdings with credit ratings" },
                { name: "compare_funds", desc: "Side-by-side fund comparison" },
                { name: "screen_funds", desc: "Multi-criteria fund screening" },
                { name: "get_fund_performance", desc: "Returns, Sharpe, Sortino, drawdown" },
              ].map((tool, i) => (
                <div key={i} style={{
                  display: "flex", gap: 16, padding: "10px 0",
                  borderBottom: `1px solid ${COLORS.borderLight}`,
                }}>
                  <code style={{
                    fontFamily: FONTS.mono, fontSize: 12, fontWeight: 500,
                    color: COLORS.text, minWidth: 180, flexShrink: 0,
                  }}>
                    {tool.name}
                  </code>
                  <span style={{ fontSize: 13, color: COLORS.textSecondary, lineHeight: 1.5 }}>
                    {tool.desc}
                  </span>
                </div>
              ))}
            </div>
          </DocSection>
        </div>
      </div>
    </div>
  );
}
