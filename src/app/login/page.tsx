"use client";

import { useEffect } from "react";

// beingsteady.com/login sends people straight into the Steady product.
// Canonical product link — see steady-canonical-product-link memory.
const PRODUCT = "https://steady-erp-voice-fresh.vercel.app/";

export default function Login() {
  useEffect(() => {
    window.location.replace(PRODUCT);
  }, []);

  return (
    <main
      style={{
        minHeight: "70vh",
        display: "grid",
        placeItems: "center",
        textAlign: "center",
        fontFamily: "system-ui, sans-serif",
        color: "#22302b",
        padding: "2rem",
      }}
    >
      <div>
        <p style={{ fontSize: "1.05rem", marginBottom: ".75rem" }}>
          Taking you to Steady…
        </p>
        <a
          href={PRODUCT}
          style={{
            display: "inline-flex",
            alignItems: "center",
            borderRadius: "9999px",
            background: "#426353",
            color: "#fff",
            padding: ".6rem 1.3rem",
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          Continue to Steady
        </a>
      </div>
    </main>
  );
}
