// src/pages/Pricing.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { COLORS, FONTS } from "../design-system";
import { useAuth, apiFetch } from "../lib/auth";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "");

const tiers = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Get started with EDGAR. US public company fundamentals, free forever.",
    features: [
      "EDGAR API access",
      "100 calls per day",
      "MCP server",
      "GitHub Issues support",
    ],
    cta: "Get Started",
    primary: false,
    action: "signup",
  },
  {
    name: "Pro",
    price: "$49",
    period: "/ month",
    description: "All modules. Unlimited access. Chat interface included.",
    features: [
      "All 3 modules (EDGAR + Bundesanzeiger + qRate)",
      "Unlimited API calls",
      "MCP server access",
      "Chat interface (100 msgs/day)",
      "CSV export",
      "Email support (24h)",
    ],
    cta: "Subscribe",
    primary: true,
    action: "subscribe",
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For teams and products. SLA, bulk access, redistribution rights.",
    features: [
      "Everything in Pro",
      "Unlimited chat",
      "Bulk data downloads",
      "SLA guarantee (99.9%)",
      "Redistribution rights",
      "Dedicated Slack support",
    ],
    cta: "Contact Us",
    primary: false,
    action: "contact",
  },
];

const faqs = [
  {
    q: "What counts as an API call?",
    a: "Each HTTP request to the BasisData API counts as one call. MCP tool invocations from Claude Desktop each count as one call. Chat interface queries count based on the underlying API calls needed to answer your question (typically 1-3 per message).",
  },
  {
    q: "Can I use BasisData data in my own product?",
    a: "The Free and Pro plans are for internal use only. If you want to display BasisData data to your own users or customers, you need the Enterprise plan with redistribution rights.",
  },
  {
    q: "Is there a free trial of the Pro plan?",
    a: "The first 500 users get Pro access free as founding members. After that, the Free plan gives you permanent EDGAR access. Upgrade to Pro when you need Bundesanzeiger, qRate, or Chat.",
  },
  {
    q: "Where does the data come from?",
    a: "EDGAR data comes directly from SEC EDGAR filings (XBRL, 10-K, 10-Q). Bundesanzeiger data comes from official German Federal Gazette publications. qRate data comes from SEC N-PORT filings and public market data. All primary sources, no third-party repackaging.",
  },
  {
    q: "How fresh is the data?",
    a: "EDGAR filings are ingested within 24 hours of SEC publication. Bundesanzeiger filings within 48 hours. Fund NAV data is updated daily after market close. Holdings data updates quarterly when N-PORT filings are published.",
  },
];

function CheckoutForm({ onSuccess, onCancel }) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setError(null);

    try {
      // Create subscription on backend
      const { client_secret } = await apiFetch("/v1/auth/create-subscription", {
        method: "POST",
      });

      // Confirm payment with card
      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        setError(result.error.message);
      } else if (result.paymentIntent.status === "succeeded") {
        onSuccess();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{
      maxWidth: 480, margin: "0 auto", padding: "0 32px",
    }}>
      <div style={{
        background: COLORS.bgCard, border: `1px solid ${COLORS.border}`,
        padding: "32px 28px",
      }}>
        <div style={{
          fontSize: 11, fontWeight: 600, letterSpacing: "0.10em",
          textTransform: "uppercase", color: COLORS.textTertiary, marginBottom: 24,
        }}>
          Subscribe to Pro — $49/month
        </div>

        <div style={{
          background: COLORS.bg, border: `1px solid ${COLORS.border}`,
          padding: "14px 16px", marginBottom: 20,
        }}>
          <CardElement options={{
            style: {
              base: {
                fontSize: "15px",
                fontFamily: FONTS.body,
                color: COLORS.text,
                "::placeholder": { color: COLORS.textTertiary },
              },
            },
          }} />
        </div>

        {error && (
          <div style={{
            background: "#FEF2F2", border: "1px solid #FECACA",
            color: COLORS.error, padding: "10px 14px", fontSize: 13,
            marginBottom: 16,
          }}>
            {error}
          </div>
        )}

        <div style={{ display: "flex", gap: 12 }}>
          <button type="submit" disabled={!stripe || processing} style={{
            flex: 1, background: COLORS.accent, color: COLORS.bg,
            border: "none", padding: "14px 0", fontSize: 15, fontWeight: 500,
            opacity: processing ? 0.6 : 1,
          }}>
            {processing ? "Processing..." : "Subscribe"}
          </button>
          <button type="button" onClick={onCancel} style={{
            background: "transparent", color: COLORS.textTertiary,
            border: `1px solid ${COLORS.border}`, padding: "14px 24px",
            fontSize: 14, fontWeight: 500,
          }}>
            Cancel
          </button>
        </div>

        <p style={{
          fontSize: 12, color: COLORS.textTertiary, marginTop: 16,
          lineHeight: 1.5, textAlign: "center",
        }}>
          Cancel anytime. No annual contracts.
        </p>
      </div>
    </form>
  );
}

