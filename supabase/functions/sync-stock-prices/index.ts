import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // 1. Fetch all unique symbols from the database
    const { data: symbolsData, error: symbolsError } = await supabaseClient
      .from('stocks')
      .select('symbol')
      .not('symbol', 'is', null);

    if (symbolsError) throw symbolsError;

    const uniqueSymbols = [...new Set(symbolsData.map(s => s.symbol))];
    console.log(`Processing ${uniqueSymbols.length} unique symbols...`);

    // 2. Fetch latest prices from Yahoo Finance
    const updates = [];
    for (const symbol of uniqueSymbols) {
      try {
        // Ensure symbols have .NS (NSE) or .BO (BSE) suffix if missing
        const ticker = symbol.includes('.') ? symbol : `${symbol}.NS`;
        const response = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=1d`);
        const data = await response.json();
        
        const price = data.chart.result[0].meta.regularMarketPrice;
        if (price) {
          updates.push({ symbol, price });
        }
      } catch (err) {
        console.error(`Failed to fetch price for ${symbol}:`, err.message);
      }
    }

    // 3. Batch update the database
    for (const update of updates) {
      await supabaseClient
        .from('stocks')
        .update({ 
          current_price: update.price, 
          last_synced_at: new Date().toISOString() 
        })
        .eq('symbol', update.symbol);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      updated: updates.length 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
