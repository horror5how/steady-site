"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { ph as phCapture } from "@/lib/analytics";

// ponytail: kept for when the product opens publicly; invite-only trial routes to /invite.
export const APP = "https://steady-erp-voice-fresh.vercel.app";
const VOICE_SECONDS = 150; // scripted intro is unhurried; no longer a hard 60s cut
const HARD_KILL = 200; // absolute failsafe
const MAX_TEXT_TURNS = 12;

/* The intro opens with two LOCKED lines (greeting, then name + what Steady is),
   spoken as clean Cedar audio via /api/hero-say. Every turn after that is a LIVE
   reply from /api/hero-brain — it answers what the person actually said, weaves in
   the empathy + mapping-system content at the right moment, and closes on signing
   up today. Cedar speaks every word; the realtime model only transcribes. */
const SCRIPT = {
  greeting:
    "Hi there. I'm Steady, and it's really good to have you here. Before we begin, what would you like me to call you?",
  explain: (name: string) =>
    `${name}. It's a real pleasure that you've come here to look into Steady. Let me tell you a little about me. ` +
    "I'm a science-backed, research-backed A.I., built to help people who are struggling with looping thoughts that don't seem to go away, " +
    "intrusive thoughts, rumination, the spirals that quietly pull you out of the present. " +
    "Do you have anything on your mind that you think you might need help with?",
};

