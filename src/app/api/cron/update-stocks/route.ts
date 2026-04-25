import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import YahooFinance from 'yahoo-finance2';
const yahooFinance = new YahooFinance();

// Create a Supabase client with the Service Role Key to bypass RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
  // 1. Verify Vercel Cron Secret (Optional but recommended)
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  console.log('Starting automated end-of-day stock price update...');

  try {
    // 2. Fetch all unique symbols from the stocks table
    const { data: symbolsData, error: symbolsError } = await supabaseAdmin
      .from('stocks')
      .select('symbol')
      // Note: Supabase doesn't have a native distinct for select without RPC, 
      // so we fetch all and deduplicate in JS.
      
    if (symbolsError) {
      throw new Error(`Failed to fetch symbols: ${symbolsError.message}`);
    }

    if (!symbolsData || symbolsData.length === 0) {
      return NextResponse.json({ message: 'No stocks found to update.' }, { status: 200 });
    }

    // Deduplicate symbols
    const uniqueSymbols = [...new Set(symbolsData.map((row) => row.symbol))];
    console.log(`Found ${uniqueSymbols.length} unique stocks to update.`);

    const updates = [];
    const errors = [];

    // 3. Fetch latest prices from Yahoo Finance
    // We process sequentially or in small batches to avoid rate limits
    for (const baseSymbol of uniqueSymbols) {
      // Append .NS as requested by the user
      const yahooSymbol = `${baseSymbol}.NS`;

      try {
        console.log(`Fetching quote for ${yahooSymbol}...`);
        // We use quote() which returns basic pricing data
        const quote = await yahooFinance.quote(yahooSymbol);
        
        if (quote && quote.regularMarketPrice) {
          const currentPrice = quote.regularMarketPrice;
          
          // 4. Update the stocks table for this symbol
          const { error: updateError } = await supabaseAdmin
            .from('stocks')
            .update({ current_price: currentPrice })
            .eq('symbol', baseSymbol);

          if (updateError) {
            console.error(`Failed to update ${baseSymbol} in DB:`, updateError);
            errors.push({ symbol: baseSymbol, error: updateError.message });
          } else {
            console.log(`Successfully updated ${baseSymbol} to ₹${currentPrice}`);
            updates.push({ symbol: baseSymbol, price: currentPrice });
          }
        } else {
          console.warn(`No regularMarketPrice found for ${yahooSymbol}`);
          errors.push({ symbol: baseSymbol, error: 'No price data found' });
        }
      } catch (err: any) {
        console.error(`Failed to fetch data for ${yahooSymbol}:`, err.message);
        errors.push({ symbol: baseSymbol, error: err.message });
      }
    }

    // 5. Return summary
    return NextResponse.json({
      message: 'Stock price update completed',
      totalProcessed: uniqueSymbols.length,
      successfulUpdates: updates.length,
      failedUpdates: errors.length,
      updates,
      errors
    }, { status: 200 });

  } catch (error: any) {
    console.error('Critical error in update-stocks cron:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
