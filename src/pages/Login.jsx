// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { COLORS, FONTS } from "../design-system";
import { supabase } from "../lib/supabase";
import { useAuth } from "../lib/auth";

export default function Login() {
  const [mode, setMode] = useState("signin"); // signin | signup | forgot
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();
  const { session } = useAuth();

  // Redirect if already logged in
  if (session) {
    navigate("/app", { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate("/app");
      } else if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage("Check your email for the confirmation link.");
      } else if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/app`,
        });
        if (error) throw error;
        setMessage("Password reset email sent.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/app`,
      },
    });
    if (error) setError(error.message);
  };

  const titles = {
    signin: "Sign in to BasisData",
    signup: "Create your account",
    forgot: "Reset your password",
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: COLORS.bg,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 32,
    }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        {/* Logo */}
        <div style={{
          textAlign: "center",
          marginBottom: 48,
        }}>
          <a href="/" style={{
            fontSize: 17, fontWeight: 600, letterSpacing: "-0.02em", color: COLORS.text,
          }}>
            BasisData
          </a>
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: 24,
          fontWeight: 600,
          letterSpacing: "-0.02em",
          color: COLORS.text,
          textAlign: "center",
          marginBottom: 36,
        }}>
          {titles[mode]}
        </h1>

        {/* Error / Message */}
        {error && (
          <div style={{
            background: "#FEF2F2",
            border: `1px solid #FECACA`,
            color: COLORS.error,
            padding: "12px 16px",
            fontSize: 13,
            marginBottom: 20,
          }}>
            {error}
          </div>
        )}
        {message && (
          <div style={{
            background: "#F0FDF4",
            border: `1px solid #BBF7D0`,
            color: "#166534",
            padding: "12px 16px",
            fontSize: 13,
            marginBottom: 20,
          }}>
            {message}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{
              display: "block",
              fontSize: 13,
              fontWeight: 500,
              color: COLORS.textSecondary,
              marginBottom: 6,
            }}>
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
              style={{
                width: "100%",
                padding: "12px 14px",
                fontSize: 15,
                border: `1px solid ${COLORS.border}`,
                background: COLORS.bgCard,
                color: COLORS.text,
                outline: "none",
                fontFamily: FONTS.body,
              }}
            />
          </div>

          {mode !== "forgot" && (
            <div style={{ marginBottom: 16 }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 6,
              }}>
                <label style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: COLORS.textSecondary,
                }}>
                  Password
                </label>
                {mode === "signin" && (
                  <span
                    onClick={() => setMode("forgot")}
                    style={{
                      fontSize: 12,
                      color: COLORS.textTertiary,
                      cursor: "pointer",
                    }}
                  >
                    Forgot password?
                  </span>
                )}
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  fontSize: 15,
                  border: `1px solid ${COLORS.border}`,
                  background: COLORS.bgCard,
                  color: COLORS.text,
                  outline: "none",
                  fontFamily: FONTS.body,
                }}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px 0",
              background: COLORS.accent,
              color: COLORS.bg,
              border: "none",
              fontSize: 15,
              fontWeight: 500,
              marginTop: 8,
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "..." : mode === "signin" ? "Sign In" : mode === "signup" ? "Create Account" : "Send Reset Link"}
          </button>
        </form>

        {/* Divider */}
        {mode !== "forgot" && (
          <>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              margin: "28px 0",
            }}>
              <div style={{ flex: 1, height: 1, background: COLORS.border }} />
              <span style={{ fontSize: 12, color: COLORS.textTertiary }}>or</span>
              <div style={{ flex: 1, height: 1, background: COLORS.border }} />
            </div>

            {/* Google OAuth */}
            <button
              onClick={handleGoogleLogin}
              style={{
                width: "100%",
                padding: "14px 0",
                background: "transparent",
                color: COLORS.text,
                border: `1px solid ${COLORS.border}`,
                fontSize: 15,
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
                <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
          </>
        )}

        {/* Toggle */}
        <div style={{
          marginTop: 32,
          textAlign: "center",
          fontSize: 14,
          color: COLORS.textSecondary,
        }}>
          {mode === "signin" && (
            <>Don't have an account?{" "}
              <span onClick={() => { setMode("signup"); setError(null); setMessage(null); }}
                style={{ color: COLORS.text, fontWeight: 500, cursor: "pointer" }}>
                Sign up
              </span>
            </>
          )}
          {mode === "signup" && (
            <>Already have an account?{" "}
              <span onClick={() => { setMode("signin"); setError(null); setMessage(null); }}
                style={{ color: COLORS.text, fontWeight: 500, cursor: "pointer" }}>
                Sign in
              </span>
            </>
          )}
          {mode === "forgot" && (
            <span onClick={() => { setMode("signin"); setError(null); setMessage(null); }}
              style={{ color: COLORS.text, fontWeight: 500, cursor: "pointer" }}>
              ← Back to sign in
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
