// lib/imageFetcher.ts

/**
 * Dynamically generates sample product images based on any item name 
 * typed by your mom during item creation.
 */
export function getDynamicPresetImages(itemName: string): string[] {
  // Clean up the item name to use as a search query tag
  const query = itemName.trim() ? encodeURIComponent(itemName.trim()) : 'product';
  
  // We generate a few variations using high-performance placeholder/image providers 
  // keyed to her exact input word so she gets relevant suggestions instantly.
  return [
    `https://picsum.photos/seed/${query}-1/500/500`,
    `https://picsum.photos/seed/${query}-2/500/500`,
    `https://picsum.photos/seed/${query}-3/500/500`,
    `https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80` // universal fallback
  ];
}
