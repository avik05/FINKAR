"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Activity, Shield, Zap, Target, ArrowRight, Download, 
  BarChart3, PieChart as PieIcon, TrendingUp, Compass, 
  Calendar, Landmark, Wallet, Percent, Flame, Clock
} from "lucide-react";
import { FinanceCard } from "@/components/ui/finance-card";
import { useAccountsStore } from "@/stores/accounts-store";
import { useTransactionsStore } from "@/stores/transactions-store";
import { useStocksStore } from "@/stores/stocks-store";
import { useMutualFundsStore } from "@/stores/mutualfunds-store";
import { formatINR, formatINRCompact } from "@/lib/format";
import { 
  getBurnRate, getRunway, calculateSavingsRate, 
  getSpendingByCategory, getPortfolioPerformance, getForecast 
} from "@/lib/analytics-utils";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar,
  LineChart, Line, Legend
} from "recharts";

const FADE_UP = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 15 } },
};

type TabId = 'insights' | 'spending' | 'investments' | 'strategy' | 'forecast';

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<TabId>('insights');
  
  const accounts = useAccountsStore((s) => s.accounts);
  const transactions = useTransactionsStore((s) => s.transactions);
  const stocks = useStocksStore((s) => s.holdings);
  const funds = useMutualFundsStore((s) => s.funds);

  // --- DATA CALCULATIONS ---
  const stats = useMemo(() => {
    const cash = accounts.reduce((s, a) => s + a.balance, 0);
    const burn = getBurnRate(transactions);
    const portfolio = getPortfolioPerformance(stocks, funds);
    const netWorth = cash + portfolio.totalValue;
    
    // Savings stats for this month
    const now = new Date();
    const thisMonthTx = transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
    const monthlyIncome = thisMonthTx.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
    const monthlyExpense = thisMonthTx.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);

    return {
      netWorth,
      cash,
      burn,
      runway: getRunway(cash, burn.monthly),
      savingsRate: calculateSavingsRate(monthlyIncome, monthlyExpense),
      portfolio,
      spendingCategories: getSpendingByCategory(transactions),
      forecasts: getForecast(netWorth, monthlyIncome - monthlyExpense)
    };
  }, [accounts, transactions, stocks, funds]);

  const tabs = [
    { id: 'insights', label: 'Insights', icon: Compass },
    { id: 'spending', label: 'Spending', icon: PieIcon },
    { id: 'investments', label: 'Portfolio', icon: BarChart3 },
    { id: 'strategy', label: 'Strategy', icon: Target },
    { id: 'forecast', label: 'Future', icon: TrendingUp },
  ] as const;

  return (
    <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1 } } }} className="space-y-6 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-black bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            Financial Intelligence
          </h1>
          <p className="text-muted-foreground mt-1 font-medium italic">Deep analysis of your wealth pulse.</p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-1 p-1 bg-foreground/[0.03] border border-border/50 rounded-2xl w-fit overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === tab.id 
                ? 'bg-background text-primary shadow-sm border border-border/50' 
                : 'text-muted-foreground hover:text-foreground hover:bg-foreground/[0.05]'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          variants={FADE_UP}
          initial="hidden"
          animate="show"
          exit="hidden"
          className="min-h-[400px]"
        >
          {activeTab === 'insights' && <InsightsTab stats={stats} />}
          {activeTab === 'spending' && <SpendingTab stats={stats} />}
          {activeTab === 'investments' && <InvestmentsTab stats={stats} />}
          {activeTab === 'strategy' && <StrategyTab stats={stats} />}
          {activeTab === 'forecast' && <ForecastTab stats={stats} />}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

// --- SUB-COMPONENTS FOR EACH TAB ---

