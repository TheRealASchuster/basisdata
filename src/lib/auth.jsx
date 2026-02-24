// src/lib/auth.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { supabase, API_BASE } from "./supabase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) completeSignup(session);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (session) completeSignup(session);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ session, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

/**
 * After Supabase auth, call the backend to create the BasisData user
 * record if it doesn't exist yet. Runs silently — errors are logged
 * but don't block the UI.
 */
async function completeSignup(session) {
  try {
    const res = await fetch(`${API_BASE}/v1/auth/complete-signup`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      const err = await res.text();
      console.warn("complete-signup:", res.status, err);
    }
  } catch (e) {
    console.warn("complete-signup error:", e);
  }
}

/**
 * Helper: make an authenticated API call using the Supabase JWT.
 */
export async function apiFetch(path, options = {}) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("Not authenticated");

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${session.access_token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(body.detail || body.message || `API error ${res.status}`);
  }

  return res.json();
}

/**
 * Raw authenticated fetch — returns the Response object (for streaming).
 */
export async function apiRawFetch(path, options = {}) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("Not authenticated");

  return fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${session.access_token}`,
      "Content-Type": "application/json",
    },
  });
}
