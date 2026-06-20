import type { FaceShape, EyeShape } from "@/data/lookLab";

export type FaceAnalysis = {
  faceShape?: FaceShape;
  eyeShape?: EyeShape;
  detected: boolean;
};

const WASM_BASE = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm";
const MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task";

type Landmark = { x: number; y: number; z: number };
type LandmarkerInstance = {
  detect: (image: HTMLImageElement | HTMLCanvasElement) => { faceLandmarks: Landmark[][] };
  close: () => void;
};

let landmarkerPromise: Promise<LandmarkerInstance> | null = null;

async function getLandmarker(): Promise<LandmarkerInstance> {
  if (!landmarkerPromise) {
    landmarkerPromise = (async () => {
      const vision = await import("@mediapipe/tasks-vision");
      const fileset = await vision.FilesetResolver.forVisionTasks(WASM_BASE);
      return (await vision.FaceLandmarker.createFromOptions(fileset, {
        baseOptions: { modelAssetPath: MODEL_URL, delegate: "GPU" },
        outputFaceBlendshapes: false,
        runningMode: "IMAGE",
        numFaces: 1,
      })) as unknown as LandmarkerInstance;
    })().catch((err) => {
      landmarkerPromise = null;
      throw err;
    });
  }
  return landmarkerPromise;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Image failed to load"));
    img.src = src;
  });
}

// Landmark index reference (MediaPipe FaceMesh 478-point):
// 10 = top of forehead   152 = chin bottom
// 234 = left cheek (face right edge from viewer perspective)
// 454 = right cheek (face left edge)
// 132 = left jaw   361 = right jaw
// 127 = left forehead corner   356 = right forehead corner
// Eye corners: left outer 33, left inner 133; right inner 362, right outer 263
// Eye top/bottom: left top 159, left bottom 145; right top 386, right bottom 374
function dist(a: Landmark, b: Landmark): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function classifyFaceShape(lm: Landmark[]): FaceShape {
  const top = lm[10];
  const chin = lm[152];
  const leftCheek = lm[234];
  const rightCheek = lm[454];
  const leftJaw = lm[132];
  const rightJaw = lm[361];
  const leftForehead = lm[127];
  const rightForehead = lm[356];

  const height = dist(top, chin);
  const cheekWidth = dist(leftCheek, rightCheek);
  const jawWidth = dist(leftJaw, rightJaw);
  const foreheadWidth = dist(leftForehead, rightForehead);

  if (!height || !cheekWidth) return "unsure";

  const heightToWidth = height / cheekWidth;
  const foreheadToCheek = foreheadWidth / cheekWidth;
  const jawToCheek = jawWidth / cheekWidth;

  // long & narrow
  if (heightToWidth > 1.55) return "oblong";

  // short / round vs square distinction
  if (heightToWidth < 1.25) {
    return jawToCheek > 0.92 ? "square" : "round";
  }

  // narrower forehead than cheeks, taper to chin → diamond
  if (foreheadToCheek < 0.85 && jawToCheek < 0.88) return "diamond";

  // wider forehead than jaw → heart
  if (foreheadToCheek > jawToCheek + 0.06) return "heart";

  // jaw close to cheek width, balanced height → square
  if (jawToCheek > 0.93 && heightToWidth < 1.42) return "square";

  return "oval";
}

function classifyEyeShape(lm: Landmark[]): EyeShape {
  // Average measurements across both eyes
  const leftOuter = lm[33];
  const leftInner = lm[133];
  const leftTop = lm[159];
  const leftBottom = lm[145];
  const rightInner = lm[362];
  const rightOuter = lm[263];
  const rightTop = lm[386];
  const rightBottom = lm[374];

  if (!leftOuter || !rightOuter) return "unsure";

  const leftWidth = dist(leftOuter, leftInner);
  const leftHeight = dist(leftTop, leftBottom);
  const rightWidth = dist(rightInner, rightOuter);
  const rightHeight = dist(rightTop, rightBottom);

  const width = (leftWidth + rightWidth) / 2;
  const height = (leftHeight + rightHeight) / 2;
  if (!width) return "unsure";

  const ratio = height / width;

  // Compare outer corner Y vs inner corner Y for tilt
  const leftTilt = leftOuter.y - leftInner.y;
  const rightTilt = rightOuter.y - rightInner.y;
  const tilt = (leftTilt + rightTilt) / 2;

  // very round (close to circle) eyes
  if (ratio > 0.42) return "round";
  // narrow tall slits or hooded — use ratio + tilt
  if (ratio < 0.28) return "monolid";
  if (tilt < -0.012) return "upturned";
  if (tilt > 0.012) return "downturned";
  // hooded check — crease very close to lash line is hard without depth; we treat as almond by default
  return "almond";
}

export async function analyseFaceFromDataUrl(dataUrl: string): Promise<FaceAnalysis> {
  const img = await loadImage(dataUrl);
  const landmarker = await getLandmarker();
  const result = landmarker.detect(img);
  const face = result.faceLandmarks?.[0];
  if (!face || face.length < 400) return { detected: false };
  return {
    detected: true,
    faceShape: classifyFaceShape(face),
    eyeShape: classifyEyeShape(face),
  };
}
