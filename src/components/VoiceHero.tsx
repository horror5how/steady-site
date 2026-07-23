"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const APP = "https://steady-erp-voice-fresh.vercel.app";
const VOICE_SECONDS = 60;
const WRAP_AT = 46; // inject "wrap up" note here
const HARD_KILL = 75; // absolute failsafe
const MAX_TEXT_TURNS = 12;

const PH_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY || "phc_CDKFjeVGfuEEid74UGx5CNwNFaqaijF8b6e9A6QhLruM";
const PH_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

type Phase = "boot" | "ready" | "connecting" | "voice" | "text" | "done";
type Line = { who: "steady" | "you"; text: string };

const FIRST_LINES: Record<string, string> = {
  "mic-first": "Allow your microphone to speak to me, or chat to me down here.",
  "question-first": "What's looping in your head right now? Say it out loud with your microphone, or type it down here.",
};
const TYPED_GREETING =
  "No mic, no problem. Hey, I'm Steady. What's your name, or what would you like me to call you? I'm being trained to help people step out of looping thoughts and reassurance seeking, and live more in the present. What's on your mind today?";
const GOODBYE =
  "That's our first minute together. I'd love to keep going properly. It's free, and I'll remember where we left off.";
const RESTING =
  "My voice has done a lot of talking today and is having a rest. Type to me here, or come into the full app.";

/* fire-and-forget PostHog capture; never blocks or throws */
function ph(event: string, props: Record<string, unknown> = {}) {
  try {
    let id = localStorage.getItem("steady-hero-id");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("steady-hero-id", id);
    }
    const payload = {
      api_key: PH_KEY,
      event,
      distinct_id: id,
      properties: { ...props, source: "hero-taster", $current_url: location.href },
    };
    navigator.sendBeacon?.(`${PH_HOST}/i/v0/e/`, new Blob([JSON.stringify(payload)], { type: "application/json" })) ||
      fetch(`${PH_HOST}/i/v0/e/`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload), keepalive: true }).catch(() => {});
  } catch {}
}

