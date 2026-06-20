"use client";

import { AnimatePresence, motion, PanInfo, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import {
  ArrowLeft,
  Bookmark,
  Calendar,
  CheckCircle2,
  Clock,
  Heart,
  Image as ImageIcon,
  MessageCircle,
  RefreshCw,
  Settings2,
  Share2,
  Sparkles,
  Sparkle,
  Eye,
  Hand,
  Scissors,
  Wand2,
  X,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BeautyProfile,
  CategoryId,
  LookRecommendation,
  Occasion,
  StyleLevel,
  getLookImageUrl,
  lookCatalog,
  occasions,
  styleLevelOptions,
} from "@/data/lookLab";
import { getRecommendations } from "@/lib/lookLabEngine";
import { track } from "@/lib/lookLabProviders";
import { whatsappHref } from "@/data/site";

const PhotoStudio = dynamic(() => import("@/components/look-lab/PhotoStudio"), {
  ssr: false,
  loading: () => (
    <div className="rounded-[2rem] border border-salonGold/30 bg-salonBlack/40 p-10 text-center text-white/60">
      Loading photo studio…
    </div>
  ),
});

type SwipeCategory = "hairstyle" | "nail-design" | "makeup" | "lashes-brows";

type SavedItem = {
  id: string;
  rec: LookRecommendation;
  savedAt: number;
};

type AnalysisNote = { kind: "loading" | "success" | "error"; message: string };

const STORAGE_KEY_SAVED = "fahita-look-lab.saved.v2";
const STORAGE_KEY_PROFILE = "fahita-look-lab.profile";

const DEFAULT_PROFILE: BeautyProfile = {
  occasion: "surprise",
  styleLevel: "elegant",
  maintenance: "moderate",
};

const SWIPE_THRESHOLD = 110;

const CATEGORY_META: Record<
  SwipeCategory,
  { label: string; icon: typeof Scissors; description: string; cover: string }
> = {
  hairstyle: {
    label: "Hairstyle",
    icon: Scissors,
    description: "Cut, finish, updo or wave.",
    cover: "/look-lab/h-soft-waves.jpg",
  },
  "nail-design": {
    label: "Nails",
    icon: Hand,
    description: "Design, finish, shape.",
    cover: "/look-lab/nd-bridal-pearl.jpg",
  },
  makeup: {
    label: "Makeup",
    icon: Wand2,
    description: "From natural glow to full glam.",
    cover: "/look-lab/m-bridal-glow.jpg",
  },
  "lashes-brows": {
    label: "Lashes & Brows",
    icon: Eye,
    description: "Lift, define, frame.",
    cover: "/look-lab/ls-volume.jpg",
  },
};

function buildCategoryDeck(category: SwipeCategory, profile: BeautyProfile): LookRecommendation[] {
  if (category === "lashes-brows") {
    const lashes = getRecommendations("lashes", profile, [], lookCatalog);
    const brows = getRecommendations("eyebrows", profile, [], lookCatalog);
    // Interleave so users see variety
    const out: LookRecommendation[] = [];
    const max = Math.max(lashes.length, brows.length);
    for (let i = 0; i < max; i++) {
      if (lashes[i]) out.push(lashes[i]);
      if (brows[i]) out.push(brows[i]);
    }
    return out;
  }
  return getRecommendations(category, profile, [], lookCatalog);
}

function buildWhatsAppFromSaved(items: SavedItem[], profile: BeautyProfile): string {
  const lines: string[] = [
    "Hello, I created a look using Fahita Look Lab and would like to book a consultation.",
  ];
  if (profile.occasion) lines.push(`Occasion: ${profile.occasion}`);
  if (items.length === 0) {
    lines.push("(no items saved yet)");
  } else {
    items.forEach((s) => {
      const cat = s.rec.category;
      const catLabel = cat === "eyebrows" ? "Brows" : cat === "lashes" ? "Lashes" : cat === "hairstyle" ? "Hairstyle" : cat === "makeup" ? "Makeup" : cat === "nail-design" ? "Nails" : cat;
      lines.push(`${catLabel}: ${s.rec.name}`);
    });
  }
  lines.push("Preferred date:");
  lines.push("Additional notes:");
  return lines.join("\n");
}

export default function LookSwipeFeed() {
  const reduceMotion = useReducedMotion();
  const [profile, setProfile] = useState<BeautyProfile>(DEFAULT_PROFILE);
  const [view, setView] = useState<"menu" | "swipe">("menu");
  const [category, setCategory] = useState<SwipeCategory>("hairstyle");
  const [index, setIndex] = useState(0);
  const [saved, setSaved] = useState<SavedItem[]>([]);
  const [showSaved, setShowSaved] = useState(false);
  const [showRefine, setShowRefine] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const [analysisNote, setAnalysisNote] = useState<AnalysisNote | null>(null);
  const [flashIcon, setFlashIcon] = useState<"save" | "pass" | null>(null);
  const [shareStatus, setShareStatus] = useState<string | null>(null);

  const deck = useMemo(() => buildCategoryDeck(category, profile), [category, profile]);
  const remaining = deck.slice(index, index + 3);

  useEffect(() => {
    try {
      const rawProfile = localStorage.getItem(STORAGE_KEY_PROFILE);
      if (rawProfile) setProfile((p) => ({ ...p, ...JSON.parse(rawProfile) }));
      const rawSaved = localStorage.getItem(STORAGE_KEY_SAVED);
      if (rawSaved) {
        const parsed = JSON.parse(rawSaved);
        if (Array.isArray(parsed)) {
          // Drop any malformed entries (e.g. left over from an earlier shape)
          const clean = parsed.filter((s): s is SavedItem => Boolean(s && s.rec && s.rec.category && s.rec.id));
          setSaved(clean);
        }
      }
      // Clear out the old key explicitly so it doesn't keep tripping things
      localStorage.removeItem("fahita-look-lab.saved");
      localStorage.removeItem("fahita-look-lab.saved-looks");
    } catch {
      /* ignore */
    }
    track("look_lab_opened", { mode: "swipe-category" });
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
    } catch {
      /* ignore */
    }
  }, [profile]);

  const persistSaved = (next: SavedItem[]) => {
    setSaved(next);
    try {
      localStorage.setItem(STORAGE_KEY_SAVED, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  const enterCategory = (c: SwipeCategory) => {
    setCategory(c);
    setIndex(0);
    setView("swipe");
    track("recommendation_viewed", { category: c });
  };

  const exitToMenu = () => setView("menu");

  const advance = () => setIndex((i) => i + 1);

  const onSave = useCallback(() => {
    const top = deck[index];
    if (!top) return;
    // De-dupe: don't add the same rec twice
    if (saved.some((s) => s.rec.id === top.id)) {
      advance();
      return;
    }
    const id = `s-${Date.now()}-${index}`;
    persistSaved([{ id, rec: top, savedAt: Date.now() }, ...saved].slice(0, 40));
    track("look_saved", { category: top.category, id: top.id });
    setFlashIcon("save");
    window.setTimeout(() => setFlashIcon(null), 400);
    advance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deck, index, saved]);

  const onPass = useCallback(() => {
    if (!deck[index]) return;
    setFlashIcon("pass");
    window.setTimeout(() => setFlashIcon(null), 300);
    advance();
  }, [deck, index]);

  const restart = () => setIndex(0);

  const setOccasion = (o: Occasion) => {
    setProfile((p) => ({ ...p, occasion: o }));
    setIndex(0);
  };

  const setStyle = (s: StyleLevel) => {
    setProfile((p) => ({ ...p, styleLevel: s }));
    setIndex(0);
  };

  const handlePhoto = (url: string) => {
    setPhoto(url);
    track("photo_uploaded", { source: "swipe-refine" });
    setAnalysisNote({ kind: "loading", message: "Analysing locally…" });
    import("@/lib/faceLandmarker")
      .then(({ analyseFaceFromDataUrl }) => analyseFaceFromDataUrl(url))
      .then((result) => {
        if (!result.detected) {
          setAnalysisNote({ kind: "error", message: "No face detected, but your photo is saved as a reference." });
          return;
        }
        const accepted: string[] = [];
        const patch: Partial<BeautyProfile> = {};
        if (result.faceShape && result.faceShape !== "unsure") {
          patch.faceShape = result.faceShape;
          accepted.push(`face ${result.faceShape}`);
        }
        if (result.eyeShape && result.eyeShape !== "unsure") {
          patch.eyeShape = result.eyeShape;
          accepted.push(`eyes ${result.eyeShape}`);
        }
        if (accepted.length === 0) {
          setAnalysisNote({ kind: "error", message: "Couldn't read features clearly. Refine manually if you'd like." });
          return;
        }
        setProfile((p) => ({ ...p, ...patch }));
        setIndex(0);
        setAnalysisNote({ kind: "success", message: `Updated: ${accepted.join(" · ")}. Cards refreshed.` });
      })
      .catch(() => setAnalysisNote({ kind: "error", message: "Local analysis didn't load. Keep refining manually." }));
  };

  const shareDeck = async () => {
    if (saved.length === 0) return;
    track("look_shared");
    const text = buildWhatsAppFromSaved(saved, profile);
    const sharable = typeof navigator !== "undefined"
      ? (navigator as Navigator & { share?: (data: ShareData) => Promise<void> }).share
      : undefined;
    if (sharable) {
      try {
        await sharable.call(navigator, { title: "My Fahita Looks", text });
        setShareStatus("Shared via your device.");
        return;
      } catch {
        /* user cancelled */
      }
    }
    try {
      await navigator.clipboard.writeText(text);
      setShareStatus("Look list copied.");
    } catch {
      setShareStatus("Copy the list manually from your saved tray.");
    }
  };

  const deckEmpty = !deck[index];
  const bookHrefAll = whatsappHref(buildWhatsAppFromSaved(saved, profile));

  return (
    <section className="relative isolate min-h-screen overflow-hidden bg-[#120709] text-white">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%,rgba(255,235,170,0.18),transparent 38%),radial-gradient(circle at 18% 28%,rgba(228,0,124,0.22),transparent 36%),radial-gradient(circle at 82% 30%,rgba(246,198,207,0.14),transparent 32%),radial-gradient(circle at 50% 92%,rgba(141,68,40,0.32),transparent 46%),linear-gradient(180deg,#0a0405 0%,#1b0a10 55%,#0a0405 100%)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 -z-10"
        style={{
          background: "linear-gradient(180deg,transparent,rgba(141,68,40,0.45) 45%,rgba(50,20,10,0.6))",
        }}
        aria-hidden
      />

      <div className="section-shell flex min-h-screen flex-col pb-10 pt-28 lg:pt-32">
        <TopBar
          view={view}
          category={category}
          savedCount={saved.length}
          onBack={exitToMenu}
          onOpenSaved={() => setShowSaved(true)}
          onOpenRefine={() => setShowRefine(true)}
          occasion={profile.occasion}
          styleLevel={profile.styleLevel}
        />

        {view === "menu" ? (
          <CategoryMenu onPick={enterCategory} profile={profile} />
        ) : (
          <>
            <div className="relative mt-6 flex flex-1 flex-col items-center justify-center">
              {deckEmpty ? (
                <EmptyDeck
                  onRestart={restart}
                  onBack={exitToMenu}
                  savedCount={saved.length}
                  onOpenSaved={() => setShowSaved(true)}
                />
              ) : (
                <CardStack
                  cards={remaining}
                  flashIcon={flashIcon}
                  reduceMotion={!!reduceMotion}
                  onSave={onSave}
                  onPass={onPass}
                />
              )}
            </div>

            {!deckEmpty && (
              <ActionDock
                onPass={onPass}
                onSave={onSave}
                position={index + 1}
                total={deck.length}
              />
            )}
          </>
        )}
      </div>

      <AnimatePresence>
        {showSaved && (
          <SavedTray
            saved={saved}
            shareStatus={shareStatus}
            bookHrefAll={bookHrefAll}
            onBookClick={() => track("booking_started", { source: "saved-tray-all" })}
            onShare={shareDeck}
            onRemove={(id) => persistSaved(saved.filter((s) => s.id !== id))}
            onClear={() => persistSaved([])}
            onClose={() => setShowSaved(false)}
            reduceMotion={!!reduceMotion}
          />
        )}
        {showRefine && (
          <RefineDrawer
            profile={profile}
            onOccasion={setOccasion}
            onStyle={setStyle}
            photo={photo}
            analysisNote={analysisNote}
            onPhoto={handlePhoto}
            onClearPhoto={() => {
              setPhoto(null);
              setAnalysisNote(null);
            }}
            onClose={() => setShowRefine(false)}
            reduceMotion={!!reduceMotion}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

function TopBar({
  view,
  category,
  savedCount,
  onBack,
  onOpenSaved,
  onOpenRefine,
  occasion,
  styleLevel,
}: {
  view: "menu" | "swipe";
  category: SwipeCategory;
  savedCount: number;
  onBack: () => void;
  onOpenSaved: () => void;
  onOpenRefine: () => void;
  occasion?: Occasion;
  styleLevel: StyleLevel;
}) {
  const occasionLabel = occasions.find((o) => o.id === occasion)?.title ?? "Surprise me";
  const styleLabel = styleLevelOptions.find((s) => s.id === styleLevel)?.label ?? "Elegant";
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        {view === "swipe" && (
          <button
            type="button"
            onClick={onBack}
            aria-label="Back to categories"
            className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-full border border-salonGold/40 bg-white/8 text-white"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
        )}
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-salonGold">Fahita Look Lab</p>
          <h1 className="mt-1 font-serif text-2xl leading-tight sm:text-3xl">
            {view === "menu" ? (
              <>Pick a category <span className="text-blush">·</span> {occasionLabel} / {styleLabel}</>
            ) : (
              <>{CATEGORY_META[category].label} <span className="text-blush">·</span> {occasionLabel} / {styleLabel}</>
            )}
          </h1>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenRefine}
          className="focus-ring inline-flex items-center gap-2 rounded-full border border-salonGold/40 bg-white/8 px-3 py-2 text-sm font-semibold text-white"
        >
          <Settings2 className="h-4 w-4" /> Refine
        </button>
        <button
          type="button"
          onClick={onOpenSaved}
          className="focus-ring relative inline-flex items-center gap-2 rounded-full bg-gold-gradient px-4 py-2 text-sm font-semibold text-salonBlack shadow-gold"
        >
          <Bookmark className="h-4 w-4" /> Saved
          {savedCount > 0 && (
            <span className="ml-1 inline-grid h-5 min-w-5 place-items-center rounded-full bg-salonBlack px-1.5 text-xs font-semibold text-salonGold">
              {savedCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

function CategoryMenu({ onPick, profile }: { onPick: (c: SwipeCategory) => void; profile: BeautyProfile }) {
  const items: SwipeCategory[] = ["hairstyle", "nail-design", "makeup", "lashes-brows"];
  return (
    <div className="mt-10 flex flex-1 flex-col items-center">
      <p className="max-w-xl text-center text-white/70">
        Choose what to design first. Swipe right on anything you love — saved looks travel with you across categories
        and book in one WhatsApp message.
      </p>
      <div className="mt-8 grid w-full max-w-3xl grid-cols-1 gap-5 sm:grid-cols-2">
        {items.map((cat) => (
          <CategoryTile key={cat} category={cat} onPick={() => onPick(cat)} profile={profile} />
        ))}
      </div>
    </div>
  );
}

function CategoryTile({
  category,
  onPick,
  profile,
}: {
  category: SwipeCategory;
  onPick: () => void;
  profile: BeautyProfile;
}) {
  const meta = CATEGORY_META[category];
  const Icon = meta.icon;
  // Pick a fresh hero from the deck so tiles refresh with profile changes
  const heroDeck = useMemo(() => buildCategoryDeck(category, profile).slice(0, 6), [category, profile]);
  const count = heroDeck.length;
  return (
    <button
      type="button"
      onClick={onPick}
      className="focus-ring group relative aspect-[16/10] w-full overflow-hidden rounded-[1.8rem] border border-salonGold/40 bg-salonBlack text-left shadow-gold transition hover:-translate-y-1 hover:shadow-[0_30px_60px_rgba(228,0,124,0.35)]"
    >
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={meta.cover}
          alt={meta.label}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,5,0.15)_0%,transparent_30%,rgba(5,5,5,0.92)_100%)]" />
      <div className="absolute inset-x-5 bottom-5 text-white">
        <div className="flex items-center gap-2 text-salonGold">
          <Icon className="h-4 w-4" />
          <p className="text-[10px] font-semibold uppercase tracking-[0.32em]">Swipe to discover</p>
        </div>
        <h2 className="mt-1 font-serif text-3xl leading-tight">{meta.label}</h2>
        <p className="mt-1 text-sm text-white/75">{meta.description}</p>
        <p className="mt-3 text-xs text-blush">{count} options ready</p>
      </div>
      <span className="pointer-events-none absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full bg-gold-gradient text-salonBlack shadow-gold">
        <Sparkle className="h-4 w-4" />
      </span>
    </button>
  );
}

function CardStack({
  cards,
  flashIcon,
  reduceMotion,
  onSave,
  onPass,
}: {
  cards: LookRecommendation[];
  flashIcon: "save" | "pass" | null;
  reduceMotion: boolean;
  onSave: () => void;
  onPass: () => void;
}) {
  return (
    <div className="relative h-[68vh] max-h-[640px] w-full max-w-md">
      {cards
        .slice(0, 3)
        .map((rec, depth) => {
          const z = 30 - depth;
          if (depth === 0) {
            return (
              <SwipeCard
                key={rec.id + "-top"}
                rec={rec}
                flashIcon={flashIcon}
                reduceMotion={reduceMotion}
                onSave={onSave}
                onPass={onPass}
                zIndex={z}
              />
            );
          }
          return (
            <div
              key={rec.id + "-" + depth}
              className="absolute inset-0 origin-center"
              style={{
                transform: `translateY(${depth * 14}px) scale(${1 - depth * 0.04})`,
                zIndex: z,
                opacity: 1 - depth * 0.2,
              }}
            >
              <CardSurface rec={rec} isStatic />
            </div>
          );
        })
        .reverse()}
    </div>
  );
}

function SwipeCard({
  rec,
  flashIcon,
  reduceMotion,
  onSave,
  onPass,
  zIndex,
}: {
  rec: LookRecommendation;
  flashIcon: "save" | "pass" | null;
  reduceMotion: boolean;
  onSave: () => void;
  onPass: () => void;
  zIndex: number;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-18, 0, 18]);
  const opacityLike = useTransform(x, [40, 140], [0, 1]);
  const opacityPass = useTransform(x, [-140, -40], [1, 0]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x > SWIPE_THRESHOLD) onSave();
    else if (info.offset.x < -SWIPE_THRESHOLD) onPass();
    else x.set(0);
  };

  return (
    <motion.div
      className="absolute inset-0"
      style={{ x, rotate, zIndex }}
      drag={reduceMotion ? false : "x"}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={onDragEnd}
      initial={false}
    >
      <CardSurface rec={rec} />
      {!reduceMotion && (
        <>
          <motion.div
            style={{ opacity: opacityLike }}
            className="pointer-events-none absolute left-6 top-6 rounded-full border-4 border-salonGold bg-salonBlack/70 px-4 py-2 font-serif text-2xl uppercase tracking-[0.18em] text-salonGold"
          >
            Save
          </motion.div>
          <motion.div
            style={{ opacity: opacityPass }}
            className="pointer-events-none absolute right-6 top-6 rounded-full border-4 border-white/80 bg-salonBlack/70 px-4 py-2 font-serif text-2xl uppercase tracking-[0.18em] text-white"
          >
            Pass
          </motion.div>
        </>
      )}
      {flashIcon === "save" && <FlashIcon kind="save" />}
      {flashIcon === "pass" && <FlashIcon kind="pass" />}
    </motion.div>
  );
}

function FlashIcon({ kind }: { kind: "save" | "pass" }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: [0, 1, 0], scale: [0.6, 1.2, 1.4] }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="pointer-events-none absolute inset-0 grid place-items-center"
    >
      {kind === "save" ? (
        <Heart className="h-32 w-32 fill-salonGold text-salonGold drop-shadow-[0_0_40px_rgba(228,0,124,0.7)]" />
      ) : (
        <X className="h-32 w-32 text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]" />
      )}
    </motion.div>
  );
}

function CardSurface({ rec, isStatic }: { rec: LookRecommendation; isStatic?: boolean }) {
  const categoryLabel =
    rec.category === "eyebrows" ? "Eyebrows" :
    rec.category === "lashes" ? "Lashes" :
    rec.category === "hairstyle" ? "Hairstyle" :
    rec.category === "makeup" ? "Makeup" :
    rec.category === "nail-design" ? "Nail Design" :
    rec.category;
  return (
    <VanityMirror isStatic={!!isStatic}>
      <div className="absolute inset-0">
        <LookImage rec={rec} className="h-full w-full" priority />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,5,0.32)_0%,transparent_28%,transparent_55%,rgba(5,5,5,0.94)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,rgba(255,255,255,0.18)_0%,transparent_22%,transparent_75%,rgba(255,209,220,0.10)_100%)]" />

      <div className="absolute inset-x-5 top-5 flex items-start justify-between gap-3 text-xs font-semibold uppercase tracking-[0.26em] text-salonGold">
        <span className="rounded-full border border-salonGold/55 bg-salonBlack/70 px-3 py-1 backdrop-blur">
          {categoryLabel}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full border border-salonGold/55 bg-salonBlack/70 px-3 py-1 text-white backdrop-blur">
          <Clock className="h-3 w-3" /> ~{rec.durationMin} min
        </span>
      </div>

      <div className="absolute inset-x-5 bottom-5 select-none">
        <h2 className="font-serif text-4xl leading-[1.04] text-white drop-shadow-[0_3px_18px_rgba(0,0,0,0.6)]">
          {rec.name}
        </h2>
        <p className="mt-2 text-sm text-white/80">{rec.description}</p>
        <p className="mt-3 text-xs text-blush">{rec.reason}</p>
      </div>
    </VanityMirror>
  );
}

