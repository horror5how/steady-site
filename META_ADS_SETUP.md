# Meta ads: technical setup

Everything in the codebase is built and deployed. It stays dormant until three
environment variables exist, then starts collecting on the next page load.

## What is already live

| Piece | Where | State |
| --- | --- | --- |
| Meta pixel loader | `src/lib/meta.ts` | Deployed, dormant until `NEXT_PUBLIC_META_PIXEL_ID` is set |
| Conversions API relay | `src/app/api/meta/route.ts` | Deployed, dormant until `META_PIXEL_ID` + `META_CAPI_TOKEN` are set |
| Event mirroring | `ph()` in `src/lib/analytics.ts` | Live — every site event passes through one choke point |
| Visit counting + engagement score | `src/lib/meta.ts` | Live in localStorage |
| Internal traffic exclusion | `src/middleware.ts`, `src/lib/notrack.ts` | Live — our own visits never enter an audience |
| Allowlist guard | `scripts/check-meta.mjs` (`npm run check`) | Live — fails if a new event is forwarded without approval |

## What only Hayat can do

These need a Facebook login, 2FA on his phone, and a card. They cannot be
automated, and nothing below takes more than ten minutes.

1. **Business portfolio** — <https://business.facebook.com/> → *Create account*.
   Business name `Steady`, his name, `hayat@beyondelevation.com`.
2. **Ad account** — inside it, *Settings → Ad accounts → Add → Create a new ad
   account*. Currency **GBP**, time zone **London**. Both are permanent.
3. **Payment method** — *Billing → Payment settings → Add payment method*.
4. **Facebook Page + Instagram** — connect the existing `@itshayatamin`
   Instagram (business account `17841422274109557`) under *Accounts →
   Instagram accounts*. Instagram placements need a Page attached.
5. **Dataset (the modern pixel)** — *Events Manager → Connect data sources →
   Web → Meta pixel*. Name it `Steady Web`. **Copy the dataset ID** (15–16
   digits) — that is `META_PIXEL_ID`.
6. **Conversions API token** — in that dataset, *Settings → Conversions API →
   Generate access token*. **Copy it** — that is `META_CAPI_TOKEN`.
7. **Verify the domain** — *Business settings → Brand safety → Domains → Add
   `beingsteady.com`*. Choose the meta-tag method and send the tag over; it
   goes in `src/app/layout.tsx`. Without this, iOS traffic is largely
   unmeasurable and the events below cannot be prioritised.

Then send both values over. They go into Vercel and the pipeline is live —
no further code changes.

## Aggregated Event Measurement priority

After domain verification, set the eight-event priority in *Events Manager →
Aggregated Event Measurement*. Highest first, because iOS only ever reports the
top-priority event a person triggers:

1. `Lead` — invite submitted, the actual conversion
2. `VoiceCompleted` — finished the hero taster
3. `HighIntentVisitor` — engagement score crossed 8
4. `VoiceStarted`
5. `VoiceMicClicked`
6. `RepeatVisitor`
7. `CtaClick`
8. `VoiceTextEngaged`

## The events being collected

Sent from the browser **and** from our server with a shared `event_id`, so Meta
counts them once and we still get them when an ad blocker or Safari kills the
pixel. Every event carries `visit_count` and `engagement_score`.

| Meta event | Fires when | Score |
| --- | --- | --- |
| `PageView` | Any page, including client-side route changes | — |
| `RepeatVisitor` | Second or later visit, 30-minute session gap | — |
| `VoiceMicClicked` | Pressed "Allow microphone" on the hero | +2 |
| `VoiceStarted` | Voice session actually opened | +3 |
| `VoiceCompleted` | Finished the hero taster | +5 |
| `VoiceTextEngaged` | Typed to Steady instead of talking | +2 |
| `VoiceTypeClicked` | Chose "I'd rather type" | +1 |
| `CtaClick` | Clicked through to the invite flow | +3 |
| `HighIntentVisitor` | Engagement score crossed 8 | — |
| `Lead` | Invite submitted | +10 |

## The audiences to build (Events Manager → Audiences → Custom audience → Website)

Named to match the retargeting tiers. Build them after the first data lands.

| Audience | Rule | Window |
| --- | --- | --- |
| `T1 — Voice completers` | `VoiceCompleted` | 180 days |
| `T2 — High intent` | `HighIntentVisitor` | 180 days |
| `T3 — Touched the voice` | `VoiceMicClicked` or `VoiceStarted` | 90 days |
| `T4 — Repeat visitors` | `RepeatVisitor` | 90 days |
| `T5 — All visitors` | `PageView` | 30 days |
| `Converted — exclude` | `Lead` | 180 days |
| `Lookalike 1%` | Source: `T1 — Voice completers` | UK |

Every retargeting ad set excludes `Converted — exclude`. Tiers are stacked
highest-first with the lower tier excluded from the higher one's ad set, so
nobody sits in two audiences and bids against himself.

## One thing to decide before spending

Steady is a mental-health product, and behavioural data next to an identity is
what got BetterHelp and Cerebral fined. So this build deliberately sends Meta
**no email, no name, no user id, and nothing clinical** — only the hero-taster
engagement events above, from the marketing site, behind cookie consent. The
product app at `steady-erp-voice-fresh` has no pixel at all and should not get
one.

That costs some match quality. The alternative — hashed emails from the invite
flow — would raise it, and would also mean handing Meta a list of people who
applied to an OCD trial. That is a decision to take deliberately, not by
default, and the code is built to the cautious side of it.
