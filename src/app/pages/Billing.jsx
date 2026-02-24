// src/app/pages/Billing.jsx
import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { COLORS, FONTS } from "../../design-system";
import { apiFetch } from "../../lib/auth";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "");

const PRO_FEATURES = [
  "Unlimited EDGAR API calls",
  "Bundesanzeiger access",
  "qRate credit fund analytics",
  "Chat interface (100 msg/day)",
  "CSV export",
];

const FREE_FEATURES = [
  { label: "EDGAR API (100 calls/day)", available: true },
  { label: "Bundesanzeiger", available: false },
  { label: "qRate", available: false },
  { label: "Chat interface", available: false },
];

function SubscribeForm({ onSuccess }) {
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
      const { client_secret } = await apiFetch("/v1/auth/create-subscription", {
        method: "POST",
      });

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
    <form onSubmit={handleSubmit}>
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

      <button type="submit" disabled={!stripe || processing} style={{
        width: "100%", background: COLORS.accent, color: COLORS.bg,
        border: "none", padding: "14px 0", fontSize: 15, fontWeight: 500,
        opacity: processing ? 0.6 : 1,
      }}>
        {processing ? "Processing..." : "Subscribe \u2014 $49/month"}
      </button>

      <p style={{
        fontSize: 12, color: COLORS.textTertiary, marginTop: 12,
        lineHeight: 1.5, textAlign: "center",
      }}>
        Cancel anytime. No annual contracts.
      </p>
    </form>
  );
}

