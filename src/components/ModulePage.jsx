// src/components/ModulePage.jsx
import { COLORS, FONTS } from "../design-system";

export function ModulePage({ module }) {
  const {
    tag,
    headline,
    stats,
    intro,
    capabilities,
    coverage,
    example,
    mcpTools,
    ctaLabel = "Get API Key — Free",
  } = module;

  return (
    <div style={{ paddingTop: 120 }}>
      {/* Hero */}
      <section style={{ maxWidth: 800, margin: "0 auto", padding: "60px 24px 80px" }}>
        <div style={{
          fontSize: 11, fontWeight: 600, letterSpacing: "0.12em",
          textTransform: "uppercase", color: COLORS.textTertiary, marginBottom: 20,
        }}>
          {tag}
        </div>
        <h1 className="module-headline" style={{
          fontSize: 48, fontWeight: 600, letterSpacing: "-0.03em",
          lineHeight: 1.1, color: COLORS.text, marginBottom: 28,
        }}>
          {headline}
        </h1>
        <div className="module-stats-row" style={{ display: "flex", gap: 16, marginBottom: 28 }}>
          {stats.map((s, i) => (
            <span key={i} style={{
              fontSize: 13, fontFamily: FONTS.mono, color: COLORS.textSecondary,
              padding: "6px 14px", border: `1px solid ${COLORS.border}`,
              whiteSpace: "nowrap",
            }}>
              {s}
            </span>
          ))}
        </div>
        <p style={{
          fontSize: 17, lineHeight: 1.7, color: COLORS.textSecondary, maxWidth: 620,
        }}>
          {intro}
        </p>
        <div className="hero-buttons" style={{ marginTop: 36, display: "flex", gap: 16 }}>
          <button style={{
            background: COLORS.accent, color: COLORS.bg, border: "none",
            padding: "14px 36px", fontSize: 15, fontWeight: 500,
          }}>
            {ctaLabel}
          </button>
          <button style={{
            background: "transparent", color: COLORS.text,
            border: `1px solid ${COLORS.border}`,
            padding: "14px 36px", fontSize: 15, fontWeight: 500,
          }}>
            Documentation →
          </button>
        </div>
      </section>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ height: 1, background: COLORS.border }} />
      </div>

      {/* What you can do */}
      <section style={{ maxWidth: 800, margin: "0 auto", padding: "64px 24px" }}>
        <h2 style={{
          fontSize: 11, fontWeight: 600, letterSpacing: "0.12em",
          textTransform: "uppercase", color: COLORS.textTertiary, marginBottom: 32,
        }}>
          What you can do
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {capabilities.map((cap, i) => (
            <div key={i} style={{
              fontSize: 16, lineHeight: 1.6, color: COLORS.text,
              paddingLeft: 20, borderLeft: `2px solid ${COLORS.border}`,
            }}>
              {cap}
            </div>
          ))}
        </div>
      </section>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ height: 1, background: COLORS.border }} />
      </div>

      {/* Coverage */}
      <section style={{ maxWidth: 800, margin: "0 auto", padding: "64px 24px" }}>
        <h2 style={{
          fontSize: 11, fontWeight: 600, letterSpacing: "0.12em",
          textTransform: "uppercase", color: COLORS.textTertiary, marginBottom: 32,
        }}>
          Coverage
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          {coverage.map((section, i) => (
            <div key={i}>
              <div style={{
                fontSize: 15, fontWeight: 600, color: COLORS.text, marginBottom: 8,
              }}>
                {section.title}
              </div>
              <div style={{
                fontSize: 14, lineHeight: 1.7, color: COLORS.textSecondary,
              }}>
                {section.items.join(" · ")}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ height: 1, background: COLORS.border }} />
      </div>

      {/* API Example */}
      <section style={{ maxWidth: 800, margin: "0 auto", padding: "64px 24px" }}>
        <h2 style={{
          fontSize: 11, fontWeight: 600, letterSpacing: "0.12em",
          textTransform: "uppercase", color: COLORS.textTertiary, marginBottom: 12,
        }}>
          Example
        </h2>
        <p style={{
          fontSize: 15, color: COLORS.textSecondary, marginBottom: 24, lineHeight: 1.6,
        }}>
          {example.description}
        </p>
        <div style={{
          background: COLORS.codeBlock, border: `1px solid ${COLORS.border}`,
          padding: 24, fontFamily: FONTS.mono, fontSize: 13,
          lineHeight: 1.7, color: COLORS.textSecondary,
          whiteSpace: "pre-wrap", overflowX: "auto",
          wordBreak: "break-all",
        }}>
          {example.code}
        </div>
      </section>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ height: 1, background: COLORS.border }} />
      </div>

      {/* MCP Tools */}
      <section style={{ maxWidth: 800, margin: "0 auto", padding: "64px 24px 100px" }}>
        <h2 style={{
          fontSize: 11, fontWeight: 600, letterSpacing: "0.12em",
          textTransform: "uppercase", color: COLORS.textTertiary, marginBottom: 32,
        }}>
          MCP Tools
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {mcpTools.map((tool, i) => (
            <div key={i} className="mcp-tool-row" style={{
              display: "flex", gap: 24, padding: "16px 0",
              borderBottom: `1px solid ${COLORS.borderLight}`,
            }}>
              <div className="mcp-tool-name" style={{
                fontFamily: FONTS.mono, fontSize: 13, fontWeight: 500,
                color: COLORS.text, minWidth: 200, flexShrink: 0,
              }}>
                {tool.name}
              </div>
              <div style={{
                fontSize: 14, color: COLORS.textSecondary, lineHeight: 1.5,
              }}>
                {tool.desc}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
