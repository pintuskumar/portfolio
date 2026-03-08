"use client";

import { lazy, Suspense } from "react";
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

const About = lazy(() => import("../components/About"));
const Skills = lazy(() => import("../components/Skills"));
const Experience = lazy(() => import("../components/Experience"));
const ProjectReel = lazy(() => import("../components/ProjectReel"));
const Education = lazy(() => import("../components/Education"));
const GitHubActivity = lazy(() => import("../components/GitHubActivity"));
const Contact = lazy(() => import("../components/Contact"));
const Footer = lazy(() => import("../components/Footer"));
const ChatWidget = lazy(() => import("../components/ChatWidget"));
const Preloader = lazy(() => import("../components/Preloader"));

export default function Home() {
  return (
    <>
      <Suspense fallback={null}>
        <Preloader />
      </Suspense>
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
        </main>
      </SmoothScroll>
    </>
  );
}
