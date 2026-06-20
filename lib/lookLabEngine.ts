import {
  BeautyProfile,
  CategoryId,
  LookRecommendation,
  SelectedLook,
  StyleLevel,
  lookCatalog,
} from "@/data/lookLab";

const STYLE_ORDER: StyleLevel[] = ["natural", "soft", "elegant", "glamorous", "dramatic"];

export function scoreRecommendation(rec: LookRecommendation, profile: BeautyProfile): number {
  let score = 0;

  if (profile.occasion && rec.occasions.includes(profile.occasion)) score += 6;

  if (rec.styleLevels.includes(profile.styleLevel)) score += 5;
  else {
    const target = STYLE_ORDER.indexOf(profile.styleLevel);
    const nearest = Math.min(...rec.styleLevels.map((s) => Math.abs(STYLE_ORDER.indexOf(s) - target)));
    score += Math.max(0, 3 - nearest);
  }

  if (rec.maintenance.includes(profile.maintenance)) score += 3;

  if (profile.faceShape && profile.faceShape !== "unsure" && rec.faceShapes?.includes(profile.faceShape)) score += 3;
  if (profile.undertone && profile.undertone !== "unsure" && rec.undertones?.includes(profile.undertone)) score += 3;
  if (profile.hairLength && rec.hairLengths?.includes(profile.hairLength)) score += 2;
  if (profile.hairTexture && rec.hairTextures?.includes(profile.hairTexture)) score += 2;

  return score;
}

export function getRecommendations(
  category: CategoryId,
  profile: BeautyProfile,
  filters: string[] = [],
  catalog: LookRecommendation[] = lookCatalog,
): LookRecommendation[] {
  const filtered = catalog.filter((r) => r.category === category);
  const tagged = filters.length
    ? filtered.filter((r) => filters.every((f) => r.tags.includes(f)))
    : filtered;
  return tagged
    .map((r) => ({ r, s: scoreRecommendation(r, profile) }))
    .sort((a, b) => b.s - a.s)
    .map((entry) => entry.r);
}

function bestForCategory(
  category: CategoryId,
  profile: BeautyProfile,
  catalog: LookRecommendation[],
  exclude: string[] = [],
): LookRecommendation | undefined {
  return getRecommendations(category, profile, [], catalog).find((r) => !exclude.includes(r.id));
}

export function buildLookDeck(
  profile: BeautyProfile,
  count = 20,
  catalog: LookRecommendation[] = lookCatalog,
): SelectedLook[] {
  const styleRotation: StyleLevel[] = ["soft", "elegant", "glamorous", "dramatic", "natural"];
  const deck: SelectedLook[] = [];
  const seen = new Set<string>();
  for (let i = 0; i < count; i++) {
    const styleLevel = styleRotation[i % styleRotation.length];
    const variant: BeautyProfile = { ...profile, styleLevel };
    const offset = Math.floor(i / styleRotation.length);
    const pick = (cat: CategoryId, off: number): LookRecommendation | undefined => {
      const list = getRecommendations(cat, variant, [], catalog);
      if (list.length === 0) return undefined;
      return list[off % list.length];
    };
    const look: SelectedLook = {
      hairstyle: pick("hairstyle", offset),
      "hair-color": pick("hair-color", offset),
      makeup: pick("makeup", offset),
      lips: pick("lips", offset),
      "nail-design": pick("nail-design", offset),
      "nail-shape": pick("nail-shape", offset),
      lashes: pick("lashes", offset),
      eyebrows: pick("eyebrows", offset),
      ...(profile.occasion === "bridal" || profile.occasion === "engagement"
        ? { accessory: pick("accessory", offset) }
        : {}),
    };
    const fingerprint = [look.hairstyle?.id, look["hair-color"]?.id, look.makeup?.id, look["nail-design"]?.id].join("|");
    if (seen.has(fingerprint)) continue;
    seen.add(fingerprint);
    deck.push(look);
  }
  return deck;
}

