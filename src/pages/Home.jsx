import Hero from "../components/Hero.jsx";
import Projects from "../components/Projects.jsx";
import FilmSortFeature from "../components/FilmSortFeature.jsx";
import About from "../components/About.jsx";
import Web3Community from "../components/Web3Community.jsx";
import Contact from "../components/Contact.jsx";

export default function Home() {
  return (
    <>
      {/* 1. Hero */}
      <Hero />

      {/* 2. About */}
      <About />

      {/* 3. Featured Projects grid */}
      <Projects />

      {/* 4. FilmSort flagship case study */}
      <FilmSortFeature />

      {/* 5. Web3 / Community */}
      <Web3Community />

      {/* 6. Contact */}
      <Contact />
    </>
  );
}
