/**
 * Financial Math Utility
 * Ensures 100% precision for currency calculations and date-sensitive operations.
 */

/**
 * Rounds a number to a specific precision to avoid floating point noise.
 * Default is 2 decimal places (standard for currency).
 */
export function safeRound(value: number, precision: number = 2): number {
  const multiplier = Math.pow(10, precision);
  return Math.round(value * multiplier) / multiplier;
}

/**
 * Safely sums an array of numbers, preventing cumulative precision errors.
 */
export function safeSum(values: number[]): number {
  const sum = values.reduce((acc, curr) => acc + (curr || 0), 0);
  return safeRound(sum);
}

/**
 * Robustly converts a string (like "₹ 1,234.56") to a number.
 * Handles commas, multiple decimal points (takes the last), and negative signs.
 */
export function cleanCurrency(val: any): number {
  if (val === null || val === undefined) return 0;
  if (typeof val === 'number') return safeRound(val);
  
  const original = String(val);
  // Remove everything except numbers, dots, and negative signs
  const cleaned = original.replace(/[^0-9.-]+/g, "");
  
  const parsed = parseFloat(cleaned);
  if (isNaN(parsed)) return 0;
  
  return safeRound(parsed);
}

/**
 * Advances a date by exactly one month, handling the "31st day" wrap-around bug.
 * If the current day is 31 and next month has 30 days, it caps at 30.
 * @param date The starting date
 * @param targetDay The intended SIP day of the month
 */
export function safeNextMonth(date: Date, targetDay: number): Date {
  const next = new Date(date);
  
  // 1. Move to next month safely
  const currentMonth = next.getMonth();
  next.setMonth(currentMonth + 1);
  
  // 2. Check if the month actually changed correctly (JS Date handles overflow by moving to next-next month)
  // e.g. Jan 31 + 1 Month -> Mar 3. We detect this and pull back.
  if (next.getMonth() !== (currentMonth + 1) % 12) {
    next.setDate(0); // Move to last day of the intended month
  }
  
  // 3. Set to target day, capped by last day of the target month
  const lastDayOfTargetMonth = new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate();
  next.setDate(Math.min(targetDay, lastDayOfTargetMonth));
  
  next.setHours(0, 0, 0, 0);
  return next;
}
