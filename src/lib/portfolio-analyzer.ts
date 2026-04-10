/**
 * ═══════════════════════════════════════════════════════════════
 * Finkar Portfolio Analysis Engine
 * ═══════════════════════════════════════════════════════════════
 * 
 * A modular, data-driven portfolio intelligence system that provides:
 *   - Real asset allocation breakdown
 *   - Risk profile detection
 *   - Strategy alignment scoring
 *   - Overexposure detection
 *   - Actionable rebalancing insights
 *   - CSV export of financial action plans
 * 
 * All outputs are derived from actual user data — zero hardcoded text.
 */

import { StockHolding, MutualFund, BankAccount } from "@/types/finance";

// ─── Types ────────────────────────────────────────────────────────
export type RiskProfile = "conservative" | "moderate" | "aggressive";

export interface AssetAllocation {
  equity: number;     // ₹ value
  debt: number;       // ₹ value
  cash: number;       // ₹ value (liquid savings)
  total: number;      // ₹ total portfolio
  equityPct: number;  // 0–100
  debtPct: number;    // 0–100
  cashPct: number;    // 0–100
}

export interface ClassifiedAsset {
  name: string;
  value: number;
  type: "equity" | "debt" | "cash";
  source: "stock" | "mutual_fund" | "bank";
  pctOfPortfolio: number;
}

export interface OverexposureAlert {
  type: "concentration" | "excess_cash" | "sector_concentration" | "low_diversification" | "negative_balance";
  severity: "warning" | "critical";
  title: string;
  description: string;
}

export interface RebalanceAction {
  from: string;       // Asset class to reduce
  to: string;         // Asset class to increase
  amount: number;     // ₹ amount to shift
  description: string;
  priority: "high" | "medium" | "low";
}

export interface StrategyTarget {
  equityPct: number;
  debtPct: number;
  cashPct: number;
  label: string;
  description: string;
}

export interface PortfolioAnalysis {
  allocation: AssetAllocation;
  classifiedAssets: ClassifiedAsset[];
  detectedProfile: RiskProfile;
  selectedProfile: RiskProfile;
  alignmentScore: number;         // 0–100
  overexposureAlerts: OverexposureAlert[];
  rebalanceActions: RebalanceAction[];
  insights: string[];             // contextual sentences
  target: StrategyTarget;
  isEmpty: boolean;
}

// ─── Strategy Targets ─────────────────────────────────────────────
const STRATEGY_TARGETS: Record<RiskProfile, StrategyTarget> = {
  conservative: {
    equityPct: 30,
    debtPct: 50,
    cashPct: 20,
    label: "Conservative",
    description: "Capital preservation with stable returns. Prioritizes debt instruments and liquid reserves.",
  },
  moderate: {
    equityPct: 60,
    debtPct: 25,
    cashPct: 15,
    label: "Moderate",
    description: "Balanced growth with controlled risk. A mix of equity and debt for steady wealth creation.",
  },
  aggressive: {
    equityPct: 80,
    debtPct: 12,
    cashPct: 8,
    label: "Aggressive",
    description: "Maximum growth potential. Heavy equity allocation to beat inflation and compound aggressively.",
  },
};

// ─── 1. Asset Classification ──────────────────────────────────────

/**
 * Classify a mutual fund into equity/debt/hybrid based on its category
 */
function classifyMutualFund(fund: MutualFund): { equity: number; debt: number } {
  const category = fund.category.toLowerCase();
  const subCat = (fund.subCategory || "").toLowerCase();
  const name = fund.fund.toLowerCase();

  // Pure equity categories
  if (
    category === "equity" || 
    category === "elss" || 
    category === "index"
  ) {
    // Check for debt index funds
    if (name.includes("gilt") || name.includes("bond") || name.includes("debt")) {
      return { equity: 0, debt: fund.current };
    }
    return { equity: fund.current, debt: 0 };
  }

  // Pure debt
  if (category === "debt") {
    return { equity: 0, debt: fund.current };
  }

  // Hybrid — approximate split
  if (category === "hybrid") {
    if (subCat.includes("aggressive") || subCat.includes("equity")) {
      return { equity: fund.current * 0.65, debt: fund.current * 0.35 };
    }
    if (subCat.includes("conservative") || subCat.includes("debt")) {
      return { equity: fund.current * 0.25, debt: fund.current * 0.75 };
    }
    // Default balanced hybrid
    return { equity: fund.current * 0.50, debt: fund.current * 0.50 };
  }

  // Fallback: treat as equity
  return { equity: fund.current, debt: 0 };
}

