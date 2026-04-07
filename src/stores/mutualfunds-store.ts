import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { MutualFund } from '@/types/finance';
import { useAuthStore } from './auth-store';
import { useAccountsStore } from './accounts-store';
import { useTransactionsStore } from './transactions-store';
import { safeRound, safeNextMonth, safeSum } from '@/lib/financial-math';

const SAMPLE_FUNDS: MutualFund[] = [
  { id: 'mf_1', fund: 'Parag Parikh Flexi Cap Fund', category: 'Equity', invested: 620000, current: 845000, sipAmount: 15000, xirr: 19.8 },
  { id: 'mf_2', fund: 'UTI Nifty 50 Index Fund', category: 'Index', invested: 410000, current: 512000, sipAmount: 20000, xirr: 14.5 },
  { id: 'mf_3', fund: 'Axis Small Cap Fund', category: 'Equity', invested: 180000, current: 245000, sipAmount: 10000, xirr: 24.2 },
  { id: 'mf_4', fund: 'ICICI Prudential Technology Fund', category: 'Equity', invested: 120000, current: 138000, sipAmount: 5000, xirr: 12.8 },
];

interface MutualFundsState {
  funds: MutualFund[];
  isLoading: boolean;
  
  fetchFunds: (userId?: string | null) => Promise<void>;
  addFund: (f: Omit<MutualFund, 'id'>) => Promise<void>;
  updateFund: (id: string, data: Partial<MutualFund>) => Promise<void>;
  deleteFund: (id: string) => Promise<void>;
  bulkUpsertFunds: (newFunds: Omit<MutualFund, 'id'>[]) => Promise<void>;
  processSIPs: () => Promise<void>;
}