function pickVariant(): string {
  try {
    let v = localStorage.getItem("steady-hero-var");
    if (!v || !FIRST_LINES[v]) {
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
  const steadyDraft = useRef("");
  const variantRef = useRef("mic-first");
  const linesRef = useRef<Line[]>([]);
  const phaseRef = useRef<Phase>("boot");
  phaseRef.current = phase;
  linesRef.current = lines;

  const say = useCallback((who: Line["who"], text: string) => {
    setLines((l) => [...l, { who, text }]);
  }, []);

  /* taster transcript rides to the app in the URL hash → product greets them as known */
  const ctaHref = useCallback(() => {
    const convo = linesRef.current.filter((l) => !Object.values(FIRST_LINES).includes(l.text));
    if (!convo.length) return APP;
    try {
      const excerpt = convo.slice(-6).map((l) => `${l.who === "you" ? "Them" : "Steady"}: ${l.text.slice(0, 160)}`);
      const payload = btoa(unescape(encodeURIComponent(JSON.stringify({ at: Date.now(), excerpt }))));
      if (payload.length > 1500) return APP;
      return `${APP}/#taster=${payload}`;
    } catch {
      return APP;
    }
  }, []);

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
      ribbon(w, mid, maxAmp, s.phase, 6.5, 0, "#22302b", "rgba(62,122,94,0.45)", 1.7);
      ribbon(w, mid, maxAmp * 0.65, -s.phase * 0.8, 5.0, 1.7, "rgba(34,48,43,0.55)", "rgba(62,122,94,0.3)", 1.1);
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
        setLines([{ who: "steady", text: ok ? FIRST_LINES[variantRef.current] : "I'm resting right now. Come meet me properly in the app, it's free." }]);
        ph("hero_ready", { api_ok: ok, variant: variantRef.current });
      }, wait);
    });
    return () => {
      alive = false;
    };
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

  /* mint + WebRTC connect with a placeholder transceiver; mic track swaps in when granted */
  const connectRealtime = useCallback(async () => {
    const mintRes = await fetch("/api/hero-session", { method: "POST" });
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
    dc.onopen = () => dc.send(JSON.stringify({ type: "response.create" }));
    dc.onmessage = (ev) => {
      let msg: { type?: string; transcript?: string; delta?: string } = {};
      try { msg = JSON.parse(ev.data); } catch { return; }
      const t = msg.type || "";
      if (t.endsWith("input_audio_transcription.completed") && msg.transcript?.trim()) {
        say("you", msg.transcript.trim());
      } else if ((t === "response.output_audio_transcript.delta" || t === "response.audio_transcript.delta") && msg.delta) {
        steadyDraft.current += msg.delta;
        setLines((l) => {
          const copy = [...l];
          const last = copy[copy.length - 1];
          if (last?.who === "steady" && last.text.length <= steadyDraft.current.length && steadyDraft.current.startsWith(last.text.slice(0, 20))) {
            copy[copy.length - 1] = { who: "steady", text: steadyDraft.current };
            return copy;
          }
          return [...copy, { who: "steady", text: steadyDraft.current }];
        });
        wave.current.speaking = true; // deltas double as the speaking signal; buffer events can lag
      } else if (t.endsWith("audio_transcript.done")) {
        steadyDraft.current = "";
      } else if (t === "response.done") {
        wave.current.speaking = false;
      } else if (t === "output_audio_buffer.started") {
        wave.current.speaking = true;
      } else if (t === "output_audio_buffer.stopped" || t === "output_audio_buffer.cleared") {
        wave.current.speaking = false;
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
  }, [say, fallbackToText]);

  const startVoice = useCallback(async () => {
    if (!apiOk) {
      window.location.href = APP;
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
      timersRef.current.push(setTimeout(() => {
        try {
          dcRef.current?.send(JSON.stringify({
            type: "conversation.item.create",
            item: { type: "message", role: "system", content: [{ type: "input_text", text: "Time is nearly up. In your next reply, wrap up warmly in one short sentence and invite them to continue in the free full Steady app using the button below." }] },
          }));
        } catch {}
      }, WRAP_AT * 1000));
      timersRef.current.push(setTimeout(() => teardown(true), VOICE_SECONDS * 1000));
      timersRef.current.push(setTimeout(() => teardown(false), HARD_KILL * 1000));
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
  }, [apiOk, say, fallbackToText, teardown, connectRealtime]);

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
      .filter((l) => !Object.values(FIRST_LINES).includes(l.text))
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
    <section className="px-5 pb-12 pt-32 sm:pt-48">
      <div className="mx-auto flex min-h-[620px] max-w-[660px] flex-col">
        {/* hero text */}
        <div className="text-center">
          <h1 className="text-balance text-[26px] font-semibold leading-[1.18] tracking-tight text-ink sm:text-[34px]">
            A calm voice for a loud mind.
          </h1>
          <p className="mx-auto mt-6 max-w-[420px] text-balance text-[14px] leading-relaxed text-ink-soft sm:text-[15.5px]">
            Steady talks you out of looping thoughts and back into the present. Speak or type — your first minute is free.
          </p>
        </div>

        {/* the line */}
        <canvas ref={canvasRef} className="mt-32 h-[100px] w-full sm:mt-44 sm:h-[120px]" aria-hidden />
        <p className="mt-4 text-center text-[13px] text-ink-soft/70" aria-live="polite">{status}</p>

        {needsTap && (
          <button
            onClick={() => { audioRef.current?.play().then(() => setNeedsTap(false)).catch(() => {}); }}
            className="mx-auto mt-3 rounded-full border border-black/10 bg-white px-5 py-2 text-[14px] font-semibold text-ink shadow-sm"
          >
            Tap to hear Steady
          </button>
        )}

        {/* chat */}
        <div ref={chatRef} className="mt-12 max-h-[300px] flex-1 space-y-6 overflow-y-auto px-1 [mask-image:linear-gradient(to_bottom,transparent,black_28px)]">
          {lines.map((l, i) =>
            l.who === "steady" ? (
              <p key={i} className="max-w-[92%] text-[15px] leading-loose text-ink">{l.text}</p>
            ) : (
              <p key={i} className="ml-auto w-fit max-w-[85%] rounded-2xl bg-[#f2f7ee] px-4 py-2.5 text-[14px] leading-relaxed text-ink">{l.text}</p>
            )
          )}
          {thinking && <p className="text-[14px] text-ink-soft/70">…</p>}
        </div>

        {/* first-visit choice */}
        {phase === "ready" && apiOk && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button onClick={startVoice} className="btn-dark inline-flex items-center gap-2 rounded-full px-6 py-3 text-[15px] font-semibold">
              Allow microphone
            </button>
            <button onClick={startTyping} className="rounded-full border border-black/10 bg-white px-6 py-3 text-[15px] font-semibold text-ink transition hover:bg-cream-2">
              I&apos;d rather type
            </button>
          </div>
        )}

        {/* live voice controls */}
        {phase === "voice" && (
          <div className="mt-5 flex items-center justify-center gap-3">
            <button onClick={toggleMic} className="rounded-full border border-black/10 bg-white px-6 py-2.5 text-[14.5px] font-semibold text-ink shadow-sm">
              {micPaused ? "Resume microphone" : "Pause microphone"}
            </button>
            <button onClick={() => teardown(true)} className="rounded-full px-4 py-2.5 text-[14px] font-medium text-ink-soft hover:text-ink">
              End
            </button>
            <span className="rounded-full bg-cream-2 px-3 py-1.5 text-[12.5px] font-semibold tabular-nums text-ink-soft">
              0:{String(secondsLeft).padStart(2, "0")}
            </span>
          </div>
        )}

        {/* CTA after taster */}
        {(phase === "done" || (phase === "ready" && !apiOk)) && (
          <div className="mt-5 flex flex-col items-center gap-2">
            <a href={ctaHref()} onClick={() => ph("cta_click", { variant: variantRef.current })} className="btn-dark inline-flex items-center rounded-full px-7 py-3.5 text-[15px] font-semibold">
              Keep talking with Steady, free
            </a>
            <span className="text-[13px] text-ink-soft">No card. No waiting list. Steady remembers you.</span>
          </div>
        )}

        {/* typing rail: always available except during boot */}
        {phase !== "boot" && phase !== "done" && (
          <form
            className="mt-10 flex items-center gap-2"
            onSubmit={(e) => { e.preventDefault(); sendText(input); }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Chat to Steady here…"
              maxLength={600}
              className="w-full rounded-full border border-black/10 bg-white px-5 py-3.5 text-[14px] text-ink shadow-sm outline-none transition focus:border-sage/60"
            />
            <button
              type="submit"
              disabled={!input.trim() || thinking}
              className="btn-dark rounded-full px-5 py-3.5 text-[14px] font-semibold disabled:opacity-40"
            >
              Send
            </button>
          </form>
        )}

        <p className="mt-8 text-center text-[12.5px] text-ink-soft/70">
          A one minute taster. Free to start · no card · <a href="/know-more" className="underline decoration-ink-soft/30 underline-offset-2 hover:text-ink">how it works</a>
        </p>
      </div>
    </section>
  );
}
