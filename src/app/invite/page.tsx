import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import InviteFlow from "@/components/InviteFlow";

export const metadata: Metadata = {
  title: "Apply to use Steady | Steady",
  description:
    "Apply to use Steady. Nine short questions and you are in straight away. Free, no card, adults 18+. Not therapy, not medical care, not an emergency service.",
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
