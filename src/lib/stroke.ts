/* The Steady stroke as the live state of the taster: the gradient inside the
   brand mark flows fast when the visitor is spiralling and settles as they calm.
   Pure logic here; drawing lives in components/Stroke.tsx. Same curve as the app. */
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

export type StrokeInput = {
  distress?: number | null;
  userSpeaking?: boolean;
  steadySpeaking?: boolean;
  paused?: boolean;
  connection?: "idle" | "connecting" | "connected";
};

/* distress 0..1 from valence and arousal, the same reading the app's live curve uses */
export function distressFrom(s: { valence: number; arousal: number } | null): number | null {
  if (!s || typeof s.valence !== "number") return null;
  return clamp(0.5 - s.valence * 0.45 + s.arousal * 0.2, 0, 1);
}

/* How hard the stroke should be flowing right now, 0.05..1. */
export function strokeTarget({ distress = null, userSpeaking = false, steadySpeaking = false, paused = false, connection = "connected" }: StrokeInput = {}): number {
  let t = distress == null ? 0.2 : distress;
  if (userSpeaking) t += 0.15;      // a voice in the room lifts it
  if (steadySpeaking) t *= 0.7;     // Steady's voice settles it
  if (connection === "connecting") t = 0.12;
  if (paused) t = 0.08;
  return clamp(t, 0.05, 1);
}

/* Ease level toward target: quick to rise (about a second), slow to settle (about seven). */
export function step(level: number, target: number, dt: number): number {
  const tau = level < target ? 1.2 : 7.0;
  return level + (target - level) * (1 - Math.exp(-dt / tau));
}

/* One shared state for the page: VoiceHero writes, Stroke reads every frame. */
const S = { input: {} as StrokeInput, level: 0.15 };
export const stroke = {
  state(patch: StrokeInput) { S.input = { ...S.input, ...patch }; },
  feel(reading: { valence: number; arousal: number } | null) { const d = distressFrom(reading); if (d != null) S.input = { ...S.input, distress: d }; },
  reset() { S.input = {}; S.level = 0.15; },
  tick(dt: number) { S.level = step(S.level, strokeTarget(S.input), dt); return S.level; },
  level() { return S.level; },
};
