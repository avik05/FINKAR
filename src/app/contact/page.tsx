"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, 
  MessageSquare, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft,
  ChevronRight,
  LifeBuoy
} from "lucide-react";
import Link from "next/link";
import { FinanceCard } from "@/components/ui/finance-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { supabase } from "@/lib/supabase";

const MESSAGE_TYPES = [
  { value: "Suggestion", label: "💡 Feature Suggestion" },
  { value: "Complaint", label: "⚠️ Formal Complaint" },
  { value: "Bug Report", label: "🪲 Technical Bug Report" },
  { value: "Feature Request", label: "🚀 Feature Request" }
];

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    type: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (!formData.name || !formData.email || !formData.type || !formData.message) {
        throw new Error("Please fill in all required fields.");
      }

      const { error: sbError } = await supabase
        .from("contact_messages")
        .insert([
          {
            name: formData.name,
            email: formData.email,
            type: formData.type,
            message: formData.message
          }
        ]);

      if (sbError) throw sbError;

      setIsSuccess(true);
      setFormData({ name: "", email: "", type: "", message: "" });
    } catch (err: any) {
      console.error("Submission error:", err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 md:py-20 relative">
      <Link 
        href="/faq" 
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 group bg-foreground/5 py-2 px-4 rounded-full border border-border/20 text-xs font-bold uppercase tracking-widest"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
        Back to FAQ
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
        {/* Left Side: Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8 lg:sticky lg:top-24"
        >
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 text-primary bg-primary/10 px-4 py-2 rounded-2xl border border-primary/20 text-sm font-black uppercase tracking-widest animate-float">
              <LifeBuoy size={16} />
              Support Center
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-black tracking-tighter text-foreground">
              Let's build the <span className="text-primary italic">future</span> of your finance.
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Have a suggestion, found a bug, or just want to tell us how much you love Finkar? We're listening. Our team reviews every message within 24 hours.
            </p>
          </div>

          <div className="space-y-6 pt-4">
            <div className="flex gap-4 p-6 rounded-3xl bg-card/40 border border-border/20 backdrop-blur-md group hover:border-primary/30 transition-all">
              <div className="p-3 rounded-2xl bg-primary/10 text-primary h-fit">
                <MessageSquare size={24} />
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-1 group-hover:text-primary transition-colors">Direct Support</h3>
                <p className="text-sm text-muted-foreground">Average response time: 2-4 hours during market hours.</p>
              </div>
            </div>
            <div className="flex gap-4 p-6 rounded-3xl bg-card/40 border border-border/20 backdrop-blur-md group hover:border-primary/30 transition-all">
              <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500 h-fit">
                <Send size={24} />
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-1 group-hover:text-blue-500 transition-colors">Collaborations</h3>
                <p className="text-sm text-muted-foreground">Interested in partnering? Reach out via "Suggestion" type.</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <FinanceCard className="p-8 md:p-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -z-10 group-hover:bg-primary/10 transition-colors" />
            
            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12 space-y-6"
                >
                  <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(0,255,156,0.2)]">
                    <CheckCircle2 size={40} className="animate-pulse" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-heading font-black text-foreground">Message Transmitted</h2>
                    <p className="text-muted-foreground">
                      Thanks! Your message has been received. We’ll get back to you soon.
                    </p>
                  </div>
                  <Button 
                    onClick={() => setIsSuccess(false)}
                    variant="outline"
                    className="mt-4 border-primary/20 hover:bg-primary hover:text-primary-foreground font-black uppercase tracking-widest rounded-2xl py-6"
                  >
                    Send Another Message
                  </Button>
                </motion.div>
              ) : (
                <motion.form 
                  key="form"
                  onSubmit={handleSubmit} 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-xs uppercase tracking-widest font-black text-muted-foreground">Full Name</Label>
                      <Input 
                        id="name" 
                        placeholder="Avik P." 
                        required 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="bg-foreground/5 border-border/50 h-14 rounded-2xl focus:border-primary/50 transition-all font-medium"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-xs uppercase tracking-widest font-black text-muted-foreground">Email Address</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="avik@finkar.com" 
                        required 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="bg-foreground/5 border-border/50 h-14 rounded-2xl focus:border-primary/50 transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type" className="text-xs uppercase tracking-widest font-black text-muted-foreground">Inquiry Type</Label>
                    <Select 
                      value={formData.type} 
                      onValueChange={(val: string | null) => setFormData({...formData, type: val || ""})}
                    >
                      <SelectTrigger className="bg-foreground/5 border-border/50 h-14 rounded-2xl focus:border-primary/50 transition-all font-semibold">
                        <SelectValue placeholder="Select one..." />
                      </SelectTrigger>
                      <SelectContent className="bg-card/95 backdrop-blur-2xl border-border/50 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
                        {MESSAGE_TYPES.map(type => (
                          <SelectItem key={type.value} value={type.value} className="py-3 focus:bg-primary/20 transition-colors cursor-pointer">
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-xs uppercase tracking-widest font-black text-muted-foreground">Your Message</Label>
                    <Textarea 
                      id="message" 
                      placeholder="How can we help you today?" 
                      required 
                      className="bg-foreground/5 border-border/50 min-h-[160px] rounded-2xl focus:border-primary/50 transition-all font-medium p-4"
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                    />
                  </div>

                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-3 font-medium"
                    >
                      <AlertCircle size={18} />
                      {error}
                    </motion.div>
                  )}

                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full h-16 bg-primary text-primary-foreground font-black text-lg uppercase tracking-widest rounded-[20px] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_8px_32px_rgba(0,255,156,0.3)] disabled:opacity-50 disabled:grayscale group"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        Transmitting...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Submit Transmission
                        <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                      </span>
                    )}
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>
          </FinanceCard>
        </motion.div>
      </div>
    </div>
  );
}
