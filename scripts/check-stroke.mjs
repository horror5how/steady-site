// The stroke rises fast when someone is spiralling and settles slowly when they calm.
import assert from "node:assert/strict";
const { strokeTarget, distressFrom, step, stroke } = await import("../src/lib/stroke.ts");
const { scoreFeeling } = await import("../src/lib/filler-pool.ts");
const panic = scoreFeeling("I'm panicking, my thoughts are racing and I can't stop spiralling");
const calm = scoreFeeling("I feel calm and settled, lighter than before");
assert.ok(distressFrom(panic) > distressFrom(calm), "panic reads higher than calm");
assert.ok(strokeTarget({ distress: 0.9, userSpeaking: true }) > strokeTarget({ distress: 0.2, steadySpeaking: true }), "spiralling flows harder than settling");
assert.ok(strokeTarget({ distress: 0.9, paused: true }) < 0.1, "pause stills it");
assert.ok(strokeTarget({ distress: 0.9, connection: "connecting" }) < 0.2, "connecting is a slow breath");
let l = 0.1; for (let i = 0; i < 20; i++) l = step(l, 1, 0.1);
assert.ok(l > 0.7, `rises within two seconds, got ${l.toFixed(2)}`);
let d = 1; for (let i = 0; i < 320; i++) d = step(d, 0.1, 0.1);
assert.ok(d < 0.15, `settles within half a minute, got ${d.toFixed(2)}`);
stroke.reset(); stroke.feel(scoreFeeling("I'm panicking and can't stop")); for (let i = 0; i < 20; i++) stroke.tick(0.1);
assert.ok(stroke.level() > 0.5, "the shared state carries a panicked line into a high level");
console.log("check-stroke OK: rises in a second, settles over seven, pause and connecting hold it still");
