-- FINKAR DASHBOARD: SUPABASE SCHEMA & RLS POLICIES (Idempotent Version)
-- Optimized: Safe to run multiple times.

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

--------------------------------------------------------------------------------
-- 1. BANK ACCOUNTS
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.bank_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Savings', 'Checking', 'Salary', 'Credit', 'Wallet')),
  balance DECIMAL(15, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.bank_accounts ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Users can view their own bank accounts" ON public.bank_accounts;
CREATE POLICY "Users can view their own bank accounts" ON public.bank_accounts FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own bank accounts" ON public.bank_accounts;
CREATE POLICY "Users can insert their own bank accounts" ON public.bank_accounts FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own bank accounts" ON public.bank_accounts;
CREATE POLICY "Users can update their own bank accounts" ON public.bank_accounts FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own bank accounts" ON public.bank_accounts;
CREATE POLICY "Users can delete their own bank accounts" ON public.bank_accounts FOR DELETE USING (auth.uid() = user_id);


--------------------------------------------------------------------------------
-- 2. TRANSACTIONS
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  account_id UUID REFERENCES public.bank_accounts(id) ON DELETE SET NULL,
  account_name TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  merchant TEXT NOT NULL,
  category TEXT NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Users can view their own transactions" ON public.transactions;
CREATE POLICY "Users can view their own transactions" ON public.transactions FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own transactions" ON public.transactions;
CREATE POLICY "Users can insert their own transactions" ON public.transactions FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own transactions" ON public.transactions;
CREATE POLICY "Users can update their own transactions" ON public.transactions FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own transactions" ON public.transactions;
CREATE POLICY "Users can delete their own transactions" ON public.transactions FOR DELETE USING (auth.uid() = user_id);


--------------------------------------------------------------------------------
-- 3. STOCK HOLDINGS
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.stocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  name TEXT NOT NULL,
  quantity DECIMAL(15, 4) NOT NULL DEFAULT 0,
  avg_buy_price DECIMAL(15, 2) NOT NULL DEFAULT 0,
  current_price DECIMAL(15, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.stocks ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Users can view their own stocks" ON public.stocks;
CREATE POLICY "Users can view their own stocks" ON public.stocks FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own stocks" ON public.stocks;
CREATE POLICY "Users can insert their own stocks" ON public.stocks FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own stocks" ON public.stocks;
CREATE POLICY "Users can update their own stocks" ON public.stocks FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own stocks" ON public.stocks;
CREATE POLICY "Users can delete their own stocks" ON public.stocks FOR DELETE USING (auth.uid() = user_id);


--------------------------------------------------------------------------------
-- 4. MUTUAL FUNDS
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.mutual_funds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  fund TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Equity', 'Debt', 'Hybrid', 'Index', 'Other')),
  invested DECIMAL(15, 2) NOT NULL DEFAULT 0,
  current DECIMAL(15, 2) NOT NULL DEFAULT 0,
  sip_amount DECIMAL(15, 2) NOT NULL DEFAULT 0,
  xirr DECIMAL(5, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.mutual_funds ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Users can view their own mutual funds" ON public.mutual_funds;
CREATE POLICY "Users can view their own mutual funds" ON public.mutual_funds FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own mutual funds" ON public.mutual_funds;
CREATE POLICY "Users can insert their own mutual funds" ON public.mutual_funds FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own mutual funds" ON public.mutual_funds;
CREATE POLICY "Users can update their own mutual funds" ON public.mutual_funds FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own mutual funds" ON public.mutual_funds;
CREATE POLICY "Users can delete their own mutual funds" ON public.mutual_funds FOR DELETE USING (auth.uid() = user_id);


--------------------------------------------------------------------------------
-- 5. FINANCIAL GOALS
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  target_amount DECIMAL(15, 2) NOT NULL DEFAULT 0,
  current_amount DECIMAL(15, 2) NOT NULL DEFAULT 0,
  category TEXT NOT NULL,
  deadline DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Users can view their own goals" ON public.goals;
CREATE POLICY "Users can view their own goals" ON public.goals FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own goals" ON public.goals;
CREATE POLICY "Users can insert their own goals" ON public.goals FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own goals" ON public.goals;
CREATE POLICY "Users can update their own goals" ON public.goals FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own goals" ON public.goals;
CREATE POLICY "Users can delete their own goals" ON public.goals FOR DELETE USING (auth.uid() = user_id);


--------------------------------------------------------------------------------
-- 6. AUTOMATED UPDATED_AT TRIGGERS
--------------------------------------------------------------------------------
-- Drop existing triggers to avoid conflicts
DROP TRIGGER IF EXISTS update_bank_accounts_modtime ON public.bank_accounts;
DROP TRIGGER IF EXISTS update_stocks_modtime ON public.stocks;
DROP TRIGGER IF EXISTS update_mutual_funds_modtime ON public.mutual_funds;
DROP TRIGGER IF EXISTS update_goals_modtime ON public.goals;

CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_bank_accounts_modtime BEFORE UPDATE ON public.bank_accounts FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_stocks_modtime BEFORE UPDATE ON public.stocks FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_mutual_funds_modtime BEFORE UPDATE ON public.mutual_funds FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_goals_modtime BEFORE UPDATE ON public.goals FOR EACH ROW EXECUTE PROCEDURE update_modified_column();


--------------------------------------------------------------------------------
-- 7. CONTACT MESSAGES (For Contact Us Form)
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  type TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to insert (public submissions)
DROP POLICY IF EXISTS "Anyone can submit contact messages" ON public.contact_messages;
CREATE POLICY "Anyone can submit contact messages" ON public.contact_messages 
FOR INSERT WITH CHECK (true);

-- Note: Select access is restricted to service_role/owner by default.


--------------------------------------------------------------------------------
-- 8. USER SETTINGS & STRATEGY (V2 ADDITIONS)
--------------------------------------------------------------------------------
-- This table stores non-auth metadata like the user's selected Risk Strategy.
-- It is designed to be purely additive and does not touch existing tables.

CREATE TABLE IF NOT EXISTS public.user_settings (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  selected_strategy TEXT NOT NULL DEFAULT 'moderate' CHECK (selected_strategy IN ('conservative', 'moderate', 'aggressive')),
  full_name TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Users can view their own settings" ON public.user_settings;
CREATE POLICY "Users can view their own settings" ON public.user_settings FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own settings" ON public.user_settings;
CREATE POLICY "Users can update their own settings" ON public.user_settings FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own settings" ON public.user_settings;
CREATE POLICY "Users can insert their own settings" ON public.user_settings FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Trigger for updated_at (Uses the existing function from Section 6)
DROP TRIGGER IF EXISTS update_user_settings_modtime ON public.user_settings;
CREATE TRIGGER update_user_settings_modtime BEFORE UPDATE ON public.user_settings FOR EACH ROW EXECUTE PROCEDURE update_modified_column();


--------------------------------------------------------------------------------
-- 9. RPC FUNCTIONS (V2 ADDITIONS)
--------------------------------------------------------------------------------

-- Helper for the frontend to check verification status safely without a session.
-- Used by the auth-store.ts 'checkPublicVerification' method.
CREATE OR REPLACE FUNCTION public.check_user_verification(target_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = target_id 
    AND email_confirmed_at IS NOT NULL
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
