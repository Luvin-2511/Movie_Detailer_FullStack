import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import "../styles/cinemaloader.scss";

const FILM_FRAMES  = 12;
const GRID_COLS    = 8;
const GRID_ROWS    = 6;
const GLITCH_CHARS = "!@#$%^&*<>[]{}|/\\~`XZQW01";
const REAL_TEXT    = "CINEVERSE";

// fast=false → full 4.4s intro (Home page)
// fast=true  → snappy 1.8s transition (route changes)
const CinemaLoader = ({ onComplete, fast = false }) => {
  const [progress,    setProgress]    = useState(0);
  const [phase,       setPhase]       = useState("intro");
  const [glitchText,  setGlitchText]  = useState(REAL_TEXT);
  const loaderRef = useRef(null);
  const rafRef    = useRef(null);

  const DURATION   = fast ? 1000 : 2800;
  const T_LOADING  = fast ? 100  : 400;
  const T_GLITCH   = fast ? 1000 : 2900;
  const T_EXIT     = fast ? 1300 : 3600;
  const T_COMPLETE = fast ? 1900 : 4400;

  const scramble = () => {
    let i = 0;
    const tick = () => {
      setGlitchText(
        REAL_TEXT.split("").map((char, idx) =>
          idx < i ? char : GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
        ).join("")
      );
      i += 0.4;
      if (i < REAL_TEXT.length + 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setGlitchText(REAL_TEXT);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  // Progress bar
  useEffect(() => {
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min(((now - start) / DURATION) * 100, 100);
      setProgress(Math.floor(p));
      if (p < 100) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // Phase sequence
  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase("loading"),               T_LOADING),
      setTimeout(() => { setPhase("glitch"); scramble(); }, T_GLITCH),
      setTimeout(() => setPhase("exit"),                  T_EXIT),
      setTimeout(() => onComplete?.(),                    T_COMPLETE),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  // GSAP grid exit
  useEffect(() => {
    if (phase !== "exit") return;
    const cells = loaderRef.current?.querySelectorAll(".loader-cell");
    if (!cells?.length) return;
    gsap.to(cells, {
      scaleY: 0,
      transformOrigin: "top center",
      duration: fast ? 0.3 : 0.5,
      stagger: { amount: fast ? 0.3 : 0.6, from: "random" },
      ease: "power4.in",
    });
    gsap.to(loaderRef.current, { opacity: 0, duration: 0.2, delay: fast ? 0.4 : 0.7 });
  }, [phase]);

  return (
    <div ref={loaderRef} className={`cinema-loader phase-${phase}`}>
      <div className="cinema-loader__grid">
        {Array.from({ length: GRID_COLS * GRID_ROWS }).map((_, i) => (
          <div key={i} className="loader-cell" />
        ))}
      </div>

      <div className="cinema-loader__scanlines" />

      <div className="cinema-loader__filmstrip cinema-loader__filmstrip--left">
        {Array.from({ length: FILM_FRAMES }).map((_, i) => (
          <div key={i} className="film-frame">
            <div className="film-hole film-hole--tl" />
            <div className="film-hole film-hole--tr" />
            <div className="film-content" style={{ animationDelay: `${i * 0.1}s` }} />
            <div className="film-hole film-hole--bl" />
            <div className="film-hole film-hole--br" />
          </div>
        ))}
      </div>

      <div className="cinema-loader__filmstrip cinema-loader__filmstrip--right">
        {Array.from({ length: FILM_FRAMES }).map((_, i) => (
          <div key={i} className="film-frame">
            <div className="film-hole film-hole--tl" />
            <div className="film-hole film-hole--tr" />
            <div className="film-content" style={{ animationDelay: `${i * 0.15}s` }} />
            <div className="film-hole film-hole--bl" />
            <div className="film-hole film-hole--br" />
          </div>
        ))}
      </div>

      <div className="cinema-loader__center">
        <div className="cinema-loader__crosshair">
          <div className="ch-h" /><div className="ch-v" />
          <div className="ch-circle" /><div className="ch-circle ch-circle--2" />
          <div className="ch-dot" />
          <div className="ch-corner ch-corner--tl" /><div className="ch-corner ch-corner--tr" />
          <div className="ch-corner ch-corner--bl" /><div className="ch-corner ch-corner--br" />
        </div>

        <div className="cinema-loader__logo">
          <div className="logo-eyebrow">INITIALIZING SYSTEM</div>
          <div className="logo-text">{glitchText}</div>
          <div className="logo-sub">PREMIUM CINEMA PLATFORM</div>
        </div>

        <div className="cinema-loader__progress">
          <div className="progress-header">
            <span className="progress-label">LOADING ASSETS</span>
            <span className="progress-num">{String(progress).padStart(3, "0")}%</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
            <div className="progress-glow" style={{ left: `${progress}%` }} />
          </div>
          <div className="progress-segments">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className={`seg ${progress >= (i + 1) * 5 ? "active" : ""}`} />
            ))}
          </div>
        </div>

        <div className="cinema-loader__status">
          {progress < 30  && <span key="a">◈ CONNECTING TO DATABASE...</span>}
          {progress >= 30 && progress < 60  && <span key="b">◈ FETCHING MOVIE CATALOG...</span>}
          {progress >= 60 && progress < 85  && <span key="c">◈ LOADING TRAILERS...</span>}
          {progress >= 85 && progress < 100 && <span key="d">◈ PREPARING EXPERIENCE...</span>}
          {progress >= 100 && <span key="e" className="status-ready">◈ SYSTEM READY</span>}
        </div>
      </div>

      <div className="cinema-loader__corner cinema-loader__corner--tl">
        <span>CINE</span><span>v2.0</span>
      </div>
      <div className="cinema-loader__corner cinema-loader__corner--tr">
        <span>RES 4K</span><span>HDR</span>
      </div>
      <div className="cinema-loader__corner cinema-loader__corner--bl">
        <span>SYS:BOOT</span><span>{String(progress).padStart(3, "0")}</span>
      </div>
      <div className="cinema-loader__corner cinema-loader__corner--br">
        <span>DOLBY</span><span>ATMOS</span>
      </div>

      <div className="cinema-loader__datalines">
        <div className="dl dl--top" /><div className="dl dl--bottom" />
      </div>
    </div>
  );
};

export default CinemaLoader;