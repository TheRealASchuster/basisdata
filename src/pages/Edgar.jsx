// src/pages/Edgar.jsx
import { ModulePage } from "../components/ModulePage";

const edgarModule = {
  tag: "EDGAR",
  headline: "US Public Company Fundamentals",
  stats: ["7,017 companies", "4.8M filings", "Every XBRL tag"],
  intro: "From revenue to labor costs to lease obligations — if a company reported it to the SEC, it's here. Standardized financials for quick comparisons, plus raw XBRL facts for the line items no one else gives you.",
  capabilities: [
    "Pull 10 years of income statements, balance sheets, and cash flows for any public company",
    "Screen for companies by revenue, margins, growth rates, leverage, and valuation multiples",
    "Access raw XBRL facts — every granular line item the company reported, not just the 30 everyone standardizes",
    "Compare up to 10 companies side-by-side on any financial metric",
    "Search across 4.8 million SEC filings by keyword, form type, and date range",
  ],
  coverage: [
    {
      title: "Income Statement",
      items: ["Revenue", "COGS", "Gross Profit", "R&D", "SG&A", "Compensation", "D&A", "Operating Income", "Interest Income", "Interest Expense", "Income Tax", "Net Income", "EPS"],
    },
    {
      title: "Balance Sheet",
      items: ["Cash", "Receivables", "Inventory", "Current Assets", "PP&E", "Goodwill", "Intangibles", "Total Assets", "Payables", "Deferred Revenue", "Current Liabilities", "Long-term Debt", "Total Liabilities", "Stockholders' Equity", "Retained Earnings"],
    },
    {
      title: "Cash Flow",
      items: ["Operating Cash Flow", "Capex", "Free Cash Flow", "Stock-Based Compensation", "Working Capital Changes", "Acquisitions", "Debt Issued", "Debt Repaid", "Shares Repurchased", "Dividends Paid"],
    },
    {
      title: "Ratios & Valuation",
      items: ["P/E", "EV/EBITDA", "EV/Revenue", "Gross Margin", "Operating Margin", "Net Margin", "Revenue Growth", "ROE", "ROA", "Debt/Equity", "Current Ratio", "FCF Yield"],
    },
    {
      title: "Raw XBRL Facts",
      items: ["Any us-gaap tag ever filed", "LaborAndRelatedExpense", "DepreciationAndAmortization", "OperatingLeaseRightOfUseAsset", "RevenueByGeography", "SegmentReporting", "and hundreds more"],
    },
  ],
  example: {
    description: "Get 5 years of annual financials for Apple:",
    code: `curl https://api.basisdata.dev/v1/companies/AAPL/financials/annual?years=5 \\
  -H "Authorization: Bearer bd_live_..."

# Or ask Claude directly:
"Show me Apple's revenue, operating margin, and FCF
 for the last 5 years"`,
  },
  mcpTools: [
    { name: "search_companies", desc: "Search by name, ticker, or CIK number" },
    { name: "get_company", desc: "Company metadata — SIC code, exchange, fiscal year end" },
    { name: "get_financials", desc: "Quarterly financial statements — income, balance sheet, cash flow" },
    { name: "get_annual_financials", desc: "Annual statements for multi-year trend analysis" },
    { name: "get_ratios", desc: "Live valuation and profitability ratios — P/E, EV/EBITDA, margins" },
    { name: "compare_companies", desc: "Side-by-side comparison of 2–10 companies on key metrics" },
    { name: "screen_companies", desc: "Multi-criteria screening by revenue, margins, growth, leverage" },
    { name: "get_raw_facts", desc: "Any XBRL tag — the raw data behind the standardized numbers" },
    { name: "search_filings", desc: "Full-text search across 4.8M SEC filings" },
    { name: "get_filing", desc: "Individual filing details with document URLs" },
  ],
};

export default function Edgar() {
  return <ModulePage module={edgarModule} />;
}
