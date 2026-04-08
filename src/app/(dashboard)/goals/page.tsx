"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Target, Plus, Trash2, PiggyBank } from "lucide-react";
import { FinanceCard } from "@/components/ui/finance-card";
import { formatINR } from "@/lib/format";
import { useGoalsStore } from "@/stores/goals-store";
import { useAuthStore } from "@/stores/auth-store";
import { AuthRequiredDialog } from "@/components/shared/auth-required-dialog";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const FADE_UP = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 15 } },
};

function AddGoalDialog() {
  const [open, setOpen] = useState(false);
  const [authPromptOpen, setAuthPromptOpen] = useState(false);
  const { isLoggedIn } = useAuthStore();
  
  const addGoal = useGoalsStore((s) => s.addGoal);
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [current, setCurrent] = useState("");
  const [deadline, setDeadline] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !target) return;

    if (!isLoggedIn) {
      setAuthPromptOpen(true);
      return;
    }

    addGoal({
      name: name.trim(),
      targetAmount: parseFloat(target) || 0,
      currentAmount: parseFloat(current) || 0,
      deadline: deadline || "",
      color: "",
    });
    setName(""); setTarget(""); setCurrent(""); setDeadline("");
    setOpen(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger render={
          <motion.button 
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-xl hover:bg-primary/20 transition-colors font-medium text-sm no-select tap-highlight-none"
          />
        }>
          <Plus size={16} /> Add Goal
        </DialogTrigger>
        <DialogContent className="bg-card border-border/50 backdrop-blur-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl text-foreground">Add Financial Goal</DialogTitle>
            <DialogDescription className="text-muted-foreground">Set a savings target to work towards.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="goal-name">Goal Name</Label>
              <Input id="goal-name" placeholder="e.g. Emergency Fund, Vacation" value={name} onChange={(e) => setName(e.target.value)} className="bg-foreground/5 border-border/50" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="goal-target">Target Amount (₹)</Label>
                <Input id="goal-target" type="number" step="0.01" placeholder="500000" value={target} onChange={(e) => setTarget(e.target.value)} className="bg-foreground/5 border-border/50" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="goal-current">Saved So Far (₹)</Label>
                <Input id="goal-current" type="number" step="0.01" placeholder="0" value={current} onChange={(e) => setCurrent(e.target.value)} className="bg-foreground/5 border-border/50" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="goal-deadline">Target Date (optional)</Label>
              <Input id="goal-deadline" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="bg-foreground/5 border-border/50" />
            </div>
            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-[0_0_20px_rgba(0,255,156,0.2)]">
              {isLoggedIn ? "Create Goal" : "Sign Up to Create"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      <AuthRequiredDialog open={authPromptOpen} setOpen={setAuthPromptOpen} />
    </>
  );
}