export function buildFahitaChoice(
  profile: BeautyProfile,
  catalog: LookRecommendation[] = lookCatalog,
): { safe: SelectedLook; perfectMatch: SelectedLook; daring: SelectedLook } {
  const safeProfile: BeautyProfile = { ...profile, styleLevel: "soft", maintenance: "easy" };
  const daringProfile: BeautyProfile = { ...profile, styleLevel: "dramatic", maintenance: "high" };

  const assemble = (p: BeautyProfile): SelectedLook => ({
    hairstyle: bestForCategory("hairstyle", p, catalog),
    "hair-color": bestForCategory("hair-color", p, catalog),
    makeup: bestForCategory("makeup", p, catalog),
    lips: bestForCategory("lips", p, catalog),
    "nail-design": bestForCategory("nail-design", p, catalog),
    "nail-shape": bestForCategory("nail-shape", p, catalog),
    eyebrows: bestForCategory("eyebrows", p, catalog),
    lashes: bestForCategory("lashes", p, catalog),
    ...(profile.occasion === "bridal" || profile.occasion === "engagement"
      ? { accessory: bestForCategory("accessory", p, catalog) }
      : {}),
  });

  return {
    safe: assemble(safeProfile),
    perfectMatch: assemble(profile),
    daring: assemble(daringProfile),
  };
}

export function lookTotals(look: SelectedLook) {
  const items = Object.values(look).filter(Boolean) as LookRecommendation[];
  const minutes = items.reduce((sum, item) => sum + (item.durationMin ?? 0), 0);
  return { itemCount: items.length, minutes };
}

export function buildWhatsAppMessage(look: SelectedLook, profile: BeautyProfile, language: "en" | "ar" = "en"): string {
  const parts: string[] = [];
  if (language === "ar") {
    parts.push("مرحبًا، صمّمت إطلالة من Fahita Look Lab وأرغب بحجز استشارة.");
    if (profile.occasion) parts.push(`المناسبة: ${profile.occasion}`);
    if (look.hairstyle) parts.push(`تسريحة الشعر: ${look.hairstyle.name}`);
    if (look["hair-color"]) parts.push(`لون الشعر: ${look["hair-color"].name}`);
    if (look.makeup) parts.push(`المكياج: ${look.makeup.name}`);
    if (look.lips) parts.push(`لون الشفاه: ${look.lips.name}`);
    if (look["nail-design"]) parts.push(`تصميم الأظافر: ${look["nail-design"].name}`);
    if (look["nail-shape"]) parts.push(`شكل الأظافر: ${look["nail-shape"].name}`);
    if (look.lashes) parts.push(`الرموش: ${look.lashes.name}`);
    if (look.eyebrows) parts.push(`الحواجب: ${look.eyebrows.name}`);
    if (look.accessory) parts.push(`إكسسوار العروس: ${look.accessory.name}`);
    parts.push("التاريخ المفضل:");
    parts.push("ملاحظات:");
    return parts.join("\n");
  }
  parts.push("Hello, I created a look using Fahita Look Lab and would like to book a consultation.");
  if (profile.occasion) parts.push(`Occasion: ${profile.occasion}`);
  if (look.hairstyle) parts.push(`Hairstyle: ${look.hairstyle.name}`);
  if (look["hair-color"]) parts.push(`Hair colour: ${look["hair-color"].name}`);
  if (look.makeup) parts.push(`Makeup: ${look.makeup.name}`);
  if (look.lips) parts.push(`Lip colour: ${look.lips.name}`);
  if (look["nail-design"]) parts.push(`Nails: ${look["nail-design"].name}`);
  if (look["nail-shape"]) parts.push(`Nail shape: ${look["nail-shape"].name}`);
  if (look.lashes) parts.push(`Lashes: ${look.lashes.name}`);
  if (look.eyebrows) parts.push(`Eyebrows: ${look.eyebrows.name}`);
  if (look.accessory) parts.push(`Accessory: ${look.accessory.name}`);
  parts.push("Preferred date:");
  parts.push("Additional notes:");
  return parts.join("\n");
}
