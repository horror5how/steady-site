import { redirect } from "next/navigation";

// Intro/marketing landing killed — beingsteady.com now opens straight on signup.
// Old landing preserved in git history; restore if the marketing page is wanted back.
export default function Home() {
  redirect("/signup");
}
