"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactECharts from "echarts-for-react";
import { Activity, Shield, Zap, Target, ArrowRight, Download } from "lucide-react";
import { FinanceCard } from "@/components/ui/finance-card";
import { useAccountsStore } from "@/stores/accounts-store";
import { useStocksStore } from "@/stores/stocks-store";
import { useMutualFundsStore } from "@/stores/mutualfunds-store";

const FADE_UP_ANIMATION_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 15 } },
};

type RiskProfile = 'conservative' | 'moderate' | 'aggressive';

const profiles: Record<RiskProfile, { name: string, icon: any, desc: string, allocation: { name: string, value: number, color: string }[] }> = {
  conservative: {
    name: "Conservative", icon: Shield, desc: "Capital preservation over high growth.",
    allocation: [
      { name: "Debt / Bonds", value: 65, color: "#64748b" },
      { name: "Equity", value: 20, color: "#00FF9C" },
      { name: "Gold / Cash", value: 15, color: "#eab308" }
    ]
  },
  moderate: {
    name: "Moderate", icon: Activity, desc: "Balanced growth with manageable drawdown.",
    allocation: [
      { name: "Equity", value: 65, color: "#00FF9C" },
      { name: "Debt / Bonds", value: 30, color: "#64748b" },
      { name: "Gold / Cash", value: 5, color: "#eab308" }
    ]
  },
  aggressive: {
    name: "Aggressive", icon: Zap, desc: "Maximized long-term returns, high volatility.",
    allocation: [
      { name: "Equity", value: 85, color: "#00FF9C" },
      { name: "Debt / Bonds", value: 15, color: "#64748b" },
      { name: "Gold / Cash", value: 0, color: "#eab308" }
    ]
  }
};

const getDonutOption = (data: { name: string, value: number, color: string }[], isTarget?: boolean) => ({
  tooltip: {
    trigger: 'item',
    backgroundColor: 'rgba(18, 18, 26, 0.95)',
    borderColor: 'rgba(255,255,255,0.1)',
    textStyle: { color: '#fff' }
  },
  series: [
    {
      name: 'Allocation',
      type: 'pie',
      radius: ['50%', '80%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 5,
        borderColor: '#12121A',
        borderWidth: 2
      },
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 20,
          fontWeight: 'bold',
          formatter: '{c}%',
          color: 'rgba(255,255,255,0.9)'
        }
      },
      labelLine: { show: false },
      data: data.map(d => ({ value: d.value, name: d.name, itemStyle: { color: d.color } }))
    }
  ]
});

