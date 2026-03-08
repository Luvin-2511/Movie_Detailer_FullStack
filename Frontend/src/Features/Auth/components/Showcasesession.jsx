import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../styles/showcasesession.scss";

gsap.registerPlugin(ScrollTrigger);

// ── Data ──────────────────────────────────────────────────────
const MORPHING_WORDS = ["DISCOVER", "EXPLORE", "OBSESS", "DEVOUR", "LIVE"];

const CARDS = [
  { id: 1, label: "TRENDING", num: "01", accent: "#e8ff00", title: "What the world is watching — right now.", tag: "LIVE DATA" },
  { id: 2, label: "TRAILERS", num: "02", accent: "#ff3c5a", title: "Every drop. Every scene. Before anyone else.", tag: "4K HDR" },
  { id: 3, label: "WATCHLIST", num: "03", accent: "#00c8ff", title: "Your cinema. Curated by you. Synced forever.", tag: "PERSONAL" },
  { id: 4, label: "HISTORY",  num: "04", accent: "#b47cff", title: "Every title you've touched. Every moment saved.", tag: "CLOUD SYNC" },
];

const GENRES = [
  "ACTION", "DRAMA", "SCI-FI", "THRILLER", "HORROR", "ROMANCE",
  "DOCUMENTARY", "ANIMATION", "CRIME", "FANTASY", "MYSTERY", "BIOGRAPHY",
  "ACTION", "DRAMA", "SCI-FI", "THRILLER", "HORROR", "ROMANCE",
  "DOCUMENTARY", "ANIMATION", "CRIME", "FANTASY", "MYSTERY", "BIOGRAPHY",
];

const STATS_DATA = [
  { value: 50000, suffix: "+", label: "TITLES" },
  { value: 4,     suffix: "K",  label: "RESOLUTION" },
  { value: 120,   suffix: "M+", label: "STREAMS / DAY" },
  { value: 99,    suffix: "%",  label: "UPTIME" },
];

// ── Magnetic card hook ────────────────────────────────────────
const useMagnetic = (strength = 0.35) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * strength;
      const dy = (e.clientY - cy) * strength;
      gsap.to(el, { x: dx, y: dy, duration: 0.4, ease: "power2.out" });
    };

    const onLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.5)" });
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return ref;
};

// ── Morphing word component ───────────────────────────────────
const MorphingWord = () => {
  const [index, setIndex] = useState(0);
  const [chars, setChars] = useState(MORPHING_WORDS[0].split(""));
  const GLITCH = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (index + 1) % MORPHING_WORDS.length;
      const target = MORPHING_WORDS[nextIndex];
      let iteration = 0;
      const raf = () => {
        setChars(
          target.split("").map((char, i) =>
            i < iteration
              ? char
              : GLITCH[Math.floor(Math.random() * GLITCH.length)]
          )
        );
        iteration += 0.5;
        if (iteration <= target.length) requestAnimationFrame(raf);
        else setChars(target.split(""));
      };
      requestAnimationFrame(raf);
      setIndex(nextIndex);
    }, 2200);
    return () => clearInterval(interval);
  }, [index]);

  return (
    <span className="morphing-word">
      {chars.map((c, i) => (
        <span key={i} className="morphing-word__char" style={{ "--ci": i }}>
          {c}
        </span>
      ))}
    </span>
  );
};

// ── Animated stat counter ─────────────────────────────────────
const StatCounter = ({ value, suffix, label, active }) => {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!active) return;
    let start = 0;
    const duration = 1800;
    const startTime = performance.now();
    const tick = (now) => {
      const p = Math.min((now - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 4);
      setDisplay(Math.floor(ease * value));
      if (p < 1) requestAnimationFrame(tick);
      else setDisplay(value);
    };
    requestAnimationFrame(tick);
  }, [active, value]);

  return (
    <div className="showcase__stat">
      <div className="showcase__stat-num">
        {display.toLocaleString()}<span>{suffix}</span>
      </div>
      <div className="showcase__stat-label">{label}</div>
    </div>
  );
};