/**
 * Build a full list of classified assets from all data sources
 */
function classifyAssets(
  stocks: StockHolding[],
  funds: MutualFund[],
  accounts: BankAccount[]
): ClassifiedAsset[] {
  const assets: ClassifiedAsset[] = [];

  // Stocks → always equity
  stocks.forEach((s) => {
    const value = s.currentPrice * s.quantity;
    if (value > 0) {
      assets.push({
        name: `${s.name} (${s.symbol})`,
        value,
        type: "equity",
        source: "stock",
        pctOfPortfolio: 0, // computed later
      });
    }
  });

  // Mutual funds → classified
  funds.forEach((f) => {
    const { equity, debt } = classifyMutualFund(f);
    if (equity > 0) {
      assets.push({
        name: f.fund,
        value: equity,
        type: "equity",
        source: "mutual_fund",
        pctOfPortfolio: 0,
      });
    }
    if (debt > 0) {
      assets.push({
        name: f.fund + (equity > 0 ? " (Debt Portion)" : ""),
        value: debt,
        type: "debt",
        source: "mutual_fund",
        pctOfPortfolio: 0,
      });
    }
  });

  // Bank accounts → cash/liquid (exclude credit cards with negative balance)
  accounts.forEach((a) => {
    if (a.balance > 0) {
      assets.push({
        name: a.name,
        value: a.balance,
        type: "cash",
        source: "bank",
        pctOfPortfolio: 0,
      });
    }
  });

  // Compute portfolio percentages
  const total = assets.reduce((sum, a) => sum + a.value, 0);
  if (total > 0) {
    assets.forEach((a) => {
      a.pctOfPortfolio = (a.value / total) * 100;
    });
  }

  return assets;
}

// ─── 2. Portfolio Aggregation ─────────────────────────────────────

function computeAllocation(assets: ClassifiedAsset[]): AssetAllocation {
  const equity = assets.filter((a) => a.type === "equity").reduce((s, a) => s + a.value, 0);
  const debt = assets.filter((a) => a.type === "debt").reduce((s, a) => s + a.value, 0);
  const cash = assets.filter((a) => a.type === "cash").reduce((s, a) => s + a.value, 0);
  const total = equity + debt + cash;

  return {
    equity,
    debt,
    cash,
    total,
    equityPct: total > 0 ? (equity / total) * 100 : 0,
    debtPct: total > 0 ? (debt / total) * 100 : 0,
    cashPct: total > 0 ? (cash / total) * 100 : 0,
  };
}

// ─── 3. Risk Profile Detection ────────────────────────────────────

function detectRiskProfile(allocation: AssetAllocation): RiskProfile {
  if (allocation.equityPct > 70) return "aggressive";
  if (allocation.equityPct >= 40) return "moderate";
  return "conservative";
}

// ─── 4. Alignment Score ───────────────────────────────────────────

function computeAlignmentScore(allocation: AssetAllocation, target: StrategyTarget): number {
  // Weighted deviation from target — max deviation is 100 pts
  const eqDev = Math.abs(allocation.equityPct - target.equityPct);
  const debtDev = Math.abs(allocation.debtPct - target.debtPct);
  const cashDev = Math.abs(allocation.cashPct - target.cashPct);

  // Weight: equity matters most, debt next, cash least
  const weightedDev = eqDev * 0.5 + debtDev * 0.3 + cashDev * 0.2;

  // Max possible deviation is ~100, so alignment = 100 - deviation (capped at 0)
  return Math.max(0, Math.round(100 - weightedDev));
}

// ─── 5. Overexposure Detection ────────────────────────────────────

