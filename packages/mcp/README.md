# basisdata-mcp

MCP server for the [BasisData](https://basisdata.dev) financial data API. Gives AI agents (Claude Desktop, Cursor, Windsurf, etc.) access to SEC EDGAR data for 7,000+ US public companies.

## Quick start

1. Get a free API key at [basisdata.dev](https://basisdata.dev)
2. Add to your MCP client config:

```json
{
  "mcpServers": {
    "basisdata": {
      "command": "uvx",
      "args": ["basisdata-mcp"],
      "env": {
        "BASISDATA_API_KEY": "bd_live_..."
      }
    }
  }
}
```

3. Restart your MCP client. Ask: *"Search for Apple using basisdata"*

## Tools

| Tool | Description |
|------|-------------|
| `search_companies` | Find companies by name, ticker, or CIK |
| `get_company` | Company metadata, SIC code, exchange, fiscal year |
| `get_financials` | Quarterly/annual income statement, balance sheet, cash flow |
| `get_annual_financials` | Multi-year annual financials for trend analysis |
| `get_ratios` | P/E, EV/EBITDA, margins, growth, leverage, FCF yield |
| `compare_companies` | Side-by-side comparison of 2-10 companies |
| `screen_companies` | Filter by revenue, margins, growth, leverage, exchange |
| `search_filings` | Full-text search across SEC filings (10-K, 10-Q, 8-K) |
| `get_filing` | Filing details and document URLs by accession number |

## Data coverage

- **7,017 US public companies** with tickers
- **4.8M SEC filings** indexed
- **50+ computed metrics** (valuation, profitability, growth, leverage)
- **< 100ms** API response time

## REST API

The MCP server calls the BasisData REST API at `api.basisdata.dev`. You can also use the API directly:

```bash
curl -H "Authorization: Bearer bd_live_..." \
  https://api.basisdata.dev/v1/companies?search=apple
```

Full docs: [api.basisdata.dev/docs](https://api.basisdata.dev/docs)

## License

MIT