// ── Card component ────────────────────────────────────────────
const ShowCard = ({ card, index }) => {
  const cardRef = useRef(null);
  const innerRef = useRef(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * -20;
      gsap.to(innerRef.current, {
        rotateX: y, rotateY: x, duration: 0.3, ease: "power2.out",
        transformPerspective: 800,
      });
      gsap.to(el.querySelector(".show-card__shine"), {
        opacity: 1,
        x: `${((e.clientX - rect.left) / rect.width) * 100}%`,
        y: `${((e.clientY - rect.top) / rect.height) * 100}%`,
        duration: 0.1,
      });
    };

    const onLeave = () => {
      gsap.to(innerRef.current, {
        rotateX: 0, rotateY: 0, duration: 0.6, ease: "elastic.out(1, 0.4)",
      });
      gsap.to(el.querySelector(".show-card__shine"), { opacity: 0, duration: 0.3 });
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className="show-card"
      style={{ "--accent": card.accent, "--delay": `${index * 0.12}s` }}
    >
      <div ref={innerRef} className="show-card__inner">
        <div className="show-card__shine" />
        <div className="show-card__noise" />

        <div className="show-card__top">
          <span className="show-card__num">{card.num}</span>
          <span className="show-card__tag">{card.tag}</span>
        </div>

        <div className="show-card__body">
          <h3 className="show-card__label">{card.label}</h3>
          <p className="show-card__title">{card.title}</p>
        </div>

        <div className="show-card__bottom">
          <div className="show-card__bar">
            <div className="show-card__bar-fill" />
          </div>
          <span className="show-card__arrow">→</span>
        </div>

        <div className="show-card__glow" />
      </div>
    </div>
  );
};

// ── Custom cursor ─────────────────────────────────────────────
const SectionCursor = ({ sectionRef }) => {
  const cursorRef = useRef(null);
  const dotRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let cx = 0, cy = 0, tx = 0, ty = 0;
    let raf;

    const lerp = (a, b, n) => a + (b - a) * n;

    const animate = () => {
      cx = lerp(cx, tx, 0.12);
      cy = lerp(cy, ty, 0.12);
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(animate);
    };

    const onMove = (e) => {
      tx = e.clientX;
      ty = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
      }
    };

    const onEnter = () => {
      cursorRef.current?.classList.add("visible");
      dotRef.current?.classList.add("visible");
      raf = requestAnimationFrame(animate);
    };

    const onLeave = () => {
      cursorRef.current?.classList.remove("visible");
      dotRef.current?.classList.remove("visible");
      cancelAnimationFrame(raf);
    };

    section.addEventListener("mousemove", onMove);
    section.addEventListener("mouseenter", onEnter);
    section.addEventListener("mouseleave", onLeave);

    return () => {
      section.removeEventListener("mousemove", onMove);
      section.removeEventListener("mouseenter", onEnter);
      section.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className="showcase-cursor" />
      <div ref={dotRef} className="showcase-cursor__dot" />
    </>
  );
};

