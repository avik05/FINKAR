import { StockHolding } from "@/types/finance";

export interface StockMapping {
  symbol: string;
  sector: string;
  exchange: "NSE" | "BSE" | "US";
}

const STOCK_DICTIONARY: Record<string, StockMapping> = {
  // Common Indian Stocks
  "ITC": { symbol: "ITC", sector: "FMCG", exchange: "NSE" },
  "INFY": { symbol: "INFY", sector: "Technology", exchange: "NSE" },
  "RELIANCE": { symbol: "RELIANCE", sector: "Energy", exchange: "NSE" },
  "HDFC": { symbol: "HDFCBANK", sector: "Financials", exchange: "NSE" },
  "ICICI": { symbol: "ICICIBANK", sector: "Financials", exchange: "NSE" },
  "TCS": { symbol: "TCS", sector: "Technology", exchange: "NSE" },
  "NTPC": { symbol: "NTPC", sector: "Energy", exchange: "NSE" },
  "REC": { symbol: "RECLTD", sector: "Financials", exchange: "NSE" },
  "SENCO": { symbol: "SENCO", sector: "Consumer Durables", exchange: "NSE" },
  "STAR HEALTH": { symbol: "STARHEALTH", sector: "Insurance", exchange: "NSE" },
  "VODAFONE IDEA": { symbol: "IDEA", sector: "Telecommunication", exchange: "NSE" },
  "MASTER TRUST": { symbol: "MASTERTR", sector: "Financials", exchange: "NSE" },
  "GROWWAMC": { symbol: "GROWWGOLD", sector: "Gold/ETF", exchange: "NSE" },
  "SBIN": { symbol: "SBIN", sector: "Financials", exchange: "NSE" },
  "AXIS": { symbol: "AXISBANK", sector: "Financials", exchange: "NSE" },
  "BHARTIARTI": { symbol: "BHARTIARTL", sector: "Telecommunication", exchange: "NSE" },
  "KOTAK": { symbol: "KOTAKBANK", sector: "Financials", exchange: "NSE" },
  "LT": { symbol: "LT", sector: "Construction", exchange: "NSE" },
  "WIPRO": { symbol: "WIPRO", sector: "Technology", exchange: "NSE" },
  "ASIANPAINT": { symbol: "ASIANPAINT", sector: "Paint", exchange: "NSE" },
  "HINDUNILVR": { symbol: "HINDUNILVR", sector: "FMCG", exchange: "NSE" },
};

/**
 * Attempts to map a raw stock name from a broker statement to a professional StockHolding object.
 */
export function mapStockFromStatement(rawName: string): Partial<StockHolding> {
  const cleanName = rawName.toUpperCase();
  
  // 1. Try exact or partial match in dictionary
  for (const [key, mapping] of Object.entries(STOCK_DICTIONARY)) {
    if (cleanName.includes(key)) {
      return {
        ...mapping,
        name: rawName,
      };
    }
  }

  // 2. Heuristic extraction for unknown stocks
  // Remove common suffixes
  const symbolTrial = cleanName
    .replace(" LIMITED", "")
    .replace(" LTD", "")
    .replace(" CORP", "")
    .split("-")[0] // Handle things like "GROWWAMC - GOLD"
    .trim();

  return {
    symbol: symbolTrial,
    name: rawName,
    sector: "Others",
    exchange: "NSE",
  };
}