export default function AnalyticsPage() {
  const [profile, setProfile] = useState<RiskProfile>('moderate');

  const accounts = useAccountsStore((s) => s.accounts);
  const holdings = useStocksStore((s) => s.holdings);
  const funds = useMutualFundsStore((s) => s.funds);

  // Calculate actual current allocation
  const currentAllocation = useMemo(() => {
    const cash = accounts.reduce((s, a) => s + a.balance, 0);
    const stocksValue = holdings.reduce((s, h) => s + h.quantity * h.currentPrice, 0);
    
    let equityMFs = 0;
    let debtMFs = 0;
    let otherMFs = 0;

    funds.forEach(f => {
      const cat = f.category.toLowerCase();
      if (cat.includes('debt') || cat.includes('liquid') || cat.includes('bond')) {
        debtMFs += f.current;
      } else if (cat.includes('equity') || cat.includes('elss') || cat.includes('index') || cat.includes('flexi')) {
        equityMFs += f.current;
      } else {
        otherMFs += f.current; // Put hybrid/others into equity for simplicity
      }
    });

    const totalEquity = stocksValue + equityMFs + otherMFs;
    const totalDebt = debtMFs;
    const totalCash = cash;

    const total = totalEquity + totalDebt + totalCash;
    if (total === 0) return [
      { name: "Equity", value: 0, color: "#00FF9C", raw: 0 },
      { name: "Debt / Bonds", value: 0, color: "#64748b", raw: 0 },
      { name: "Gold / Cash", value: 0, color: "#eab308", raw: 0 }
    ];

    return [
      { name: "Equity", value: Math.round((totalEquity / total) * 100), color: "#00FF9C", raw: totalEquity },
      { name: "Debt / Bonds", value: Math.round((totalDebt / total) * 100), color: "#64748b", raw: totalDebt },
      { name: "Gold / Cash", value: Math.round((totalCash / total) * 100), color: "#eab308", raw: totalCash }
    ];
  }, [accounts, holdings, funds]);

  const generateExecutionSheet = () => {
    const total = currentAllocation.reduce((s, a) => s + a.raw, 0);
    if (total === 0) {
      alert("Please add some accounts or investments first.");
      return;
    }

    const targetAlloc = profiles[profile].allocation;
    let csv = "Asset Category,Current Amount (INR),Target Amount (INR),Action,Recommended Trade Amount (INR)\n";

    targetAlloc.forEach(target => {
      const curr = currentAllocation.find(c => c.name === target.name);
      const currVal = curr ? curr.raw : 0;
      const targetVal = (target.value / 100) * total;
      
      const diff = targetVal - currVal;
      const action = diff > 500 ? "BUY" : diff < -500 ? "SELL" : "HOLD";
      
      csv += `"${target.name}",${currVal.toFixed(2)},${targetVal.toFixed(2)},${action},${Math.abs(diff).toFixed(2)}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Finkar_Trading_Execution_${profile}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial="hidden"
      animate="show"
      viewport={{ once: true }}
      variants={{ show: { transition: { staggerChildren: 0.1 } } }}
      className="space-y-6 pb-6"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Robo-Advisor</h1>
          <p className="text-muted-foreground mt-1">AI-driven portfolio recommendations and rebalancing based on your actual net worth.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(Object.keys(profiles) as RiskProfile[]).map((key) => {
          const prof = profiles[key];
          const isSelected = profile === key;
          return (
            <motion.div key={key} variants={FADE_UP_ANIMATION_VARIANTS}>
              <FinanceCard 
                className={`p-6 cursor-pointer border-2 transition-all duration-300 ${isSelected ? 'border-primary bg-primary/5' : 'border-border/50 hover:border-foreground/20 hover:bg-foreground/5'}`}
                onClick={() => setProfile(key)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-xl ${isSelected ? 'bg-primary/20 text-primary' : 'bg-foreground/5 text-muted-foreground'}`}>
                    <prof.icon size={24} />
                  </div>
                  {isSelected && <span className="text-xs font-bold text-primary px-2 py-1 bg-primary/10 rounded-full">Active</span>}
                </div>
                <h3 className="text-xl font-heading font-bold">{prof.name}</h3>
                <p className="text-sm text-muted-foreground mt-2 min-h-[40px]">{prof.desc}</p>
              </FinanceCard>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
        {/* Current vs Target */}
        <motion.div variants={FADE_UP_ANIMATION_VARIANTS} className="flex flex-col">
          <FinanceCard className="p-6 flex-1 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-heading font-semibold mb-6 flex justify-between">
                Current Allocation <span className="text-muted-foreground font-normal">vs</span> Target Allocation
              </h2>
              
              <div className="grid grid-cols-2 gap-4 h-[250px] relative">
                <div className="relative">
                  <ReactECharts option={getDonutOption(currentAllocation)} style={{ height: '100%', width: '100%' }} notMerge={true} />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-xs text-muted-foreground font-semibold">Current</span>
                  </div>
                </div>
                <div className="relative">
                  <AnimatePresence mode="wait">
                    <motion.div key={profile} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="h-full w-full">
                      <ReactECharts option={getDonutOption(profiles[profile].allocation, true)} style={{ height: '100%', width: '100%' }} notMerge={true} />
                    </motion.div>
                  </AnimatePresence>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-xs text-primary font-semibold">Target</span>
                  </div>
                </div>
              </div>
            </div>
          </FinanceCard>
        </motion.div>

        {/* Action Plan */}
        <motion.div variants={FADE_UP_ANIMATION_VARIANTS} className="flex flex-col">
          <FinanceCard className="p-6 flex-1 bg-gradient-to-br from-card/60 to-card">
            <h2 className="text-lg font-heading font-semibold mb-2 flex items-center gap-2">
              <Target className="text-primary" size={20} /> Rebalancing Plan
            </h2>
            <p className="text-sm text-muted-foreground mb-6">Suggested actions to align your portfolio with the <strong>{profiles[profile].name}</strong> strategy.</p>
            
            <div className="space-y-4">
              {currentAllocation.map((curr) => {
                const target = profiles[profile].allocation.find(t => t.name === curr.name)?.value || 0;
                const diff = target - curr.value;
                if (Math.abs(diff) <= 1) return null;
                
                return (
                  <div key={curr.name} className={`p-4 rounded-xl border ${diff > 0 ? 'bg-primary/5 border-primary/20' : 'bg-destructive/5 border-destructive/20'}`}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-sm">{diff > 0 ? 'Increase' : 'Reduce'} {curr.name}</span>
                      <span className={`text-xs font-bold ${diff > 0 ? 'text-primary' : 'text-destructive'}`}>
                        {diff > 0 ? '+' : ''}{diff}%
                      </span>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground mt-2">
                      Current {curr.value}% <ArrowRight size={12} className="mx-2" /> Target {target}%
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-8">
              <button 
                onClick={generateExecutionSheet}
                className="w-full bg-primary flex justify-center items-center gap-2 text-primary-foreground font-semibold py-3 rounded-xl shadow-[0_0_15px_rgba(0,255,156,0.3)] hover:shadow-[0_0_25px_rgba(0,255,156,0.5)] transition-all active:scale-95"
              >
                <Download size={18} />
                Generate Trading Execution Sheet
              </button>
            </div>
          </FinanceCard>
        </motion.div>
      </div>
    </motion.div>
  );
}
