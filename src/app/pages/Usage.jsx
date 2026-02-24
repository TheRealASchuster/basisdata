// src/app/pages/Usage.jsx
import { useState, useEffect } from "react";
import { COLORS, FONTS } from "../../design-system";
import { apiFetch } from "../../lib/auth";

function StatCard({ label, value }) {
  return (
    <div style={{
      background: "#FFFFFF", border: `1px solid ${COLORS.border}`,
      padding: "16px 20px", flex: 1, minWidth: 140,
    }}>
      <div style={{ fontSize: 20, fontWeight: 600, color: COLORS.text, fontFamily: FONTS.mono }}>
        {value}
      </div>
      <div style={{ fontSize: 12, color: "#999", marginTop: 4 }}>{label}</div>
    </div>
  );
}

export default function Usage() {
  const [usage, setUsage] = useState(null);
  const [daily, setDaily] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiFetch("/v1/auth/usage?period=30d"),
      apiFetch("/v1/auth/usage?period=30d&breakdown=daily").catch(() => null),
    ]).then(([u, d]) => {
      setUsage(u);
      setDaily(d?.daily || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ fontSize: 13, color: "#999", padding: "60px 0" }}>Loading...</div>;

  const edgar = usage?.by_module?.edgar || 0;
  const ba = usage?.by_module?.bundesanzeiger || 0;
  const qrate = usage?.by_module?.qrate || 0;
  const chat = usage?.by_module?.chat || 0;
  const total = usage?.total_requests || 0;

  const now = new Date();
  const monthLabel = now.toLocaleString("default", { month: "long", year: "numeric" });

  const exportCSV = () => {
    if (!daily.length) return;
    const header = "Date,EDGAR,Bundesanzeiger,qRate,Chat,Total";
    const rows = daily.map(d => {
      const e = d.by_module?.edgar || 0;
      const b = d.by_module?.bundesanzeiger || 0;
      const q = d.by_module?.qrate || 0;
      const c = d.by_module?.chat || 0;
      const t = d.total || (e + b + q + c);
      return `${d.date},${e},${b},${q},${c},${t}`;
    });
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `basisdata-usage-${now.toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const thStyle = {
    padding: "10px 12px", fontSize: 11, fontWeight: 600,
    letterSpacing: "0.05em", textTransform: "uppercase",
    color: COLORS.textTertiary, whiteSpace: "nowrap",
  };

  const tdStyle = {
    padding: "10px 12px", fontSize: 13, fontFamily: FONTS.mono,
    color: COLORS.textSecondary, whiteSpace: "nowrap",
  };

  return (
    <div style={{ maxWidth: 800 }}>
      <h1 style={{ fontSize: 28, fontWeight: 600, letterSpacing: "-0.02em", color: COLORS.text, marginBottom: 8 }}>
        Usage
      </h1>
      <p style={{ fontSize: 14, color: "#999", marginBottom: 24 }}>{monthLabel}</p>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 32 }}>
        <StatCard label="Total calls" value={total.toLocaleString()} />
        <StatCard label="EDGAR" value={edgar.toLocaleString()} />
        <StatCard label="qRate" value={qrate.toLocaleString()} />
        <StatCard label="Chat msgs" value={chat.toLocaleString()} />
      </div>

      {/* Daily breakdown */}
      <div style={{ height: 1, background: COLORS.border, marginBottom: 24 }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#999" }}>
          Daily Breakdown
        </h2>
        {daily.length > 0 && (
          <button onClick={exportCSV} style={{
            background: "transparent", border: `1px solid ${COLORS.border}`,
            padding: "6px 14px", fontSize: 12, fontWeight: 500, color: COLORS.textSecondary,
          }}>
            Export CSV
          </button>
        )}
      </div>

      {daily.length > 0 ? (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                <th style={{ ...thStyle, textAlign: "left" }}>Date</th>
                <th style={{ ...thStyle, textAlign: "right" }}>EDGAR</th>
                <th style={{ ...thStyle, textAlign: "right" }}>Bundesanz.</th>
                <th style={{ ...thStyle, textAlign: "right" }}>qRate</th>
                <th style={{ ...thStyle, textAlign: "right" }}>Chat</th>
                <th style={{ ...thStyle, textAlign: "right" }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {daily.map((d, i) => {
                const e = d.by_module?.edgar || 0;
                const b = d.by_module?.bundesanzeiger || 0;
                const q = d.by_module?.qrate || 0;
                const c = d.by_module?.chat || 0;
                const t = d.total || (e + b + q + c);
                return (
                  <tr key={i} style={{ borderBottom: `1px solid ${COLORS.borderLight}` }}>
                    <td style={{ ...tdStyle, textAlign: "left", color: COLORS.text, fontWeight: 500 }}>{d.date}</td>
                    <td style={{ ...tdStyle, textAlign: "right" }}>{e}</td>
                    <td style={{ ...tdStyle, textAlign: "right" }}>{b}</td>
                    <td style={{ ...tdStyle, textAlign: "right" }}>{q}</td>
                    <td style={{ ...tdStyle, textAlign: "right" }}>{c}</td>
                    <td style={{ ...tdStyle, textAlign: "right", fontWeight: 500, color: COLORS.text }}>{t}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p style={{ fontSize: 13, color: "#999" }}>No daily data available yet.</p>
      )}
    </div>
  );
}
