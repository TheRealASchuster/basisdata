// src/pages/Landing.jsx
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { COLORS, FONTS } from "../design-system";

function Hero() {
  return (
    <section style={{
      textAlign: "center",
      maxWidth: 900, margin: "0 auto", padding: "160px 24px 100px",
    }}>
      <h1 className="hero-title" style={{
        fontSize: 60, fontWeight: 600, lineHeight: 1.08,
        letterSpacing: "-0.035em", color: COLORS.text, marginBottom: 28,
        animation: "fadeUp 0.8s ease-out forwards",
      }}>
        Financial data infrastructure<br />for the AI era.
      </h1>
      <p className="hero-sub" style={{
        fontSize: 18, lineHeight: 1.6, color: COLORS.textSecondary,
        maxWidth: 560, margin: "0 auto 48px", fontWeight: 400,
        animation: "fadeUp 0.8s ease-out 0.1s forwards", opacity: 0,
      }}>
        SEC EDGAR. German Bundesanzeiger. US Credit Funds.<br />
        REST API. MCP server. Chat interface. Built for AI agents.
      </p>
      <div className="hero-buttons" style={{
        display: "flex", gap: 16, justifyContent: "center",
        animation: "fadeUp 0.8s ease-out 0.2s forwards", opacity: 0,
      }}>
        <Link to="/signup" style={{
          background: COLORS.accent, color: COLORS.bg, border: "none",
          padding: "14px 36px", fontSize: 15, fontWeight: 500, display: "inline-block",
        }}>
          Get Started — Free
        </Link>
        <Link to="/docs" style={{
          background: "transparent", color: COLORS.text,
          border: `1px solid ${COLORS.border}`,
          padding: "14px 36px", fontSize: 15, fontWeight: 500, display: "inline-block",
        }}>
          Documentation →
        </Link>
      </div>
    </section>
  );
}

function Divider() {
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
      <div style={{ height: 1, background: COLORS.border }} />
    </div>
  );
}

function ModuleCard({ name, subtitle, stats, description, to }) {
  return (
    <div style={{ flex: 1, padding: "48px 0" }}>
      <div style={{
        fontSize: 11, fontWeight: 600, letterSpacing: "0.12em",
        textTransform: "uppercase", color: COLORS.textTertiary, marginBottom: 16,
      }}>
        {name}
      </div>
      <div style={{
        fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em",
        color: COLORS.text, marginBottom: 20,
      }}>
        {subtitle}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 24 }}>
        {stats.map((s, i) => (
          <div key={i} style={{
            fontSize: 14, color: COLORS.textSecondary,
            fontWeight: 400, letterSpacing: "-0.01em",
          }}>
            {s}
          </div>
        ))}
      </div>
      <p style={{
        fontSize: 15, lineHeight: 1.65, color: COLORS.textSecondary, marginBottom: 28,
      }}>
        {description}
      </p>
      <Link to={to} style={{
        fontSize: 14, fontWeight: 500, color: COLORS.text,
        borderBottom: `1px solid ${COLORS.border}`, paddingBottom: 2,
      }}>
        Explore →
      </Link>
    </div>
  );
}

