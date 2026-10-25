export interface DiscountedPrice {
  originalPrice: number;
  discountAmount: number;
  finalPrice: number;
}

export function calculateDiscount(price: number): DiscountedPrice {
  const discountAmount = price > 3000 ? 200 : 100;
  const finalPrice = Math.max(0, price - discountAmount);
  
  return {
    originalPrice: price,
    discountAmount,
    finalPrice,
  };
}