function detectOverexposures(
  assets: ClassifiedAsset[],
  allocation: AssetAllocation,
  stocks: StockHolding[]
): OverexposureAlert[] {
  const alerts: OverexposureAlert[] = [];

  // 1. Excess cash — more than 40% in liquid
  if (allocation.cashPct > 40 && allocation.total > 0) {
    alerts.push({
      type: "excess_cash",
      severity: allocation.cashPct > 60 ? "critical" : "warning",
      title: "Excess Liquid Reserves",
      description: `${allocation.cashPct.toFixed(0)}% of your portfolio is in cash/savings, which loses value to inflation (~6%/yr). Consider deploying idle funds into income-generating assets.`,
    });
  }

  // 2. Single stock concentration — any stock > 25% of total equity
  const equityTotal = allocation.equity;
  if (equityTotal > 0) {
    stocks.forEach((s) => {
      const stockVal = s.currentPrice * s.quantity;
      const pct = (stockVal / allocation.total) * 100;
      if (pct > 25) {
        alerts.push({
          type: "concentration",
          severity: pct > 40 ? "critical" : "warning",
          title: `High Concentration: ${s.symbol}`,
          description: `${s.name} represents ${pct.toFixed(1)}% of your total portfolio. A single adverse event could significantly impact your wealth.`,
        });
      }
    });
  }

  // 3. Sector concentration — any sector > 35% of equity value
  const sectorMap: Record<string, number> = {};
  stocks.forEach((s) => {
    const val = s.currentPrice * s.quantity;
    const sector = s.sector || "Others";
    sectorMap[sector] = (sectorMap[sector] || 0) + val;
  });
  
  if (equityTotal > 0) {
    Object.entries(sectorMap).forEach(([sector, value]) => {
      const pct = (value / equityTotal) * 100;
      if (pct > 35 && Object.keys(sectorMap).length > 1) {
        alerts.push({
          type: "sector_concentration",
          severity: "warning",
          title: `Sector Overweight: ${sector}`,
          description: `${pct.toFixed(0)}% of your equity is concentrated in ${sector}. Diversifying across sectors can reduce systematic risk.`,
        });
      }
    });
  }

  // 4. Low diversification — fewer than 3 unique equity holdings
  const equityHoldings = assets.filter((a) => a.type === "equity").length;
  if (equityHoldings > 0 && equityHoldings < 3 && allocation.total > 100000) {
    alerts.push({
      type: "low_diversification",
      severity: "warning",
      title: "Limited Equity Diversification",
      description: `You hold only ${equityHoldings} equity position${equityHoldings === 1 ? "" : "s"}. A broader portfolio (5-15 holdings) reduces company-specific risk.`,
    });
  }

  // 5. Zero debt allocation with significant portfolio
  if (allocation.debtPct === 0 && allocation.total > 200000 && allocation.equityPct > 50) {
    alerts.push({
      type: "low_diversification",
      severity: "warning",
      title: "No Debt / Fixed Income",
      description: `Your portfolio has zero allocation to debt instruments. Even aggressive investors benefit from a 10-15% debt cushion to reduce volatility.`,
    });
  }

  return alerts;
}

// ─── 6. Optimization & Rebalancing Engine ─────────────────────────

function generateRebalanceActions(
  allocation: AssetAllocation,
  target: StrategyTarget
): RebalanceAction[] {
  const actions: RebalanceAction[] = [];
  const total = allocation.total;
  if (total <= 0) return actions;

  // Compute gap for each class
  const equityGap = (target.equityPct - allocation.equityPct) / 100 * total;
  const debtGap = (target.debtPct - allocation.debtPct) / 100 * total;
  const cashGap = (target.cashPct - allocation.cashPct) / 100 * total;

  // Determine what's overweight and underweight
  const overweight: { class: string; amount: number }[] = [];
  const underweight: { class: string; amount: number }[] = [];

  if (equityGap > 5000) underweight.push({ class: "Equity", amount: equityGap });
  else if (equityGap < -5000) overweight.push({ class: "Equity", amount: -equityGap });

  if (debtGap > 5000) underweight.push({ class: "Debt", amount: debtGap });
  else if (debtGap < -5000) overweight.push({ class: "Debt", amount: -debtGap });

  if (cashGap > 5000) underweight.push({ class: "Cash", amount: cashGap });
  else if (cashGap < -5000) overweight.push({ class: "Cash", amount: -cashGap });

  // Generate shift actions
  overweight.forEach((ow) => {
    underweight.forEach((uw) => {
      const shiftAmount = Math.min(ow.amount, uw.amount);
      if (shiftAmount > 1000) {
        const fromDetails = getAssetClassDetails(ow.class);
        const toDetails = getAssetClassDetails(uw.class);

        actions.push({
          from: ow.class,
          to: uw.class,
          amount: Math.round(shiftAmount),
          description: `Reduce ${ow.class.toLowerCase()} exposure and allocate to ${toDetails.suggestion}`,
          priority: shiftAmount / total > 0.1 ? "high" : shiftAmount / total > 0.05 ? "medium" : "low",
        });

        ow.amount -= shiftAmount;
        uw.amount -= shiftAmount;
      }
    });
  });

  return actions;
}

function getAssetClassDetails(cls: string) {
  switch (cls) {
    case "Equity":
      return { suggestion: "diversified equity or index funds for long-term growth" };
    case "Debt":
      return { suggestion: "debt mutual funds or government bonds for stable returns" };
    case "Cash":
      return { suggestion: "liquid funds or high-yield savings for emergency reserves" };
    default:
      return { suggestion: "balanced instruments" };
  }
}