function Modules() {
  return (
    <section style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
      <div className="module-cards" style={{ display: "flex", gap: 48 }}>
        <ModuleCard
          name="EDGAR" subtitle="US Public Companies"
          stats={["7,017 companies", "4.8M SEC filings", "Raw XBRL facts"]}
          description="Equity research, quant analysis, and financial modeling. Every line item a company reported to the SEC — from revenue to labor costs to lease obligations."
          to="/edgar"
        />
        <div className="module-divider-v" style={{ width: 1, background: COLORS.border, flexShrink: 0 }} />
        <ModuleCard
          name="BUNDESANZEIGER" subtitle="German Mittelstand"
          stats={["50,000 companies", "HGB financials", "Down to €2M revenue"]}
          description="PE deal sourcing, M&A advisory, and German market research. Family-owned Mittelstand companies that don't show up on Bloomberg."
          to="/bundesanzeiger"
        />
        <div className="module-divider-v" style={{ width: 1, background: COLORS.border, flexShrink: 0 }} />
        <ModuleCard
          name="QRATE" subtitle="Credit Fund Analytics"
          stats={["1,800 share classes", "500 portfolios", "Top 20 managers"]}
          description="Credit portfolio management and fixed income analysis. Holdings, risk metrics, and returns for every major credit fund."
          to="/qrate"
        />
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { num: "01", title: "MCP Server", desc: "Add BasisData to Claude Desktop in 30 seconds. 19 tools, one config snippet. Your AI agent can query every dataset." },
    { num: "02", title: "REST API", desc: "50+ endpoints for programmatic access. Company fundamentals, fund holdings, German financials — all via simple HTTP calls." },
    { num: "03", title: "Chat Interface", desc: "No code required. Ask questions in plain English, get tables and CSV exports. Powered by Claude." },
  ];
  return (
    <section style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px" }}>
      <div style={{
        fontSize: 11, fontWeight: 600, letterSpacing: "0.12em",
        textTransform: "uppercase", color: COLORS.textTertiary, marginBottom: 48,
      }}>
        Three ways to access
      </div>
      <div className="steps-row" style={{ display: "flex", gap: 48 }}>
        {steps.map((step, i) => (
          <div key={i} style={{ flex: 1 }}>
            <div style={{
              fontSize: 48, fontWeight: 600, color: COLORS.borderLight,
              letterSpacing: "-0.04em", marginBottom: 16, fontFamily: FONTS.mono,
            }}>
              {step.num}
            </div>
            <div style={{
              fontSize: 20, fontWeight: 600, letterSpacing: "-0.02em",
              color: COLORS.text, marginBottom: 12,
            }}>
              {step.title}
            </div>
            <p style={{ fontSize: 15, lineHeight: 1.65, color: COLORS.textSecondary }}>
              {step.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function CodeBlock() {
  return (
    <section style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 80px" }}>
      <div className="code-block-layout" style={{ display: "flex", gap: 48, alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: 11, fontWeight: 600, letterSpacing: "0.12em",
            textTransform: "uppercase", color: COLORS.textTertiary, marginBottom: 20,
          }}>
            MCP Setup
          </div>
          <div className="section-title" style={{
            fontSize: 28, fontWeight: 600, letterSpacing: "-0.02em",
            lineHeight: 1.3, color: COLORS.text, marginBottom: 16,
          }}>
            One config snippet.<br />Every financial dataset.
          </div>
          <p style={{
            fontSize: 15, lineHeight: 1.65, color: COLORS.textSecondary, maxWidth: 400,
          }}>
            Add BasisData to your Claude Desktop config and restart.
            Then ask Claude to analyze any company, screen German Mittelstand,
            or compare credit funds — all through natural language.
          </p>
        </div>
        <div style={{
          flex: 1, background: COLORS.codeBlock,
          border: `1px solid ${COLORS.border}`,
          padding: "24px 28px", fontFamily: FONTS.mono, fontSize: 13,
          lineHeight: 1.7, color: COLORS.textSecondary,
          whiteSpace: "pre", overflow: "auto",
        }}>
          <span style={{ color: COLORS.textTertiary }}>// claude_desktop_config.json</span>{"\n"}
          {"{\n"}
          {"  "}<span style={{ color: "#7B6E60" }}>"mcpServers"</span>{": {\n"}
          {"    "}<span style={{ color: "#7B6E60" }}>"basisdata"</span>{": {\n"}
          {"      "}<span style={{ color: "#7B6E60" }}>"command"</span>{": "}<span style={{ color: "#5A7A5A" }}>"uvx"</span>{",\n"}
          {"      "}<span style={{ color: "#7B6E60" }}>"args"</span>{": ["}<span style={{ color: "#5A7A5A" }}>"basisdata-mcp"</span>{"],\n"}
          {"      "}<span style={{ color: "#7B6E60" }}>"env"</span>{": {\n"}
          {"        "}<span style={{ color: "#7B6E60" }}>"BASISDATA_API_KEY"</span>{": "}<span style={{ color: "#5A7A5A" }}>"your_key"</span>{"\n"}
          {"      }\n"}
          {"    }\n"}
          {"  }\n"}
          {"}"}
        </div>
      </div>
    </section>
  );
}

function ChatPreview() {
  const [typed, setTyped] = useState("");
  const fullText = "Compare PIMCO Income Fund and DoubleLine Total Return on duration, yield, and 3-year Sharpe ratio";
  const [showResponse, setShowResponse] = useState(false);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const interval = setInterval(() => {
      if (i < fullText.length) {
        setTyped(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => setShowResponse(true), 600);
      }
    }, 28);
    return () => clearInterval(interval);
  }, [started]);

  return (
    <section ref={ref} style={{ maxWidth: 1200, margin: "0 auto", padding: "20px 24px 80px" }}>
      <div style={{
        fontSize: 11, fontWeight: 600, letterSpacing: "0.12em",
        textTransform: "uppercase", color: COLORS.textTertiary, marginBottom: 20,
      }}>
        Chat Interface
      </div>
      <div className="section-title" style={{
        fontSize: 28, fontWeight: 600, letterSpacing: "-0.02em",
        lineHeight: 1.3, color: COLORS.text, marginBottom: 12,
      }}>
        Ask. Don't configure.
      </div>
      <p style={{
        fontSize: 15, lineHeight: 1.65, color: COLORS.textSecondary,
        maxWidth: 560, marginBottom: 40,
      }}>
        No dashboards. No filters. No learning curve.
        Type what you need in plain English. Get tables you can export to CSV.
      </p>

      <div style={{
        background: COLORS.bgCard, border: `1px solid ${COLORS.border}`,
        maxWidth: 720, overflow: "hidden",
      }}>
        <div style={{
          padding: "16px 24px", borderBottom: `1px solid ${COLORS.border}`,
          fontSize: 13, fontWeight: 500, color: COLORS.textSecondary,
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#4CAF50" }} />
          BasisData Chat
        </div>

        <div style={{ padding: 24, minHeight: 280 }}>
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, color: COLORS.textTertiary, marginBottom: 8, fontWeight: 500 }}>YOU</div>
            <div style={{ fontSize: 15, lineHeight: 1.6, color: COLORS.text }}>
              {typed}
              {!showResponse && <span style={{
                display: "inline-block", width: 2, height: 18,
                background: COLORS.accent, marginLeft: 2, verticalAlign: "text-bottom",
                animation: "fadeIn 0.5s ease-in-out infinite alternate",
              }} />}
            </div>
          </div>

          {showResponse && (
            <div style={{ animation: "fadeUp 0.5s ease-out forwards" }}>
              <div style={{ fontSize: 11, color: COLORS.textTertiary, marginBottom: 8, fontWeight: 500 }}>BASISDATA</div>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: COLORS.textSecondary, marginBottom: 16 }}>
                Here's the comparison using latest available data:
              </p>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, fontFamily: FONTS.mono }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                      {["Metric", "PIMCO Income (PIMIX)", "DoubleLine TR (DBLTX)"].map((h, i) => (
                        <th key={i} style={{
                          textAlign: i === 0 ? "left" : "right", padding: "10px 12px",
                          fontWeight: 500, color: COLORS.textTertiary, fontSize: 11,
                          letterSpacing: "0.05em", textTransform: "uppercase",
                          whiteSpace: "nowrap",
                        }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Effective Duration", "4.2 yrs", "3.8 yrs"],
                      ["30-Day SEC Yield", "5.14%", "4.67%"],
                      ["12-Month Distribution", "5.82%", "5.21%"],
                      ["3-Year Sharpe Ratio", "0.87", "0.72"],
                      ["3-Year Std Dev", "6.41%", "5.89%"],
                      ["Max Drawdown (3Y)", "-12.4%", "-10.8%"],
                      ["AUM", "$156.2B", "$48.7B"],
                      ["Expense Ratio", "0.49%", "0.73%"],
                    ].map(([metric, a, b], i) => (
                      <tr key={i} style={{ borderBottom: `1px solid ${COLORS.borderLight}` }}>
                        <td style={{ padding: "10px 12px", color: COLORS.text, fontWeight: 500, whiteSpace: "nowrap" }}>{metric}</td>
                        <td style={{ padding: "10px 12px", textAlign: "right", color: COLORS.textSecondary }}>{a}</td>
                        <td style={{ padding: "10px 12px", textAlign: "right", color: COLORS.textSecondary }}>{b}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button style={{
                marginTop: 16, background: "transparent",
                border: `1px solid ${COLORS.border}`, padding: "8px 16px",
                fontSize: 12, fontWeight: 500, color: COLORS.textSecondary,
              }}>
                ↓ Download CSV
              </button>
            </div>
          )}
        </div>

        <div style={{ padding: "16px 24px", borderTop: `1px solid ${COLORS.border}` }}>
          <div style={{
            background: COLORS.codeBlock, border: `1px solid ${COLORS.borderLight}`,
            padding: "12px 16px", fontSize: 14, color: COLORS.textTertiary,
          }}>
            Ask anything about companies, funds, or markets...
          </div>
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const items = [
    { number: "7,017", label: "US Companies" },
    { number: "50,000", label: "German Companies" },
    { number: "1,800", label: "Fund Share Classes" },
    { number: "4.8M", label: "SEC Filings" },
    { number: "19", label: "MCP Tools" },
    { number: "<100ms", label: "Response Time" },
  ];
  return (
    <section style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px" }}>
      <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 1 }}>
        {items.map((item, i) => (
          <div key={i} style={{ textAlign: "center", padding: "24px 16px" }}>
            <div className="stat-number" style={{
              fontSize: 36, fontWeight: 600, letterSpacing: "-0.04em",
              color: COLORS.text, marginBottom: 8,
              fontFeatureSettings: "'tnum' 1",
            }}>
              {item.number}
            </div>
            <div style={{
              fontSize: 11, color: COLORS.textTertiary,
              letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 500,
            }}>
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function PricingPreview() {
  return (
    <section style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px" }}>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <div style={{
          fontSize: 11, fontWeight: 600, letterSpacing: "0.12em",
          textTransform: "uppercase", color: COLORS.textTertiary, marginBottom: 20,
        }}>
          Pricing
        </div>
        <div className="section-title" style={{
          fontSize: 36, fontWeight: 600, letterSpacing: "-0.03em", color: COLORS.text,
        }}>
          Free during beta. Pay when you're ready.
        </div>
      </div>
      <div className="pricing-grid" style={{
        display: "flex", gap: 1, background: COLORS.border,
        border: `1px solid ${COLORS.border}`,
      }}>
        {[
          { name: "Free", price: "$0", period: "forever", features: ["EDGAR API only", "100 calls / day", "MCP server access"], cta: "Get Started", primary: false },
          { name: "Pro", price: "$49", period: "/ month", features: ["All 3 modules", "Unlimited API calls", "Chat interface", "CSV export", "Email support"], cta: "Subscribe", primary: true },
          { name: "Enterprise", price: "Custom", period: "", features: ["Everything in Pro", "Bulk data download", "SLA guarantee", "Redistribution rights"], cta: "Contact Us", primary: false },
        ].map((tier, i) => (
          <div key={i} style={{
            flex: 1, background: tier.primary ? COLORS.bgCard : COLORS.bg, padding: "48px 32px",
          }}>
            <div style={{
              fontSize: 13, fontWeight: 600, letterSpacing: "0.06em",
              textTransform: "uppercase", color: COLORS.textTertiary, marginBottom: 24,
            }}>
              {tier.name}
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 32 }}>
              <span style={{ fontSize: 40, fontWeight: 600, letterSpacing: "-0.03em", color: COLORS.text }}>
                {tier.price}
              </span>
              <span style={{ fontSize: 15, color: COLORS.textTertiary }}>{tier.period}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 36 }}>
              {tier.features.map((f, j) => (
                <div key={j} style={{ fontSize: 14, color: COLORS.textSecondary, lineHeight: 1.4 }}>{f}</div>
              ))}
            </div>
            <Link to={tier.primary ? "/signup" : tier.name === "Enterprise" ? "/contact" : "/signup"} style={{
              display: "block", textAlign: "center", width: "100%",
              background: tier.primary ? COLORS.accent : "transparent",
              color: tier.primary ? COLORS.bg : COLORS.text,
              border: tier.primary ? "none" : `1px solid ${COLORS.border}`,
              padding: "14px 0", fontSize: 14, fontWeight: 500,
            }}>
              {tier.cta}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function Landing() {
  return (
    <div>
      <Hero />
      <Divider />
      <Modules />
      <Divider />
      <HowItWorks />
      <Divider />
      <CodeBlock />
      <ChatPreview />
      <Divider />
      <Stats />
      <Divider />
      <PricingPreview />
    </div>
  );
}
