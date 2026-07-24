import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import AuthForm from "@/components/AuthForm";

export const metadata = { title: "Log in — Steady" };

export default function Login() {
  return (
    <>
      <Nav />
      <AuthForm mode="login" />
      <Footer />
    </>
  );
}
