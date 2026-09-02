const KEYWORD_MAP: { class: string; label: string; keywords: string[] }[] = [
  { class: "METAL", label: "Metal", keywords: ["metal", "demir", "fe", "al", "alüminyum", "çelik", "alaşım", "krom", "bakır"] },
  { class: "PLASTIC", label: "Plastik", keywords: ["plastik", "pet", "polimer", "naylon", "pvc"] },
  { class: "ORGANIC", label: "Organik", keywords: ["organik", "biyo", "kompost", "gıda"] },
  { class: "CHEMICAL", label: "Kimyasal", keywords: ["kimyasal", "asit", "solvent", "çözelti"] },
  { class: "TEXTILE", label: "Tekstil", keywords: ["tekstil", "kumaş", "iplik", "pamuk"] },
  { class: "GLASS", label: "Cam", keywords: ["cam", "silika"] },
  { class: "PAPER", label: "Kağıt", keywords: ["kağıt", "selüloz", "karton"] },
];

export interface ClassifyResult {
  materialClass: string;
  label: string;
  confidence: number;
}

// Lightweight keyword-based stand-in for the AI /classify endpoint (no backend available on the frontend).
export function mockClassify(text: string): ClassifyResult {
  const lower = text.toLowerCase();
  for (const entry of KEYWORD_MAP) {
    const hit = entry.keywords.find((kw) => lower.includes(kw));
    if (hit) {
      const confidence = 0.78 + Math.min(0.2, hit.length / 50);
      return { materialClass: entry.class, label: entry.label, confidence };
    }
  }
  return { materialClass: "OTHER", label: "Diğer", confidence: 0.42 };
}
