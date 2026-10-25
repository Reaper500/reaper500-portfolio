import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Hero } from "@/sections/Hero";
import { About } from "@/sections/About";
import { Skills } from "@/sections/Skills";
import { Projects } from "@/sections/Projects";
import { TechReviews } from "@/sections/TechReviews";
import { Activity } from "@/sections/Activity";
import { Contact } from "@/sections/Contact";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main id="main">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <TechReviews />
        <Activity />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