export default function Pricing() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [showCheckout, setShowCheckout] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleTierClick = (action) => {
    if (action === "signup") {
      navigate("/signup");
    } else if (action === "subscribe") {
      if (!session) {
        navigate("/login");
        return;
      }
      setShowCheckout(true);
    } else if (action === "contact") {
      window.location.href = "mailto:alex@schuster.nyc?subject=BasisData Enterprise";
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: COLORS.bg,
      paddingTop: 120,
    }}>
      {/* Hero */}
      <section style={{
        textAlign: "center", maxWidth: 600,
        margin: "0 auto", padding: "60px 32px 80px",
      }}>
        <h1 style={{
          fontSize: 42, fontWeight: 600, letterSpacing: "-0.03em",
          lineHeight: 1.1, color: COLORS.text, marginBottom: 16,
        }}>
          Simple pricing.
        </h1>
        <p style={{
          fontSize: 17, lineHeight: 1.6, color: COLORS.textSecondary,
        }}>
          Free during beta. Pay when you need more.
          <br />No hidden fees. No annual contracts.
        </p>
      </section>

      {/* Success message */}
      {subscribed && (
        <section style={{ maxWidth: 480, margin: "0 auto", padding: "0 32px 40px" }}>
          <div style={{
            background: "#F0FDF4", border: "1px solid #BBF7D0",
            padding: "20px 24px", textAlign: "center",
          }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: "#166534", marginBottom: 4 }}>
              Welcome to Pro!
            </div>
            <div style={{ fontSize: 14, color: "#166534", lineHeight: 1.5 }}>
              All modules are now unlocked. <Link to="/app" style={{ textDecoration: "underline" }}>Go to dashboard &rarr;</Link>
            </div>
          </div>
        </section>
      )}

      {/* Checkout */}
      {showCheckout && !subscribed && (
        <section style={{ marginBottom: 40 }}>
          <Elements stripe={stripePromise}>
            <CheckoutForm
              onSuccess={() => { setSubscribed(true); setShowCheckout(false); }}
              onCancel={() => setShowCheckout(false)}
            />
          </Elements>
        </section>
      )}

      {/* Tiers */}
      {!showCheckout && (
        <section style={{
          maxWidth: 1080, margin: "0 auto", padding: "0 32px 80px",
        }}>
          <div className="pricing-grid" style={{
            display: "flex", gap: 1,
            background: COLORS.border, border: `1px solid ${COLORS.border}`,
          }}>
            {tiers.map((tier, i) => (
              <div key={i} style={{
                flex: 1, background: tier.primary ? COLORS.bgCard : COLORS.bg,
                padding: "48px 36px", display: "flex", flexDirection: "column",
              }}>
                <div style={{
                  fontSize: 13, fontWeight: 600, letterSpacing: "0.06em",
                  textTransform: "uppercase", color: COLORS.textTertiary, marginBottom: 24,
                }}>
                  {tier.name}
                </div>
                <div style={{
                  display: "flex", alignItems: "baseline", gap: 4, marginBottom: 12,
                }}>
                  <span style={{
                    fontSize: 44, fontWeight: 600, letterSpacing: "-0.03em", color: COLORS.text,
                  }}>
                    {tier.price}
                  </span>
                  <span style={{ fontSize: 15, color: COLORS.textTertiary }}>
                    {tier.period}
                  </span>
                </div>
                <p style={{
                  fontSize: 14, lineHeight: 1.5, color: COLORS.textSecondary, marginBottom: 28,
                }}>
                  {tier.description}
                </p>
                <div style={{
                  display: "flex", flexDirection: "column", gap: 14, marginBottom: 36, flex: 1,
                }}>
                  {tier.features.map((f, j) => (
                    <div key={j} style={{
                      fontSize: 14, color: COLORS.textSecondary, lineHeight: 1.4,
                      paddingLeft: 18, position: "relative",
                    }}>
                      <span style={{ position: "absolute", left: 0, color: COLORS.textTertiary }}>·</span>
                      {f}
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => handleTierClick(tier.action)}
                  style={{
                    width: "100%",
                    background: tier.primary ? COLORS.accent : "transparent",
                    color: tier.primary ? COLORS.bg : COLORS.text,
                    border: tier.primary ? "none" : `1px solid ${COLORS.border}`,
                    padding: "14px 0", fontSize: 15, fontWeight: 500,
                  }}
                >
                  {tier.cta}
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* FAQ */}
      <section style={{ maxWidth: 680, margin: "0 auto", padding: "0 32px 100px" }}>
        <div style={{ height: 1, background: COLORS.border, marginBottom: 64 }} />
        <div style={{
          fontSize: 11, fontWeight: 600, letterSpacing: "0.12em",
          textTransform: "uppercase", color: COLORS.textTertiary, marginBottom: 40,
        }}>
          Questions
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {faqs.map((faq, i) => (
            <div key={i} style={{
              padding: "24px 0", borderBottom: `1px solid ${COLORS.borderLight}`,
            }}>
              <div style={{
                fontSize: 16, fontWeight: 600, color: COLORS.text,
                marginBottom: 10, letterSpacing: "-0.01em",
              }}>
                {faq.q}
              </div>
              <div style={{
                fontSize: 14, lineHeight: 1.7, color: COLORS.textSecondary,
              }}>
                {faq.a}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
