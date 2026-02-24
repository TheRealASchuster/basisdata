// src/app/pages/Settings.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { COLORS } from "../../design-system";
import { apiFetch } from "../../lib/auth";
import { supabase } from "../../lib/supabase";

export default function Settings() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingName, setEditingName] = useState(false);
  const [editingCompany, setEditingCompany] = useState(false);
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    apiFetch("/v1/auth/me")
      .then((p) => {
        setProfile(p);
        setName(p.name || "");
        setCompany(p.company || "");
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const handleChangePassword = async () => {
    const email = profile?.email;
    if (!email) return;
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/app/settings",
    });
    if (error) {
      alert("Error: " + error.message);
    } else {
      alert("Password reset email sent. Check your inbox.");
    }
  };

  const handleSaveName = async () => {
    setSaving(true);
    try {
      await apiFetch("/v1/auth/me", {
        method: "PATCH",
        body: JSON.stringify({ name }),
      });
      setProfile((p) => ({ ...p, name }));
      setEditingName(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveCompany = async () => {
    setSaving(true);
    try {
      await apiFetch("/v1/auth/me", {
        method: "PATCH",
        body: JSON.stringify({ company }),
      });
      setProfile((p) => ({ ...p, company }));
      setEditingCompany(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = prompt(
      'This will permanently delete your account, API keys, and all data. Type "DELETE" to confirm.'
    );
    if (confirmed !== "DELETE") return;

    try {
      await apiFetch("/v1/auth/me", { method: "DELETE" });
      await supabase.auth.signOut();
      navigate("/");
    } catch (err) {
      alert("Error deleting account: " + err.message);
    }
  };

  if (loading) return <div style={{ fontSize: 13, color: "#999", padding: "60px 0" }}>Loading...</div>;

  const inputStyle = {
    padding: "6px 10px", fontSize: 13, border: `1px solid ${COLORS.border}`,
    background: "#FFFFFF", color: COLORS.text, outline: "none", width: 200,
    fontFamily: "inherit",
  };

  const smallBtn = {
    background: "transparent", border: `1px solid ${COLORS.border}`,
    padding: "4px 12px", fontSize: 12, fontWeight: 500, color: COLORS.textSecondary,
    marginLeft: 8,
  };

  return (
    <div style={{ maxWidth: 560 }}>
      <h1 style={{ fontSize: 28, fontWeight: 600, letterSpacing: "-0.02em", color: COLORS.text, marginBottom: 32 }}>
        Settings
      </h1>

      {/* Account */}
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#999", marginBottom: 16 }}>
          Account
        </h2>
        <table style={{ fontSize: 13, borderCollapse: "collapse" }}>
          <tbody>
            <tr>
              <td style={{ padding: "8px 24px 8px 0", color: "#6B6B6B", verticalAlign: "middle" }}>Email</td>
              <td style={{ padding: "8px 0", color: COLORS.text }}>{profile?.email}</td>
            </tr>
            <tr>
              <td style={{ padding: "8px 24px 8px 0", color: "#6B6B6B", verticalAlign: "middle" }}>Name</td>
              <td style={{ padding: "8px 0", color: COLORS.text }}>
                {editingName ? (
                  <span style={{ display: "inline-flex", alignItems: "center" }}>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      style={inputStyle}
                      autoFocus
                      onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
                    />
                    <button onClick={handleSaveName} disabled={saving} style={{ ...smallBtn, color: COLORS.success }}>
                      Save
                    </button>
                    <button onClick={() => { setEditingName(false); setName(profile?.name || ""); }} style={smallBtn}>
                      Cancel
                    </button>
                  </span>
                ) : (
                  <span>
                    {profile?.name || "\u2014"}
                    <button onClick={() => setEditingName(true)} style={smallBtn}>Edit</button>
                  </span>
                )}
              </td>
            </tr>
            <tr>
              <td style={{ padding: "8px 24px 8px 0", color: "#6B6B6B", verticalAlign: "middle" }}>Company</td>
              <td style={{ padding: "8px 0", color: COLORS.text }}>
                {editingCompany ? (
                  <span style={{ display: "inline-flex", alignItems: "center" }}>
                    <input
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      style={inputStyle}
                      autoFocus
                      onKeyDown={(e) => e.key === "Enter" && handleSaveCompany()}
                    />
                    <button onClick={handleSaveCompany} disabled={saving} style={{ ...smallBtn, color: COLORS.success }}>
                      Save
                    </button>
                    <button onClick={() => { setEditingCompany(false); setCompany(profile?.company || ""); }} style={smallBtn}>
                      Cancel
                    </button>
                  </span>
                ) : (
                  <span>
                    {profile?.company || "\u2014"}
                    <button onClick={() => setEditingCompany(true)} style={smallBtn}>Edit</button>
                  </span>
                )}
              </td>
            </tr>
            <tr>
              <td style={{ padding: "8px 24px 8px 0", color: "#6B6B6B" }}>Plan</td>
              <td style={{ padding: "8px 0", color: COLORS.text, textTransform: "capitalize" }}>
                {profile?.plan}
                {profile?.is_founding_user && <span style={{ color: COLORS.success, marginLeft: 8, fontSize: 12 }}>Founding</span>}
              </td>
            </tr>
            <tr>
              <td style={{ padding: "8px 24px 8px 0", color: "#6B6B6B" }}>Member since</td>
              <td style={{ padding: "8px 0", color: COLORS.text }}>{profile?.created_at?.split("T")[0] || "\u2014"}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ height: 1, background: COLORS.border, marginBottom: 32 }} />

      {/* Security */}
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#999", marginBottom: 16 }}>
          Security
        </h2>
        <button onClick={handleChangePassword} style={{
          background: "transparent", border: `1px solid ${COLORS.border}`,
          padding: "10px 20px", fontSize: 13, fontWeight: 500, color: COLORS.text,
        }}>
          Change Password
        </button>
      </div>

      <div style={{ height: 1, background: COLORS.border, marginBottom: 32 }} />

      {/* Danger Zone */}
      <div>
        <h2 style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: COLORS.error, marginBottom: 16 }}>
          Danger Zone
        </h2>
        <button onClick={handleDeleteAccount} style={{
          background: "transparent", border: `1px solid ${COLORS.error}`,
          padding: "10px 20px", fontSize: 13, fontWeight: 500, color: COLORS.error,
        }}>
          Delete Account
        </button>
        <p style={{ fontSize: 12, color: "#999", marginTop: 8, lineHeight: 1.5 }}>
          Permanently deletes your account, API keys, and all data. This cannot be undone.
        </p>
      </div>
    </div>
  );
}
