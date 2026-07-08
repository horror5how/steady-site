import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import LogoBar from "@/components/LogoBar";
import Patterns from "@/components/Patterns";
import Moments from "@/components/Moments";
import FacesRow from "@/components/FacesRow";
import EmpathyBanner from "@/components/EmpathyBanner";
import Suite from "@/components/Suite";
import Becoming from "@/components/Becoming";
import Cta from "@/components/Cta";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <Hero />
        <LogoBar />
        <Patterns />
        <Moments />
        <Suite />
        <FacesRow />
        <EmpathyBanner />
        <Becoming />
        <Cta />
      </main>
      <Footer />
      <CookieBanner />
    </>
  );
}
