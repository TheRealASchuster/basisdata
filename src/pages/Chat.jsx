// src/pages/Chat.jsx
import { useState, useRef, useEffect, useCallback } from "react";
import { COLORS, FONTS } from "../design-system";
import { apiRawFetch } from "../lib/auth";
import { useAuth } from "../lib/auth";

function TableBlock({ headers, rows }) {
  const downloadCSV = () => {
    const csv = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `basisdata-export-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ margin: "16px 0" }}>
      <div style={{ overflowX: "auto" }}>
        <table style={{
          width: "100%", borderCollapse: "collapse",
          fontSize: 13, fontFamily: FONTS.mono,
        }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${COLORS.border}` }}>
              {headers.map((h, i) => (
                <th key={i} style={{
                  textAlign: i === 0 ? "left" : "right", padding: "10px 12px",
                  fontWeight: 500, color: COLORS.textTertiary, fontSize: 11,
                  letterSpacing: "0.05em", textTransform: "uppercase", whiteSpace: "nowrap",
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${COLORS.borderLight}` }}>
                {row.map((cell, j) => (
                  <td key={j} style={{
                    padding: "10px 12px",
                    textAlign: j === 0 ? "left" : "right",
                    color: j === 0 ? COLORS.text : COLORS.textSecondary,
                    fontWeight: j === 0 ? 500 : 400, whiteSpace: "nowrap",
                  }}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button onClick={downloadCSV} style={{
        marginTop: 12, background: "transparent",
        border: `1px solid ${COLORS.border}`, padding: "8px 16px",
        fontSize: 12, fontWeight: 500, color: COLORS.textSecondary,
      }}>
        ↓ Download CSV
      </button>
    </div>
  );
}

function parseResponse(content) {
  const tables = [];
  const tableRegex = /\n?\|(.+)\|\n\|[-| :]+\|\n((?:\|.+\|\n?)+)/g;
  const cleanedText = content.replace(tableRegex, (match, headerLine, bodyLines) => {
    const headers = headerLine.split("|").map(h => h.trim()).filter(Boolean);
    const rows = bodyLines.trim().split("\n").map(line =>
      line.split("|").map(c => c.trim()).filter(Boolean)
    );
    tables.push({ headers, rows });
    return "";
  });
  return { text: cleanedText.trim(), tables };
}

function Message({ role, content, tables }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{
        fontSize: 11, fontWeight: 600, letterSpacing: "0.08em",
        textTransform: "uppercase", color: COLORS.textTertiary, marginBottom: 8,
      }}>
        {role === "user" ? "YOU" : "BASISDATA"}
      </div>
      <div style={{
        fontSize: 15, lineHeight: 1.7, color: COLORS.text, whiteSpace: "pre-wrap",
      }}>
        {content}
      </div>
      {tables && tables.map((table, i) => (
        <TableBlock key={i} headers={table.headers} rows={table.rows} />
      ))}
    </div>
  );
}

function StreamingMessage({ content, status }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{
        fontSize: 11, fontWeight: 600, letterSpacing: "0.08em",
        textTransform: "uppercase", color: COLORS.textTertiary, marginBottom: 8,
      }}>
        BASISDATA
      </div>
      {status && !content && (
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          fontSize: 13, color: COLORS.textTertiary, padding: "4px 0",
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: "50%",
            background: COLORS.textTertiary,
            animation: "pulse 1s ease-in-out infinite",
          }} />
          {status}...
        </div>
      )}
      {content && (
        <div style={{
          fontSize: 15, lineHeight: 1.7, color: COLORS.text, whiteSpace: "pre-wrap",
        }}>
          {content}
          <span style={{
            display: "inline-block", width: 2, height: 16,
            background: COLORS.accent, marginLeft: 1, verticalAlign: "text-bottom",
            animation: "fadeIn 0.5s ease-in-out infinite alternate",
          }} />
        </div>
      )}
    </div>
  );
}

const DATASETS = [
  { id: "edgar", label: "EDGAR", desc: "US public companies" },
  { id: "bundesanzeiger", label: "Bundesanzeiger", desc: "German Mittelstand" },
  { id: "qrate", label: "qRate", desc: "Credit funds" },
];

function DatasetToggle({ selected, onToggle }) {
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {DATASETS.map(ds => {
        const active = selected.includes(ds.id);
        return (
          <button
            key={ds.id}
            onClick={() => onToggle(ds.id)}
            style={{
              background: active ? COLORS.accent : "transparent",
              color: active ? COLORS.bg : COLORS.textTertiary,
              border: `1px solid ${active ? COLORS.accent : COLORS.border}`,
              padding: "6px 14px",
              fontSize: 12,
              fontWeight: 500,
              transition: "all 0.15s",
              letterSpacing: "0.01em",
            }}
          >
            {ds.label}
          </button>
        );
      })}
    </div>
  );
}

export default function Chat({ embedded = false }) {
  const { session } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streamText, setStreamText] = useState("");
  const [streamStatus, setStreamStatus] = useState("");
  const [datasets, setDatasets] = useState(["edgar", "bundesanzeiger", "qrate"]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const hasMessages = messages.length > 0 || loading;

  const userName = session?.user?.user_metadata?.full_name
    || session?.user?.email?.split("@")[0]
    || "there";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, streamText, streamStatus]);

  const toggleDataset = (id) => {
    setDatasets(prev => {
      if (prev.includes(id)) {
        if (prev.length === 1) return prev; // keep at least one
        return prev.filter(d => d !== id);
      }
      return [...prev, id];
    });
  };

  const sendMessage = useCallback(async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);
    setStreamText("");
    setStreamStatus("");

    try {
      const allMessages = [
        ...messages.map(m => ({ role: m.role, content: m.content })),
        { role: "user", content: userMessage },
      ];

      const response = await apiRawFetch("/v1/chat/stream", {
        method: "POST",
        body: JSON.stringify({ messages: allMessages }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({ detail: response.statusText }));
        throw new Error(body.detail || body.message || `API error ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";
      let buffer = "";
      let gotDone = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        let eventType = "";
        for (const line of lines) {
          if (line.startsWith("event: ")) {
            eventType = line.slice(7).trim();
          } else if (line.startsWith("data: ")) {
            const data = line.slice(6);
            try {
              const parsed = JSON.parse(data);
              if (eventType === "status") {
                setStreamStatus(parsed.label || parsed.tool);
              } else if (eventType === "delta") {
                accumulated += parsed.text;
                setStreamText(accumulated);
                setStreamStatus("");
              } else if (eventType === "done") {
                gotDone = true;
                const { text, tables } = parseResponse(accumulated);
                setMessages(prev => [...prev, {
                  role: "assistant", content: text,
                  tables: tables.length > 0 ? tables : undefined,
                }]);
                setStreamText("");
                setStreamStatus("");
              } else if (eventType === "error") {
                throw new Error(parsed.message || "Stream error");
              }
            } catch (e) {
              if (e.message === "Stream error" || eventType === "error") throw e;
            }
          }
        }
      }

      if (!gotDone && accumulated) {
        const { text, tables } = parseResponse(accumulated);
        setMessages(prev => [...prev, {
          role: "assistant", content: text,
          tables: tables.length > 0 ? tables : undefined,
        }]);
        setStreamText("");
      }
    } catch (err) {
      setStreamText("");
      setStreamStatus("");
      setMessages(prev => [...prev, {
        role: "assistant",
        content: err.message.includes("upgrade_required")
          ? "Chat requires a Pro subscription. Visit /pricing to upgrade."
          : `Error: ${err.message}`,
      }]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setStreamText("");
    setStreamStatus("");
  };

  // ── Empty state (Claude Desktop style) ─────────────────────
  if (!hasMessages) {
    return (
      <div style={{
        minHeight: embedded ? "calc(100vh - 180px)" : "100vh",
        background: COLORS.bg,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: embedded ? 0 : 64,
        paddingBottom: 40,
      }}>
        <div style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          maxWidth: 640,
          padding: "0 32px",
        }}>
          <h1 style={{
            fontSize: 28, fontWeight: 600, letterSpacing: "-0.02em",
            color: COLORS.text, marginBottom: 8, textAlign: "center",
          }}>
            Hello, {userName}.
          </h1>
          <p style={{
            fontSize: 15, color: COLORS.textTertiary, textAlign: "center",
            marginBottom: 40, lineHeight: 1.5,
          }}>
            What would you like to analyze?
          </p>

          {/* Input area — centered */}
          <div style={{ width: "100%", marginBottom: 16 }}>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything about companies, funds, or markets..."
                rows={1}
                style={{
                  flex: 1, padding: "14px 16px", fontSize: 15,
                  border: `1px solid ${COLORS.border}`, background: COLORS.bgCard,
                  color: COLORS.text, outline: "none", resize: "none",
                  fontFamily: FONTS.body, lineHeight: 1.5, maxHeight: 120,
                }}
                onInput={(e) => {
                  e.target.style.height = "auto";
                  e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
                }}
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                style={{
                  background: input.trim() ? COLORS.accent : COLORS.border,
                  color: COLORS.bg, border: "none", padding: "14px 24px",
                  fontSize: 14, fontWeight: 500, flexShrink: 0,
                }}
              >
                Send
              </button>
            </div>
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              marginTop: 12,
            }}>
              <DatasetToggle selected={datasets} onToggle={toggleDataset} />
              <span style={{ fontSize: 11, color: COLORS.textTertiary }}>
                Powered by Claude
              </span>
            </div>
          </div>

          {/* Suggestions */}
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr",
            gap: 8, width: "100%", marginTop: 8,
          }}>
            {[
              "Compare Apple and Microsoft on revenue, margins, and FCF over 5 years",
              "Find German companies with >€10M revenue and >30% equity ratio",
              "High yield ETFs with duration <3 years and yield >6%",
              "MarketAxess cost structure — compensation, tech, and D&A",
            ].map((prompt, i) => (
              <button
                key={i}
                onClick={() => { setInput(prompt); inputRef.current?.focus(); }}
                style={{
                  background: COLORS.bgCard, border: `1px solid ${COLORS.border}`,
                  padding: "12px 14px", fontSize: 13, color: COLORS.textSecondary,
                  textAlign: "left", lineHeight: 1.4, transition: "border-color 0.2s",
                }}
                onMouseEnter={(e) => e.target.style.borderColor = COLORS.textTertiary}
                onMouseLeave={(e) => e.target.style.borderColor = COLORS.border}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Conversation view ─────────────────────────────────────
  return (
    <div style={{
      minHeight: embedded ? "calc(100vh - 180px)" : "100vh",
      background: COLORS.bg,
      display: "flex",
      flexDirection: "column",
      paddingTop: embedded ? 0 : 64,
    }}>
      {/* Chat header */}
      <div style={{
        borderBottom: `1px solid ${COLORS.border}`,
        background: COLORS.bg,
        position: embedded ? "relative" : "sticky",
        top: embedded ? undefined : 64,
        zIndex: 10,
      }}>
        <div style={{
          maxWidth: 720, margin: "0 auto", padding: "12px 32px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            fontSize: 13, fontWeight: 500, color: COLORS.textSecondary,
          }}>
            <span style={{
              width: 8, height: 8, borderRadius: "50%",
              background: COLORS.success, display: "inline-block",
            }} />
            BasisData Chat
          </div>
          <button onClick={clearChat} style={{
            background: "transparent", border: "none",
            fontSize: 12, color: COLORS.textTertiary, padding: 0,
          }}>
            New chat
          </button>
        </div>
      </div>

      {/* Messages area */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 32px 140px" }}>
          {messages.map((msg, i) => (
            <Message key={i} role={msg.role} content={msg.content} tables={msg.tables} />
          ))}
          {loading && (streamText || streamStatus) && (
            <StreamingMessage content={streamText} status={streamStatus} />
          )}
          {loading && !streamText && !streamStatus && (
            <div style={{ marginBottom: 28 }}>
              <div style={{
                fontSize: 11, fontWeight: 600, letterSpacing: "0.08em",
                textTransform: "uppercase", color: COLORS.textTertiary, marginBottom: 8,
              }}>BASISDATA</div>
              <div style={{ display: "flex", gap: 6, padding: "8px 0" }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    width: 6, height: 6, borderRadius: "50%",
                    background: COLORS.textTertiary,
                    animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                  }} />
                ))}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area — bottom */}
      <div style={{
        position: embedded ? "sticky" : "fixed",
        bottom: 0,
        left: embedded ? undefined : 0,
        right: embedded ? undefined : 0,
        background: COLORS.bg,
        borderTop: `1px solid ${COLORS.border}`,
      }}>
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "12px 32px 16px" }}>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything..."
              rows={1}
              style={{
                flex: 1, padding: "14px 16px", fontSize: 15,
                border: `1px solid ${COLORS.border}`, background: COLORS.bgCard,
                color: COLORS.text, outline: "none", resize: "none",
                fontFamily: FONTS.body, lineHeight: 1.5, maxHeight: 120,
              }}
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
              }}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              style={{
                background: input.trim() ? COLORS.accent : COLORS.border,
                color: COLORS.bg, border: "none", padding: "14px 24px",
                fontSize: 14, fontWeight: 500, flexShrink: 0,
                opacity: loading ? 0.6 : 1, transition: "background 0.2s",
              }}
            >
              Send
            </button>
          </div>
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            marginTop: 8,
          }}>
            <DatasetToggle selected={datasets} onToggle={toggleDataset} />
            <span style={{ fontSize: 11, color: COLORS.textTertiary }}>
              Powered by Claude
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
