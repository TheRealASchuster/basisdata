// src/design-system.js
// Shared design tokens and components for BasisData website

export const COLORS = {
  bg: "#F7F6F3",
  bgCard: "#FFFFFF",
  text: "#1A1A1A",
  textSecondary: "#6B6B6B",
  textTertiary: "#999999",
  accent: "#111111",
  border: "#E0DFDB",
  borderLight: "#EEEDE9",
  codeBlock: "#FAFAF8",
  success: "#4CAF50",
  error: "#C62828",
  warning: "#E65100",
};

export const FONTS = {
  heading: "'General Sans', -apple-system, 'Helvetica Neue', Helvetica, sans-serif",
  body: "'General Sans', -apple-system, 'Helvetica Neue', Helvetica, sans-serif",
  mono: "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace",
};

export const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap');
  @import url('https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    background: ${COLORS.bg};
    color: ${COLORS.text};
    font-family: ${FONTS.body};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  ::selection {
    background: ${COLORS.accent};
    color: ${COLORS.bg};
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }

  a { color: inherit; text-decoration: none; }
  button { cursor: pointer; font-family: inherit; }
  input, textarea { font-family: inherit; }

  /* Mobile responsive overrides */
  @media (max-width: 768px) {
    .flex-row-mobile-col { flex-direction: column !important; }
    .hide-mobile { display: none !important; }
    .show-mobile { display: flex !important; }
    .hero-title { font-size: 36px !important; }
    .hero-sub { font-size: 16px !important; }
    .section-title { font-size: 24px !important; }
    .stat-number { font-size: 28px !important; }
    .module-headline { font-size: 32px !important; }

    .stats-grid {
      grid-template-columns: repeat(3, 1fr) !important;
    }
    .pricing-grid {
      flex-direction: column !important;
    }
    .nav-links {
      display: none !important;
    }
    .nav-mobile-toggle {
      display: flex !important;
    }
    .mobile-menu {
      display: flex !important;
    }
    .code-block-layout {
      flex-direction: column !important;
    }
    .module-cards {
      flex-direction: column !important;
    }
    .module-divider-v {
      display: none !important;
    }
    .steps-row {
      flex-direction: column !important;
      gap: 32px !important;
    }
    .footer-columns {
      flex-direction: column !important;
      gap: 32px !important;
    }
    .docs-sidenav {
      display: none !important;
    }
    .docs-layout {
      flex-direction: column !important;
    }
    .module-stats-row {
      flex-wrap: wrap !important;
    }
    .mcp-tool-row {
      flex-direction: column !important;
      gap: 4px !important;
    }
    .mcp-tool-name {
      min-width: unset !important;
    }
  }

  @media (max-width: 480px) {
    .stats-grid {
      grid-template-columns: repeat(2, 1fr) !important;
    }
    .hero-title { font-size: 28px !important; }
    .hero-buttons {
      flex-direction: column !important;
      align-items: stretch !important;
    }
    .hero-buttons a, .hero-buttons button {
      text-align: center !important;
    }
  }
`;
