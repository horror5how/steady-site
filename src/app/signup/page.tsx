import { redirect } from "next/navigation";

// ponytail: no public signup during the invite-only trial — one door, and it is /invite.
// Restore the AuthForm page (git history) when the product opens publicly.
export default function Signup() {
  redirect("/invite");
}
