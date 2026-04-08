"use client";

import React, { useState, useRef } from "react";
import { 
  CloudUpload, 
  FileSpreadsheet, 
  CheckCircle2, 
  Loader2, 
  AlertCircle,
  HelpCircle,
  Download,
  Terminal,
  RefreshCw,
  TrendingUp,
  Wallet,
  ShieldCheck,
  ChevronRight,
  Info
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useMutualFundsStore } from "@/stores/mutualfunds-store";
import { useAuthStore } from "@/stores/auth-store";
import { AuthRequiredDialog } from "@/components/shared/auth-required-dialog";
import { formatINR } from "@/lib/format";
import { cleanCurrency } from "@/lib/financial-math";
import { MutualFund } from "@/types/finance";

export function FetchFundsDialog() {
  const [open, setOpen] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [previewData, setPreviewData] = useState<Omit<MutualFund, "id">[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [authPromptOpen, setAuthPromptOpen] = useState(false);
  
  const { isLoggedIn } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { bulkUpsertFunds } = useMutualFundsStore();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsParsing(true);
    setError(null);

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const XLSX = await import("xlsx");
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        const rawRows = XLSX.utils.sheet_to_json<Array<string | number>>(worksheet, { header: 1 });
        
        // Groww XLSX usually has headers starting around row 21 (0-indexed 20)
        // Let's find "Scheme Name" specifically
        let headerIdx = -1;
        for (let i = 0; i < Math.min(rawRows.length, 50); i++) {
          if (rawRows[i].some((cell) => String(cell).toLowerCase().includes("scheme name"))) {
            headerIdx = i;
            break;
          }
        }

        if (headerIdx === -1) {
          throw new Error("Could not find fund list headers. Please ensure you are uploading a standard broker holding statement.");
        }

        const headers = rawRows[headerIdx] as (string | number)[];
        const dataRows = rawRows.slice(headerIdx + 1);

        const findCol = (terms: string[]) => headers.findIndex(h => terms.some(t => String(h).toLowerCase().includes(t.toLowerCase())));
        
        const colMap = {
          fund: findCol(["scheme name", "fund name", "particulars"]),
          amc: findCol(["amc"]),
          category: findCol(["category"]),
          subCategory: findCol(["sub-category", "subcategory"]),
          units: findCol(["units", "quantity", "qty"]),
          invested: findCol(["invested value", "cost value", "purchase value", "invested amount"]),
          current: findCol(["current value", "market value", "current amount"]),
          xirr: findCol(["xirr"]),
        };

        if (colMap.fund === -1 || colMap.units === -1) {
          throw new Error("Required columns (Scheme Name/Units) not found. This file format might be unsupported.");
        }

        const mappedFunds: Omit<MutualFund, "id">[] = dataRows
          .filter(row => row[colMap.fund] && !isNaN(parseFloat(String(row[colMap.units]))))
          .map(row => {
            const rawName = String(row[colMap.fund]);
            const investedVal = cleanCurrency(row[colMap.invested]);
            const currentVal = cleanCurrency(row[colMap.current]);
            
            return {
              fund: rawName,
              amc: colMap.amc > -1 ? String(row[colMap.amc]) : "Mutual Fund",
              category: (colMap.category > -1 ? String(row[colMap.category]) : "Equity") as MutualFund["category"],
              subCategory: colMap.subCategory > -1 ? String(row[colMap.subCategory]) : "Growth",
              units: cleanCurrency(row[colMap.units]),
              invested: investedVal,
              current: currentVal,
              xirr: colMap.xirr > -1 ? cleanCurrency(row[colMap.xirr]) : 0,
              lastProcessedDate: new Date().toISOString(),
              sipAmount: 0
            };
          });

        if (mappedFunds.length === 0) {
          throw new Error("No holdings found in the selected file.");
        }

        setPreviewData(mappedFunds);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to parse fund statement.");
      } finally {
        setIsParsing(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleImport = async () => {
    if (!isLoggedIn) {
      setAuthPromptOpen(true);
      return;
    }
    await bulkUpsertFunds(previewData);
    setOpen(false);
    setPreviewData([]);
    setError(null);
  };

  const reset = () => {
    setPreviewData([]);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(val) => { setOpen(val); if(!val) reset(); }}>
        <DialogTrigger render={<Button variant="outline" className="h-10 px-4 rounded-xl border-primary/20 hover:bg-primary/5 text-primary gap-2 transition-all font-bold shadow-[0_0_15px_rgba(0,255,156,0.1)] hover:shadow-[0_0_20px_rgba(0,255,156,0.2)] w-full sm:w-auto" />}>
            <CloudUpload size={16} />
            <span className="sm:hidden">Sync</span>
            <span className="hidden sm:inline">Fetch Holding</span>
        </DialogTrigger>
        <DialogContent className="bg-card/40 backdrop-blur-[40px] border-border/40 w-[95vw] sm:max-w-none lg:max-w-[1240px] max-h-[92vh] overflow-hidden p-0 rounded-[32px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)]">
          <div className="flex flex-col h-full max-h-[92vh]">
            {/* Header Section */}
            <div className="p-8 border-b border-border/20 bg-gradient-to-br from-primary/5 via-transparent to-transparent">
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle className="text-4xl font-black tracking-tight bg-gradient-to-r from-primary to-primary/40 bg-clip-text text-transparent flex items-center gap-3">
                    <RefreshCw className={isParsing ? "animate-spin text-primary" : "text-primary"} size={32} />
                    Mutual Funds Auto-Sync
                  </DialogTitle>
                  <DialogDescription className="text-muted-foreground text-sm font-medium mt-1">
                    Instantly synchronize your portfolio using your broker&apos;s holdings statement.
                  </DialogDescription>
                </div>
                <div className="hidden md:flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Privacy Status</p>
                    <div className="flex items-center gap-1.5 text-primary">
                      <ShieldCheck size={14} />
                      <span className="text-xs font-bold uppercase tracking-tighter">Client-Side Only</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
              {previewData.length > 0 ? (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                  {/* Stats Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-foreground/5 border border-border/20 p-6 rounded-3xl">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Total Funds</p>
                      <p className="text-2xl font-black text-foreground">{previewData.length}</p>
                    </div>
                    <div className="bg-primary/5 border border-primary/20 p-6 rounded-3xl">
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Total Invested</p>
                      <p className="text-2xl font-black text-primary">
                        {formatINR(previewData.reduce((acc, curr) => acc + curr.invested, 0))}
                      </p>
                    </div>
                    <div className="bg-foreground/5 border border-border/20 p-6 rounded-3xl">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Portfolio Value</p>
                      <p className="text-2xl font-black text-foreground">
                        {formatINR(previewData.reduce((acc, curr) => acc + curr.current, 0))}
                      </p>
                    </div>
                  </div>

                  {/* Preview Table Container */}
                  <div className="bg-card/30 border border-border/20 rounded-[24px] overflow-hidden backdrop-blur-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm border-collapse">
                        <thead>
                          <tr className="bg-foreground/5 text-muted-foreground">
                            <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest border-b border-border/10">Scheme Name / AMC</th>
                            <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-widest border-b border-border/10">Units</th>
                            <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-widest border-b border-border/10">Invested</th>
                            <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-widest border-b border-border/10">Current</th>
                            <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-widest border-b border-border/10">Returns</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/10">
                          {previewData.slice(0, 10).map((mf, i) => {
                            const returns = mf.current - mf.invested;
                            return (
                              <tr key={i} className="group hover:bg-primary/[0.03] transition-colors">
                                <td className="px-8 py-6">
                                  <div className="font-bold text-foreground text-sm group-hover:text-primary transition-colors">{mf.fund}</div>
                                  <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-1 opacity-60">{mf.amc}</div>
                                </td>
                                <td className="px-8 py-6 text-right font-mono font-black text-foreground leading-none">{mf.units?.toFixed(3)}</td>
                                <td className="px-8 py-6 text-right font-mono text-muted-foreground/80 leading-none">{formatINR(mf.invested)}</td>
                                <td className="px-8 py-6 text-right font-mono font-bold text-foreground leading-none">{formatINR(mf.current)}</td>
                                <td className="px-8 py-6 text-right font-mono font-black leading-none">
                                  <span className={returns > 0 ? "text-primary" : "text-red-400"}>
                                    {returns > 0 ? "+" : ""}{formatINR(returns)}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    {previewData.length > 10 && (
                      <div className="p-4 bg-muted/30 text-center border-t border-border/10">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                          + {previewData.length - 10} more funds hidden in preview
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button 
                      onClick={handleImport} 
                      className="flex-1 h-14 rounded-2xl font-black text-lg bg-primary text-black hover:bg-primary/90 shadow-[0_8px_32px_rgba(0,255,156,0.2)] hover:scale-[1.01] active:scale-[0.99] transition-all"
                    >
                      {isLoggedIn ? "Synchronize Portfolio" : "Sign Up to Sync"}
                    </Button>
                    <Button variant="ghost" onClick={reset} className="h-14 px-8 border border-border/20 text-muted-foreground hover:text-foreground rounded-2xl font-bold">
                      Discard
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-12 py-4">
                  {/* Support Cards Section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Info className="text-primary" size={16} />
                      <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">Instructions for major brokers</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { 
                          name: "Groww", 
                          steps: "Portfolio > Mutual Funds > Reports > Holding Statement",
                          color: "from-emerald-500/10 to-transparent"
                        },
                        { 
                          name: "Zerodha", 
                          steps: "Console > Reports > Mutual Fund Holdings > Download XLSX",
                          color: "from-blue-500/10 to-transparent"
                        },
                        { 
                          name: "CAMS / Karvy", 
                          steps: "Portal > CAS Statement > Monthly/Quarterly Summary",
                          color: "from-purple-500/10 to-transparent"
                        }
                      ].map((b, i) => (
                        <div key={i} className={`bg-gradient-to-br ${b.color} border border-border/20 p-5 rounded-3xl group hover:border-primary/40 transition-all cursor-default relative overflow-hidden`}>
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-black text-xs uppercase tracking-widest text-foreground">{b.name}</span>
                            <Download size={14} className="text-muted-foreground opacity-50 transition-all" />
                          </div>
                          <p className="text-[10px] leading-relaxed text-muted-foreground font-medium">{b.steps}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Enhanced Drop Area */}
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="relative group border-2 border-dashed border-primary/20 rounded-[40px] p-20 flex flex-col items-center justify-center gap-6 bg-primary/[0.02] hover:bg-primary/[0.05] hover:border-primary/40 transition-all cursor-pointer overflow-hidden isolate"
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileUpload} 
                      accept=".xlsx,.xls,.csv" 
                      className="hidden" 
                    />
                    
                    <div className="relative">
                      <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 group-hover:bg-primary/30 transition-all" />
                      <div className="bg-card w-24 h-24 rounded-[32px] flex items-center justify-center shadow-2xl relative border border-border/40 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500">
                        <CloudUpload className="text-primary" size={48} />
                      </div>
                    </div>
                    
                    <div className="text-center relative">
                      <p className="text-3xl font-black text-foreground tracking-tight mb-2">Drop your .XLSX here</p>
                      <p className="text-sm text-muted-foreground font-medium">or click to browse your holding statement</p>
                    </div>

                    <div className="flex gap-2 text-[10px] font-black text-primary uppercase tracking-[0.2em] bg-primary/10 px-6 py-2.5 rounded-full mt-4 border border-primary/20 group-hover:bg-primary group-hover:text-black transition-all">
                      <FileSpreadsheet size={14} /> supports groww, console & cas
                    </div>

                    {isParsing && (
                      <div className="absolute inset-0 bg-card/80 backdrop-blur-md rounded-[40px] z-50 flex flex-col items-center justify-center gap-4">
                        <div className="relative">
                           <Loader2 className="animate-spin text-primary" size={64} />
                           <RefreshCw className="absolute inset-0 m-auto text-primary/40 animate-pulse" size={24} />
                        </div>
                        <p className="text-xl font-black text-primary tracking-widest uppercase">Deciphering Portfolio...</p>
                        <p className="text-xs text-muted-foreground font-medium">This usually takes a few seconds</p>
                      </div>
                    )}
                  </div>

                  {error && (
                    <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-3xl flex items-center gap-4 text-red-500 animate-in slide-in-from-top-4">
                      <AlertCircle className="shrink-0" size={24} />
                      <div>
                        <p className="font-black uppercase text-xs tracking-widest mb-1">Import Error</p>
                        <p className="text-sm font-medium">{error}</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Security Footer */}
                  <div className="flex items-center justify-center gap-12 border-t border-border/10 pt-8 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
                     <div className="flex items-center gap-2">
                        <ShieldCheck size={18} className="text-primary" />
                        <span className="text-[10px] font-black uppercase tracking-widest">End-to-End Encrypted</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <Wallet size={18} className="text-primary" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Read-Only Access</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <Terminal size={18} className="text-primary" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Client-Side Parser</span>
                     </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <AuthRequiredDialog open={authPromptOpen} setOpen={setAuthPromptOpen} />
    </>
  );
}
