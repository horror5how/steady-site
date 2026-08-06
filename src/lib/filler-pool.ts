/* Emotion-matched holding lines for the homepage voice taster — a port of the
   product's filler system (steady-erp-voice-fresh/public/filler-lines.mjs +
   sentiment-engine.mjs) so both surfaces speak from the same 36-line pool and
   the same baked Cedar clips. Keep the two pools identical: the mp3s here are
   copied from the product's bake.

   Sentiment: VADER-style lexicon scoring (Hutto & Gilbert 2014) with negation
   flip and booster window, mapped onto the Russell circumplex (valence ×
   arousal) — distressed, depleted, energised, calm, neutral — with confession
   and shame markers outranking the raw score as "tender". */

type Line = { file: string; text: string };

export const FILLER_POOL: Record<string, Line[]> = {
  distressed: [
    { file: "distressed-1", text: "Okay. I'm right here with you." },
    { file: "distressed-2", text: "That sounds really intense. Stay with me." },
    { file: "distressed-3", text: "I hear how fast that's racing. Give me a second." },
    { file: "distressed-4", text: "Alright. Let's slow this down together." },
    { file: "distressed-5", text: "I can hear the worry in that. One moment." },
    { file: "distressed-6", text: "That's a lot hitting you at once. Let me think." },
  ],
  depleted: [
    { file: "depleted-1", text: "That's heavy. Let me sit with it for a moment." },
    { file: "depleted-2", text: "I hear you. That sounds really hard." },
    { file: "depleted-3", text: "Thank you for saying that out loud. Give me a moment." },
    { file: "depleted-4", text: "Mmm. That's been weighing on you." },
    { file: "depleted-5", text: "I'm taking that in. It matters." },
    { file: "depleted-6", text: "That can't be easy to carry. Let me think about what you just said." },
  ],
  tender: [
    { file: "tender-1", text: "Thank you for trusting me with that." },
    { file: "tender-2", text: "That took courage to say. Give me a second." },
    { file: "tender-3", text: "I'm really glad you told me. Let me take that in." },
    { file: "tender-4", text: "There's no judgement here. One moment." },
    { file: "tender-5", text: "That's a brave thing to share. Let me think." },
    { file: "tender-6", text: "I hear you, and it's okay. Give me a moment with that." },
  ],
  calm: [
    { file: "calm-1", text: "That's good to hear. Let me think about that." },
    { file: "calm-2", text: "Mmm, I like that. Give me a second." },
    { file: "calm-3", text: "That sounds like a settled place to be. One moment." },
    { file: "calm-4", text: "Good. Let me take that in properly." },
    { file: "calm-5", text: "That's really something. Let me think for a moment." },
    { file: "calm-6", text: "I'm glad. Give me a second with that." },
  ],
  energised: [
    { file: "energised-1", text: "Oh, that's brilliant. Give me a second." },
    { file: "energised-2", text: "I love hearing that. Let me think." },
    { file: "energised-3", text: "That's wonderful. Let me take it in." },
    { file: "energised-4", text: "Ha, that's great. One moment." },
    { file: "energised-5", text: "Now that's good news. Let me think about that." },
    { file: "energised-6", text: "That energy is lovely to hear. Give me a moment." },
  ],
  neutral: [
    { file: "neutral-1", text: "Good question. Let me think." },
    { file: "neutral-2", text: "Let me think about what you just said." },
    { file: "neutral-3", text: "Okay, give me a second." },
    { file: "neutral-4", text: "Right. Let me take that in." },
    { file: "neutral-5", text: "Mmm, let me think that through." },
    { file: "neutral-6", text: "One moment. I want to answer that properly." },
  ],
};

