import type { BeautyProfile } from "@/data/lookLab";

export type FaceTrackingProvider = {
  isAvailable: () => boolean;
  start: (video: HTMLVideoElement) => Promise<void>;
  stop: () => void;
};

export type MakeupTryOnProvider = {
  isAvailable: () => boolean;
  apply: (region: "lips" | "eyes" | "cheeks", color: string) => Promise<void>;
};

export type HairColourProvider = {
  isAvailable: () => boolean;
  apply: (hex: string) => Promise<void>;
};

export type NailTryOnProvider = {
  isAvailable: () => boolean;
  apply: (designId: string) => Promise<void>;
};

export type TransformationProvider = {
  isAvailable: () => boolean;
  transform: (imageBlob: Blob, profile: BeautyProfile) => Promise<Blob>;
};

export type FaceAnalysisProvider = {
  isAvailable: () => boolean;
  analyse: (imageBlob: Blob) => Promise<Partial<BeautyProfile>>;
};

const unavailable = { isAvailable: () => false };

export const providers = {
  faceTracking: unavailable as FaceTrackingProvider,
  makeup: unavailable as MakeupTryOnProvider,
  hairColour: unavailable as HairColourProvider,
  nailTryOn: unavailable as NailTryOnProvider,
  transformation: unavailable as TransformationProvider,
  faceAnalysis: unavailable as FaceAnalysisProvider,
};

export function track(event: string, payload?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  const w = window as unknown as { plausible?: (e: string, o?: { props: Record<string, unknown> }) => void; gtag?: (...args: unknown[]) => void };
  if (w.plausible) w.plausible(event, payload ? { props: payload } : undefined);
  else if (w.gtag) w.gtag("event", event, payload ?? {});
}
