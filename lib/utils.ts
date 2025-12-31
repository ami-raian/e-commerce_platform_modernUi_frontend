export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ")
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price)
}

export function calculateDiscount(originalPrice: number, discountPercent: number): number {
  return originalPrice - originalPrice * (discountPercent / 100)
}

export function isFlashSaleActive(startTime: Date, endTime: Date): boolean {
  const now = new Date()
  return now >= startTime && now <= endTime
}

export function getRemainingTime(endTime: Date): {
  days: number
  hours: number
  minutes: number
  seconds: number
} {
  const now = new Date().getTime()
  const end = new Date(endTime).getTime()
  const difference = end - now

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  }
}

// Generate SEO-friendly slug from product name
export function generateSlug(name: string): string {
  if (!name || name.trim() === '') {
    return 'product'; // Fallback if name is empty
  }
  
  // Convert Unicode mathematical bold characters to normal ASCII
  let normalized = '';
  for (const char of name) {
    const code = char.codePointAt(0);
    if (code) {
      // Bold uppercase (𝗔-𝗭: U+1D5D4 to U+1D5ED)
      if (code >= 0x1D5D4 && code <= 0x1D5ED) {
        normalized += String.fromCharCode(code - 0x1D5D4 + 65);
      }
      // Bold lowercase (𝗮-𝘇: U+1D5EE to U+1D607)
      else if (code >= 0x1D5EE && code <= 0x1D607) {
        normalized += String.fromCharCode(code - 0x1D5EE + 97);
      }
      // Regular characters
      else {
        normalized += char;
      }
    } else {
      normalized += char;
    }
  }
  
  // Normalize remaining Unicode and create slug
  const slug = normalized
    .normalize('NFKD') // Normalize Unicode (e.g., é -> e)
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Keep only letters, numbers, spaces, hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
    .substring(0, 60); // Limit length
  
  return slug || 'product'; // Fallback if still empty
}

// Generate product URL with slug for SEO (format: /product/slug-id)
export function getProductUrl(id: string, name: string): string {
  const slug = generateSlug(name)
  return `/product/${slug}-${id}`
}

// Extract ID from slug-id format
export function extractIdFromSlug(slugId: string): string {
  // Check if it's just an ID (24 characters, no hyphens in between or old format)
  if (slugId.length === 24 && /^[a-f0-9]{24}$/i.test(slugId)) {
    return slugId; // It's just a MongoDB ID
  }
  
  // Get the last segment after the last hyphen (assuming it's the ID)
  const parts = slugId.split('-');
  const lastPart = parts[parts.length - 1];
  
  // MongoDB IDs are typically 24 characters
  if (lastPart.length === 24 && /^[a-f0-9]{24}$/i.test(lastPart)) {
    return lastPart;
  }
  
  // If not found at end, return the whole string (fallback)
  return slugId;
}