// ── Main ShowcaseSection ──────────────────────────────────────
const ShowcaseSection = () => {
  const sectionRef = useRef(null);
  const headlineRef = useRef(null);
  const cardsRef = useRef(null);
  const statsRef = useRef(null);
  const [statsActive, setStatsActive] = useState(false);
  const magnetRef = useMagnetic(0.3);

  useEffect(() => {
    const ctx = gsap.context(() => {

      // ── Headline split reveal ──
      const lines = headlineRef.current?.querySelectorAll(".headline-line");
      gsap.fromTo(lines,
        { yPercent: 110, opacity: 0 },
        {
          yPercent: 0, opacity: 1,
          duration: 1.1,
          stagger: 0.14,
          ease: "power4.out",
          scrollTrigger: {
            trigger: headlineRef.current,
            start: "top 75%",
          },
        }
      );

      // ── Cards entrance ──
      const cards = cardsRef.current?.querySelectorAll(".show-card");
      gsap.fromTo(cards,
        { y: 100, opacity: 0, scale: 0.92 },
        {
          y: 0, opacity: 1, scale: 1,
          duration: 0.9,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 80%",
          },
        }
      );

      // ── Stats trigger ──
      ScrollTrigger.create({
        trigger: statsRef.current,
        start: "top 80%",
        onEnter: () => setStatsActive(true),
      });

      // ── Horizontal scroll reel on scroll ──
      gsap.to(".showcase__genres-track--fwd", {
        xPercent: -30,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        },
      });

      gsap.to(".showcase__genres-track--rev", {
        xPercent: 30,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        },
      });

      // ── Big text parallax ──
      gsap.to(".showcase__bg-text", {
        yPercent: -40,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="showcase">
      <SectionCursor sectionRef={sectionRef} />

      {/* ── Noise grain overlay ── */}
      <div className="showcase__grain" />

      {/* ── Giant parallax BG text ── */}
      <div className="showcase__bg-text" aria-hidden>CINEMA</div>

      {/* ── Top label bar ── */}
      <div className="showcase__topbar">
        <span className="showcase__topbar-label">◈ PLATFORM SHOWCASE</span>
        <div className="showcase__topbar-line" />
        <span className="showcase__topbar-label">SCROLL TO EXPLORE</span>
      </div>

      {/* ── Morphing headline ── */}
      <div ref={headlineRef} className="showcase__headline">
        <div className="headline-wrap">
          <div className="headline-line">
            <span className="headline-static">MADE TO</span>
          </div>
          <div className="headline-line">
            <MorphingWord />
          </div>
          <div className="headline-line">
            <span className="headline-static headline-static--outline">CINEMA.</span>
          </div>
        </div>

        <div className="showcase__headline-meta">
          <p>A platform built for people who take cinema seriously. Every frame matters.</p>
          <div className="showcase__headline-badge" ref={magnetRef}>
            <span>EXPLORE NOW</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7H12M8 3L12 7L8 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
        </div>
      </div>

      {/* ── Genre scroll reels ── */}
      <div className="showcase__genres">
        <div className="showcase__genres-row">
          <div className="showcase__genres-track showcase__genres-track--fwd">
            {GENRES.map((g, i) => (
              <span key={i} className="genre-pill">{g}</span>
            ))}
          </div>
        </div>
        <div className="showcase__genres-row showcase__genres-row--rev">
          <div className="showcase__genres-track showcase__genres-track--rev">
            {[...GENRES].reverse().map((g, i) => (
              <span key={i} className={`genre-pill ${i % 4 === 0 ? "genre-pill--accent" : ""}`}>{g}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── 3D Tilt cards ── */}
      <div ref={cardsRef} className="showcase__cards">
        {CARDS.map((card, i) => (
          <ShowCard key={card.id} card={card} index={i} />
        ))}
      </div>

      {/* ── Stats row ── */}
      <div ref={statsRef} className="showcase__stats">
        <div className="showcase__stats-divider" />
        {STATS_DATA.map((s, i) => (
          <StatCounter key={i} {...s} active={statsActive} />
        ))}
        <div className="showcase__stats-divider" />
      </div>

      {/* ── Bottom tape ── */}
      <div className="showcase__tape">
        <div className="showcase__tape-inner">
          {Array.from({ length: 3 }).map((_, i) =>
            ["THE DARK KNIGHT", "INTERSTELLAR", "PARASITE", "ARRIVAL", "HEREDITARY", "MIDSOMMAR", "TENET", "NOPE"].map((t, j) => (
              <span key={`${i}-${j}`} className="tape-item">
                {t} <span className="tape-dot">◆</span>
              </span>
            ))
          )}
        </div>
      </div>

    </section>
  );
};

export default ShowcaseSection;