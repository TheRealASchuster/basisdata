// src/pages/QRate.jsx
import { ModulePage } from "../components/ModulePage";

const qrateModule = {
  ctaLabel: "Get API Key — Pro",
  tag: "QRATE",
  headline: "Credit Fund Analytics",
  stats: ["1,800 share classes", "500 portfolios", "Top 20 managers"],
  intro: "Holdings, risk metrics, and returns for every major US credit fund — high yield, investment grade, bank loans, convertibles, and BDCs. The Bloomberg PORT alternative that runs on an API call.",
  capabilities: [
    "Screen credit funds by yield, duration, credit quality, and risk-adjusted returns",
    "Compare PIMCO vs DoubleLine vs BlackRock on any metric — side by side",
    "View position-level holdings from quarterly N-PORT filings with credit ratings",
    "Track credit quality migration and portfolio composition over time",
    "Analyze BDC portfolios alongside '40 Act funds in a unified schema",
  ],
  coverage: [
    {
      title: "Fund Types",
      items: ["ETFs", "Open-end mutual funds", "Closed-end funds", "Interval funds", "Business Development Companies (BDCs)"],
    },
    {
      title: "Managers Covered",
      items: ["BlackRock/iShares", "PIMCO", "Vanguard", "Fidelity", "JPMorgan", "Goldman Sachs", "Invesco", "DoubleLine", "T. Rowe Price", "Franklin Templeton", "Nuveen", "Western Asset", "Lord Abbett", "Eaton Vance", "Loomis Sayles", "Guggenheim", "Ares", "Apollo", "KKR"],
    },
    {
      title: "Strategies",
      items: ["High Yield", "Investment Grade Corporate", "Bank Loan / Floating Rate", "Multi-Sector Credit", "Convertible", "Short Duration", "Structured Credit / CLO", "Municipal Bond", "Government / Agency", "Broad Fixed Income"],
    },
    {
      title: "Holdings Data (from N-PORT)",
      items: ["Security name", "CUSIP / ISIN", "Market value", "Portfolio weight", "Coupon rate", "Maturity date", "Credit rating (S&P / Moody's)", "Asset type", "Sector", "Country"],
    },
    {
      title: "Performance & Risk",
      items: ["Returns (1M, 3M, 6M, YTD, 1Y, 3Y, 5Y, 10Y)", "Sharpe Ratio", "Sortino Ratio", "Max Drawdown", "Standard Deviation", "Current Yield", "30-Day SEC Yield", "Distribution Rate"],
    },
    {
      title: "Portfolio Analytics",
      items: ["Effective Duration", "Credit Quality Breakdown (AAA to CCC)", "Sector Allocation", "Top 10 Holdings", "Concentration (HHI)", "Liquidity Score", "Expense Ratio", "AUM"],
    },
  ],
  example: {
    description: "Compare high yield ETFs on key risk metrics:",
    code: `curl "https://api.basisdata.dev/v1/funds/compare?tickers=HYG,JNK,USHY&metrics=yield,duration,sharpe_3y" \\
  -H "Authorization: Bearer bd_live_..."

# Or ask Claude:
"Show me all high yield ETFs with duration under 3 years
 and yield above 6% — rank by 3-year Sharpe ratio"`,
  },
  mcpTools: [
    { name: "search_funds", desc: "Search credit funds by name, ticker, manager, or strategy" },
    { name: "get_fund", desc: "Fund metadata — manager, strategy, inception, fees, share classes" },
    { name: "get_fund_holdings", desc: "Position-level holdings with credit ratings and weights" },
    { name: "get_fund_performance", desc: "Returns across multiple time periods (1M to 10Y)" },
    { name: "get_fund_risk", desc: "Sharpe, Sortino, drawdown, volatility, duration" },
    { name: "get_fund_allocation", desc: "Credit quality, sector, and geography breakdowns" },
    { name: "compare_funds", desc: "Side-by-side comparison on any metric" },
    { name: "screen_funds", desc: "Multi-criteria screening by yield, duration, quality, Sharpe" },
  ],
};

export default function QRate() {
  return <ModulePage module={qrateModule} />;
}
