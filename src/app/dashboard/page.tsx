// beingsteady.com/dashboard hosts the Steady product on-domain via a full-bleed
// iframe. The product runs from its own origin (assets, /api, mic all same-origin
// to itself); the product allows framing from beingsteady.com via CSP frame-ancestors.
// ponytail: iframe until the product moves into this repo/domain for real.
const PRODUCT = "https://steady-erp-voice-fresh.vercel.app/";

export const metadata = { title: "Steady" };

export default function Dashboard() {
  return (
    <iframe
      src={PRODUCT}
      title="Steady"
      allow="microphone; camera; autoplay; clipboard-write"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        border: "none",
      }}
    />
  );
}
