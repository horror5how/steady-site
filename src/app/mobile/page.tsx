import type { Metadata } from "next";
import MobileLanding from "@/components/MobileLanding";
import { pickVariant } from "@/lib/landing";

/* /mobile — where every ad lands. One screen to decide, one button to act.
 * ?ad=<key> swaps the headline to match the ad, same table as /landing.
 * Out of the index for the same reason /landing is. */

export const metadata: Metadata = {
  title: "Steady — a warm voice for looping thoughts",
  description:
    "Say what's looping and talk it through out loud, tonight. Free, no card. Nine questions and you're in. Adults 18+.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Steady — a warm voice for looping thoughts",
    description: "Ten minutes a day, out loud. Free, no card, tonight.",
    url: "https://beingsteady.com/mobile",
    siteName: "Steady",
    images: [{ url: "https://beingsteady.com/landing/og.jpg", width: 1200, height: 630 }],
    type: "website",
  },
};

export default async function MobilePage({
  searchParams,
}: {
  searchParams: Promise<{ ad?: string | string[] }>;
}) {
  const { ad } = await searchParams;
  return <MobileLanding variant={pickVariant(ad)} />;
}
