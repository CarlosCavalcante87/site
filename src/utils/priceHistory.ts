export interface PriceHistoryPoint {
  date: string; // ISO format or YYYY-MM-DD
  label: string; // e.g. "25 Ago", "02 Set"
  price: number;
}

/**
 * Deterministic pseudo-random number generator based on a string seed.
 * Ensures the same product always generates the exact same realistic historical curve.
 */
function seededRandom(seedStr: string) {
  let h = 0x811c9dc5;
  for (let i = 0; i < seedStr.length; i++) {
    h ^= seedStr.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

/**
 * Generates an automatic, realistic price history curve over the specified days.
 * The curve matches realistic e-commerce price patterns (anchored at originalPrice or higher past price,
 * showing realistic promotional fluctuations, and finishing at current price).
 */
export function generateAutomaticPriceHistory(
  productId: string,
  currentPrice: number,
  originalPrice?: number,
  days: number = 30
): PriceHistoryPoint[] {
  const rng = seededRandom(`${productId}-${days}`);
  const now = new Date();
  const points: PriceHistoryPoint[] = [];

  // Determine starting baseline price (originalPrice or ~25% higher than current price)
  const basePrice = originalPrice && originalPrice > currentPrice
    ? originalPrice
    : Number((currentPrice * (1.2 + rng() * 0.15)).toFixed(2));

  // We generate ~7 to 10 key inflection points over the timeframe to produce the natural wave
  const numSteps = Math.min(Math.max(Math.round(days / 4), 7), 12);
  const stepInterval = days / (numSteps - 1);

  // Generate intermediate points mimicking typical discount curves
  // 1. Starts high
  // 2. Small dip
  // 3. Rebounds slightly
  // 4. Promo drop
  // 5. Normalizes higher
  // 6. Drops down
  // 7. Ends at current lowest price
  const curveMultipliers = [
    1.0,           // Day 0 (30 days ago) - Full price
    0.92,          // Slight promotion
    0.96,          // Back up
    0.85,          // Promo dip
    0.98,          // Flash spike
    0.78,          // Big offer
    0.86,          // Rebound
    0.70,          // Final major discount
  ];

  for (let i = 0; i < numSteps; i++) {
    const dayOffset = Math.round(days - i * stepInterval);
    const pointDate = new Date(now);
    pointDate.setDate(now.getDate() - Math.max(0, dayOffset));

    const dayName = pointDate.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
    }).replace('.', '');

    if (i === numSteps - 1) {
      // Last point is strictly today's current price
      points.push({
        date: pointDate.toISOString().split('T')[0],
        label: 'Hoje',
        price: Number(currentPrice.toFixed(2)),
      });
    } else {
      // Interpolate between basePrice and currentPrice with curve shape + small seed jitter
      const progress = i / (numSteps - 1);
      const curveIndex = Math.min(
        Math.floor((i / (numSteps - 1)) * curveMultipliers.length),
        curveMultipliers.length - 1
      );
      const multiplier = curveMultipliers[curveIndex];
      const jitter = (rng() - 0.5) * 0.05;

      // Blend from basePrice down toward currentPrice
      const theoreticalPrice = basePrice * (multiplier + jitter);
      // Ensure it stays at or above currentPrice before the final day
      const safePrice = Math.max(currentPrice * 1.02, theoreticalPrice);

      points.push({
        date: pointDate.toISOString().split('T')[0],
        label: dayName,
        price: Number(safePrice.toFixed(2)),
      });
    }
  }

  return points;
}
