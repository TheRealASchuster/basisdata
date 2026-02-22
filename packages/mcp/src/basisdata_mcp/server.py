"""BasisData MCP Server -- SEC EDGAR financial data for AI agents."""

import json
import os

import httpx
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("basisdata")

API_BASE = "https://api.basisdata.dev"
API_KEY = os.environ.get("BASISDATA_API_KEY", "")


def _headers():
    return {"Authorization": f"Bearer {API_KEY}"}


def _get(path: str, params: dict | None = None) -> dict:
    """Make GET request to BasisData API."""
    if not API_KEY:
        return {"error": "BASISDATA_API_KEY not set. Get a free key at https://basisdata.dev"}
    with httpx.Client(timeout=30) as client:
        r = client.get(f"{API_BASE}{path}", headers=_headers(), params=params)
        r.raise_for_status()
        return r.json()


def _fmt(data: dict) -> str:
    """Format API response as readable JSON string."""
    return json.dumps(data, indent=2, default=str)


@mcp.tool()
def search_companies(query: str, limit: int = 25) -> str:
    """Search for companies by name, ticker, or CIK number.

    Args:
        query: Company name, ticker symbol, or CIK number to search for
        limit: Max results to return (default 25, max 100)
    """
    data = _get("/v1/companies", params={"search": query, "limit": limit})
    if "error" in data:
        return data["error"]
    results = data.get("data", [])
    if not results:
        return f"No companies found for '{query}'"
    lines = []
    for c in results:
        line = f"{c.get('ticker', 'N/A'):6s}  {c.get('name', 'Unknown')}"
        extras = []
        if c.get("exchange"):
            extras.append(c["exchange"])
        if c.get("sic_description"):
            extras.append(c["sic_description"])
        if extras:
            line += f"  ({', '.join(extras)})"
        lines.append(line)
    total = data.get("meta", {}).get("total", len(results))
    lines.append(f"\n{total} total matches")
    return "\n".join(lines)


@mcp.tool()
def get_company(ticker: str) -> str:
    """Get detailed company metadata including SIC code, exchange, fiscal year end, and data availability.

    Args:
        ticker: Stock ticker symbol (e.g., AAPL, MSFT)
    """
    data = _get(f"/v1/companies/{ticker}")
    if "error" in data:
        return data["error"]
    return _fmt(data.get("data", data))


@mcp.tool()
def get_financials(ticker: str, periods: int = 8, period_type: str = "Q") -> str:
    """Get standardized financial statements (income statement, balance sheet, cash flow).

    Args:
        ticker: Stock ticker symbol
        periods: Number of periods to return (default 8)
        period_type: 'Q' for quarterly (default), 'A' for annual
    """
    data = _get(f"/v1/companies/{ticker}/financials", params={
        "period_type": period_type,
        "limit": periods,
    })
    if "error" in data:
        return data["error"]
    return _fmt(data)


@mcp.tool()
def get_annual_financials(ticker: str, years: int = 5) -> str:
    """Get annual financial statements for multi-year trend analysis.

    Args:
        ticker: Stock ticker symbol
        years: Number of years to return (default 5)
    """
    data = _get(f"/v1/companies/{ticker}/financials/annual", params={"years": years})
    if "error" in data:
        return data["error"]
    return _fmt(data)


@mcp.tool()
def get_ratios(ticker: str) -> str:
    """Get computed financial ratios and valuation metrics: P/E, EV/EBITDA, margins, growth rates, leverage, ROE, FCF yield.

    Uses TTM financials plus live market data from yfinance.

    Args:
        ticker: Stock ticker symbol
    """
    data = _get(f"/v1/companies/{ticker}/ratios")
    if "error" in data:
        return data["error"]
    return _fmt(data.get("data", data))


@mcp.tool()
def compare_companies(tickers: str, metrics: str = "") -> str:
    """Compare 2-10 companies side-by-side on key financial metrics.

    Args:
        tickers: Comma-separated ticker symbols (e.g., "AAPL,MSFT,GOOGL")
        metrics: Optional comma-separated metrics to compare (e.g., "revenue,net_income,ev_ebitda")
    """
    params = {"tickers": tickers, "format": "rows"}
    if metrics:
        params["metrics"] = metrics
    data = _get("/v1/compare", params=params)
    if "error" in data:
        return data["error"]
    return _fmt(data)