// word → [valence -4..4, arousal 0..1] — same entries as the product's engine.
const LEXICON: Record<string, [number, number]> = {
  terrified: [-3.4, 0.9], panic: [-3.0, 0.92], panicking: [-3.0, 0.92],
  scared: [-2.2, 0.78], afraid: [-2.2, 0.74], anxious: [-2.0, 0.72],
  anxiety: [-2.0, 0.7], dread: [-2.6, 0.7], overwhelmed: [-2.2, 0.74],
  spiralling: [-2.4, 0.8], spiraling: [-2.4, 0.8], freaking: [-2.4, 0.85],
  furious: [-2.8, 0.88], angry: [-2.3, 0.8], rage: [-2.9, 0.9],
  hate: [-2.7, 0.75], disgusting: [-2.4, 0.6], unbearable: [-3.0, 0.78],
  desperate: [-2.7, 0.78], crisis: [-2.6, 0.8], nightmare: [-2.6, 0.72],
  sad: [-2.1, 0.35], hopeless: [-3.1, 0.3], empty: [-2.2, 0.25],
  numb: [-1.9, 0.2], tired: [-1.3, 0.2], exhausted: [-1.9, 0.22],
  drained: [-1.8, 0.22], lonely: [-2.2, 0.32], depressed: [-2.7, 0.28],
  miserable: [-2.6, 0.35], worthless: [-3.0, 0.35], useless: [-2.5, 0.35],
  ashamed: [-2.3, 0.45], guilty: [-2.1, 0.45], stuck: [-1.6, 0.35],
  trapped: [-2.4, 0.55], alone: [-1.9, 0.3], flat: [-1.2, 0.18],
  low: [-1.4, 0.25], down: [-1.4, 0.28], awful: [-2.4, 0.5],
  terrible: [-2.4, 0.5], horrible: [-2.5, 0.55], bad: [-1.6, 0.45],
  worse: [-1.9, 0.5], worst: [-2.6, 0.55], crying: [-2.0, 0.55],
  struggling: [-1.8, 0.5], failing: [-2.1, 0.5], failure: [-2.4, 0.45],
  pointless: [-2.5, 0.3], burden: [-2.6, 0.4], dirty: [-1.7, 0.5],
  contaminated: [-2.2, 0.6], wrong: [-1.6, 0.45], scary: [-2.0, 0.7],
  replaying: [-1.6, 0.6], overthinking: [-1.8, 0.65], looping: [-1.6, 0.6],
  racing: [-1.9, 0.75], argument: [-1.5, 0.6], fight: [-1.8, 0.65],
  checking: [-1.3, 0.55], rumination: [-1.7, 0.55], ruminating: [-1.7, 0.55],
  worried: [-1.8, 0.6], worry: [-1.8, 0.6], stress: [-1.9, 0.65],
  stressed: [-1.9, 0.68], upset: [-1.9, 0.6], hurt: [-2.0, 0.55],
  pain: [-2.1, 0.55], suffering: [-2.5, 0.5], intrusive: [-1.5, 0.55],
  calm: [1.9, 0.15], calmer: [1.9, 0.15], peaceful: [2.2, 0.12],
  relieved: [2.1, 0.3], relief: [2.1, 0.3], settled: [1.6, 0.2],
  steady: [1.4, 0.2], okay: [0.9, 0.25], ok: [0.9, 0.25], fine: [0.8, 0.25],
  better: [1.7, 0.35], lighter: [1.6, 0.3], safe: [1.8, 0.25],
  rested: [1.6, 0.15], comfortable: [1.7, 0.2], grateful: [2.3, 0.35],
  happy: [2.4, 0.6], glad: [2.0, 0.5], excited: [2.3, 0.8],
  proud: [2.3, 0.55], hopeful: [2.2, 0.5], great: [2.5, 0.6],
  amazing: [2.8, 0.7], love: [2.7, 0.6], loved: [2.6, 0.55],
  wonderful: [2.7, 0.6], good: [1.9, 0.45], win: [2.2, 0.65],
  won: [2.2, 0.65], progress: [1.8, 0.45], managed: [1.5, 0.4],
  laughing: [2.4, 0.7], enjoyed: [2.1, 0.5], brilliant: [2.6, 0.6],
};

const BOOSTERS = new Set(["very", "really", "so", "extremely", "incredibly", "completely", "totally", "absolutely", "utterly", "deeply"]);
const DAMPENERS = new Set(["slightly", "somewhat", "kinda", "kind", "little", "bit", "barely", "less", "marginally"]);
const NEGATIONS = new Set(["not", "no", "never", "dont", "cant", "cannot", "wont", "isnt", "wasnt", "couldnt", "wouldnt", "didnt", "aint", "hardly", "without"]);

const TENDER_MARKERS = [
  /never told (anyone|any one|a soul|anybody)/,
  /(so|really|deeply) embarrass/,
  /embarrassing|embarrassed|humiliat/,
  /asham|shame/,
  /don'?t judge|no judgement|think less of me/,
  /my secret|a secret i/,
  /confess/,
  /disgust(ed|ing) (with|at|by) myself/,
  /hard (for me )?to (say|admit)/,
  /can'?t believe i'?m (telling|saying)/,
];

export function classifyFeeling(text: string): string {
  const raw = String(text || "").toLowerCase();
  if (TENDER_MARKERS.some((m) => m.test(raw))) return "tender";
  const tokens = raw.replace(/[^a-z' !]/g, " ").split(/\s+/).map((t) => t.replace(/'/g, "")).filter(Boolean);
  let sum = 0;
  const arousals: number[] = [];
  for (let i = 0; i < tokens.length; i++) {
    const entry = LEXICON[tokens[i]];
    if (!entry) continue;
    let [valence, arousal] = entry;
    let boost = 0;
    let negated = false;
    for (let j = Math.max(0, i - 3); j < i; j++) {
      if (BOOSTERS.has(tokens[j])) boost += 0.293;
      if (DAMPENERS.has(tokens[j])) boost -= 0.293;
      if (NEGATIONS.has(tokens[j])) negated = true;
    }
    valence = valence > 0 ? valence + boost : valence - boost;
    if (negated) valence *= -0.74;
    sum += valence;
    arousals.push(arousal);
  }
  const valence = sum / Math.sqrt(sum * sum + 15);
  const exclaims = Math.min(3, (raw.match(/!/g) || []).length);
  let arousal = arousals.length ? arousals.reduce((a, b) => a + b, 0) / arousals.length : 0.35;
  arousal = Math.max(0, Math.min(1, arousal + exclaims * 0.06));
  if (valence < -0.15) return arousal >= 0.5 ? "distressed" : "depleted";
  if (valence > 0.15) return arousal >= 0.5 ? "energised" : "calm";
  return "neutral";
}

/* Random within the matched category, never repeating either of the last two
   lines from that category. */
const recentByCategory: Record<string, string[]> = {};

export function pickFiller(text: string): { category: string; text: string; src: string } {
  const category = classifyFeeling(text);
  const pool = FILLER_POOL[category] || FILLER_POOL.neutral;
  const recent = recentByCategory[category] || [];
  const candidates = pool.filter((l) => !recent.includes(l.file));
  const chosen = candidates[Math.floor(Math.random() * candidates.length)];
  recentByCategory[category] = [chosen.file, recent[0]].filter(Boolean) as string[];
  return { category, text: chosen.text, src: `/hero-audio/${chosen.file}.mp3` };
}

export function allFillerClips(): string[] {
  return Object.values(FILLER_POOL).flat().map((l) => `/hero-audio/${l.file}.mp3`);
}
