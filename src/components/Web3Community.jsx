import { useRef, useState, useEffect, useCallback } from "react";
const AVATAR = "https://pbs.twimg.com/profile_images/1990929564474773504/HkT4wInV_400x400.jpg";

const POSTS = [
  "https://x.com/_devTimmy/status/1951708823850303686?s=20",
  "https://x.com/_devTimmy/status/1947250782933602507?s=20",
  "https://x.com/_devTimmy/status/2064580149081788625?s=20",
  "https://x.com/_devTimmy/status/2060262522616262763?s=20",
  "https://x.com/_devTimmy/status/2021130066076323986?s=20",
];

const ARTICLES = [
  "https://x.com/_devTimmy/status/2011106010354638878?s=20",
  "https://x.com/_devTimmy/status/2077277282985517261?s=20",
  "https://x.com/_devTimmy/status/2013150374794874986?s=20",
];

function XLogo({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function ArticleCard({ meta }) {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={meta.url}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        borderRadius: 16,
        overflow: 'hidden',
        textDecoration: 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        transition: 'transform 150ms ease, box-shadow 150ms ease',
        transform: hovered ? 'translate3d(0, -4px, 0)' : 'translate3d(0, 0, 0)',
        boxShadow: hovered
          ? '0 16px 48px rgba(0,0,0,0.7)'
          : '0 4px 20px rgba(0,0,0,0.5)',
        willChange: 'transform, opacity',
        backfaceVisibility: 'hidden',
      }}
    >
      {/* Image with title overlay */}
      {meta.image ? (
        <div style={{
          width: '100%',
          height: 200,
          borderRadius: 12,
          overflow: 'hidden',
          border: `1px solid ${hovered ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.07)'}`,
          position: 'relative',
          display: 'block',
        }}>
          <img
            src={meta.image}
            alt={meta.title || ''}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />

          {/* Centered title overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.45), rgba(0,0,0,0.35) 40%, rgba(0,0,0,0.0) 70%)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            boxSizing: 'border-box',
            zIndex: 2,
          }}>
            {(() => {
              const extractTitleFromDescription = (desc) => {
                if (!desc) return '';
                // prefer first non-empty line
                const lines = desc.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
                if (lines.length) {
                  const first = lines[0];
                  // if first line is short-ish, use it; otherwise take first sentence
                  if (first.length <= 120) return first;
                  const sentence = first.split(/[.!?]\s/)[0];
                  if (sentence && sentence.length <= 140) return sentence;
                  return first.slice(0, 140).trim();
                }
                // fallback: take first 100 chars
                return desc.trim().slice(0, 140);
              };

              const titleText = (meta.title && meta.title.trim()) ? meta.title.trim() : extractTitleFromDescription(meta.description);
              if (!titleText) return null;
              return (
                <div style={{
                  color: '#fff',
                  fontSize: 20,
                  fontWeight: 800,
                  textAlign: 'center',
                  lineHeight: 1.15,
                  textShadow: '0 8px 28px rgba(0,0,0,0.6)',
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                }}>
                  {titleText}
                </div>
              );
            })()}
          </div>
        </div>
      ) : (
        // If no image, fall back to simple title block
        meta.title && (
          <div style={{
            padding: 12,
            background: 'rgba(16,16,20,0.95)',
            borderRadius: 8,
            fontSize: 15,
            fontWeight: 700,
            color: '#fff',
          }}>{meta.title}</div>
        )
      )}

    </a>
  );
}

function TweetCard({ meta, onHover }) {
  const [hovered, setHovered] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const enter = () => { setHovered(true); if(onHover) onHover(true); };
  const leave = () => { setHovered(false); if(onHover) onHover(false); };

  // Show title + description, or just description, or just title
  const text = meta.title && meta.description 
    ? `${meta.title}\n\n${meta.description}`
    : meta.description || meta.title || '';

  return (
    <a
      href={meta.url}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={enter}
      onMouseLeave={leave}
      style={{
        position: 'relative',
        width: 320,
        flexShrink: 0,
        borderRadius: 16,
        padding: '18px 18px 16px',
        background: hovered
          ? 'rgba(22, 22, 26, 0.98)'
          : 'rgba(16, 16, 20, 0.95)',
        border: `1px solid ${hovered ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.07)'}`,
        boxShadow: hovered
          ? '0 16px 48px rgba(0,0,0,0.7)'
          : '0 4px 20px rgba(0,0,0,0.5)',
        color: 'inherit',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        overflow: 'hidden',
        textDecoration: 'none',
        transition: 'background 150ms ease, border-color 150ms ease, box-shadow 150ms ease',
        cursor: 'pointer',
      }}
    >
      {/* X logo — top right */}
      <div style={{ position: 'absolute', top: 16, right: 16, color: '#ffffff' }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </div>

      {/* Header — avatar + name row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingRight: 28 }}>
        {/* Avatar */}
        <div style={{
          width: 42,
          height: 42,
          borderRadius: '50%',
          overflow: 'hidden',
          flexShrink: 0,
          border: '1.5px solid rgba(255,255,255,0.1)',
        }}>
          <img
            src={AVATAR}
            alt="TIMM¥"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </div>

        {/* Name + handle + follow */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'nowrap' }}>
            <span style={{
              fontSize: 14,
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: -0.2,
              whiteSpace: 'nowrap',
            }}>
              TIMM¥
            </span>
            {/* Verified-style checkmark */}
            <svg width="15" height="15" viewBox="0 0 24 24" fill="#1d9bf0" style={{ flexShrink: 0 }}>
              <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.68.88-3.34 2.19c-1.39-.46-2.9-.2-3.91.81s-1.27 2.52-.81 3.91C2.63 9.33 1.75 10.57 1.75 12s.88 2.67 2.19 3.34c-.46 1.39-.2 2.9.81 3.91s2.52 1.27 3.91.81c.66 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.46 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z"/>
            </svg>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 1 }}>
            <span style={{ fontSize: 12, color: '#71717a', whiteSpace: 'nowrap' }}>@_devTimmy</span>
            <span style={{ fontSize: 12, color: '#3f3f46' }}>·</span>
            <span
              onClick={e => { e.preventDefault(); e.stopPropagation(); window.open('https://x.com/_devTimmy', '_blank', 'noreferrer'); }}
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: '#1d9bf0',
                cursor: 'pointer',
                textDecoration: 'none',
              }}
            >
              Follow
            </span>
          </div>
        </div>
      </div>

      {/* Post text body */}
      {text ? (
        <div style={{ fontSize: 14, lineHeight: 1.65, color: '#e4e4e7' }}>
          <div style={
            expanded
              ? { whiteSpace: 'pre-wrap', wordBreak: 'break-word' }
              : { display: '-webkit-box', WebkitLineClamp: 6, WebkitBoxOrient: 'vertical', overflow: 'hidden', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }
          }>
            {text}
          </div>
          {text.length > 240 && (
            <button
              onClick={e => { e.preventDefault(); e.stopPropagation(); setExpanded(v => !v); }}
              style={{
                marginTop: 6,
                background: 'none',
                border: 'none',
                color: '#1d9bf0',
                fontWeight: 700,
                fontSize: 13,
                cursor: 'pointer',
                padding: 0,
              }}
            >
              {expanded ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>
      ) : null}

      {/* Attached image — below text, rounded border with fade to void */}
      {meta.image ? (
        <div style={{
          width: '100%',
          borderRadius: 12,
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.07)',
          flexShrink: 0,
          position: 'relative',
        }}>
          <img
            src={meta.image}
            alt={meta.title || ''}
            style={{ width: '100%', height: 168, objectFit: 'cover', display: 'block' }}
          />
          {/* Fade overlay */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '60%',
            background: 'linear-gradient(to bottom, transparent, rgba(16, 16, 20, 0.95))',
            pointerEvents: 'none',
          }} />
        </div>
      ) : null}
    </a>
  );
}