export const useMutualFundsStore = create<MutualFundsState>((set, get) => ({
  funds: SAMPLE_FUNDS,
  isLoading: false,

  fetchFunds: async (providedUserId) => {
    const userId = providedUserId !== undefined ? providedUserId : useAuthStore.getState().user?.id;
    
    if (!userId) {
      set({ funds: SAMPLE_FUNDS, isLoading: false });
      return;
    }

    set({ isLoading: true });
    const { data, error } = await supabase
      .from('mutual_funds')
      .select('*')
      .order('fund', { ascending: true });

    if (error) {
      console.error('Error fetching mutual funds:', error);
      set({ isLoading: false });
      return;
    }

    const mapped = (data || []).map(row => ({
      id: row.id,
      fund: row.fund,
      category: row.category as MutualFund['category'],
      invested: Number(row.invested),
      current: Number(row.current),
      sipAmount: Number(row.sip_amount),
      xirr: Number(row.xirr),
      sipDay: row.sip_day ? Number(row.sip_day) : undefined,
      sipAccountId: row.sip_account_id || null,
      lastProcessedDate: row.last_processed_date || null,
      units: row.units ? Number(row.units) : undefined,
      amc: row.amc,
      subCategory: row.sub_category,
    }));

    set({ funds: mapped, isLoading: false });
    // Trigger SIP processing after fetching
    get().processSIPs();
  },

  addFund: async (f) => {
    const userId = useAuthStore.getState().user?.id;

    if (!userId) {
      const d = new Date();
      if (f.sipDay) {
        if (d.getDate() < f.sipDay) {
          d.setMonth(d.getMonth() - 1);
        }
        const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
        d.setDate(Math.min(f.sipDay, lastDay));
      }
      d.setHours(0, 0, 0, 0);
      
      set((state) => ({
        funds: [...state.funds, { ...f, id: `guest_mf_${Date.now()}`, lastProcessedDate: d.toISOString() }],
      }));
      return;
    }

    const { data, error } = await supabase
      .from('mutual_funds')
      .insert([{
        user_id: userId,
        fund: f.fund,
        category: f.category,
        invested: f.invested,
        current: f.current,
        sip_amount: f.sipAmount,
        xirr: f.xirr,
        sip_day: f.sipDay,
        sip_account_id: f.sipAccountId,
        last_processed_date: f.lastProcessedDate || (() => {
          const d = new Date();
          if (f.sipDay) {
            if (d.getDate() < f.sipDay) {
              d.setMonth(d.getMonth() - 1);
            }
            const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
            d.setDate(Math.min(f.sipDay, lastDay));
          }
          d.setHours(0, 0, 0, 0);
          return d.toISOString();
        })(),
        units: f.units,
        amc: f.amc,
        sub_category: f.subCategory,
      }])
      .select();

    if (error) {
      console.error('Error adding fund:', error);
      return;
    }

    if (data && data[0]) {
      const newFund: MutualFund = {
        id: data[0].id,
        fund: data[0].fund,
        category: data[0].category as MutualFund['category'],
        invested: Number(data[0].invested),
        current: Number(data[0].current),
        sipAmount: Number(data[0].sip_amount),
        xirr: Number(data[0].xirr),
        sipDay: data[0].sip_day ? Number(data[0].sip_day) : undefined,
        sipAccountId: data[0].sip_account_id || null,
        lastProcessedDate: data[0].last_processed_date || null,
        units: data[0].units ? Number(data[0].units) : undefined,
        amc: data[0].amc,
        subCategory: data[0].sub_category,
      };
      set((state) => ({
        funds: [...state.funds, newFund],
      }));
    }
  },

  updateFund: async (id, data) => {
    const userId = useAuthStore.getState().user?.id;

    if (!userId) {
      set((state) => ({
        funds: state.funds.map((f) => (f.id === id ? { ...f, ...data } : f)),
      }));
      return;
    }

    const { error } = await supabase
      .from('mutual_funds')
      .update({
        fund: data.fund,
        category: data.category,
        invested: data.invested,
        current: data.current,
        sip_amount: data.sipAmount,
        xirr: data.xirr,
        sip_day: data.sipDay,
        sip_account_id: data.sipAccountId,
        last_processed_date: data.lastProcessedDate,
        units: data.units,
        amc: data.amc,
        sub_category: data.subCategory,
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating fund:', error);
      return;
    }

    set((state) => ({
      funds: state.funds.map((f) => (f.id === id ? { ...f, ...data } : f)),
    }));
  },

  deleteFund: async (id) => {
    const userId = useAuthStore.getState().user?.id;

    if (!userId) {
      set((state) => ({
        funds: state.funds.filter((f) => f.id !== id),
      }));
      return;
    }

    const { error } = await supabase.from('mutual_funds').delete().eq('id', id);

    if (error) {
      console.error('Error deleting fund:', error);
      return;
    }

    set((state) => ({
      funds: state.funds.filter((f) => f.id !== id),
    }));
  },

  bulkUpsertFunds: async (newFunds) => {
    const userId = useAuthStore.getState().user?.id;
    const currentFunds = get().funds;

    if (!userId) {
      // Guest Mode: Overwrite by Fund Name
      const updatedFunds = [...currentFunds];
      
      newFunds.forEach(nf => {
        const index = updatedFunds.findIndex(f => f.fund.toLowerCase() === nf.fund.toLowerCase());
        if (index > -1) {
          updatedFunds[index] = { ...updatedFunds[index], ...nf };
        } else {
          updatedFunds.push({ ...nf, id: `guest_mf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` });
        }
      });

      set({ funds: updatedFunds });
      return;
    }

    // Auth Mode: Fetch existing to map Names to IDs
    const { data: dbData, error: fetchError } = await supabase
      .from('mutual_funds')
      .select('id, fund');

    if (fetchError) {
      console.error('Error fetching for upsert:', fetchError);
      return;
    }

    const nameToIdMap = new Map((dbData || []).map(r => [r.fund.toLowerCase(), r.id]));

    // Prepare payload
    const upsertPayload = newFunds.map(nf => {
      const existingId = nameToIdMap.get(nf.fund.toLowerCase());
      const row: any = {
        user_id: userId,
        fund: nf.fund,
        category: nf.category,
        invested: nf.invested,
        current: nf.current,
        sip_amount: nf.sipAmount || 0,
        xirr: nf.xirr || 0,
        units: nf.units,
        amc: nf.amc,
        sub_category: nf.subCategory,
        // For new imports, we don't necessarily have SIP info, but we keep existing if present
        // Actually, upsert will overwrite. If we want to preserve SIP info, we'd need to merge here.
      };
      
      if (existingId) {
        row.id = existingId;
        // Optimization: Try to preserve existing SIP settings if they exist in state
        const existingState = currentFunds.find(f => f.id === existingId);
        if (existingState) {
          row.sip_day = existingState.sipDay;
          row.sip_account_id = existingState.sipAccountId;
          row.last_processed_date = existingState.lastProcessedDate;
          row.sip_amount = nf.sipAmount || existingState.sipAmount; // Prefer new SIP amount if available
        }
      } else {
        // New fund: set initial last_processed_date to today
        row.last_processed_date = new Date().toISOString();
      }
      
      return row;
    });

    const { error: upsertError } = await supabase
      .from('mutual_funds')
      .upsert(upsertPayload, { onConflict: 'id' });

    if (upsertError) {
      console.error('Error during bulk upsert:', upsertError);
      return;
    }

    await get().fetchFunds(userId);
  },

  processSIPs: async () => {
    const { funds, updateFund } = get();
    const { accounts, updateAccount } = useAccountsStore.getState();
    const { addTransaction } = useTransactionsStore.getState();
    const userId = useAuthStore.getState().user?.id;
    
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    
    let updatedAny = false;

    for (const fund of funds) {
      if (!fund.sipAmount || !fund.sipDay || !fund.sipAccountId) continue;

      const targetAccount = accounts.find(a => a.id === fund.sipAccountId);
      if (!targetAccount) continue;

      // Determine starting point for catch-up
      // If lastProcessedDate is missing, we initialize it to today (to avoid back-dated processing on fresh setup)
      const lastProcessed = fund.lastProcessedDate ? new Date(fund.lastProcessedDate) : now;
      
      // move to the next month's SIP date using safe utility
      let processingDate = safeNextMonth(lastProcessed, fund.sipDay);

      // Catch-up loop: process all missed SIPs between lastProcessed and Now
      while (processingDate <= now) {
        console.log(`Processing SIP for ${fund.fund} on ${processingDate.toLocaleDateString()}`);
        
        // 1. Transaction Record
        await addTransaction({
          date: processingDate.toISOString(),
          merchant: `SIP: ${fund.fund}`,
          category: "Investments",
          amount: -fund.sipAmount,
          accountId: targetAccount.id,
          accountName: targetAccount.name,
        });

        // 2. Update Bank Balance (handles both Guest and Auth modes)
        await updateAccount(targetAccount.id, { balance: safeRound(targetAccount.balance - fund.sipAmount) });

        // 3. Update Fund Totals
        const updatedInvested = safeRound((fund.invested || 0) + fund.sipAmount);
        const updatedCurrent = safeRound((fund.current || 0) + fund.sipAmount);
        
        await updateFund(fund.id, {
          invested: updatedInvested,
          current: updatedCurrent,
          lastProcessedDate: processingDate.toISOString()
        });

        // Advance to next month safely
        processingDate = safeNextMonth(processingDate, fund.sipDay);
        updatedAny = true;
      }
    }

    if (updatedAny) {
      console.log("SIP Automation: Finished processing updates.");
    }
  },
}));
