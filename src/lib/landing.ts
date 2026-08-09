/* Ad landing variants.
 *
 * One entry per Meta ad in ~/Documents/Steady Meta Ads. Message match is the
 * single biggest lever on paid traffic, so the H1 here is the ad's own static
 * mirror line, close to word for word. ?ad=<key> picks the variant; anything
 * unrecognised falls back to `checker`, which is the flex-test lead ad.
 *
 * ponytail: a plain lookup table, not a CMS. Five ads, five rows.
 *
 * No invented proof anywhere. There are no users, no testimonials and no
 * numbers yet, so credibility rides on three things that are true: the method
 * is the one therapists already use, it is free with no card, and the first
 * group is genuinely small.
 */

/** Where /landing leaves the email for /invite to pick up. Not a URL param:
 *  an email address beside an OCD ad is not something to put in a link that
 *  can be shared, logged or pasted. */
export const PREFILL_KEY = "steady-lead-email";

export type LoopStep = { label: string; text: string };

export type Variant = {
  key: string;
  /** Ad this page is matched to, for analytics. */
  ad: string;
  image: string;
  imageAlt: string;
  /** Mirrors the ad's static line. */
  headline: string;
  sub: string;
  /** Sits over the hero image, mirrors the ad's persistent overlay. */
  overlay: string;
  /** The page's primary action: header, sticky bar, and the share button. */
  cta: string;
  /** The email button. Usually the same, but ad 5's primary action is to pass
   *  the page on, so its form has to ask for something different. */
  formCta?: string;
  loop: LoopStep[];
  /** The ad's exclusion line. Who this is not for. */
  exclusion: string;
  /** Reframes the form for someone applying on behalf of another person. */
  forSomeoneElse?: boolean;
};

export const VARIANTS: Record<string, Variant> = {
  checker: {
    key: "checker",
    ad: "ad1-checker",
    image: "/landing/checker.jpg",
    imageAlt: "A woman standing in a hallway, hand hovering an inch from the front door lock",
    headline: "Five times before bed. Now once, out loud.",
    sub: "Steady is a warm voice you talk to when the loop starts. Ten minutes, and the sixth check stops being the plan.",
    overlay: "Ten minutes out loud",
    cta: "Get my invite",
    loop: [
      { label: "Trigger", text: "The front door, on the way to bed" },
      { label: "Thought", text: "“What if I left it open?”" },
      { label: "Habit", text: "Checking it a sixth time" },
      { label: "Back to now", text: "One conversation instead of the sixth check" },
    ],
    exclusion:
      "It is not a therapist and it is not for a crisis. It is for the ordinary Tuesday night when the loop starts and nobody is awake.",
  },

  reassurance: {
    key: "reassurance",
    ad: "ad2-reassurance",
    image: "/landing/reassurance.jpg",
    imageAlt: "A man at a kitchen table in the evening, catching himself mid-question",
    headline: "Every answer helped for about a minute.",
    sub: "Steady is the one voice that will never reassure you. That is the entire point, and it is why it works.",
    overlay: "The one voice that will not reassure you",
    cta: "Get my invite",
    loop: [
      { label: "Trigger", text: "An ordinary moment, an ordinary doubt" },
      { label: "Thought", text: "“I need to know she is sure”" },
      { label: "Habit", text: "Asking her the same thing again" },
      { label: "Back to now", text: "Practising sitting with the maybe" },
    ],
    exclusion:
      "If what you want is someone to tell you it is fine, this is the wrong thing. It will not do that.",
  },

  night: {
    key: "night",
    ad: "ad3-researcher",
    image: "/landing/night.jpg",
    imageAlt: "A woman asleep, phone face down on the bed beside her",
    headline: "None of them were ever going to be the last one.",
    sub: "Forty tabs at one in the morning. Steady is a voice, not a search bar. Wake up with a plan instead of a search history.",
    overlay: "Wake up with a plan, not a search history",
    cta: "Get my invite",
    loop: [
      { label: "Trigger", text: "One odd feeling, late at night" },
      { label: "Thought", text: "“What if it is something?”" },
      { label: "Habit", text: "Forty tabs, and never a last one" },
      { label: "Back to now", text: "Say it out loud, close the tabs, sleep" },
    ],
    exclusion:
      "It will not tell you what your symptoms mean. It is not a doctor and it will not play one.",
  },

  pureo: {
    key: "pureo",
    ad: "ad4-pureo",
    image: "/landing/pureo.jpg",
    imageAlt: "A man sitting on the edge of a bed in morning light",
    headline: "Nothing to see from outside.",
    sub: "No checking, no rituals. Just arguing with your own head all afternoon. Steady is a voice you can say the actual thought to.",
    overlay: "Say the one you have never said out loud",
    cta: "Get my invite",
    loop: [
      { label: "Trigger", text: "A thought arrives, uninvited" },
      { label: "Thought", text: "“What does it mean that I thought it?”" },
      { label: "Habit", text: "Arguing with it from eleven until five" },
      { label: "Back to now", text: "Saying it out loud, and letting it pass" },
    ],
    exclusion:
      "It will not tell you what the thought means about you. It does not do that, and it will not be shocked either.",
  },

  watching: {
    key: "watching",
    ad: "ad5-watching",
    image: "/landing/watching.jpg",
    imageAlt: "A mother standing in a doorway, watching her daughter read on the sofa",
    headline: "I have been answering it wrong for two years.",
    sub: "Nobody tells you the reassurance is the thing feeding it. Steady is a warm voice they can talk to that will never do what you did.",
    overlay: "You were trying to help",
    cta: "Send it to them",
    formCta: "Show me what she would see",
    loop: [
      { label: "Trigger", text: "She asks the question again" },
      { label: "Thought", text: "“If I answer it properly this time…”" },
      { label: "Habit", text: "Answering, and feeding it" },
      { label: "Back to now", text: "A voice that will never give her the answer" },
    ],
    exclusion:
      "This is not something you can do for her. She has to want to open it. All you can do is put it in front of her.",
    forSomeoneElse: true,
  },
};

export const DEFAULT_VARIANT = "checker";

export function pickVariant(raw: string | string[] | undefined): Variant {
  const key = Array.isArray(raw) ? raw[0] : raw;
  return VARIANTS[(key || "").toLowerCase()] ?? VARIANTS[DEFAULT_VARIANT];
}
