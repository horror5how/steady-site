import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import InviteFlow from "@/components/InviteFlow";

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
      <InviteFlow />
      <Footer />
    </>
  );
}