function ContributeDialog({ goalId, goalName }: { goalId: string; goalName: string }) {
  const [open, setOpen] = useState(false);
  const [authPromptOpen, setAuthPromptOpen] = useState(false);
  const { isLoggedIn } = useAuthStore();
  
  const contributeToGoal = useGoalsStore((s) => s.contributeToGoal);
  const [amount, setAmount] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;

    if (!isLoggedIn) {
      setAuthPromptOpen(true);
      return;
    }

    contributeToGoal(goalId, parseFloat(amount) || 0);
    setAmount("");
    setOpen(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger render={
          <motion.button 
            whileTap={{ scale: 0.95 }}
            className="text-[10px] md:text-xs text-primary bg-primary/10 px-3 py-1.5 rounded-lg hover:bg-primary/20 transition-colors font-black uppercase tracking-widest no-select tap-highlight-none"
          />
        }>
          + Add Funds
        </DialogTrigger>
        <DialogContent className="bg-card border-border/50 backdrop-blur-2xl sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg text-foreground">Contribute to {goalName}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="contrib-amount">Amount (₹)</Label>
              <Input id="contrib-amount" type="number" step="0.01" min="1" placeholder="5000" value={amount} onChange={(e) => setAmount(e.target.value)} className="bg-foreground/5 border-border/50" required />
            </div>
            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-[0_0_20px_rgba(0,255,156,0.2)]">
              {isLoggedIn ? "Save" : "Sign Up to Save"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      <AuthRequiredDialog open={authPromptOpen} setOpen={setAuthPromptOpen} />
    </>
  );
}

export default function GoalsPage() {
  const goals = useGoalsStore((s) => s.goals);
  const deleteGoal = useGoalsStore((s) => s.deleteGoal);
  const { isLoggedIn } = useAuthStore();
  const [authPromptOpen, setAuthPromptOpen] = useState(false);

  const handleDelete = (id: string) => {
    if (!isLoggedIn) {
      setAuthPromptOpen(true);
      return;
    }
    deleteGoal(id);
  };

  const totalTarget = goals.reduce((s, g) => s + g.targetAmount, 0);
  const totalSaved = goals.reduce((s, g) => s + g.currentAmount, 0);

  return (
    <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1 } } }} className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Goals</h1>
          <p className="text-muted-foreground mt-1 text-sm">Track your financial milestones and savings targets.</p>
        </div>
        <AddGoalDialog />
      </div>

      {goals.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
          <motion.div variants={FADE_UP}>
            <FinanceCard className="p-3 md:p-6 border-border/50">
              <span className="text-[9px] md:text-sm font-black text-muted-foreground uppercase tracking-widest truncate">Target</span>
              <h2 className="text-base md:text-2xl font-heading font-black mt-0.5 text-foreground tracking-tighter truncate">{formatINR(totalTarget)}</h2>
            </FinanceCard>
          </motion.div>
          <motion.div variants={FADE_UP}>
            <FinanceCard className="p-3 md:p-6 border-border/50">
              <span className="text-[9px] md:text-sm font-black text-muted-foreground uppercase tracking-widest truncate">Saved</span>
              <h2 className="text-base md:text-2xl font-heading font-black mt-0.5 text-primary tracking-tighter truncate">{formatINR(totalSaved)}</h2>
            </FinanceCard>
          </motion.div>
          <motion.div variants={FADE_UP} className="col-span-2 md:col-span-1">
            <FinanceCard className="p-3 md:p-6 border-border/50">
              <span className="text-[9px] md:text-sm font-black text-muted-foreground uppercase tracking-widest truncate">Progress</span>
              <h2 className="text-base md:text-2xl font-heading font-black mt-0.5 text-foreground tracking-tighter truncate">
                {totalTarget > 0 ? ((totalSaved / totalTarget) * 100).toFixed(0) : 0}%
              </h2>
            </FinanceCard>
          </motion.div>
        </div>
      )}

      {goals.length === 0 ? (
        <motion.div variants={FADE_UP}>
          <FinanceCard className="p-12 text-center border-border/50">
            <PiggyBank className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-30" />
            <h3 className="text-lg font-heading font-semibold mb-2 text-foreground">No Goals Yet</h3>
            <p className="text-sm text-muted-foreground mb-6">Set financial goals like an emergency fund, vacation savings, or down payment target.</p>
            <AddGoalDialog />
          </FinanceCard>
        </motion.div>
      ) : (
        <div className="grid grid-cols-2 gap-3 md:gap-6">
          {goals.map((goal) => {
            const pct = goal.targetAmount > 0 ? Math.min((goal.currentAmount / goal.targetAmount) * 100, 100) : 0;
            const remaining = Math.max(goal.targetAmount - goal.currentAmount, 0);
            return (
              <motion.div key={goal.id} variants={FADE_UP} className="aspect-square md:aspect-auto">
                <FinanceCard className="p-3 md:p-6 group relative h-full border-border/50 overflow-hidden flex flex-col justify-between">
                  <button onClick={() => handleDelete(goal.id)} className="absolute top-2 right-2 p-1 rounded-lg opacity-0 lg:group-hover:opacity-100 hover:bg-destructive/20 text-destructive transition-all" title="Delete goal">
                    <Trash2 size={12} />
                  </button>

                  <div className="flex justify-between items-start mb-2 md:mb-4 pr-6">
                    <div>
                      <h3 className="text-sm md:text-lg font-heading font-black text-foreground tracking-tight truncate leading-tight">{goal.name}</h3>
                      {goal.deadline && (
                        <p className="text-[8px] md:text-xs text-muted-foreground mt-0.5 font-bold uppercase tracking-tighter">
                          {new Date(goal.deadline).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between text-[10px] md:text-sm mb-1.5 font-black uppercase tracking-tighter">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="text-foreground">{pct.toFixed(0)}%</span>
                  </div>
                  <div className="h-2 md:h-3 w-full bg-foreground/5 rounded-full overflow-hidden mb-3 md:mb-4 border border-border/50">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: goal.color || '#00FF9C' }}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-1 md:gap-2 text-center pt-2 border-t border-border/5 mt-auto">
                    <div>
                      <p className="text-[8px] md:text-[10px] text-muted-foreground uppercase tracking-tight font-black">Saved</p>
                      <p className="text-[10px] md:text-sm font-black text-primary truncate">{formatINR(goal.currentAmount)}</p>
                    </div>
                    <div>
                      <p className="text-[8px] md:text-[10px] text-muted-foreground uppercase tracking-tight font-black">Target</p>
                      <p className="text-[10px] md:text-sm font-black text-foreground truncate">{formatINR(goal.targetAmount)}</p>
                    </div>
                    <div className="hidden xs:block">
                      <p className="text-[8px] md:text-[10px] text-muted-foreground uppercase tracking-tight font-black">Rem.</p>
                      <p className="text-[10px] md:text-sm font-black text-foreground truncate">{formatINR(remaining)}</p>
                    </div>
                  </div>
                </FinanceCard>
              </motion.div>
            );
          })}
        </div>
      )}
      
      <AuthRequiredDialog open={authPromptOpen} setOpen={setAuthPromptOpen} />
    </motion.div>
  );
}