function VanityMirror({ children, isStatic }: { children: React.ReactNode; isStatic: boolean }) {
  return (
    <div
      className={`relative h-full w-full ${isStatic ? "" : "cursor-grab active:cursor-grabbing"}`}
      style={{ filter: isStatic ? undefined : "drop-shadow(0 30px 70px rgba(228,0,124,0.45))" }}
    >
      <div
        className="absolute inset-0 rounded-[2.2rem] p-[14px]"
        style={{
          background: "linear-gradient(155deg,#f8d784 0%,#a37434 32%,#f6c065 52%,#7f4f1a 78%,#f1c777 100%)",
          boxShadow: "inset 0 0 0 1px rgba(255,239,200,0.6), inset 0 0 24px rgba(0,0,0,0.45), 0 32px 70px rgba(8,4,2,0.65)",
        }}
      >
        <div
          className="relative h-full w-full overflow-hidden rounded-[1.6rem] bg-salonBlack"
          style={{ boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.6), inset 0 0 28px rgba(0,0,0,0.5), inset 0 6px 30px rgba(255,255,255,0.08)" }}
        >
          {children}
        </div>
      </div>
      <BulbRing />
      <div
        className="pointer-events-none absolute -inset-x-6 -bottom-8 h-16 rounded-[50%] blur-2xl"
        style={{ background: "radial-gradient(ellipse,rgba(255,209,220,0.35),transparent_70%)" }}
        aria-hidden
      />
    </div>
  );
}

function BulbRing() {
  const topCount = 9;
  const sideCount = 4;
  return (
    <>
      <div className="pointer-events-none absolute inset-x-7 top-1 flex justify-between" aria-hidden>
        {Array.from({ length: topCount }).map((_, i) => (
          <Bulb key={`t${i}`} delay={i * 0.18} />
        ))}
      </div>
      <div className="pointer-events-none absolute inset-x-7 bottom-1 flex justify-between" aria-hidden>
        {Array.from({ length: topCount }).map((_, i) => (
          <Bulb key={`b${i}`} delay={i * 0.18 + 0.4} />
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-10 left-1 flex flex-col justify-between" aria-hidden>
        {Array.from({ length: sideCount }).map((_, i) => (
          <Bulb key={`l${i}`} delay={i * 0.22 + 0.1} />
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-10 right-1 flex flex-col justify-between" aria-hidden>
        {Array.from({ length: sideCount }).map((_, i) => (
          <Bulb key={`r${i}`} delay={i * 0.22 + 0.55} />
        ))}
      </div>
    </>
  );
}

function Bulb({ delay = 0 }: { delay?: number }) {
  return (
    <span className="relative inline-flex h-3 w-3 items-center justify-center">
      <span
        className="absolute -inset-2 rounded-full blur-md"
        style={{ background: "radial-gradient(circle,rgba(255,235,170,0.85),transparent_70%)", animation: `bulb-glow 3.6s ease-in-out ${delay}s infinite` }}
      />
      <span
        className="relative h-2.5 w-2.5 rounded-full"
        style={{
          background: "radial-gradient(circle at 35% 32%,#fff7c8,#f4c95a 60%,#9a6b18)",
          boxShadow: "0 0 6px rgba(255,235,170,0.9), 0 0 14px rgba(255,209,120,0.6)",
        }}
      />
    </span>
  );
}

function ActionDock({
  onPass,
  onSave,
  position,
  total,
}: {
  onPass: () => void;
  onSave: () => void;
  position: number;
  total: number;
}) {
  return (
    <div className="mt-6 flex flex-col items-center gap-3">
      <div className="flex items-center gap-4">
        <button
          type="button"
          aria-label="Pass on this look"
          onClick={onPass}
          className="focus-ring grid h-16 w-16 place-items-center rounded-full border-2 border-white/30 bg-salonBlack/70 text-white transition hover:-translate-y-0.5 hover:border-white/80"
        >
          <X className="h-7 w-7" />
        </button>
        <button
          type="button"
          aria-label="Save this look"
          onClick={onSave}
          className="focus-ring grid h-16 w-16 place-items-center rounded-full border-2 border-salonGold/60 bg-salonPink/15 text-salonGold transition hover:-translate-y-0.5 hover:border-salonGold"
        >
          <Heart className="h-7 w-7" />
        </button>
      </div>
      <p className="text-xs uppercase tracking-[0.32em] text-white/55">
        {position} / {total} · swipe or tap
      </p>
    </div>
  );
}

function EmptyDeck({
  onRestart,
  onBack,
  savedCount,
  onOpenSaved,
}: {
  onRestart: () => void;
  onBack: () => void;
  savedCount: number;
  onOpenSaved: () => void;
}) {
  return (
    <div className="rounded-[2rem] border border-dashed border-salonGold/40 bg-black/40 p-10 text-center">
      <Sparkles className="mx-auto h-10 w-10 text-salonGold" />
      <h2 className="mt-4 font-serif text-3xl text-white">You&rsquo;ve seen this category.</h2>
      <p className="mt-2 text-white/65">Reshuffle, jump to another category, or open your saved tray to book.</p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={onRestart}
          className="focus-ring shine inline-flex items-center gap-2 rounded-full bg-gold-gradient px-5 py-3 font-semibold text-salonBlack shadow-gold"
        >
          <RefreshCw className="h-4 w-4" /> Reshuffle
        </button>
        <button
          type="button"
          onClick={onBack}
          className="focus-ring inline-flex items-center gap-2 rounded-full border border-salonGold/40 bg-white/10 px-5 py-3 font-semibold text-white"
        >
          Pick another category
        </button>
        {savedCount > 0 && (
          <button
            type="button"
            onClick={onOpenSaved}
            className="focus-ring inline-flex items-center gap-2 rounded-full border border-salonGold/40 bg-white/10 px-5 py-3 font-semibold text-white"
          >
            <Bookmark className="h-4 w-4" /> Saved ({savedCount})
          </button>
        )}
      </div>
    </div>
  );
}

function SavedTray({
  saved,
  shareStatus,
  bookHrefAll,
  onBookClick,
  onShare,
  onRemove,
  onClear,
  onClose,
  reduceMotion,
}: {
  saved: SavedItem[];
  shareStatus: string | null;
  bookHrefAll: string;
  onBookClick: () => void;
  onShare: () => void;
  onRemove: (id: string) => void;
  onClear: () => void;
  onClose: () => void;
  reduceMotion: boolean;
}) {
  // Group by category
  const groups = saved.reduce<Record<string, SavedItem[]>>((acc, item) => {
    const key = item.rec.category;
    (acc[key] ||= []).push(item);
    return acc;
  }, {});
  const groupOrder: { id: CategoryId | "lashes-brows"; label: string }[] = [
    { id: "hairstyle", label: "Hairstyle" },
    { id: "nail-design", label: "Nails" },
    { id: "makeup", label: "Makeup" },
    { id: "lashes", label: "Lashes" },
    { id: "eyebrows", label: "Eyebrows" },
    { id: "hair-color", label: "Hair Colour" },
    { id: "lips", label: "Lip Colour" },
    { id: "nail-shape", label: "Nail Shape" },
    { id: "accessory", label: "Accessory" },
  ];

  return (
    <motion.div
      key="saved"
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={reduceMotion ? undefined : { opacity: 1 }}
      exit={reduceMotion ? undefined : { opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-salonBlack/85 backdrop-blur sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label="Saved items"
    >
      <motion.div
        initial={reduceMotion ? false : { y: 60 }}
        animate={reduceMotion ? undefined : { y: 0 }}
        exit={reduceMotion ? undefined : { y: 60 }}
        transition={{ type: "spring", stiffness: 220, damping: 28 }}
        className="relative max-h-[88vh] w-full max-w-3xl overflow-hidden rounded-t-[2rem] border border-salonGold/30 bg-salonBlack p-6 shadow-gold sm:rounded-[2rem]"
      >
        <header className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-salonGold">Beauty Passport</p>
            <h2 className="mt-1 font-serif text-3xl text-white">Saved items</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close saved tray"
            className="focus-ring rounded-full border border-white/30 bg-white/10 p-2 text-white"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
        </header>

        {saved.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-salonGold/30 p-8 text-center text-white/65">
            Tap the heart on anything you love. Saved items stay on this device and book in one WhatsApp message.
          </div>
        ) : (
          <div className="mt-5 max-h-[55vh] space-y-5 overflow-y-auto pr-1">
            {groupOrder
              .filter((g) => groups[g.id]?.length)
              .map((g) => (
                <div key={g.id}>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-salonGold">{g.label}</p>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    {groups[g.id].map((entry) => (
                      <article
                        key={entry.id}
                        className="grid grid-cols-[68px_1fr] gap-3 rounded-2xl border border-salonGold/25 bg-white/5 p-2"
                      >
                        <div className="overflow-hidden rounded-xl">
                          <LookImage rec={entry.rec} className="aspect-square h-full w-full" />
                        </div>
                        <div className="flex flex-col">
                          <h3 className="font-serif text-base text-white">{entry.rec.name}</h3>
                          <p className="mt-0.5 text-xs text-white/55">~{entry.rec.durationMin} min</p>
                          <button
                            type="button"
                            onClick={() => onRemove(entry.id)}
                            className="focus-ring mt-auto inline-flex items-center gap-1 self-start rounded-full border border-white/25 bg-white/8 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/80"
                          >
                            <X className="h-3 w-3" /> Remove
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        )}

        {saved.length > 0 && (
          <footer className="mt-5 flex flex-wrap items-center gap-3 border-t border-white/10 pt-4">
            <a
              href={bookHrefAll}
              target="_blank"
              rel="noreferrer"
              onClick={onBookClick}
              className="focus-ring shine inline-flex items-center gap-2 rounded-full bg-gold-gradient px-5 py-3 text-sm font-semibold text-salonBlack shadow-gold"
            >
              <MessageCircle className="h-4 w-4" /> Book all on WhatsApp
            </a>
            <button
              type="button"
              onClick={onShare}
              className="focus-ring inline-flex items-center gap-2 rounded-full border border-salonGold/40 bg-white/10 px-4 py-2 text-sm font-semibold text-white"
            >
              <Share2 className="h-4 w-4" /> Share list
            </button>
            <button
              type="button"
              onClick={onClear}
              className="focus-ring inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-white/70"
            >
              <X className="h-4 w-4" /> Clear all
            </button>
            {shareStatus && <span className="text-sm text-blush">{shareStatus}</span>}
          </footer>
        )}
      </motion.div>
    </motion.div>
  );
}

function RefineDrawer({
  profile,
  onOccasion,
  onStyle,
  photo,
  analysisNote,
  onPhoto,
  onClearPhoto,
  onClose,
  reduceMotion,
}: {
  profile: BeautyProfile;
  onOccasion: (o: Occasion) => void;
  onStyle: (s: StyleLevel) => void;
  photo: string | null;
  analysisNote: AnalysisNote | null;
  onPhoto: (url: string) => void;
  onClearPhoto: () => void;
  onClose: () => void;
  reduceMotion: boolean;
}) {
  const [tab, setTab] = useState<"vibe" | "photo">("vibe");
  return (
    <motion.div
      key="refine"
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={reduceMotion ? undefined : { opacity: 1 }}
      exit={reduceMotion ? undefined : { opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-salonBlack/85 backdrop-blur sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label="Refine your feed"
    >
      <motion.div
        initial={reduceMotion ? false : { y: 60 }}
        animate={reduceMotion ? undefined : { y: 0 }}
        exit={reduceMotion ? undefined : { y: 60 }}
        transition={{ type: "spring", stiffness: 220, damping: 28 }}
        className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-t-[2rem] border border-salonGold/30 bg-salonBlack p-6 shadow-gold sm:rounded-[2rem]"
      >
        <header className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-salonGold">Refine</p>
            <h2 className="mt-1 font-serif text-3xl text-white">Shape your feed</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close refine drawer"
            className="focus-ring rounded-full border border-white/30 bg-white/10 p-2 text-white"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
        </header>

        <div className="mt-5 flex gap-2" role="tablist" aria-label="Refine tabs">
          <button
            type="button"
            role="tab"
            aria-selected={tab === "vibe"}
            onClick={() => setTab("vibe")}
            className={`focus-ring rounded-full px-4 py-2 text-sm font-semibold transition ${
              tab === "vibe" ? "bg-gold-gradient text-salonBlack shadow-gold" : "border border-salonGold/30 bg-white/8 text-white"
            }`}
          >
            <Calendar className="mr-2 inline-block h-4 w-4" /> Vibe
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "photo"}
            onClick={() => setTab("photo")}
            className={`focus-ring rounded-full px-4 py-2 text-sm font-semibold transition ${
              tab === "photo" ? "bg-gold-gradient text-salonBlack shadow-gold" : "border border-salonGold/30 bg-white/8 text-white"
            }`}
          >
            <ImageIcon className="mr-2 inline-block h-4 w-4" /> Photo
          </button>
        </div>

        {tab === "vibe" && (
          <div className="mt-5 space-y-6">
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-[0.28em] text-salonGold">Occasion</h3>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {occasions.map((o) => {
                  const active = o.id === profile.occasion;
                  return (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => onOccasion(o.id)}
                      aria-pressed={active}
                      className={`focus-ring rounded-2xl border p-3 text-left transition ${
                        active
                          ? "border-salonGold bg-gold-gradient text-salonBlack shadow-gold"
                          : "border-salonGold/25 bg-white/8 text-white hover:border-salonGold/60"
                      }`}
                    >
                      <p className={`font-serif text-base ${active ? "text-salonBlack" : "text-white"}`}>{o.title}</p>
                      <p className={`text-xs ${active ? "text-salonBlack/75" : "text-white/65"}`}>{o.description}</p>
                    </button>
                  );
                })}
              </div>
            </section>

            <section>
              <h3 className="text-xs font-semibold uppercase tracking-[0.28em] text-salonGold">Mood</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {styleLevelOptions.map((s) => {
                  const active = s.id === profile.styleLevel;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => onStyle(s.id as StyleLevel)}
                      aria-pressed={active}
                      className={`focus-ring flex-1 rounded-2xl border px-3 py-3 text-center transition ${
                        active
                          ? "border-salonGold bg-gold-gradient text-salonBlack shadow-gold"
                          : "border-salonGold/25 bg-white/8 text-white hover:border-salonGold/60"
                      }`}
                    >
                      <p className={`font-serif text-base ${active ? "text-salonBlack" : "text-white"}`}>{s.label}</p>
                      <p className={`text-xs ${active ? "text-salonBlack/75" : "text-white/60"}`}>{s.description}</p>
                    </button>
                  );
                })}
              </div>
            </section>

            <p className="text-xs text-white/55">Changes refresh your feed instantly and reset position.</p>
          </div>
        )}

        {tab === "photo" && (
          <div className="mt-5 space-y-4">
            <p className="text-sm text-white/75">
              Optional. We&rsquo;ll analyse your photo locally with MediaPipe to suggest face shape and eye shape — these
              refine the look stack. Your photo never leaves the browser.
            </p>
            <PhotoStudio
              photoDataUrl={photo}
              onPhoto={onPhoto}
              onClear={onClearPhoto}
              onSkip={onClose}
              analysisNote={analysisNote}
            />
            {analysisNote?.kind === "success" && (
              <div className="rounded-2xl border border-salonGold/30 bg-salonPink/12 p-3 text-sm text-blush">
                <CheckCircle2 className="mr-2 inline-block h-4 w-4" />
                {analysisNote.message}
              </div>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

function LookImage({
  rec,
  className,
  priority,
}: {
  rec: LookRecommendation;
  className?: string;
  priority?: boolean;
}) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  const setImgRef = useCallback((node: HTMLImageElement | null) => {
    if (node && node.complete && node.naturalHeight > 0) {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    setLoaded(false);
    setErrored(false);
  }, [rec.id]);

  return (
    <div className={`relative overflow-hidden ${className ?? ""}`} style={{ background: rec.swatch }}>
      {!errored && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={setImgRef}
          src={getLookImageUrl(rec, { width: 800, height: 1000 })}
          alt={rec.name}
          loading={priority ? "eager" : "lazy"}
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
          className={`h-full w-full object-cover transition-opacity duration-700 ${loaded ? "opacity-100" : "opacity-0"}`}
        />
      )}
      {!loaded && !errored && (
        <div className="absolute inset-0 grid place-items-center bg-black/30" aria-hidden>
          <Sparkles className="h-7 w-7 animate-pulse text-salonGold" />
        </div>
      )}
    </div>
  );
}
