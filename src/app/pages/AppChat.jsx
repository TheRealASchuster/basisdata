// src/app/pages/AppChat.jsx — assistant-ui powered chat
import {
  AssistantRuntimeProvider,
  useLocalRuntime,
} from "@assistant-ui/react";
import { Thread, makeMarkdownText } from "@assistant-ui/react-ui";
import remarkGfm from "remark-gfm";
import "@assistant-ui/react-ui/styles/index.css";
import "@assistant-ui/react-ui/styles/themes/default.css";
import "@assistant-ui/react-ui/styles/markdown.css";
import { supabase } from "../../lib/supabase";
import { COLORS, FONTS } from "../../design-system";

const API_BASE = import.meta.env.VITE_API_BASE || "https://api.basisdata.dev";

// ── Markdown renderer with GFM tables ──────────────────
const MarkdownText = makeMarkdownText({
  remarkPlugins: [remarkGfm],
});

// ── Runtime adapter for our SSE backend ─────────────────
const basisDataAdapter = {
  async *run({ messages, abortSignal }) {
    // Get fresh JWT
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error("Not authenticated");

    // Map assistant-ui messages to our API format
    const apiMessages = [];
    for (const msg of messages) {
      if (msg.role === "user" || msg.role === "assistant") {
        let text = "";
        if (msg.content) {
          for (const part of msg.content) {
            if (part.type === "text") text += part.text;
          }
        }
        if (text) {
          apiMessages.push({ role: msg.role, content: text });
        }
      }
    }

    const response = await fetch(`${API_BASE}/v1/chat/stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ messages: apiMessages }),
      signal: abortSignal,
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({ detail: response.statusText }));
      throw new Error(body.detail || body.message || `API error ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let text = "";
    let buffer = "";

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
          try {
            const parsed = JSON.parse(line.slice(6));
            if (eventType === "delta" && parsed.text) {
              text += parsed.text;
              yield { content: [{ type: "text", text }] };
            } else if (eventType === "error") {
              throw new Error(parsed.message || "Stream error");
            }
          } catch (e) {
            if (e.message === "Stream error" || eventType === "error") throw e;
          }
        }
      }
    }

    // Final yield
    if (text) {
      yield {
        content: [{ type: "text", text }],
        status: { type: "complete", reason: "stop" },
      };
    }
  },
};

// ── Theme CSS overrides ─────────────────────────────────
const themeCSS = `
  .aui-root {
    --aui-background: 37 18% 96%;
    --aui-foreground: 0 0% 10%;
    --aui-card: 0 0% 100%;
    --aui-card-foreground: 0 0% 10%;
    --aui-primary: 0 0% 7%;
    --aui-primary-foreground: 37 18% 96%;
    --aui-secondary: 37 10% 92%;
    --aui-secondary-foreground: 0 0% 10%;
    --aui-muted: 37 10% 92%;
    --aui-muted-foreground: 0 0% 42%;
    --aui-accent: 37 10% 92%;
    --aui-accent-foreground: 0 0% 10%;
    --aui-border: 37 8% 87%;
    --aui-input: 37 8% 87%;
    --aui-ring: 0 0% 10%;
    --aui-radius: 0.75rem;
    --aui-thread-max-width: 44rem;
    font-family: ${FONTS.body};
    height: 100%;
  }

  .aui-root .aui-thread-root {
    background: ${COLORS.bg};
    height: 100%;
  }

  .aui-root .aui-composer-root {
    border-radius: 16px;
  }

  .aui-root .aui-thread-welcome-root {
    padding-top: 20vh;
  }

  .aui-root .aui-thread-welcome-center {
    max-width: 600px;
  }

  .aui-root .aui-thread-welcome-message {
    font-size: 15px;
    color: ${COLORS.textTertiary};
  }

  .aui-root .aui-thread-welcome-suggestion-text {
    font-size: 13px;
    text-align: left;
  }

  .aui-root .aui-user-message-content {
    border-radius: 16px;
  }

  /* Markdown tables */
  .aui-root .aui-md table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
    font-family: ${FONTS.mono};
    font-variant-numeric: tabular-nums;
    margin: 16px 0;
    border: 1px solid ${COLORS.border};
    border-radius: 8px;
    overflow: hidden;
  }

  .aui-root .aui-md th {
    text-align: left;
    padding: 10px 14px;
    font-weight: 500;
    color: ${COLORS.textTertiary};
    font-size: 11px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    border-bottom: 1px solid ${COLORS.border};
    background: ${COLORS.bg};
  }

  .aui-root .aui-md td {
    padding: 10px 14px;
    border-bottom: 1px solid ${COLORS.borderLight};
    color: ${COLORS.textSecondary};
  }

  .aui-root .aui-md tr:last-child td {
    border-bottom: none;
  }

  .aui-root .aui-md td:first-child {
    color: ${COLORS.text};
    font-weight: 500;
  }

  /* Code blocks */
  .aui-root .aui-md pre {
    background: ${COLORS.codeBlock};
    border: 1px solid ${COLORS.border};
    border-radius: 8px;
    font-family: ${FONTS.mono};
    font-size: 13px;
  }

  .aui-root .aui-md code {
    font-family: ${FONTS.mono};
    font-size: 13px;
  }

  .aui-root .aui-md p code {
    background: ${COLORS.codeBlock};
    border: 1px solid ${COLORS.border};
    border-radius: 4px;
    padding: 2px 6px;
    font-size: 12px;
  }

  .aui-root .aui-md ul,
  .aui-root .aui-md ol {
    padding-left: 20px;
    margin: 8px 0;
  }

  .aui-root .aui-md li {
    margin: 4px 0;
    line-height: 1.7;
  }

  .aui-root .aui-md strong {
    font-weight: 600;
    color: ${COLORS.text};
  }

  .aui-root .aui-md a {
    color: ${COLORS.text};
    text-decoration: underline;
    text-underline-offset: 2px;
  }
`;

// ── Main component ──────────────────────────────────────
export default function AppChat() {
  const runtime = useLocalRuntime(basisDataAdapter, {
    maxSteps: 1,
  });

  return (
    <div style={{ margin: "-40px -48px", height: "100vh" }}>
      <style>{themeCSS}</style>
      <AssistantRuntimeProvider runtime={runtime}>
        <Thread
          welcome={{
            message: "Ask about companies, funds, or markets.",
            suggestions: [
              { prompt: "Compare Apple and Microsoft on revenue, margins, and FCF over 5 years", text: "Compare AAPL vs MSFT" },
              { prompt: "German companies with revenue above 10M and equity ratio over 30%", text: "Screen German companies" },
              { prompt: "High yield ETFs with duration under 3 years and yield above 6%", text: "Find high yield funds" },
              { prompt: "MarketAxess cost structure — compensation, tech spending, and D&A", text: "Deep dive: MarketAxess" },
            ],
          }}
          assistantMessage={{
            allowCopy: true,
            allowReload: true,
            components: {
              Text: MarkdownText,
            },
          }}
          userMessage={{
            allowEdit: true,
          }}
          composer={{
            allowAttachments: false,
          }}
          strings={{
            composer: {
              input: {
                placeholder: "Ask about companies, funds, or markets...",
              },
            },
          }}
        />
      </AssistantRuntimeProvider>
    </div>
  );
}