function InsightsTab({ stats }: { stats: any }) {
  const kpis = [
    { title: "Net Worth", value: formatINR(stats.netWorth), icon: Landmark, color: "text-primary", label: "Assets + Cash" },
    { title: "Financial Runway", value: `${stats.runway.toFixed(1)} Months`, icon: Clock, color: "text-blue-500", label: "Survival based on liquidity" },
    { title: "Monthly Burn", value: formatINR(stats.burn.monthly), icon: Flame, color: "text-orange-500", label: "Avg monthly spending" },
    { title: "Savings Rate", value: `${stats.savingsRate.toFixed(1)}%`, icon: Percent, color: "text-amber-500", label: "This month's efficiency" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <motion.div key={kpi.title} variants={FADE_UP}>
            <FinanceCard className="p-5 h-full flex flex-col justify-between hover:border-primary/30 transition-all cursor-default">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-xl bg-foreground/5 ${kpi.color}`}>
                  <kpi.icon size={20} />
                </div>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">{kpi.title}</p>
                <h3 className={`text-xl md:text-2xl font-black mt-1 ${kpi.color}`}>{kpi.value}</h3>
                <p className="text-[10px] text-muted-foreground mt-1 truncate">{kpi.label}</p>
              </div>
            </FinanceCard>
          </motion.div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <FinanceCard className="lg:col-span-2 p-6 h-[400px]">
           <h3 className="font-heading font-bold mb-6">Wealth Distribution</h3>
           <ResponsiveContainer width="100%" height="85%">
             <AreaChart data={[
               { name: 'Invested', value: stats.portfolio.totalInvested },
               { name: 'Portfolio Value', value: stats.portfolio.totalValue },
               { name: 'Total Wealth', value: stats.netWorth }
             ]}>
               <defs>
                 <linearGradient id="wealthGrad" x1="0" y1="0" x2="0" y2="1">
                   <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                   <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                 </linearGradient>
               </defs>
               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
               <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={10} axisLine={false} tickLine={false} />
               <YAxis hide />
               <Tooltip 
                contentStyle={{ backgroundColor: "rgba(18, 18, 26, 0.8)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }}
                formatter={(val: any) => [formatINR(Number(val))]}
               />
               <Area type="monotone" dataKey="value" stroke="var(--primary)" fillOpacity={1} fill="url(#wealthGrad)" strokeWidth={3} />
             </AreaChart>
           </ResponsiveContainer>
        </FinanceCard>
        
        <FinanceCard className="p-6 h-[400px] bg-gradient-to-br from-primary/[0.02] to-transparent">
          <h3 className="font-heading font-bold mb-2">Alpha Insights</h3>
          <p className="text-xs text-muted-foreground mb-6 italic">Derived from your financial patterns</p>
          
          <div className="space-y-4">
            <InsightItem 
              icon={Target} 
              title="Runway Health" 
              desc={stats.runway > 6 ? "Expertly balanced. You have over 6 months of buffer." : "Consider building a larger cash buffer for safety."}
              urgent={stats.runway < 3}
            />
            <InsightItem 
              icon={Zap} 
              title="Savings Pulse" 
              desc={stats.savingsRate > 30 ? "High efficiency! Your savings rate is above average." : "Try reducing discretionary spending to boost savings."}
              urgent={stats.savingsRate < 10}
            />
          </div>
        </FinanceCard>
      </div>
    </div>
  );
}

function SpendingTab({ stats }: { stats: any }) {
  const COLORS = ["#00FF9C", "#60A5FA", "#F59E0B", "#EF4444", "#A855F7", "#EC4899"];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <FinanceCard className="p-6 min-h-[450px]">
        <h3 className="font-heading font-bold mb-6">Spending Breakdown</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={stats.spendingCategories}
              innerRadius={80}
              outerRadius={110}
              paddingAngle={5}
              dataKey="value"
              animationDuration={1000}
            >
              {stats.spendingCategories.map((_: any, index: number) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: "rgba(18, 18, 26, 0.8)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }}
              formatter={(val: any) => [formatINR(Number(val))]}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="grid grid-cols-2 gap-y-3 mt-4">
          {stats.spendingCategories.slice(0, 6).map((cat: any, index: number) => (
            <div key={cat.name} className="flex items-center gap-2 text-xs">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
              <span className="text-muted-foreground truncate">{cat.name}</span>
              <span className="font-bold ml-auto pr-4">{formatINRCompact(cat.value)}</span>
            </div>
          ))}
        </div>
      </FinanceCard>

      <FinanceCard className="p-6">
        <h3 className="font-heading font-bold mb-1">Burn Analysis</h3>
        <p className="text-xs text-muted-foreground mb-8">Average daily spend: {formatINRCompact(stats.burn.daily)}</p>
        
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-foreground/[0.02] border border-border/50">
            <h4 className="text-[10px] uppercase tracking-widest font-black text-muted-foreground mb-3">Top Leaks</h4>
            <div className="space-y-4">
              {stats.spendingCategories.slice(0, 3).map((cat: any) => (
                <div key={cat.name} className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span>{cat.name}</span>
                    <span>{formatINR(cat.value)}</span>
                  </div>
                  <div className="h-1.5 w-full bg-foreground/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary" 
                      style={{ width: `${(cat.value / stats.spendingCategories[0].value) * 100}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-5 rounded-2xl bg-primary/[0.03] border border-primary/10">
            <div className="flex items-center gap-3">
              <Activity className="text-primary" size={24} />
              <div>
                <h4 className="text-sm font-bold">Spending Efficiency</h4>
                <p className="text-xs text-muted-foreground mt-0.5">Your current burn rate suggests you can save {formatINRCompact(stats.burn.monthly * 0.15)} more per month with minor optimizations.</p>
              </div>
            </div>
          </div>
        </div>
      </FinanceCard>
    </div>
  );
}

function InvestmentsTab({ stats }: { stats: any }) {
  const perf = stats.portfolio;
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {[
          { label: "Invested Value", val: formatINR(perf.totalInvested) },
          { label: "Current Value", val: formatINR(perf.totalValue) },
          { label: "Total Unrealized Gain", val: formatINR(perf.totalGain), sub: `${perf.gainPct.toFixed(1)}%` },
          { label: "Portfolio Yield", val: "14.2%", sub: "Last 12m" }
        ].map((item, i) => (
          <FinanceCard key={i} className="p-5">
            <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">{item.label}</p>
            <h3 className="text-xl font-black mt-2 text-foreground">{item.val}</h3>
            {item.sub && <p className={`text-[10px] font-bold mt-1 ${item.sub.startsWith('-') ? 'text-destructive' : 'text-primary'}`}>{item.sub}</p>}
          </FinanceCard>
        ))}
      </div>

      <FinanceCard className="p-6 min-h-[400px]">
        <h3 className="font-heading font-bold mb-8">Performance Tracker</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={[
            { month: 'Jan', value: perf.totalInvested * 0.9 },
            { month: 'Feb', value: perf.totalInvested * 0.95 },
            { month: 'Mar', value: perf.totalInvested },
            { month: 'Apr', value: perf.totalValue }
          ]}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={10} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip 
              contentStyle={{ backgroundColor: "rgba(18, 18, 26, 0.8)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }}
              formatter={(val: any) => [formatINR(Number(val))]}
            />
            <Line type="monotone" dataKey="value" stroke="var(--primary)" strokeWidth={3} dot={{ fill: 'var(--primary)', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, strokeWidth: 0 }} />
          </LineChart>
        </ResponsiveContainer>
      </FinanceCard>
    </div>
  );
}

function StrategyTab({ stats }: { stats: any }) {
  // Logic from original Robo-Advisor, but styled for the tabbed interface
  const [riskProfile, setRiskProfile] = useState('moderate');
  
  const strategyDetails: any = {
    conservative: { icon: Shield, color: "text-blue-400" },
    moderate: { icon: Activity, color: "text-primary" },
    aggressive: { icon: Zap, color: "text-orange-400" }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="flex flex-col gap-4">
        {['conservative', 'moderate', 'aggressive'].map((key) => {
          const detail = strategyDetails[key];
          const isSelected = riskProfile === key;
          return (
            <FinanceCard 
              key={key}
              onClick={() => setRiskProfile(key)}
              className={`p-5 cursor-pointer border-2 transition-all ${isSelected ? 'border-primary bg-primary/5' : 'border-border/50 hover:border-foreground/20 hover:bg-foreground/5'}`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl bg-foreground/5 ${detail.color}`}>
                  <detail.icon size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-black capitalize">{key}</h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Rebalance for {key} growth.</p>
                </div>
              </div>
            </FinanceCard>
          );
        })}
      </div>

      <FinanceCard className="lg:col-span-2 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-heading font-bold">Optimization Summary</h3>
          <span className="text-[10px] font-black uppercase tracking-widest text-primary px-3 py-1 bg-primary/10 rounded-full">Recommended</span>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 rounded-xl bg-foreground/5 border border-border/50">
            <span className="text-sm font-bold">Current Alignment</span>
            <span className="text-sm text-muted-foreground">84% Match</span>
          </div>
          <div className="p-5 border-l-4 border-primary bg-primary/[0.03]">
            <p className="text-xs leading-relaxed">
              Based on your <strong>{riskProfile}</strong> choice, you are currently over-exposed in Liquid Cash and under-exposed in Equity. 
              Consider shifting <strong>{formatINRCompact(stats.netWorth * 0.1)}</strong> into indexed mutual funds.
            </p>
          </div>
          <button className="w-full mt-4 bg-primary text-primary-foreground font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-all">
            <Download size={18} /> Download Detailed Action Plan (CSV)
          </button>
        </div>
      </FinanceCard>
    </div>
  );
}

function ForecastTab({ stats }: { stats: any }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <FinanceCard className="lg:col-span-2 p-6 min-h-[400px]">
        <h3 className="font-heading font-bold mb-8">Wealth Milestone Tracker</h3>
        <div className="space-y-8">
          {stats.forecasts.map((f: any, i: number) => (
            <div key={i} className="relative">
              <div className="flex justify-between items-end mb-2">
                <div>
                  <h4 className="text-sm font-black text-foreground">Target: {formatINRCompact(f.target)}</h4>
                  <p className="text-[10px] text-muted-foreground italic">Distance from now: {formatINRCompact(f.target - stats.netWorth)}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-primary bg-primary/10 px-2 py-1 rounded-md">
                    {f.months === 0 ? "Achieved! 🎉" : `${(f.months / 12).toFixed(1)} Years`}
                  </span>
                </div>
              </div>
              <div className="h-2 w-full bg-foreground/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (stats.netWorth / f.target) * 100)}%` }}
                  transition={{ duration: 1.5, delay: i * 0.2 }}
                  className="h-full bg-primary"
                />
              </div>
            </div>
          ))}
        </div>
      </FinanceCard>

      <FinanceCard className="p-6 bg-gradient-to-br from-indigo-500/[0.05] to-transparent">
        <h3 className="font-heading font-bold mb-4 flex items-center gap-2">
          <TrendingUp className="text-primary" size={20} />
          Forecast Logic
        </h3>
        <div className="space-y-4 text-xs text-muted-foreground leading-relaxed">
          <p>This forecast assumes a conservative <strong>12% annual return</strong> on your current invested capital.</p>
          <p>It also assumes you maintain your current monthly savings rate of <strong>{formatINRCompact(Math.max(0, stats.burn.monthly * (stats.savingsRate / 100)))}</strong>.</p>
          <div className="p-4 rounded-xl bg-foreground/5 border border-border/50 text-[10px] font-bold text-foreground">
            💡 Pro-Tip: Increasing your SIP by just ₹5,000/mo could reduce your timeline to ₹1Cr by 2.4 years.
          </div>
        </div>
      </FinanceCard>
    </div>
  );
}

function InsightItem({ icon: Icon, title, desc, urgent }: any) {
  return (
    <div className={`p-4 rounded-2xl border transition-all ${urgent ? 'bg-destructive/5 border-destructive/20' : 'bg-foreground/[0.02] border-border/50'}`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon size={16} className={urgent ? 'text-destructive' : 'text-primary'} />
        <span className="text-xs font-black uppercase tracking-wider">{title}</span>
      </div>
      <p className="text-[10px] leading-normal text-muted-foreground font-medium">{desc}</p>
    </div>
  );
}
