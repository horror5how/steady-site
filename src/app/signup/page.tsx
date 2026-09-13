import { redirect } from "next/navigation";

// ponytail: places go by application, not sign-up — one door, and it is /invite.
// Restore the AuthForm page (git history) when the product opens publicly.
export default function Signup() {
  redirect("/invite");
}