// ponytail: naive spoken-first-name grab — strip lead-ins, take the salient word.
function extractName(text: string): string {
  let t = String(text || "").trim().replace(/[.!?,]+$/g, "");
  t = t.replace(/^(hi|hey|hello|yeah|yes|well|um|uh|so|ok|okay)[,\s]+/i, "");
  const m = t.match(/(?:call me|i am|i'?m|my name is|name'?s|it'?s|this is)\s+([A-Za-z][A-Za-z'-]*)/i);
  let name = (m ? m[1] : t.split(/\s+/).pop()) || "";
  name = name.replace(/[^A-Za-z'-]/g, "");
  if (!name) return "friend";
  return name.charAt(0).toUpperCase() + name.slice(1);
}


type Phase = "boot" | "ready" | "connecting" | "voice" | "text" | "done";
type Line = { who: "steady" | "you"; text: string };

const TYPED_GREETING =
  "No mic, no problem. Hey, I'm Steady. What's your name, or what would you like me to call you? I'm being trained to help people step out of looping thoughts and reassurance seeking, and live more in the present. What's on your mind today?";
const GOODBYE =
  "That's our first minute together. I'd love to keep going properly. Steady is invite-only while we're still testing, so apply for an invitation just above and I'll pick up where we left off.";
const RESTING =
  "My voice has done a lot of talking today and is having a rest. Type to me here, or come into the full app.";

/* Hero-taster events go through the shared PostHog client, which is already
   consent-gated. Tagging the source here keeps every existing funnel intact. */
function ph(event: string, props: Record<string, unknown> = {}) {
  phCapture(event, { ...props, source: "hero-taster" });
}

function pickVariant(): string {
  try {
    let v = localStorage.getItem("steady-hero-var");
    if (!v || !["mic-first", "question-first"].includes(v)) {
      v = Math.random() < 0.5 ? "mic-first" : "question-first";
      localStorage.setItem("steady-hero-var", v);
    }
    return v;
  } catch {
    return "mic-first";
  }
}

export default function VoiceHero() {
  const [phase, setPhase] = useState<Phase>("boot");
  const [lines, setLines] = useState<Line[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [micPaused, setMicPaused] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(VOICE_SECONDS);
  const [apiOk, setApiOk] = useState(true);
  const [needsTap, setNeedsTap] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);
  const micRef = useRef<MediaStream | null>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const wave = useRef({ amp: 0.07, phase: 0, speaking: false, userSpeaking: false, energy: 0 });
  const ttsRef = useRef<HTMLAudioElement | null>(null);
  const userDraft = useRef("");
  const introStep = useRef(0);
  const introName = useRef("");
  const introSpeaking = useRef(false);
  const variantRef = useRef("mic-first");
  const linesRef = useRef<Line[]>([]);
  const phaseRef = useRef<Phase>("boot");
  phaseRef.current = phase;
  linesRef.current = lines;

  const say = useCallback((who: Line["who"], text: string) => {
    setLines((l) => [...l, { who, text }]);
  }, []);

  /* every visit starts blank — the taster transcript is never carried anywhere,
     so no stale chat from a previous session can ever resurface */
  // ponytail: invite-only trial — every public CTA goes to the application, not the app.
  // Restore APP here when the product opens to the public.
  const ctaHref = useCallback(() => "/invite", []);

  /* ---------- wave canvas ---------- */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;

    const ribbon = (w: number, mid: number, amp: number, ph2: number, freq: number, off: number, color: string, glow: string, lw: number) => {
      ctx.beginPath();
      for (let x = 0; x <= w; x += 3) {
        const t = x / w;
        const env = Math.pow(Math.sin(Math.PI * t), 1.4);
        const y = mid + env * amp * (Math.sin(t * freq + ph2 + off) * 0.7 + Math.sin(t * freq * 0.5 - ph2 * 0.6 + off) * 0.3);
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.strokeStyle = color;
      ctx.lineWidth = lw;
      ctx.shadowColor = glow;
      ctx.shadowBlur = 14;
      ctx.stroke();
      ctx.shadowBlur = 0;
    };

    const render = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (canvas.width !== Math.round(w * dpr)) {
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const s = wave.current;
      // ponytail: line only comes alive when Steady speaks. Idle AND user-speaking = a steady, near-flat line.
      const target = s.speaking
        ? 0.55 + Math.min(0.35, s.energy * 6) + 0.12 * Math.sin(s.phase * 2.1)
        : 0.035;
      s.amp += (target - s.amp) * 0.08;
      s.phase += 0.035 + s.amp * 0.05;
      const mid = h / 2;
      const maxAmp = h * 0.42 * Math.min(1, s.amp);
      ribbon(w, mid, maxAmp, s.phase, 6.5, 0, "#2b3135", "rgba(109,117,123,0.4)", 1.7);
      ribbon(w, mid, maxAmp * 0.65, -s.phase * 0.8, 5.0, 1.7, "rgba(43,49,53,0.5)", "rgba(109,117,123,0.3)", 1.1);
      if (!reduced) raf = requestAnimationFrame(render);
    };
    render();
    if (reduced) {
      const id = setInterval(render, 800);
      return () => clearInterval(id);
    }
    return () => cancelAnimationFrame(raf);
  }, []);

  /* ---------- boot: warm the lambda, never block more than 4s ---------- */
  useEffect(() => {
    let alive = true;
    variantRef.current = pickVariant();
    const started = Date.now();
    const warm = fetch("/api/hero-session", { method: "GET" })
      .then((r) => r.json())
      .then((j) => Boolean(j?.ok))
      .catch(() => false);
    Promise.race([warm, new Promise<boolean>((res) => setTimeout(() => res(false), 4000))]).then((ok) => {
      if (!alive) return;
      const wait = Math.max(0, 1200 - (Date.now() - started));
      setTimeout(() => {
        if (!alive) return;
        setApiOk(ok);
        setPhase("ready");
        // start from blank: Steady has not spoken yet, so the chat shows nothing
        setLines(ok ? [] : [{ who: "steady", text: "I'm resting right now. Come meet me properly in the app, it's free." }]);
        ph("hero_ready", { api_ok: ok, variant: variantRef.current });
      }, wait);
    });
    return () => {
      alive = false;
    };
  }, []);

  /* ---------- fresh start on every visit: bfcache restores get a hard reload ---------- */
  useEffect(() => {
    const onShow = (e: PageTransitionEvent) => { if (e.persisted) window.location.reload(); };
    window.addEventListener("pageshow", onShow);
    return () => window.removeEventListener("pageshow", onShow);
  }, []);

  /* ---------- QA hook (read-only) ---------- */
  useEffect(() => {
    (window as unknown as Record<string, unknown>).__steadyHero = {
      get phase() { return phaseRef.current; },
      get lines() { return linesRef.current; },
      get wave() { return { ...wave.current }; },
    };
  }, []);

  /* ---------- autoscroll chat ---------- */
  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
  }, [lines, thinking]);

  /* ---------- voice session ---------- */
  const teardown = useCallback((goodbye: boolean) => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    try { dcRef.current?.close(); } catch {}
    try { pcRef.current?.close(); } catch {}
    try { ttsRef.current?.pause(); } catch {}
    introSpeaking.current = false;
    micRef.current?.getTracks().forEach((t) => t.stop());
    dcRef.current = null;
    pcRef.current = null;
    micRef.current = null;
    wave.current.speaking = false;
    wave.current.userSpeaking = false;
    if (goodbye) {
      setPhase("done");
      setLines((l) => [...l, { who: "steady", text: GOODBYE }]);
      ph("voice_completed", { variant: variantRef.current });
    }
  }, []);

  useEffect(() => () => teardown(false), [teardown]);

  // cost guard: end the session if the tab is hidden for 15s mid-voice
  useEffect(() => {
    const onVis = () => {
      if (document.hidden && phaseRef.current === "voice") {
        const t = setTimeout(() => {
          if (document.hidden && phaseRef.current === "voice") teardown(true);
        }, 15000);
        timersRef.current.push(t);
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [teardown]);

  const fallbackToText = useCallback((reason: string) => {
    teardown(false);
    setPhase("text");
    setLines((l) => [...l, { who: "steady", text: reason }]);
  }, [teardown]);

  /* ---------- intro engine: Cedar audio + live captions, mic muted while Steady speaks ---------- */
  const setMic = useCallback((on: boolean) => {
    const track = micRef.current?.getTracks?.()[0];
    if (track) track.enabled = on;
  }, []);

  /* update the newest line belonging to `who` (for live word-by-word captions) */
  const updateLast = useCallback((who: Line["who"], text: string) => {
    setLines((l) => {
      const copy = [...l];
      for (let i = copy.length - 1; i >= 0; i--) {
        if (copy[i].who === who) { copy[i] = { who, text }; return copy; }
      }
      return [...copy, { who, text }];
    });
  }, []);

  const heroSay = useCallback(async (line: string) => {
    say("steady", ""); // empty caption line; words appear as Steady speaks
    introSpeaking.current = true;
    wave.current.speaking = true;
    setMic(false); // no echo: the model must not hear and re-transcribe Steady's own voice
    let reveal: ReturnType<typeof setInterval> | null = null;
    try {
      const r = await fetch("/api/hero-say", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: line }),
      });
      if (!r.ok) throw new Error("say");
      const url = URL.createObjectURL(await r.blob());
      const a = new Audio(url);
      ttsRef.current = a;
      const words = line.split(/\s+/);
      const startReveal = () => {
        // pace the caption to the real audio duration; small tail so text never beats the voice
        const ms = Number.isFinite(a.duration) && a.duration > 1 ? (a.duration * 1000 * 0.96) / words.length : 320;
        let i = 0;
        reveal = setInterval(() => {
          i++;
          updateLast("steady", words.slice(0, i).join(" "));
          if (i >= words.length && reveal) { clearInterval(reveal); reveal = null; }
        }, ms);
      };
      await new Promise<void>((resolve) => {
        a.onloadedmetadata = () => {};
        a.onplaying = startReveal;
        a.onended = () => resolve();
        a.onerror = () => resolve();
        a.play().catch(() => { setNeedsTap(true); resolve(); });
      });
      URL.revokeObjectURL(url);
    } catch {
      // audio failed — show the full line so nothing is lost
    } finally {
      if (reveal) clearInterval(reveal);
      updateLast("steady", line);
      wave.current.speaking = false;
      introSpeaking.current = false;
      setMic(true);
    }
  }, [say, setMic, updateLast]);

  /* live brain turn: answer what they actually said, steer toward loop -> method -> signup */
  const brainTurn = useCallback(async (userText: string) => {
    setThinking(true);
    const history = linesRef.current
      .filter((l) => l.text)
      .map((l) => ({ role: l.who === "you" ? "user" : "assistant", content: l.text }));
    const last = history[history.length - 1];
    if (!(last?.role === "user" && last.content === userText)) history.push({ role: "user", content: userText });
    let reply: string | null = null;
    for (let attempt = 0; attempt < 2 && !reply; attempt++) {
      try {
        const r = await fetch("/api/hero-brain", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: history, name: introName.current }),
        });
        if (r.ok) reply = (await r.json()).reply;
        else if (r.status === 429 || r.status === 503) break;
      } catch {}
      if (!reply) await new Promise((res) => setTimeout(res, 700));
    }
    setThinking(false);
    await heroSay(reply || "I missed that — say it once more for me?");
  }, [heroSay]);

  const advanceIntro = useCallback((userText: string) => {
    if (introSpeaking.current) return;
    const step = introStep.current;
    if (step === 0) {
      introName.current = extractName(userText);
      try { if (introName.current) localStorage.setItem("steady-signup-name", introName.current); } catch {}
      introStep.current = 1;
      void heroSay(SCRIPT.explain(introName.current));
    } else {
      introStep.current = step + 1;
      void brainTurn(userText);
    }
  }, [heroSay, brainTurn]);

  const beginIntro = useCallback(() => {
    introStep.current = 0;
    introName.current = "";
    introSpeaking.current = false;
    void heroSay(SCRIPT.greeting);
  }, [heroSay]);

  /* mint + WebRTC connect with a placeholder transceiver; mic track swaps in when granted */
  const connectRealtime = useCallback(async () => {
    let devKey = "";
    try { devKey = localStorage.getItem("steady-dev-key") || ""; } catch {}
    const mintRes = await fetch("/api/hero-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(devKey ? { dev: devKey } : {}),
    });
    if (!mintRes.ok) {
      const err = (await mintRes.json().catch(() => ({})))?.error;
      throw Object.assign(new Error("mint"), { code: mintRes.status === 429 ? "limit" : err === "budget" ? "budget" : "mint" });
    }
    const { secret, model } = await mintRes.json();
    const pc = new RTCPeerConnection();
    pcRef.current = pc;
    const transceiver = pc.addTransceiver("audio", { direction: "sendrecv" });
    pc.onconnectionstatechange = () => {
      if (["failed", "disconnected", "closed"].includes(pc.connectionState) && phaseRef.current === "voice") {
        ph("voice_dropped", { variant: variantRef.current });
        fallbackToText("We lost the line. Type to me here instead.");
      }
    };
    pc.ontrack = (ev) => {
      const audio = audioRef.current || new Audio();
      audioRef.current = audio;
      audio.autoplay = true;
      audio.srcObject = ev.streams[0];
      audio.play().catch(() => setNeedsTap(true));
      try {
        const ac = new AudioContext();
        const src = ac.createMediaStreamSource(ev.streams[0]);
        const an = ac.createAnalyser();
        an.fftSize = 256;
        src.connect(an);
        const buf = new Uint8Array(an.frequencyBinCount);
        const poll = () => {
          if (!pcRef.current) return;
          an.getByteFrequencyData(buf);
          let sum = 0;
          for (let i = 0; i < buf.length; i++) sum += buf[i];
          wave.current.energy = sum / buf.length / 255;
          requestAnimationFrame(poll);
        };
        poll();
      } catch {} // analyser is a bonus; speaking flags carry the wave
    };

    const dc = pc.createDataChannel("oai-events");
    dcRef.current = dc;
    dc.onopen = () => {}; // model never speaks; the intro engine drives every turn
    dc.onmessage = (ev) => {
      let msg: { type?: string; transcript?: string; delta?: string } = {};
      try { msg = JSON.parse(ev.data); } catch { return; }
      const t = msg.type || "";
      if (t.endsWith("input_audio_transcription.delta") && msg.delta) {
        if (introSpeaking.current) return; // ignore any echo of Steady's own voice
        // live caption of the visitor's own words as they speak
        if (!userDraft.current) say("you", "");
        userDraft.current += msg.delta;
        updateLast("you", userDraft.current.trim());
      } else if (t.endsWith("input_audio_transcription.completed") && msg.transcript?.trim()) {
        if (introSpeaking.current) { userDraft.current = ""; return; }
        const text = msg.transcript.trim();
        if (userDraft.current) updateLast("you", text);
        else say("you", text);
        userDraft.current = "";
        advanceIntro(text);
      } else if (t === "input_audio_buffer.speech_started") {
        wave.current.userSpeaking = true;
      } else if (t === "input_audio_buffer.speech_stopped") {
        wave.current.userSpeaking = false;
      }
    };

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    const sdpRes = await fetch(`https://api.openai.com/v1/realtime/calls?model=${encodeURIComponent(model)}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/sdp" },
      body: offer.sdp,
    });
    if (!sdpRes.ok) throw new Error("sdp " + sdpRes.status);
    await pc.setRemoteDescription({ type: "answer", sdp: await sdpRes.text() });
    return transceiver;
  }, [say, fallbackToText, advanceIntro, updateLast]);

  const startVoice = useCallback(async () => {
    if (!apiOk) {
      window.location.href = "/invite";
      return;
    }
    setPhase("connecting");
    ph("mic_clicked", { variant: variantRef.current });
    // permission prompt and WebRTC handshake run in parallel: first word ~1s sooner
    const micPromise = navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
    const connectPromise = connectRealtime();
    let mic: MediaStream;
    try {
      mic = await micPromise;
      ph("mic_granted", { variant: variantRef.current });
    } catch {
      ph("mic_denied", { variant: variantRef.current });
      connectPromise.then(() => teardown(false)).catch(() => {});
      setPhase("text");
      say("steady", "All good, we can type instead. What's your name?");
      return;
    }
    micRef.current = mic;
    try {
      const transceiver = await connectPromise;
      await transceiver.sender.replaceTrack(mic.getTracks()[0]);

      setPhase("voice");
      ph("voice_started", { variant: variantRef.current });
      setSecondsLeft(VOICE_SECONDS);
      const startedAt = Date.now();
      const tick = setInterval(() => {
        const left = VOICE_SECONDS - Math.floor((Date.now() - startedAt) / 1000);
        setSecondsLeft(Math.max(0, left));
        if (left <= 0) clearInterval(tick);
      }, 1000);
      timersRef.current.push(tick as unknown as ReturnType<typeof setTimeout>);
      timersRef.current.push(setTimeout(() => teardown(false), HARD_KILL * 1000));
      beginIntro(); // scripted Cedar greeting starts now; the script ends the session itself
    } catch (e) {
      const code = (e as { code?: string })?.code;
      console.error("voice start failed", e);
      ph("voice_failed", { variant: variantRef.current, code: code || "unknown" });
      if (code === "limit") {
        fallbackToText("You've used today's free voice minutes on this connection. Type to me here, or open the full app for a real session.");
      } else if (code === "budget") {
        fallbackToText(RESTING);
      } else {
        fallbackToText("My voice is being shy right now. Type to me here instead. What's your name?");
      }
    }
  }, [apiOk, say, fallbackToText, teardown, connectRealtime, beginIntro]);

  /* ---------- text chat ---------- */
  const sendText = useCallback(async (raw: string) => {
    const text = raw.trim();
    if (!text || thinking) return;
    setInput("");
    if (phaseRef.current === "voice" || phaseRef.current === "connecting") teardown(false);
    if (phaseRef.current !== "text") setPhase("text");
    say("you", text);
    ph("text_message", { variant: variantRef.current });
    if (!apiOk) {
      say("steady", "I can't chat right here just now, but the full app is one tap away and free.");
      return;
    }
    const userTurns = lines.filter((l) => l.who === "you").length + 1;
    if (userTurns > MAX_TEXT_TURNS) {
      say("steady", "Let's keep this going properly in the app. It's free and I'll remember you.");
      setPhase("done");
      return;
    }
    setThinking(true);
    const history = [...lines, { who: "you" as const, text }]
      .filter((l) => l.text)
      .map((l) => ({ role: l.who === "you" ? "user" : "assistant", content: l.text }));
    let reply: string | null = null;
    for (let attempt = 0; attempt < 2 && !reply; attempt++) {
      try {
        const r = await fetch("/api/hero-chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: history }),
        });
        if (r.status === 429) {
          reply = "We've chatted a lot today from this connection. Come into the full app, it's free and has no taster limits.";
          break;
        }
        if (r.status === 503) {
          reply = RESTING;
          break;
        }
        if (r.ok) reply = (await r.json()).reply;
      } catch {}
      if (!reply) await new Promise((res) => setTimeout(res, 800));
    }
    setThinking(false);
    say("steady", reply || "I stumbled there. Try me again in a moment, or open the full app below.");
  }, [apiOk, lines, say, teardown, thinking]);

  const startTyping = useCallback(() => {
    setPhase("text");
    ph("type_clicked", { variant: variantRef.current });
    say("steady", TYPED_GREETING);
  }, [say]);

  const toggleMic = useCallback(() => {
    const track = micRef.current?.getTracks()[0];
    if (!track) return;
    track.enabled = !track.enabled;
    setMicPaused(!track.enabled);
  }, []);

  /* ---------- status line ---------- */
  const status =
    phase === "boot" ? "Steady is coming online. Give Steady a second, he's coming." :
    phase === "connecting" ? "Waking Steady's voice…" :
    phase === "voice" ? (wave.current.speaking ? "Steady is speaking." : "Steady is listening.") :
    phase === "text" ? "Steady is here." :
    phase === "done" ? "Come talk properly, it's free." :
    "Steady is here.";

  return (
    <>
      {/* ================= TOP: the minimal taster — first thing you see ================= */}
      <section className="flex min-h-[88svh] flex-col justify-center px-5 pb-10 pt-28 sm:pt-32">
        <div className="mx-auto flex w-full max-w-[720px] flex-col">
          {/* hero text — quiet, small */}
          <h1 className="text-center text-[40px] font-bold leading-[0.95] tracking-[-0.04em] text-ink sm:text-[52px] md:text-[60px]">
            A calm voice
            <br />
            for a loud mind.
          </h1>
          <p className="mx-auto mt-5 max-w-[440px] text-balance text-center text-[15px] leading-relaxed text-ink-soft sm:text-[16px]">
            Say what&apos;s looping — Steady talks you back into the present.
          </p>

          {/* the line */}
          <canvas ref={canvasRef} className="mt-16 h-[110px] w-full sm:mt-20 sm:h-[130px]" aria-hidden />
          <p className="mt-4 text-center text-[13.5px] text-ink-soft/80" aria-live="polite">{status}</p>

          {needsTap && (
            <button
              onClick={() => { audioRef.current?.play().then(() => setNeedsTap(false)).catch(() => {}); }}
              className="mx-auto mt-4 rounded-full border border-line bg-white px-5 py-2 text-[13px] font-semibold text-ink shadow-sm"
            >
              Tap to hear Steady
            </button>
          )}

          {/* chat — spacious */}
          <div ref={chatRef} className="mt-10 max-h-[260px] space-y-6 overflow-y-auto px-1 [mask-image:linear-gradient(to_bottom,transparent,black_26px)]">
            {lines.map((l, i) =>
              l.who === "steady" ? (
                <p key={i} className="mx-auto max-w-[520px] text-center text-[14.5px] leading-loose text-ink-soft">{l.text}</p>
              ) : (
                <p key={i} className="ml-auto w-fit max-w-[80%] rounded-2xl bg-white px-4 py-2 text-[13.5px] leading-relaxed text-ink shadow-sm">{l.text}</p>
              )
            )}
            {thinking && <p className="text-center text-[13.5px] text-ink-soft/60">…</p>}
          </div>

          {/* first-visit choice — small, airy */}
          {phase === "ready" && apiOk && (
            <>
              <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
                <button onClick={startVoice} className="btn-dark inline-flex items-center px-5 py-2.5 text-[13px] font-semibold">
                  Allow microphone
                </button>
                <button onClick={startTyping} className="rounded-full border border-line bg-white px-5 py-2.5 text-[13px] font-semibold text-ink transition hover:bg-cream-2">
                  I&apos;d rather type
                </button>
              </div>
              {/* Disclosure before the mic opens: it is an AI, it is not care, and this
                  taster is not saved. Adults only. */}
              <p className="mx-auto mt-5 max-w-[440px] text-center text-[12px] leading-relaxed text-ink-soft/80">
                You&rsquo;ll be talking to an AI, not a person — and it isn&rsquo;t therapy, medical
                care or crisis support. Adults 18+. Your voice is processed by OpenAI to power the
                conversation and this one-minute taster isn&rsquo;t saved. If you need someone now,
                call or text <strong className="font-semibold text-ink">988</strong> in the US.
              </p>
            </>
          )}

          {/* live voice controls */}
          {phase === "voice" && (
            <div className="mt-10 flex items-center justify-center gap-3">
              <button onClick={toggleMic} className="rounded-full border border-line bg-white px-5 py-2 text-[13px] font-semibold text-ink shadow-sm">
                {micPaused ? "Resume microphone" : "Pause microphone"}
              </button>
              <button onClick={() => teardown(true)} className="rounded-full px-3 py-2 text-[13px] font-medium text-ink-soft hover:text-ink">
                End
              </button>
              <span className="rounded-full bg-cream-2 px-3 py-1.5 text-[12px] font-semibold tabular-nums text-ink-soft">
                0:{String(secondsLeft).padStart(2, "0")}
              </span>
            </div>
          )}

          {/* CTA after taster */}
          {(phase === "done" || (phase === "ready" && !apiOk)) && (
            <div className="mt-10 flex flex-col items-center gap-2.5">
              <a href={ctaHref()} onClick={() => ph("cta_click", { variant: variantRef.current })} className="btn-dark inline-flex items-center px-6 py-3 text-[14px] font-semibold">
                Apply for an invitation
              </a>
              <span className="text-[12.5px] text-ink-soft">Invite-only while we test. Free, no card, adults 18+.</span>
            </div>
          )}

          {/* typing rail — boxy composer */}
          {phase !== "boot" && phase !== "done" && (
            <form
              className="mx-auto mt-10 w-full max-w-[520px]"
              onSubmit={(e) => { e.preventDefault(); sendText(input); }}
            >
              <div className="rounded-[1.2rem] border border-line bg-white px-4 pb-3 pt-3.5 shadow-[0_10px_30px_-18px_rgba(35,40,44,0.3)] transition focus-within:border-ink/25">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendText(input); }
                  }}
                  placeholder="Chat to Steady here…"
                  maxLength={600}
                  rows={2}
                  className="w-full resize-none bg-transparent text-[13.5px] leading-relaxed text-ink outline-none placeholder:text-ink-soft/60"
                />
                <div className="mt-1 flex justify-end">
                  <button
                    type="submit"
                    disabled={!input.trim() || thinking}
                    aria-label="Send"
                    className="grid h-8 w-8 place-items-center rounded-[0.65rem] border border-line bg-cream-2 text-ink transition hover:bg-line disabled:opacity-40"
                  >
                    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" />
                    </svg>
                  </button>
                </div>
              </div>
            </form>
          )}

          <p className="mt-9 text-center text-[12px] text-ink-soft/70">
            A one minute taster. Free to start · no card · <a href="/know-more" className="underline decoration-ink-soft/30 underline-offset-2 hover:text-ink">how it works</a>
          </p>
        </div>
      </section>

      {/* ================= BELOW: editorial hero, pushed down ================= */}
      <section className="px-5 pb-20 pt-16 sm:pt-24">
        <div className="mx-auto grid max-w-[1180px] items-center gap-14 lg:grid-cols-[0.92fr_1.08fr] lg:gap-12">

          {/* editorial left */}
          <div className="text-center lg:text-left">
            <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
              <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-1.5 text-[13px] font-medium text-ink">
                <span className="h-1.5 w-1.5 rounded-full bg-[#bfe3cf]" />
                Looping thoughts
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-1.5 text-[13px] font-medium text-ink">
                <span className="h-1.5 w-1.5 rounded-full bg-[#e9d3bc]" />
                Reassurance seeking
              </span>
            </div>

            <h2 className="mt-9 text-balance text-[40px] font-bold leading-[0.97] tracking-[-0.04em] text-ink sm:text-[52px] lg:text-[58px]">
              Built for the nights the loop wins.
            </h2>

            <div className="mx-auto mt-10 h-px w-44 bg-line lg:mx-0" />

            <p className="mx-auto mt-9 max-w-[420px] text-[15px] leading-relaxed text-ink-soft sm:text-[16px] lg:mx-0">
              Steady talks you out of looping thoughts and back into the present — out loud, in a voice that remembers you.
            </p>

            <div className="mt-11 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <a
                href={ctaHref()}
                onClick={() => ph("cta_click", { variant: variantRef.current })}
                className="btn-mint inline-flex items-center px-7 py-3.5 text-[15px] font-semibold"
              >
                Click here to be invited
              </a>
              <a
                href="/know-more"
                className="rounded-full border border-line bg-white px-7 py-3.5 text-[15px] font-semibold text-ink transition hover:bg-cream-2"
              >
                How it works
              </a>
            </div>
          </div>

          {/* photo right with glass overlays */}
          <div className="relative">
            <div className="overflow-hidden rounded-[2.6rem]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/photos/hero-woman-relief.jpg"
                alt="A woman exhaling, shoulders dropping in relief"
                className="h-[480px] w-full object-cover sm:h-[560px]"
              />
            </div>

            <div className="glass-panel absolute right-5 top-5 rounded-2xl px-4 py-3 text-left">
              <p className="text-[17px] font-semibold leading-none text-ink">1 min</p>
              <p className="mt-1 text-[11.5px] leading-tight text-ink/70">free taster<br />no card</p>
            </div>

            <div className="glass-panel absolute inset-x-5 bottom-5 rounded-[1.6rem] px-5 py-4">
              <p className="text-[13.5px] leading-relaxed text-ink">
                &ldquo;It&apos;s 2am and my head is spinning.&rdquo;
              </p>
              <p className="mt-1.5 text-[12px] text-ink/60">
                The moment Steady is built for. Scroll up and say hello — he&apos;s already listening.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
