"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Camera, Image as ImageIcon, RotateCcw, SwitchCamera, X } from "lucide-react";

type Mode = "idle" | "camera" | "preview" | "error";

const MAX_BYTES = 8 * 1024 * 1024;
const ACCEPT = ["image/jpeg", "image/png", "image/webp"];

export default function PhotoStudio({
  photoDataUrl,
  onPhoto,
  onClear,
  onSkip,
  analysisNote,
}: {
  photoDataUrl: string | null;
  onPhoto: (dataUrl: string) => void;
  onClear: () => void;
  onSkip: () => void;
  analysisNote?: { kind: "loading" | "success" | "error"; message: string } | null;
}) {
  const [mode, setMode] = useState<Mode>(photoDataUrl ? "preview" : "idle");
  const [facing, setFacing] = useState<"user" | "environment">("user");
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  useEffect(() => () => stopStream(), [stopStream]);

  const startCamera = useCallback(async () => {
    setError(null);
    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Camera isn't available in this browser. You can upload a photo instead.");
      setMode("error");
      return;
    }
    try {
      stopStream();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing, width: { ideal: 1280 }, height: { ideal: 1280 } },
        audio: false,
      });
      streamRef.current = stream;
      setMode("camera");
      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => undefined);
        }
      });
    } catch (e) {
      const msg = (e as Error).message?.includes("Permission")
        ? "Camera permission was denied. Allow access in your browser settings or upload a photo instead."
        : "We couldn't reach your camera. You can upload a photo instead.";
      setError(msg);
      setMode("error");
    }
  }, [facing, stopStream]);

  const capture = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const w = video.videoWidth || 720;
    const h = video.videoHeight || 720;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    if (facing === "user") {
      ctx.translate(w, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0, w, h);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    stopStream();
    onPhoto(dataUrl);
    setMode("preview");
  }, [facing, onPhoto, stopStream]);

  const onFile = useCallback(
    async (file: File | null) => {
      if (!file) return;
      if (!ACCEPT.includes(file.type)) {
        setError("Please choose a JPG, PNG or WEBP image.");
        setMode("error");
        return;
      }
      if (file.size > MAX_BYTES) {
        setError("That image is over 8 MB. Try a smaller file.");
        setMode("error");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          onPhoto(reader.result);
          setMode("preview");
        }
      };
      reader.readAsDataURL(file);
    },
    [onPhoto],
  );

  const openPicker = () => {
    fileInputRef.current?.click();
  };

  const flip = () => {
    setFacing((f) => (f === "user" ? "environment" : "user"));
  };

  useEffect(() => {
    if (mode === "camera") startCamera();
  }, [facing, mode, startCamera]);

  return (
    <div className="rounded-[2rem] border border-salonGold/30 bg-salonBlack/40 p-6 shadow-soft backdrop-blur">
      {/* Always-mounted file input — sr-only style so .click() opens the OS picker reliably */}
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPT.join(",")}
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0] ?? null;
          e.target.value = "";
          onFile(file);
        }}
      />

      {mode === "idle" && (
        <div className="grid gap-4 md:grid-cols-3">
          <button
            type="button"
            onClick={() => setMode("camera")}
            className="focus-ring group flex flex-col items-center gap-3 rounded-2xl border border-salonGold/30 bg-white/8 p-6 text-white transition hover:-translate-y-0.5 hover:bg-salonPink/20"
          >
            <Camera className="h-7 w-7 text-salonGold" />
            <p className="font-serif text-xl">Use Camera</p>
            <p className="text-sm text-white/70">Front or rear camera with positioning guide.</p>
          </button>
          <button
            type="button"
            onClick={openPicker}
            className="focus-ring group flex flex-col items-center gap-3 rounded-2xl border border-salonGold/30 bg-white/8 p-6 text-white transition hover:-translate-y-0.5 hover:bg-salonPink/20"
          >
            <ImageIcon className="h-7 w-7 text-salonGold" />
            <p className="font-serif text-xl">Upload Photo</p>
            <p className="text-sm text-white/70">JPG, PNG or WEBP up to 8 MB.</p>
          </button>
          <button
            type="button"
            onClick={onSkip}
            className="focus-ring group flex flex-col items-center gap-3 rounded-2xl border border-white/20 bg-white/4 p-6 text-white transition hover:-translate-y-0.5 hover:border-salonGold/40"
          >
            <RotateCcw className="h-7 w-7 text-blush" />
            <p className="font-serif text-xl">Continue Without Photo</p>
            <p className="text-sm text-white/70">Build your look from the consultation only.</p>
          </button>
        </div>
      )}

      {mode === "camera" && (
        <div className="relative">
          <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-2xl border border-salonGold/40 bg-black">
            <video
              ref={videoRef}
              playsInline
              muted
              className={`h-full w-full object-cover ${facing === "user" ? "[transform:scaleX(-1)]" : ""}`}
            />
            <div className="pointer-events-none absolute inset-0 grid place-items-center">
              <div className="h-3/4 w-2/3 rounded-[50%] border-2 border-dashed border-white/40" />
            </div>
          </div>
          <canvas ref={canvasRef} className="hidden" />
          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={flip}
              className="focus-ring inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white"
            >
              <SwitchCamera className="h-4 w-4" /> Flip
            </button>
            <button
              type="button"
              onClick={capture}
              className="focus-ring shine inline-flex items-center gap-2 rounded-full bg-gold-gradient px-6 py-3 font-semibold text-salonBlack"
            >
              <Camera className="h-4 w-4" /> Capture
            </button>
            <button
              type="button"
              onClick={() => {
                stopStream();
                setMode("idle");
              }}
              className="focus-ring inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white"
            >
              <X className="h-4 w-4" /> Cancel
            </button>
          </div>
        </div>
      )}

      {mode === "preview" && photoDataUrl && (
        <div>
          <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-2xl border border-salonGold/40 bg-black">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photoDataUrl} alt="Your photo preview" className="h-full w-full object-cover" />
          </div>
          <div className="mx-auto mt-4 max-w-md rounded-2xl border border-salonGold/30 bg-salonPink/15 p-4 text-sm leading-6 text-white/85">
            {analysisNote?.kind === "loading" && (
              <p className="font-semibold text-blush">{analysisNote.message}</p>
            )}
            {analysisNote?.kind === "success" && (
              <>
                <p className="font-semibold text-blush">Photo analysed.</p>
                <p className="mt-1 text-white/75">{analysisNote.message}</p>
              </>
            )}
            {analysisNote?.kind === "error" && (
              <>
                <p className="font-semibold text-blush">Photo saved as your reference.</p>
                <p className="mt-1 text-white/75">{analysisNote.message}</p>
              </>
            )}
            {!analysisNote && (
              <>
                <p className="font-semibold text-blush">Photo saved as your reference.</p>
                <p className="mt-1 text-white/75">
                  Tap <strong className="text-white">Continue</strong> — we&rsquo;ll suggest a starting profile from the
                  photo on the next step. Your photo travels with the booking message so the salon team sees what you
                  had in mind.
                </p>
              </>
            )}
          </div>
          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                onClear();
                setMode("idle");
              }}
              className="focus-ring inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white"
            >
              <RotateCcw className="h-4 w-4" /> Replace
            </button>
            <button
              type="button"
              onClick={openPicker}
              className="focus-ring inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white"
            >
              <ImageIcon className="h-4 w-4" /> Upload different
            </button>
          </div>
        </div>
      )}

      {mode === "error" && (
        <div className="text-center">
          <p className="font-serif text-2xl text-white">We hit a snag</p>
          <p className="mt-2 text-white/70">{error}</p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={openPicker}
              className="focus-ring shine inline-flex items-center gap-2 rounded-full bg-gold-gradient px-5 py-3 font-semibold text-salonBlack"
            >
              <ImageIcon className="h-4 w-4" /> Upload a Photo Instead
            </button>
            <button
              type="button"
              onClick={() => setMode("idle")}
              className="focus-ring inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      <p className="mt-4 text-center text-xs text-white/55">
        Your photo is used only to create your beauty preview. Analysis runs entirely in your browser. It will not be
        uploaded unless you choose to save your look or send it to the salon.
      </p>
    </div>
  );
}
