export type ShippingQuote = {
  cost: number;
  eta: string;
};

const REGION_BASE: Record<string, number> = {
  rm: 4990,
  v: 6990,
  viii: 7990,
};

export function estimateShipping(region: string, subtotal: number, weightKg: number): ShippingQuote {
  const normalized = region.toLowerCase();
  const base = REGION_BASE[normalized] ?? 9900;
  const weightFactor = weightKg > 5 ? Math.ceil(weightKg - 5) * 1500 : 0;
  const discount = subtotal > 1500000 ? 0.4 : subtotal > 800000 ? 0.25 : subtotal > 400000 ? 0.15 : 0;
  const cost = Math.max(0, Math.round((base + weightFactor) * (1 - discount)));
  const eta = normalized === "rm" ? "24-48 horas" : "3-5 dias";
  return { cost, eta };
}