export default function Web3Community() {
  const [posts, setPosts] = useState(() => POSTS.map((u, i) => ({ id: String(i), url: u })));
  const [activeTab, setActiveTab] = useState('posts');
  const [paused, setPaused] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const scrollRef = useRef(null);
  const scrollPos = useRef(0);

  const [metaList, setMetaList] = useState(null);
  const [articlesList, setArticlesList] = useState(null);

  useEffect(() => {
    let reqId;
    const scroll = () => {
      if (scrollRef.current && !paused && !isInteracting && window.innerWidth <= 767) {
        // Sync position if user scrolled manually
        if (Math.abs(scrollPos.current - scrollRef.current.scrollLeft) > 2) {
          scrollPos.current = scrollRef.current.scrollLeft;
        }
        scrollPos.current += 0.5;
        const halfWidth = scrollRef.current.scrollWidth / 2;
        if (scrollPos.current >= halfWidth) {
          scrollPos.current = 0; // loop
        }
        scrollRef.current.scrollLeft = scrollPos.current;
      }
      reqId = requestAnimationFrame(scroll);
    };
    reqId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(reqId);
  }, [paused, isInteracting]);

  useEffect(() => {
    // Fetch scraped metadata for posts
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/fetch-meta', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ urls: POSTS }),
        });
        const data = await res.json();
        if (cancelled) return;
        if (data?.ok && Array.isArray(data.results)) {
          setMetaList(data.results.map((r) => ({ url: r.url, title: r.title || '', description: r.description || '', image: r.image || '', likes: r.likes || 0 })));
        } else {
          setMetaList(POSTS.map(u => ({ url: u, title: '', description: '', image: '', likes: 0 })));
        }
      } catch (err) {
        setMetaList(POSTS.map(u => ({ url: u, title: '', description: '', image: '' })));
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    // Fetch scraped metadata for articles
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/fetch-meta', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ urls: ARTICLES }),
        });
        const data = await res.json();
        if (cancelled) return;
        if (data?.ok && Array.isArray(data.results)) {
          setArticlesList(data.results.map((r) => ({ url: r.url, title: r.title || '', description: r.description || '', image: r.image || '', likes: r.likes || 0 })));
        } else {
          setArticlesList(ARTICLES.map(u => ({ url: u, title: '', description: '', image: '', likes: 0 })));
        }
      } catch (err) {
        setArticlesList(ARTICLES.map(u => ({ url: u, title: '', description: '', image: '' })));
      }
    })();
    return () => { cancelled = true; };
  }, []);

  /* Duplicate for seamless loop — need at least enough cards to fill viewport */
  const looped = (metaList ?? POSTS.map(u => ({ url: u, title: '', description: '', image: '' }))).concat(metaList ?? POSTS.map(u => ({ url: u, title: '', description: '', image: '' })));

  return (
    <section
      id="community"
      style={{
        background: "#000000",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        padding: "48px 0 40px",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Ambient glow */}
      <div aria-hidden style={{
        position: "absolute", top: 0, right: "-5%",
        width: "40%", height: "50%",
        background: "radial-gradient(ellipse at top right, rgba(139,92,246,0.07) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>

        {/* ── Header ───────────────────────────────────────────────────── */}
        <div style={{
          display: "flex", alignItems: "flex-end",
          justifyContent: "space-between", flexWrap: "wrap",
          gap: 20, marginBottom: 40,
        }}>
          <div>
            <h2 style={{
              color: "#ffffff",
              fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
              fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.1,
              marginBottom: 10,
            }}>
              What I'm Into
            </h2>
            <p style={{ color: "#71717a", fontSize: 15, margin: 0, maxWidth: 420 }}>
              Building user solutions, exploring AI and crypto, making ideas come alive and sharing what I learn
            </p>
          </div>

          <a
            href="https://x.com/_devTimmy"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              padding: "9px 18px", borderRadius: 9999,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#a1a1aa", fontSize: 13, fontWeight: 700,
              textDecoration: "none",
              transition: "background 150ms ease, color 150ms ease, border-color 150ms ease",
            }}
            onMouseEnter={e => {
              const el = e.currentTarget;
              el.style.background = "rgba(255,255,255,0.1)";
              el.style.color = "#fff";
              el.style.borderColor = "rgba(255,255,255,0.18)";
            }}
            onMouseLeave={e => {
              const el = e.currentTarget;
              el.style.background = "rgba(255,255,255,0.06)";
              el.style.color = "#a1a1aa";
              el.style.borderColor = "rgba(255,255,255,0.1)";
            }}
          >
            <XLogo size={14} />
            Follow @_devTimmy
          </a>
        </div>

        {/* ── Tabs ───────────────────────────────────────────────────── */}
        <div style={{
          display: "flex",
          gap: 16,
          marginBottom: 32,
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          paddingBottom: 16,
        }}>
          {(['posts', 'articles']).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: 'none',
                border: 'none',
                padding: '8px 16px',
                fontSize: 14,
                fontWeight: 600,
                color: activeTab === tab ? '#ffffff' : '#71717a',
                cursor: 'pointer',
                transition: 'color 150ms ease',
                borderBottom: activeTab === tab ? '2px solid #8b5cf6' : 'none',
                marginBottom: -16,
                paddingBottom: 16,
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab) {
                  (e.currentTarget).style.color = '#a1a1aa';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab) {
                  (e.currentTarget).style.color = '#71717a';
                }
              }}
            >
              {tab === 'posts' ? 'What I Share' : 'Articles'}
            </button>
          ))}
        </div>
      </div>

      {/* ── Marquee (Posts Tab) ───────────────────────────────────────────────────── */}
      {activeTab === 'posts' && (
        <>
          <div
            className="tweets-marquee-outer"
            aria-label="X posts auto-scroll"
            style={{ paddingLeft: 24 }}
            ref={scrollRef}
            onTouchStart={() => setIsInteracting(true)}
            onTouchEnd={() => setIsInteracting(false)}
            onScroll={() => {
              if (window.innerWidth <= 767 && isInteracting) {
                // Keep track updated if manually scrolling
                scrollPos.current = scrollRef.current.scrollLeft;
              }
            }}
          >
            <div
              className="tweets-marquee-track"
            >
              {metaList === null ? (
                // Show skeletons while loading
                Array.from({ length: POSTS.length * 2 }).map((_, i) => (
                  <div key={`s-${i}`} style={{ width: 320, flexShrink: 0, borderRadius: 12, padding: 12 }}>
                    <div style={{ width: '100%', height: 160, borderRadius: 8, background: 'linear-gradient(90deg, #0d0d0d, #151515, #0d0d0d)', backgroundSize: '200% 100%', animation: 'shimmer 1.2s linear infinite' }} />
                    <div style={{ height: 12 }} />
                    <div style={{ width: '70%', height: 12, borderRadius: 6, background: 'linear-gradient(90deg, #0d0d0d, #151515, #0d0d0d)', backgroundSize: '200% 100%', animation: 'shimmer 1.2s linear infinite' }} />
                    <div style={{ height: 8 }} />
                    <div style={{ width: '100%', height: 44, borderRadius: 6, background: 'linear-gradient(90deg, #0d0d0d, #151515, #0d0d0d)', backgroundSize: '200% 100%', animation: 'shimmer 1.2s linear infinite' }} />
                  </div>
                ))
              ) : (
                looped.map((meta, i) => (
                  <TweetCard
                    key={`${meta.url}-${i}`}
                    meta={meta}
                    onHover={setPaused}
                  />
                ))
              )}
            </div>
          </div>

          {/* ── See all CTA ───────────────────────────────────────────────── */}
          <div style={{ maxWidth: 1200, margin: "32px auto 0", padding: "0 24px" }}>
            <a
              href="https://x.com/_devTimmy"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                fontSize: 13, fontWeight: 700, color: "#8b5cf6",
                textDecoration: "none",
                transition: "color 150ms ease",
              }}
              onMouseEnter={e => { (e.currentTarget).style.color = "#a78bfa"; }}
              onMouseLeave={e => { (e.currentTarget).style.color = "#8b5cf6"; }}
            >
              See all posts on X
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
            </a>
          </div>
        </>
      )}

      {/* ── Articles Tab ───────────────────────────────────────────────────── */}
      {activeTab === 'articles' && (
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 20,
          }}>
            {articlesList ? articlesList.map((meta, i) => (
              <ArticleCard
                key={`article-${meta.url}-${i}`}
                meta={meta}
              />
            )) : (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={`article-skeleton-${i}`} style={{ borderRadius: 12, padding: 12 }}>
                  <div style={{ width: '100%', height: 200, borderRadius: 8, background: 'linear-gradient(90deg, #0d0d0d, #151515, #0d0d0d)', backgroundSize: '200% 100%', animation: 'shimmer 1.2s linear infinite' }} />
                  <div style={{ height: 12 }} />
                  <div style={{ width: '100%', height: 80, borderRadius: 6, background: 'linear-gradient(90deg, #0d0d0d, #151515, #0d0d0d)', backgroundSize: '200% 100%', animation: 'shimmer 1.2s linear infinite' }} />
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <style>{`
        .tweets-marquee-outer {
          overflow: hidden;
          position: relative;
          /* Fade edges */
          -webkit-mask-image: linear-gradient(
            to right,
            transparent 0px,
            black 60px,
            black calc(100% - 60px),
            transparent 100%
          );
          mask-image: linear-gradient(
            to right,
            transparent 0px,
            black 60px,
            black calc(100% - 60px),
            transparent 100%
          );
        }

        @keyframes tweetScroll {
          from { transform: translate3d(0, 0, 0); }
          to   { transform: translate3d(-50%, 0, 0); }
        }

        .tweets-marquee-track {
          display: flex;
          gap: 14px;
          width: max-content;
          animation: tweetScroll 40s linear infinite;
          padding-bottom: 6px;
          will-change: transform;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
        }

        @media (max-width: 767px) {
          .tweets-marquee-outer {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
            -webkit-mask-image: linear-gradient(
              to right,
              transparent 0,
              black 18px,
              black calc(100% - 18px),
              transparent 100%
            );
            mask-image: linear-gradient(
              to right,
              transparent 0,
              black 18px,
              black calc(100% - 18px),
              transparent 100%
            );
          }

          .tweets-marquee-outer::-webkit-scrollbar {
            display: none;
          }

          .tweets-marquee-track {
            animation: none;
            gap: 12px;
          }
        }

        @media (hover: hover) and (pointer: fine) {
          .tweets-marquee-outer:hover .tweets-marquee-track {
            animation-play-state: paused;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .tweets-marquee-track { animation: none; }
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </section>
  );
}
