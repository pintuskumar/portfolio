import { Suspense } from "react";
import dynamic from "next/dynamic";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import TechMarquee from "../components/TechMarquee";
import SmoothScroll from "../components/SmoothScroll";
import ScrollProgress from "../components/ScrollProgress";
import CustomCursor from "../components/CustomCursor";
import MouseTrail from "../components/MouseTrail";
import KeyboardNav from "../components/KeyboardNav";
import ConsoleEasterEgg from "../components/ConsoleEasterEgg";
import CommandPalette from "../components/CommandPalette";
import SectionDivider from "../components/SectionDivider";
import Preloader from "../components/Preloader";

const About = dynamic(() => import("../components/About"));
const Skills = dynamic(() => import("../components/Skills"));
const Experience = dynamic(() => import("../components/Experience"));
const ProjectReel = dynamic(() => import("../components/ProjectReel"));
const Education = dynamic(() => import("../components/Education"));
const GitHubActivity = dynamic(() => import("../components/GitHubActivity"));
const ProjectArchitecture = dynamic(() => import("../components/ProjectArchitecture"));
const Contact = dynamic(() => import("../components/Contact"));
const Footer = dynamic(() => import("../components/Footer"));
const ChatWidget = dynamic(() => import("../components/ChatWidget"));
const VoiceAssistant = dynamic(() => import("../components/VoiceAssistant"));
const VisitorCounter = dynamic(() => import("../components/VisitorCounter"));

export default function Home() {
  return (
    <>
      <Preloader />
      <SmoothScroll>
        <ScrollProgress />
        <CustomCursor />
        <KeyboardNav />
        <ConsoleEasterEgg />
        <CommandPalette />
        <MouseTrail />
        <main className="min-h-screen bg-gray-950">
          <Navbar />
          <Hero />
          <TechMarquee />
          <SectionDivider />
          <Suspense fallback={null}>
            <About />
          </Suspense>
          <SectionDivider />
          <Suspense fallback={null}>
            <Skills />
          </Suspense>
          <SectionDivider />
          <Suspense fallback={null}>
            <Experience />
          </Suspense>
          <SectionDivider />
          <Suspense fallback={null}>
            <ProjectReel />
          </Suspense>
          <SectionDivider />
          <Suspense fallback={null}>
            <ProjectArchitecture />
          </Suspense>
          <SectionDivider />
          <Suspense fallback={null}>
            <Education />
          </Suspense>
          <SectionDivider />
          <Suspense fallback={null}>
            <GitHubActivity />
          </Suspense>
          <SectionDivider />
          <Suspense fallback={null}>
            <Contact />
          </Suspense>
          <Suspense fallback={null}>
            <Footer />
          </Suspense>
          <Suspense fallback={null}>
            <ChatWidget />
          </Suspense>
          <Suspense fallback={null}>
            <VoiceAssistant />
          </Suspense>
        </main>
      </SmoothScroll>
    </>
  );
}
