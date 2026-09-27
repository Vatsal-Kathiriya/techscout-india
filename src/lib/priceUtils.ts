/**
 * Utility functions for pricing and discounts.
 */

/**
 * Calculates discount percentage between selling price and MRP.
 * Returns a rounded integer (e.g. 16 for 16% off), or 0 if no valid discount.
 */
export function calculateDiscount(priceStr?: string, mrpStr?: string): number {
  if (!priceStr || !mrpStr) return 0;
  
  const parseNum = (str: string): number => {
    // Strip everything except digits and decimal point
    const cleaned = str.replace(/[^0-9.]/g, '');
    return parseFloat(cleaned) || 0;
  };

  const price = parseNum(priceStr);
  const mrp = parseNum(mrpStr);

  if (mrp <= 0 || price <= 0 || mrp <= price) {
    return 0;
  }

  const discount = Math.round(((mrp - price) / mrp) * 100);
  return discount > 0 && discount < 100 ? discount : 0;
}

/**
 * Returns true if a product has a genuine discount (MRP > Price).
 * If false, the product sells at raw / regular price with no discount.
 */
export function hasValidDiscount(priceStr?: string, mrpStr?: string): boolean {
  return calculateDiscount(priceStr, mrpStr) > 0;
}

/**
 * Ensures a price string has standard rupee format (e.g. "₹20,990")
 */
export function formatCurrency(val?: string | number): string {
  if (val === undefined || val === null) return '';
  const str = String(val).trim();
  if (!str) return '';
  if (str.startsWith('₹')) return str;
  return `₹${str}`;
}
