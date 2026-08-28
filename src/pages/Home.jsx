import Hero            from "./components/Hero";
import Projects        from "./components/Projects";
import FilmSortFeature from "./components/FilmSortFeature";
import About           from "./components/About";
import Web3Community   from "./components/Web3Community";
import Contact         from "./components/Contact";

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
