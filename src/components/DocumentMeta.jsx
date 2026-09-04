import { useEffect } from "react";

const SITE_URL = import.meta.env.VITE_SITE_URL || "https://solo-devtimmy.vercel.app";
const DESCRIPTION =
  "I am an Full-Stack developer that builds practical web and mobile app ideas from concept to production. Prompt-to-Stack Builder, Mobile Developer, and Content Creator";

function setMeta(selector, attrs) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement("meta");
    document.head.appendChild(el);
  }
  Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
}

export default function DocumentMeta() {
  useEffect(() => {
    document.title = "Cole Sustain Timmy | AI-first FullStack Developer";

    setMeta('meta[name="description"]', { name: "description", content: DESCRIPTION });
    setMeta('meta[property="og:url"]', { property: "og:url", content: SITE_URL });
    setMeta('meta[property="og:title"]', { property: "og:title", content: "Cole Sustain Timmy | AI-first FullStack Developer" });
    setMeta('meta[property="og:description"]', { property: "og:description", content: DESCRIPTION });
    setMeta('meta[property="og:site_name"]', { property: "og:site_name", content: "Cole Sustain Timmy | AI-first FullStack Developer" });
    setMeta('meta[property="og:image"]', { property: "og:image", content: `${SITE_URL}/timmy_pfp-modified.png` });
    setMeta('meta[name="twitter:title"]', { name: "twitter:title", content: "Cole Sustain Timmy | AI-first FullStack Developer" });
    setMeta('meta[name="twitter:description"]', { name: "twitter:description", content: DESCRIPTION });
    setMeta('meta[name="twitter:image"]', { name: "twitter:image", content: `${SITE_URL}/timmy_pfp-modified.png` });

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", SITE_URL);

    let structuredData = document.getElementById("person-structured-data");
    if (!structuredData) {
      structuredData = document.createElement("script");
      structuredData.id = "person-structured-data";
      structuredData.type = "application/ld+json";
      document.head.appendChild(structuredData);
    }
    structuredData.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Cole Sustain Timmy",
      alternateName: ["dev timmy", "devTimmy", "Timmy"],
      url: SITE_URL,
      jobTitle: "AI-first FullStack Developer",
      sameAs: [
        "https://x.com/_devTimmy",
        "https://github.com/devtimmy",
        "https://www.linkedin.com/in/devtimmy",
      ],
    });
  }, []);

  return null;
}
