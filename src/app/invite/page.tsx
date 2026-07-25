import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import InviteForm from "@/components/InviteForm";

export const metadata: Metadata = {
  title: "Apply for an invitation | Steady",
  description:
    "Steady is an invite-only research trial for adults 18+. Free, no card. Not therapy, not medical care, not an emergency service. Apply to join the first small group.",
  alternates: { canonical: "https://beingsteady.com/invite" },
};

export default function InvitePage() {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-[720px] px-5 pb-24 pt-36 md:pt-44">
        <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-sage">
          Invite-only research trial
        </p>
        <h1 className="mt-4 text-balance text-[38px] font-semibold leading-[1.05] tracking-[-0.02em] text-ink md:text-[48px]">
          Apply for an invitation
        </h1>
        <p className="mt-5 text-[17px] leading-relaxed text-ink-soft">
          Steady is early, and we are testing it with a small first group of adults rather than
          selling it to anyone. It is free, there is no card, and there is no waiting list to buy
          your way past. Tell us a little about you and we will be in touch if there is a place.
        </p>
        <InviteForm />
      </main>
      <Footer />
    </>
  );
}
