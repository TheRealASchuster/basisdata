// src/pages/Chat.jsx
import { useState, useRef, useEffect, useCallback } from "react";
import { COLORS, FONTS } from "../design-system";
import { apiRawFetch } from "../lib/auth";
import { useAuth } from "../lib/auth";

// ── Arrow icon for send button ──────────────────────────
function ArrowUpIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 14V4M4 8l5-5 5 5" />
    </svg>
  );
}

// ── Data table with CSV export ──────────────────────────
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
      <div style={{
        overflowX: "auto", border: `1px solid ${COLORS.border}`,
        borderRadius: 8, background: COLORS.bgCard,
      }}>
        <table style={{
          width: "100%", borderCollapse: "collapse",
          fontSize: 13, fontFamily: FONTS.mono,
          fontVariantNumeric: "tabular-nums",
        }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${COLORS.border}` }}>
              {headers.map((h, i) => (
                <th key={i} style={{
                  textAlign: i === 0 ? "left" : "right", padding: "10px 14px",
                  fontWeight: 500, color: COLORS.textTertiary, fontSize: 11,
                  letterSpacing: "0.05em", textTransform: "uppercase", whiteSpace: "nowrap",
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} style={{ borderBottom: i < rows.length - 1 ? `1px solid ${COLORS.borderLight}` : "none" }}>
                {row.map((cell, j) => (
                  <td key={j} style={{
                    padding: "10px 14px",
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
        marginTop: 8, background: "transparent",
        border: `1px solid ${COLORS.border}`, borderRadius: 6,
        padding: "6px 14px", fontSize: 12, fontWeight: 500,
        color: COLORS.textSecondary, transition: "border-color 0.15s",
      }}
        onMouseEnter={(e) => e.currentTarget.style.borderColor = COLORS.textTertiary}
        onMouseLeave={(e) => e.currentTarget.style.borderColor = COLORS.border}
      >
        Export CSV
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

// ── Messages ────────────────────────────────────────────
function Message({ role, content, tables }) {
  const isUser = role === "user";
  return (
    <div style={{
      marginBottom: 24,
      animation: "fadeUp 0.3s ease-out",
    }}>
      {isUser ? (
        <div style={{
          background: "#EDECE8", borderRadius: 16, padding: "12px 18px",
          fontSize: 15, lineHeight: 1.7, color: COLORS.text,
          whiteSpace: "pre-wrap", maxWidth: "85%", marginLeft: "auto",
        }}>
          {content}
        </div>
      ) : (
        <div>
          <div style={{
            fontSize: 15, lineHeight: 1.7, color: COLORS.text, whiteSpace: "pre-wrap",
            fontVariantNumeric: "tabular-nums",
          }}>
            {content}
          </div>
          {tables && tables.map((table, i) => (
            <TableBlock key={i} headers={table.headers} rows={table.rows} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Tool use pill indicator ─────────────────────────────
function ToolIndicator({ label }) {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 8,
      background: COLORS.bgCard, border: `1px solid ${COLORS.border}`,
      borderRadius: 999, padding: "6px 14px 6px 10px",
      fontSize: 12, color: COLORS.textSecondary, fontWeight: 500,
      marginBottom: 8,
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: "50%",
        background: "#F59E0B",
        animation: "pulse 1.2s ease-in-out infinite",
        flexShrink: 0,
      }} />
      {label}
    </div>
  );
}

function StreamingMessage({ content, status }) {
  return (
    <div style={{ marginBottom: 24, animation: "fadeUp 0.3s ease-out" }}>
      {status && !content && <ToolIndicator label={status} />}
      {content && (
        <div style={{
          fontSize: 15, lineHeight: 1.7, color: COLORS.text, whiteSpace: "pre-wrap",
          fontVariantNumeric: "tabular-nums",
        }}>
          {content}
          <span style={{
            display: "inline-block", width: 2, height: 16,
            background: COLORS.accent, marginLeft: 2, verticalAlign: "text-bottom",
            animation: "fadeIn 0.5s ease-in-out infinite alternate",
          }} />
        </div>
      )}
    </div>
  );
}

function ThinkingDots() {
  return (
    <div style={{ marginBottom: 24, animation: "fadeUp 0.2s ease-out" }}>
      <div style={{ display: "flex", gap: 4, padding: "8px 0" }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 5, height: 5, borderRadius: "50%",
            background: COLORS.textTertiary,
            animation: `pulse 1.2s ease-in-out ${i * 0.15}s infinite`,
          }} />
        ))}
      </div>
    </div>
  );
}

// ── Suggestion cards ────────────────────────────────────
const SUGGESTIONS = [
  { cat: "Compare", prompt: "Compare Apple and Microsoft on revenue, margins, and FCF over 5 years" },
  { cat: "Screen", prompt: "German companies with >10M revenue and >30% equity ratio" },
  { cat: "Funds", prompt: "High yield ETFs with duration <3 years and yield >6%" },
  { cat: "Deep dive", prompt: "MarketAxess cost structure \u2014 compensation, tech, and D&A" },
];

function SuggestionCard({ cat, prompt, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: COLORS.bgCard, border: `1px solid ${COLORS.border}`,
        borderRadius: 10, padding: "14px 16px", fontSize: 13,
        color: COLORS.textSecondary, textAlign: "left", lineHeight: 1.5,
        transition: "all 0.2s", display: "flex", flexDirection: "column", gap: 4,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = COLORS.textTertiary;
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = COLORS.border;
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <span style={{
        fontSize: 10, fontWeight: 600, letterSpacing: "0.08em",
        textTransform: "uppercase", color: COLORS.textTertiary,
      }}>{cat}</span>
      <span>{prompt}</span>
    </button>
  );
}

// ── Input bar (shared between empty + conversation) ─────
function InputBar({ inputRef, input, setInput, onKeyDown, onSend, loading }) {
  return (
    <div style={{
      background: COLORS.bgCard, border: `1px solid ${COLORS.border}`,
      borderRadius: 16, padding: "4px 4px 4px 18px",
      display: "flex", alignItems: "flex-end", gap: 8,
      transition: "border-color 0.2s",
    }}
      onFocus={(e) => e.currentTarget.style.borderColor = "#BBBBB5"}
      onBlur={(e) => e.currentTarget.style.borderColor = COLORS.border}
    >
      <textarea
        ref={inputRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Ask about companies, funds, or markets..."
        rows={1}
        style={{
          flex: 1, padding: "10px 0", fontSize: 15,
          border: "none", background: "transparent",
          color: COLORS.text, outline: "none", resize: "none",
          fontFamily: FONTS.body, lineHeight: 1.5, maxHeight: 150,
        }}
        onInput={(e) => {
          e.target.style.height = "auto";
          e.target.style.height = Math.min(e.target.scrollHeight, 150) + "px";
        }}
      />
      <button
        onClick={onSend}
        disabled={loading || !input.trim()}
        style={{
          width: 36, height: 36, borderRadius: 10,
          background: input.trim() ? COLORS.accent : COLORS.border,
          color: "#FFFFFF", border: "none",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0, transition: "all 0.15s",
          opacity: loading ? 0.5 : 1,
          marginBottom: 2,
        }}
      >
        <ArrowUpIcon />
      </button>
    </div>
  );
}

// ── Main component ──────────────────────────────────────
export default function Chat({ embedded = false }) {
  const { session } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streamText, setStreamText] = useState("");
  const [streamStatus, setStreamStatus] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const hasMessages = messages.length > 0 || loading;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, streamText, streamStatus]);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    if (inputRef.current) inputRef.current.style.height = "auto";
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

  // ── Empty state ─────────────────────────────────────────
  if (!hasMessages) {
    return (
      <div style={{
        height: embedded ? "100%" : undefined,
        minHeight: embedded ? undefined : "100vh",
        background: COLORS.bg,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: embedded ? 0 : 64,
      }}>
        <div style={{
          flex: 1, display: "flex", flexDirection: "column",
          justifyContent: "center", alignItems: "center",
          width: "100%", maxWidth: 620, padding: "0 32px",
        }}>
          <h1 style={{
            fontSize: 28, fontWeight: 600, letterSpacing: "-0.02em",
            color: COLORS.text, marginBottom: 6, textAlign: "center",
          }}>
            BasisData
          </h1>
          <p style={{
            fontSize: 15, color: COLORS.textTertiary, textAlign: "center",
            marginBottom: 32, lineHeight: 1.5,
          }}>
            9,700+ companies across US, Germany, and credit markets.
          </p>

          <div style={{ width: "100%", marginBottom: 24 }}>
            <InputBar
              inputRef={inputRef} input={input} setInput={setInput}
              onKeyDown={handleKeyDown} onSend={sendMessage} loading={loading}
            />
          </div>

          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr",
            gap: 8, width: "100%",
          }}>
            {SUGGESTIONS.map((s, i) => (
              <SuggestionCard
                key={i} cat={s.cat} prompt={s.prompt}
                onClick={() => { setInput(s.prompt); inputRef.current?.focus(); }}
              />
            ))}
          </div>
        </div>

        <div style={{ padding: "16px 0 20px", fontSize: 11, color: COLORS.textTertiary }}>
          Powered by Claude
        </div>
      </div>
    );
  }

  // ── Conversation view ───────────────────────────────────
  return (
    <div style={{
      height: embedded ? "100%" : undefined,
      minHeight: embedded ? undefined : "100vh",
      background: COLORS.bg,
      display: "flex",
      flexDirection: "column",
      paddingTop: embedded ? 0 : 64,
    }}>
      {/* Header */}
      <div style={{
        borderBottom: `1px solid ${COLORS.border}`,
        background: COLORS.bg,
        position: embedded ? "relative" : "sticky",
        top: embedded ? undefined : 64,
        zIndex: 10, flexShrink: 0,
      }}>
        <div style={{
          maxWidth: 720, margin: "0 auto", padding: "10px 32px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: COLORS.textSecondary }}>
            BasisData Chat
          </span>
          <button onClick={clearChat} title="New chat" style={{
            background: "transparent", border: `1px solid ${COLORS.border}`,
            borderRadius: 6, width: 28, height: 28,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: COLORS.textTertiary, transition: "border-color 0.15s",
          }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = COLORS.textSecondary}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = COLORS.border}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M1 1h5M8 1h5M7 1v12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "28px 32px 160px" }}>
          {messages.map((msg, i) => (
            <Message key={i} role={msg.role} content={msg.content} tables={msg.tables} />
          ))}
          {loading && (streamText || streamStatus) && (
            <StreamingMessage content={streamText} status={streamStatus} />
          )}
          {loading && !streamText && !streamStatus && <ThinkingDots />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Bottom input */}
      <div style={{
        position: embedded ? "relative" : "fixed",
        bottom: embedded ? undefined : 0,
        left: embedded ? undefined : 0,
        right: embedded ? undefined : 0,
        flexShrink: 0,
        background: `linear-gradient(transparent, ${COLORS.bg} 24%)`,
        paddingTop: 24,
      }}>
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 32px 14px" }}>
          <InputBar
            inputRef={inputRef} input={input} setInput={setInput}
            onKeyDown={handleKeyDown} onSend={sendMessage} loading={loading}
          />
          <div style={{ textAlign: "center", marginTop: 8, fontSize: 11, color: COLORS.textTertiary }}>
            Powered by Claude
          </div>
        </div>
      </div>
    </div>
  );
}
