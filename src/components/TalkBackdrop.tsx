"use client";

import { useEffect, useState } from "react";
import { ShaderGradientCanvas, ShaderGradient } from "@shadergradient/react";

/* Hayat's ShaderGradient preset, prop for prop — a violet sphere on black.
   Canvas-level settings (fov, pixelDensity, grain) live on the canvas; the
   URL-only params from the customiser (format, frameRate, gizmoHelper,
   axesHelper, bgColor) style the customiser page, not an embedded canvas —
   the section's own black background is the bgColor here. */
export default function TalkBackdrop() {
  /* ponytail: the preset is framed for a wide canvas — on a phone the camera is
     zoomed into empty space beside the sphere, so pull back on narrow screens. */
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 760px)");
    const sync = () => setNarrow(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return (
    <ShaderGradientCanvas
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      pixelDensity={1}
      fov={45}
      pointerEvents="none"
    >
      <ShaderGradient
        control="props"
        animate="on"
        brightness={1.5}
        cAzimuthAngle={250}
        cDistance={narrow ? 2.8 : 1.5}
        cPolarAngle={140}
        cameraZoom={narrow ? 6 : 12.5}
        color1="#809bd6"
        color2="#910aff"
        color3="#af38ff"
        envPreset="city"
        grain="on"
        lightType="3d"
        positionX={0}
        positionY={0}
        positionZ={0}
        reflection={0.5}
        rotationX={0}
        rotationY={0}
        rotationZ={140}
        type="sphere"
        uAmplitude={7}
        uDensity={0.8}
        uFrequency={5.5}
        uSpeed={0.3}
        uStrength={0.4}
        uTime={0}
        wireframe={false}
      />
    </ShaderGradientCanvas>
  );
}