// ─── 7. Intelligence Layer: Contextual Insights ──────────────────

function generateInsights(
  allocation: AssetAllocation,
  target: StrategyTarget,
  selectedProfile: RiskProfile,
  detectedProfile: RiskProfile,
  alerts: OverexposureAlert[],
  actions: RebalanceAction[],
  stocks: StockHolding[],
  funds: MutualFund[]
): string[] {
  const insights: string[] = [];
  const total = allocation.total;

  if (total <= 0) {
    insights.push("Your portfolio is empty. Add your bank accounts, stocks, and mutual funds to get personalized strategy insights.");
    return insights;
  }

  // Profile mismatch insight
  if (detectedProfile !== selectedProfile) {
    const profileLabels: Record<RiskProfile, string> = {
      conservative: "defensive and capital-preserving",
      moderate: "balanced between growth and safety",
      aggressive: "growth-oriented with high equity exposure",
    };
    insights.push(
      `Your current allocation is ${profileLabels[detectedProfile]}, but you've selected a ${selectedProfile} strategy. ${
        actions.length > 0
          ? `${actions.length} rebalancing action${actions.length > 1 ? "s" : ""} can bring you closer to your target.`
          : "Minor adjustments may be needed."
      }`
    );
  } else {
    insights.push(
      `Your portfolio naturally aligns with your ${selectedProfile} strategy. ${
        allocation.equityPct > 0
          ? `You hold ${allocation.equityPct.toFixed(0)}% in equity, ${allocation.debtPct.toFixed(0)}% in debt, and ${allocation.cashPct.toFixed(0)}% in cash.`
          : ""
      }`
    );
  }

  // Cash-specific insights
  if (allocation.cashPct > 30) {
    const excessCash = allocation.cash - (target.cashPct / 100) * total;
    if (excessCash > 10000) {
      insights.push(
        `You have ${allocation.cashPct.toFixed(0)}% of your portfolio sitting in cash. At current inflation (~6%), this loses approximately ₹${Math.round(excessCash * 0.06 / 12).toLocaleString("en-IN")}/month in purchasing power.`
      );
    }
  }

  // Top stock insight
  if (stocks.length > 0) {
    const topStock = [...stocks].sort((a, b) => b.currentPrice * b.quantity - a.currentPrice * a.quantity)[0];
    const topVal = topStock.currentPrice * topStock.quantity;
    const topPct = (topVal / total) * 100;
    if (topPct > 15) {
      insights.push(
        `Your largest equity position is ${topStock.name} at ${topPct.toFixed(1)}% of your portfolio (₹${topVal.toLocaleString("en-IN")}). Consider if this level of concentration matches your risk appetite.`
      );
    }
  }

  // MF portfolio quality
  if (funds.length > 0) {
    const avgXirr = funds.reduce((sum, f) => sum + f.xirr, 0) / funds.length;
    if (avgXirr > 0) {
      insights.push(
        `Your mutual fund portfolio has an average XIRR of ${avgXirr.toFixed(1)}% across ${funds.length} fund${funds.length > 1 ? "s" : ""}. ${
          avgXirr > 15 ? "This is strong outperformance." : avgXirr > 10 ? "Performing in line with market benchmarks." : "Consider reviewing underperforming schemes."
        }`
      );
    }
  }

  // SIP contribution insight
  const totalSIP = funds.reduce((sum, f) => sum + (f.sipAmount || 0), 0);
  if (totalSIP > 0) {
    insights.push(
      `You're investing ₹${totalSIP.toLocaleString("en-IN")}/month through SIPs. At 12% annual returns, this compounds to approximately ₹${Math.round(totalSIP * 12 * ((Math.pow(1.12, 10) - 1) / 0.12)).toLocaleString("en-IN")} over 10 years.`
    );
  }

  return insights;
}

// ─── 8. CSV Export Generator ──────────────────────────────────────