function UpdateCardForm({ onSuccess, onCancel }) {
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
      const { data, error: createError } = await stripe.createPaymentMethod({
        type: "card",
        card: elements.getElement(CardElement),
      });

      if (createError) {
        setError(createError.message);
        return;
      }

      await apiFetch("/v1/auth/update-payment-method", {
        method: "POST",
        body: JSON.stringify({ payment_method_id: data.id }),
      });

      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 20 }}>
      <div style={{
        background: COLORS.bg, border: `1px solid ${COLORS.border}`,
        padding: "14px 16px", marginBottom: 16,
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
          background: COLORS.accent, color: COLORS.bg,
          border: "none", padding: "10px 24px", fontSize: 13, fontWeight: 500,
          opacity: processing ? 0.6 : 1,
        }}>
          {processing ? "Updating..." : "Update Card"}
        </button>
        <button type="button" onClick={onCancel} style={{
          background: "transparent", color: COLORS.textSecondary,
          border: `1px solid ${COLORS.border}`, padding: "10px 20px",
          fontSize: 13, fontWeight: 500,
        }}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function Billing() {
  const [profile, setProfile] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUpdateCard, setShowUpdateCard] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [justSubscribed, setJustSubscribed] = useState(false);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    try {
      const [p, s] = await Promise.all([
        apiFetch("/v1/auth/me"),
        apiFetch("/v1/auth/subscription").catch(() => null),
      ]);
      setProfile(p);
      setSubscription(s);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const handleCancel = async () => {
    if (!confirm("Cancel your subscription? You'll retain access until the end of the billing period.")) return;
    setCancelling(true);
    try {
      await apiFetch("/v1/auth/cancel-subscription", { method: "POST" });
      await loadData();
    } catch (err) {
      alert(err.message);
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return <div style={{ fontSize: 13, color: "#999", padding: "60px 0" }}>Loading...</div>;

  const isPro = profile?.plan === "pro" || profile?.plan === "enterprise";
  const isFounding = profile?.is_founding_user;

  return (
    <div style={{ maxWidth: 560 }}>
      <h1 style={{ fontSize: 28, fontWeight: 600, letterSpacing: "-0.02em", color: COLORS.text, marginBottom: 32 }}>
        Billing
      </h1>

      {/* Success banner */}
      {justSubscribed && (
        <div style={{
          background: "#F0FDF4", border: "1px solid #BBF7D0",
          padding: "14px 18px", marginBottom: 24, fontSize: 13,
        }}>
          <span style={{ fontWeight: 600, color: "#166534" }}>Welcome to Pro!</span>
          <span style={{ color: "#166534", marginLeft: 8 }}>All modules are now unlocked.</span>
        </div>
      )}

      <div style={{
        background: "#FFFFFF", border: `1px solid ${COLORS.border}`, padding: "28px 32px",
      }}>
        {/* Plan header */}
        <div style={{ fontSize: 18, fontWeight: 600, color: COLORS.text, marginBottom: 20 }}>
          {isPro ? "Pro" : "Free"} {isPro && "\u2014 $49/month"}
        </div>

        {/* Feature list */}
        <div style={{ fontSize: 13, lineHeight: 2.2, color: "#6B6B6B", marginBottom: 20 }}>
          {isPro ? (
            PRO_FEATURES.map((f, i) => <div key={i}>{f}</div>)
          ) : (
            FREE_FEATURES.map((f, i) => (
              <div key={i} style={f.available ? {} : { color: "#999", textDecoration: "line-through" }}>
                {f.label}
              </div>
            ))
          )}
        </div>

        {/* Pro subscription details */}
        {isPro && subscription && !isFounding && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ height: 1, background: COLORS.borderLight, margin: "16px 0" }} />
            <table style={{ fontSize: 13, borderCollapse: "collapse" }}>
              <tbody>
                {subscription.current_period_end && (
                  <tr>
                    <td style={{ padding: "4px 16px 4px 0", color: "#999" }}>Next billing</td>
                    <td style={{ padding: "4px 0", color: COLORS.text }}>
                      {new Date(subscription.current_period_end * 1000).toLocaleDateString("en-US", {
                        month: "long", day: "numeric", year: "numeric",
                      })}
                    </td>
                  </tr>
                )}
                {subscription.card_brand && (
                  <tr>
                    <td style={{ padding: "4px 16px 4px 0", color: "#999" }}>Card</td>
                    <td style={{ padding: "4px 0", color: COLORS.text, textTransform: "capitalize" }}>
                      {subscription.card_brand} ending in {subscription.card_last4}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
              <button onClick={() => setShowUpdateCard(!showUpdateCard)} style={{
                background: "transparent", border: `1px solid ${COLORS.border}`,
                padding: "10px 20px", fontSize: 13, fontWeight: 500, color: COLORS.text,
              }}>
                Update Card
              </button>
              <button onClick={handleCancel} disabled={cancelling} style={{
                background: "transparent", border: `1px solid ${COLORS.border}`,
                padding: "10px 20px", fontSize: 13, fontWeight: 500,
                color: COLORS.error, opacity: cancelling ? 0.6 : 1,
              }}>
                {cancelling ? "Cancelling..." : "Cancel Subscription"}
              </button>
            </div>

            {/* Update card form */}
            {showUpdateCard && (
              <Elements stripe={stripePromise}>
                <UpdateCardForm
                  onSuccess={() => { setShowUpdateCard(false); loadData(); }}
                  onCancel={() => setShowUpdateCard(false)}
                />
              </Elements>
            )}
          </div>
        )}

        {/* Founding user badge */}
        {isFounding && (
          <div style={{
            marginTop: 4, padding: "12px 16px",
            background: "#F0FDF4", border: "1px solid #BBF7D0",
            fontSize: 13, color: "#166534",
          }}>
            You're a founding user. Pro access is free for you. Thank you for being early.
          </div>
        )}

        {/* Free plan upgrade */}
        {!isPro && !isFounding && (
          <div style={{ marginTop: 4 }}>
            <div style={{ height: 1, background: COLORS.borderLight, margin: "16px 0 24px" }} />
            <div style={{
              fontSize: 11, fontWeight: 600, letterSpacing: "0.10em",
              textTransform: "uppercase", color: COLORS.textTertiary, marginBottom: 16,
            }}>
              Upgrade to Pro
            </div>
            <Elements stripe={stripePromise}>
              <SubscribeForm onSuccess={() => { setJustSubscribed(true); loadData(); }} />
            </Elements>
          </div>
        )}
      </div>
    </div>
  );
}