@mcp.tool()
def screen_companies(
    revenue_gt: float | None = None,
    revenue_lt: float | None = None,
    net_income_gt: float | None = None,
    ebitda_gt: float | None = None,
    net_margin_gt: float | None = None,
    net_margin_lt: float | None = None,
    gross_margin_gt: float | None = None,
    operating_margin_gt: float | None = None,
    roe_gt: float | None = None,
    current_ratio_gt: float | None = None,
    debt_to_equity_lt: float | None = None,
    exchange: str | None = None,
    sort_by: str = "revenue",
    limit: int = 25,
) -> str:
    """Screen companies by financial criteria.

    All numeric filters are optional. Combine any number of them.
    Revenue/income values are in USD (e.g., 1000000000 = $1B).
    Margin/ratio values are decimals (e.g., 0.1 = 10%).

    Args:
        revenue_gt: Min revenue in USD
        revenue_lt: Max revenue in USD
        net_income_gt: Min net income in USD
        ebitda_gt: Min EBITDA in USD
        net_margin_gt: Min net margin (decimal, 0.1 = 10%)
        net_margin_lt: Max net margin
        gross_margin_gt: Min gross margin
        operating_margin_gt: Min operating margin
        roe_gt: Min return on equity
        current_ratio_gt: Min current ratio
        debt_to_equity_lt: Max debt-to-equity ratio
        exchange: Filter by exchange (NYSE, Nasdaq)
        sort_by: Sort field (default: revenue)
        limit: Max results (default 25, max 100)
    """
    params = {"sort_by": sort_by, "limit": limit}
    local_vars = {
        "revenue_gt": revenue_gt, "revenue_lt": revenue_lt,
        "net_income_gt": net_income_gt, "ebitda_gt": ebitda_gt,
        "net_margin_gt": net_margin_gt, "net_margin_lt": net_margin_lt,
        "gross_margin_gt": gross_margin_gt, "operating_margin_gt": operating_margin_gt,
        "roe_gt": roe_gt, "current_ratio_gt": current_ratio_gt,
        "debt_to_equity_lt": debt_to_equity_lt, "exchange": exchange,
    }
    for k, v in local_vars.items():
        if v is not None:
            params[k] = v

    data = _get("/v1/screener", params=params)
    if "error" in data:
        return data["error"]
    results = data.get("data", [])
    total = data.get("meta", {}).get("total", len(results))
    if not results:
        return "No companies match those criteria"
    lines = [f"Found {total} companies (showing {len(results)}):\n"]
    for c in results:
        ticker = c.get("ticker", "???")
        name = c.get("name", "Unknown")
        rev = c.get("revenue")
        rev_str = f"Rev: ${rev/1e9:.1f}B" if rev and rev > 1e9 else f"Rev: ${rev/1e6:.0f}M" if rev else ""
        margin = c.get("net_margin")
        margin_str = f"Margin: {margin*100:.1f}%" if margin else ""
        lines.append(f"  {ticker:6s}  {name:40s}  {rev_str:16s}  {margin_str}")
    return "\n".join(lines)


@mcp.tool()
def search_filings(
    query: str = "",
    form_type: str = "",
    filed_after: str = "",
    filed_before: str = "",
    limit: int = 25,
) -> str:
    """Search SEC filings across all companies.

    Args:
        query: Search terms to find in filing descriptions
        form_type: Filter by form type (e.g., "10-K", "10-Q", "8-K")
        filed_after: Only filings after this date (YYYY-MM-DD)
        filed_before: Only filings before this date (YYYY-MM-DD)
        limit: Max results (default 25)
    """
    params = {"limit": limit}
    if query:
        params["q"] = query
    if form_type:
        params["form_type"] = form_type
    if filed_after:
        params["filed_after"] = filed_after
    if filed_before:
        params["filed_before"] = filed_before
    data = _get("/v1/filings/search", params=params)
    if "error" in data:
        return data["error"]
    return _fmt(data)


@mcp.tool()
def get_filing(accession_number: str) -> str:
    """Get details of a specific SEC filing by its accession number, including document URLs.

    Args:
        accession_number: SEC filing accession number (e.g., "0000320193-24-000123")
    """
    data = _get(f"/v1/filings/{accession_number}")
    if "error" in data:
        return data["error"]
    return _fmt(data.get("data", data))


def main():
    mcp.run(transport="stdio")


if __name__ == "__main__":
    main()
