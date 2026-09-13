"use client";

import { ShaderGradientCanvas, ShaderGradient } from "@shadergradient/react";

/* The live backdrop for the taster section — Hayat's ShaderGradient preset:
   a slow violet sphere on black, grain on, camera pulled in close. */
const PRESET =
  "https://www.shadergradient.co/customize?animate=on&axesHelper=off" +
  "&bgColor1=%23000000&bgColor2=%23000000&brightness=1.5&cAzimuthAngle=250" +
  "&cDistance=1.5&cPolarAngle=140&cameraZoom=12.5&color1=%23809bd6" +
  "&color2=%23910aff&color3=%23af38ff&destination=onCanvas&embedMode=off" +
  "&envPreset=city&format=gif&fov=45&frameRate=10&gizmoHelper=hide&grain=on" +
  "&lightType=3d&pixelDensity=1&positionX=0&positionY=0&positionZ=0" +
  "&range=disabled&rangeEnd=40&rangeStart=0&reflection=0.5&rotationX=0" +
  "&rotationY=0&rotationZ=140&shader=defaults&type=sphere&uAmplitude=7" +
  "&uDensity=0.8&uFrequency=5.5&uSpeed=0.3&uStrength=0.4&uTime=0&wireframe=false";

export default function TalkBackdrop() {
  return (
    <ShaderGradientCanvas
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      pixelDensity={1}
      fov={45}
    >
      <ShaderGradient control="query" urlString={PRESET} />
    </ShaderGradientCanvas>
  );
}
