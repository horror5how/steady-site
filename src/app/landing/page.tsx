import type { Metadata } from "next";
import Landing from "@/components/Landing";
import { pickVariant } from "@/lib/landing";

/* /landing — the page paid traffic lands on.
 *
 * ?ad=checker | reassurance | night | pureo | watching picks the variant, so
 * the headline is the same sentence the ad just made. Anything else falls back
 * to the checker ad.
 *
 * Deliberately out of the index: this is one page wearing five different
 * headlines, and none of them should compete with the homepage in search.
 */

export const metadata: Metadata = {
  title: "Steady — a warm voice for looping thoughts",
  description:
    "Say what’s looping and talk it out with a warm voice, tonight. Free to start, no card. An invite-only research trial for adults 18 and over.",
  robots: { index: false, follow: false },
};

export default async function LandingPage({
  searchParams,
}: {
  searchParams: Promise<{ ad?: string | string[] }>;
}) {
  const { ad } = await searchParams;
  return <Landing variant={pickVariant(ad)} />;
}
