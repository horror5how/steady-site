import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import AuthForm from "@/components/AuthForm";

export const metadata = { title: "Try Steady — Sign up" };

export default function Signup() {
  return (
    <>
      <Nav />
      <AuthForm mode="signup" />
      <Footer />
    </>
  );
}
