// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { GLOBAL_CSS } from "./design-system";
import { AuthProvider, useAuth } from "./lib/auth";
import { Nav, Footer } from "./components/Nav";
import Landing from "./pages/Landing";
import Edgar from "./pages/Edgar";
import Bundesanzeiger from "./pages/Bundesanzeiger";
import QRate from "./pages/QRate";
import Login from "./pages/Login";
import Pricing from "./pages/Pricing";
import Docs from "./pages/Docs";

// App shell (authenticated)
import AppShell from "./app/AppShell";
import MCP from "./app/pages/MCP";
import AppChat from "./app/pages/AppChat";
import Keys from "./app/pages/Keys";
import Usage from "./app/pages/Usage";
import Billing from "./app/pages/Billing";
import Settings from "./app/pages/Settings";

function Layout({ children, showNav = true, showFooter = true }) {
  const { session } = useAuth();
  return (
    <>
      <style>{GLOBAL_CSS}</style>
      {showNav && <Nav user={session?.user ?? null} />}
      {children}
      {showFooter && <Footer />}
    </>
  );
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public marketing pages */}
      <Route path="/" element={<Layout><Landing /></Layout>} />
      <Route path="/edgar" element={<Layout><Edgar /></Layout>} />
      <Route path="/bundesanzeiger" element={<Layout><Bundesanzeiger /></Layout>} />
      <Route path="/qrate" element={<Layout><QRate /></Layout>} />
      <Route path="/pricing" element={<Layout><Pricing /></Layout>} />
      <Route path="/docs" element={<Layout><Docs /></Layout>} />

      {/* Authenticated app shell */}
      <Route path="/app" element={<AppShell />}>
        <Route index element={<MCP />} />
        <Route path="mcp" element={<MCP />} />
        <Route path="chat" element={<AppChat />} />
        <Route path="keys" element={<Keys />} />
        <Route path="usage" element={<Usage />} />
        <Route path="billing" element={<Billing />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Redirects: old routes → new app shell */}
      <Route path="/dashboard" element={<Navigate to="/app" replace />} />
      <Route path="/chat" element={<Navigate to="/app/chat" replace />} />

      {/* Login: No Nav, no Footer */}
      <Route path="/login" element={
        <Layout showNav={false} showFooter={false}><Login /></Layout>
      } />
      <Route path="/signup" element={
        <Layout showNav={false} showFooter={false}><Login /></Layout>
      } />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
