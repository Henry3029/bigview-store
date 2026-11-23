export interface DiscountResult {
  originalPrice: number;
  discountAmount: number;
  finalPrice: number;
}

export function calculateDiscount(price: number): DiscountResult {
  // Edge-case protection: ensure price is a valid non-negative number
  const safePrice = Number.isFinite(price) && price > 0 ? price : 0;

  // Evaluate tiers from HIGHEST to LOWEST
  let discountAmount = 0;
  if (safePrice >= 11000) {
    discountAmount = 249;
  } else if (safePrice >= 5000) {
    discountAmount = 199;
  } else if (safePrice >= 2000) {
    discountAmount = 149;
  } else if (safePrice >= 1000) {
    discountAmount = 99;
  }

  // Ensure finalPrice never drops below 0
  const finalPrice = Math.max(0, safePrice - discountAmount);

  return {
    originalPrice: safePrice,
    discountAmount,
    finalPrice,
  };
}
