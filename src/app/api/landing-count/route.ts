import { list } from "@vercel/blob";

/* A true count of people who started this week, or nothing.
 *
 * Reads the names of the sealed lead blobs — never their contents. Each name
 * carries the time it was written, which is all this needs. Below the floor
 * it returns null and the page shows nothing: a count of two is not momentum,
 * it is a confession.
 */

export const runtime = "nodejs";
export const revalidate = 600;

const FLOOR = 5;
const WEEK = 7 * 24 * 60 * 60 * 1000;

export async function GET() {
  try {
    const since = Date.now() - WEEK;
    let week = 0;
    let cursor: string | undefined;
    do {
      const page = await list({ prefix: "landing-leads/", cursor, limit: 1000 });
      for (const blob of page.blobs) {
        const stamp = Number(blob.pathname.slice("landing-leads/".length).split(/[-.]/)[0]);
        if (Number.isFinite(stamp) && stamp >= since) week += 1;
      }
      cursor = page.hasMore ? page.cursor : undefined;
    } while (cursor);
    return Response.json(
      { week: week >= FLOOR ? week : null },
      { headers: { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=3600" } },
    );
  } catch {
    return Response.json({ week: null });
  }
}
