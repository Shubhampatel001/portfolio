import { SmoothScrollProvider } from "@/components/layout/smooth-scroll-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Experience } from "@/components/sections/experience";
import { Projects } from "@/components/sections/projects";
import { Skills } from "@/components/sections/skills";
import { Certifications } from "@/components/sections/certifications";
import { Achievements } from "@/components/sections/achievements";
import { Volunteering } from "@/components/sections/volunteering";
import { Mascot } from "@/components/ui/mascot";
import { Contact } from "@/components/sections/contact";

export default function Home() {
  return (
    <SmoothScrollProvider>
      <Navbar />
      <main>
        <Hero />
        <Projects />
        <Experience />
        <About />
        <Skills />
        <Certifications />
        <Achievements />
        <Volunteering />
        <Contact />
      </main>
      <Footer />
      <Mascot />
    </SmoothScrollProvider>
  );
}