export function generateActionPlanCSV(analysis: PortfolioAnalysis): string {
  const rows: string[][] = [];
  const target = analysis.target;

  rows.push(["Finkar Financial Intelligence — Action Plan"]);
  rows.push(["Generated", new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })]);
  rows.push(["Strategy Profile", target.label]);
  rows.push(["Alignment Score", `${analysis.alignmentScore}%`]);
  rows.push(["Detected Risk Profile", analysis.detectedProfile.toUpperCase()]);
  rows.push([]);

  // Current allocation
  rows.push(["═══ CURRENT ALLOCATION ═══"]);
  rows.push(["Asset Class", "Current Value (₹)", "Current %", "Target %", "Gap %"]);
  rows.push([
    "Equity",
    Math.round(analysis.allocation.equity).toString(),
    analysis.allocation.equityPct.toFixed(1) + "%",
    target.equityPct + "%",
    (analysis.allocation.equityPct - target.equityPct).toFixed(1) + "%",
  ]);
  rows.push([
    "Debt",
    Math.round(analysis.allocation.debt).toString(),
    analysis.allocation.debtPct.toFixed(1) + "%",
    target.debtPct + "%",
    (analysis.allocation.debtPct - target.debtPct).toFixed(1) + "%",
  ]);
  rows.push([
    "Cash / Liquid",
    Math.round(analysis.allocation.cash).toString(),
    analysis.allocation.cashPct.toFixed(1) + "%",
    target.cashPct + "%",
    (analysis.allocation.cashPct - target.cashPct).toFixed(1) + "%",
  ]);
  rows.push([
    "TOTAL",
    Math.round(analysis.allocation.total).toString(),
    "100%",
    "100%",
    "",
  ]);
  rows.push([]);

  // Rebalancing actions
  if (analysis.rebalanceActions.length > 0) {
    rows.push(["═══ REBALANCING ACTIONS ═══"]);
    rows.push(["Priority", "From", "To", "Amount (₹)", "Details"]);
    analysis.rebalanceActions.forEach((action) => {
      rows.push([
        action.priority.toUpperCase(),
        action.from,
        action.to,
        action.amount.toString(),
        action.description,
      ]);
    });
    rows.push([]);
  }

  // Alerts
  if (analysis.overexposureAlerts.length > 0) {
    rows.push(["═══ RISK ALERTS ═══"]);
    rows.push(["Severity", "Type", "Details"]);
    analysis.overexposureAlerts.forEach((alert) => {
      rows.push([alert.severity.toUpperCase(), alert.title, alert.description]);
    });
    rows.push([]);
  }

  // Detailed holdings
  rows.push(["═══ PORTFOLIO BREAKDOWN ═══"]);
  rows.push(["Asset Name", "Value (₹)", "Class", "Source", "% of Portfolio"]);
  analysis.classifiedAssets
    .sort((a, b) => b.value - a.value)
    .forEach((asset) => {
      rows.push([
        asset.name,
        Math.round(asset.value).toString(),
        asset.type.toUpperCase(),
        asset.source.replace("_", " ").toUpperCase(),
        asset.pctOfPortfolio.toFixed(1) + "%",
      ]);
    });
  rows.push([]);

  // Insights
  rows.push(["═══ INTELLIGENCE INSIGHTS ═══"]);
  analysis.insights.forEach((insight) => {
    rows.push([insight]);
  });
  rows.push([]);
  rows.push(["Generated by Finkar Financial Intelligence Engine"]);

  // Escape CSV values
  return rows
    .map((row) => row.map((cell) => `"${(cell || "").replace(/"/g, '""')}"`).join(","))
    .join("\n");
}

// ─── MAIN ANALYZER: Public Entry Point ────────────────────────────

export function analyzePortfolio(
  stocks: StockHolding[],
  funds: MutualFund[],
  accounts: BankAccount[],
  selectedProfile: RiskProfile
): PortfolioAnalysis {
  // 1. Classify all assets
  const classifiedAssets = classifyAssets(stocks, funds, accounts);

  // 2. Compute allocation
  const allocation = computeAllocation(classifiedAssets);

  // 3. Detect current risk profile
  const detectedProfile = detectRiskProfile(allocation);

  // 4. Get strategy target
  const target = STRATEGY_TARGETS[selectedProfile];

  // 5. Compute alignment score
  const alignmentScore = computeAlignmentScore(allocation, target);

  // 6. Detect overexposures
  const overexposureAlerts = detectOverexposures(classifiedAssets, allocation, stocks);

  // 7. Generate rebalancing actions
  const rebalanceActions = generateRebalanceActions(allocation, target);

  // 8. Generate contextual insights
  const insights = generateInsights(
    allocation,
    target,
    selectedProfile,
    detectedProfile,
    overexposureAlerts,
    rebalanceActions,
    stocks,
    funds
  );

  return {
    allocation,
    classifiedAssets,
    detectedProfile,
    selectedProfile,
    alignmentScore,
    overexposureAlerts,
    rebalanceActions,
    insights,
    target,
    isEmpty: allocation.total <= 0,
  };
}
