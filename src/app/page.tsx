import type { Metadata } from "next";
import SkyHome from "@/components/SkyHome";

export const metadata: Metadata = {
  metadataBase: new URL("https://beingsteady.com"),
  title: "Steady — A calm voice for a loud mind",
  description:
    "An AI voice companion for looping thoughts. Talk things through, understand your patterns and choose a small practice step. Apply for a place with Steady.",
  alternates: { canonical: "https://beingsteady.com" },
  openGraph: {
    title: "Steady — A calm voice for a loud mind",
    description:
      "When the same thought keeps coming back, talk it through with Steady. A little more room for living.",
    url: "https://beingsteady.com",
    images: [
      {
        url: "/sky-social.png",
        width: 1200,
        height: 630,
        alt: "Steady — A calm voice. For a loud mind.",
      },
    ],
  },
};

export default function Home() {
  return <SkyHome />;
}
