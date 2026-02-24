// src/pages/Bundesanzeiger.jsx
import { ModulePage } from "../components/ModulePage";

const bundesanzeigerModule = {
  ctaLabel: "Get API Key — Pro",
  tag: "BUNDESANZEIGER",
  headline: "German Mittelstand Financial Data",
  stats: ["50,000 companies", "HGB financials", "Down to €2M revenue"],
  intro: "Family-owned Mittelstand companies that don't show up on Bloomberg. DAX blue chips down to regional manufacturers — all parsed from official Bundesanzeiger filings, standardized, and searchable via API.",
  capabilities: [
    "Screen German companies by Umsatz, margins, Eigenkapitalquote, and employee count",
    "Access full HGB financial statements in native German field names or English-standardized",
    "Compare German and US companies on standardized metrics across accounting standards",
    "Find acquisition targets in specific industries and Bundesländer",
    "Track Mittelstand performance across multiple Geschäftsjahre",
  ],
  coverage: [
    {
      title: "GuV (§275 HGB)",
      items: ["Umsatzerlöse", "Materialaufwand", "Personalaufwand", "Abschreibungen", "Sonstige betriebliche Erträge", "Sonstige betriebliche Aufwendungen", "Betriebsergebnis", "Zinsergebnis", "Steuern", "Jahresüberschuss"],
    },
    {
      title: "Bilanz (§266 HGB)",
      items: ["Anlagevermögen", "Immaterielle Vermögensgegenstände", "Sachanlagen", "Finanzanlagen", "Umlaufvermögen", "Vorräte", "Forderungen", "Kassenbestand", "Eigenkapital", "Rückstellungen", "Verbindlichkeiten", "Bilanzsumme"],
    },
    {
      title: "Kennzahlen",
      items: ["Eigenkapitalquote", "Umsatzrendite", "Personalaufwandsquote", "Verschuldungsgrad", "Anlagenintensität", "Working Capital", "EBIT-Marge"],
    },
    {
      title: "Standardized (Cross-country)",
      items: ["Revenue", "Total Assets", "Equity", "Net Income", "Operating Margin", "Equity Ratio", "Debt/Equity — mapped to same schema as EDGAR for direct US-DE comparison"],
    },
  ],
  example: {
    description: "Search for German companies with over €10M revenue and >15% equity ratio:",
    code: `curl "https://api.basisdata.dev/v1/de/companies?revenue_gt=10000000&equity_ratio_gt=0.15" \\
  -H "Authorization: Bearer bd_live_..."

# Or ask Claude:
"Find German Mittelstand companies with revenue
 between €5M and €50M and equity ratio above 30%"`,
  },
  mcpTools: [
    { name: "search_de_companies", desc: "Search German companies by name, Handelsregister-Nr, or industry" },
    { name: "get_de_company", desc: "Company metadata — legal form, Sitz, Bundesland, industry" },
    { name: "get_de_financials", desc: "HGB financial statements — GuV and Bilanz" },
    { name: "screen_de_companies", desc: "Multi-criteria screening — revenue, margins, equity ratio, employees" },
    { name: "compare_de_companies", desc: "Side-by-side comparison of German companies" },
    { name: "compare_cross_country", desc: "Compare US (EDGAR) and German (Bundesanzeiger) companies" },
  ],
};

export default function Bundesanzeiger() {
  return <ModulePage module={bundesanzeigerModule} />;
}
