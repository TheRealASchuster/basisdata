// src/app/AppShell.jsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { COLORS, GLOBAL_CSS } from "../design-system";
import { useAuth } from "../lib/auth";
import Sidebar from "./Sidebar";

export default function AppShell() {
  const { session, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <>
        <style>{GLOBAL_CSS}</style>
        <div style={{
          height: "100vh", display: "flex",
          alignItems: "center", justifyContent: "center",
          color: "#999", fontSize: 14,
        }}>
          Loading...
        </div>
      </>
    );
  }

  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div style={{ display: "flex", minHeight: "100vh", background: COLORS.bg }}>
        <Sidebar user={session.user} />
        <main style={{
          marginLeft: 240,
          flex: 1,
          padding: "40px 48px",
          maxWidth: "calc(100vw - 240px)",
          minHeight: "100vh",
        }}>
          <Outlet context={{ session }} />
        </main>
      </div>
    </>
  );
}
