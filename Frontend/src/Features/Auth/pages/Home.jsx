import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import CinemaLoader from "../components/CinemaLoader";
import ShowcaseSection from "../components/Showcasesession";
import "../styles/home.scss";

gsap.registerPlugin(ScrollTrigger);

// ─── Three.js particle field ────────────────────────────────
const initThree = (canvas) => {
  const W = window.innerWidth;
  const H = window.innerHeight;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(W, H);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 100);
  camera.position.z = 4;

  // Particle geometry
  const count = 2500;
  const positions = new Float32Array(count * 3);
  const scales = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    positions[i * 3 + 0] = (Math.random() - 0.5) * 12;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 5;
    scales[i] = Math.random();
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));

  const mat = new THREE.PointsMaterial({
    size: 0.012,
    color: new THREE.Color("#e8ff00"),
    transparent: true,
    opacity: 0.55,
    sizeAttenuation: true,
  });

  const particles = new THREE.Points(geo, mat);
  scene.add(particles);

  // Floating ring
  const ringGeo = new THREE.TorusGeometry(2.2, 0.004, 16, 120);
  const ringMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color("#e8ff00"),
    transparent: true,
    opacity: 0.08,
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = Math.PI / 2.5;
  scene.add(ring);

  const ring2 = new THREE.Mesh(
    new THREE.TorusGeometry(1.5, 0.002, 16, 120),
    new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.04 })
  );
  ring2.rotation.x = Math.PI / 3;
  ring2.rotation.y = Math.PI / 6;
  scene.add(ring2);

  // Mouse interaction
  let mouseX = 0, mouseY = 0;
  const onMouseMove = (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 0.4;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 0.4;
  };
  window.addEventListener("mousemove", onMouseMove);

  const onResize = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  };
  window.addEventListener("resize", onResize);

  let animId;
  const clock = new THREE.Clock();
  const animate = () => {
    animId = requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    particles.rotation.y = t * 0.018;
    particles.rotation.x = mouseY * 0.3;
    particles.rotation.z = mouseX * 0.2;

    ring.rotation.z = t * 0.06;
    ring2.rotation.z = -t * 0.04;

    camera.position.x += (mouseX - camera.position.x) * 0.04;
    camera.position.y += (-mouseY - camera.position.y) * 0.04;

    renderer.render(scene, camera);
  };
  animate();

  return () => {
    cancelAnimationFrame(animId);
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("resize", onResize);
    renderer.dispose();
  };
};

// ─── Marquee data ───────────────────────────────────────────
const MARQUEE_ITEMS = [
  "TRENDING NOW", "OPPENHEIMER", "DUNE PART TWO", "THE BATMAN",
  "PAST LIVES", "POOR THINGS", "KILLERS OF THE FLOWER MOON",
  "PRISCILLA", "MAESTRO", "ANATOMY OF A FALL",
];

const FEATURES = [
  { icon: "🔥", title: "TRENDING", desc: "Real-time trending movies and shows fetched live from TMDB. Always fresh, always now." },
  { icon: "🎬", title: "TRAILERS", desc: "Watch trailers without leaving the app. YouTube-powered previews in an immersive modal." },
  { icon: "♾️", title: "INFINITE SCROLL", desc: "Never hit a wall. Content loads seamlessly as you explore, no pagination needed." },
  { icon: "❤️", title: "FAVORITES", desc: "Bookmark your must-watch movies. Your list syncs to the cloud across all devices." },
  { icon: "🕐", title: "WATCH HISTORY", desc: "Every title you open or preview is logged. Pick up exactly where you left off." },
  { icon: "🛡️", title: "ADMIN PANEL", desc: "Full control dashboard. Manage movies, moderate users, and keep the platform clean." },
];

// ─── Home Component ─────────────────────────────────────────
const Home = () => {
  const canvasRef = useRef(null);
  const navRef = useRef(null);
  const heroRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  // Three.js init after loader
  useEffect(() => {
    if (!loaded || !canvasRef.current) return;
    const cleanup = initThree(canvasRef.current);
    return cleanup;
  }, [loaded]);

  // GSAP scroll animations
  useEffect(() => {
    if (!loaded) return;

    // Nav scroll behavior
    const handleScroll = () => {
      if (navRef.current) {
        navRef.current.classList.toggle("scrolled", window.scrollY > 60);
      }
    };
    window.addEventListener("scroll", handleScroll);

    // Hero elements reveal
    const heroEls = heroRef.current?.querySelectorAll("[data-gsap]");
    heroEls?.forEach((el) => el.classList.add("visible"));

    // Feature cards stagger
    gsap.fromTo(".home-page__features-card",
      { opacity: 0, y: 60 },
      {
        opacity: 1, y: 0, duration: 0.8, stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".home-page__features-grid",
          start: "top 80%",
        },
      }
    );

    // Stats counter
    gsap.fromTo(".home-page__stats-item",
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0, duration: 0.7, stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".home-page__stats",
          start: "top 85%",
        },
      }
    );

    // Footer CTA
    gsap.fromTo(".home-page__footer-cta h2",
      { opacity: 0, y: 80 },
      {
        opacity: 1, y: 0, duration: 1.2,
        ease: "power4.out",
        scrollTrigger: { trigger: ".home-page__footer-cta", start: "top 75%" },
      }
    );

    return () => window.removeEventListener("scroll", handleScroll);
  }, [loaded]);

  return (
    <>
      {/* ── CINEMA LOADER ── */}
      {!loaded && <CinemaLoader onComplete={() => setLoaded(true)} />}

      {loaded && (
        <div className="home-page">
          {/* ── NAV ── */}
          <nav className="home-page__nav" ref={navRef}>
            <Link to="/" className="home-page__nav-logo">CINEVERSE</Link>
            <ul className="home-page__nav-links">
              {["Trending", "Movies", "TV Shows", "People"].map((l) => (
                <li key={l}><a href="#">{l}</a></li>
              ))}
            </ul>
            <div className="home-page__nav-actions">
              <Link to="/login" className="nav-login">Sign In</Link>
              <Link to="/register" className="nav-cta">Get Started</Link>
            </div>
          </nav>

          {/* ── HERO ── */}
          <section className="home-page__hero" ref={heroRef}>
            <canvas className="home-page__hero-canvas" ref={canvasRef} />
            <div className="home-page__hero-overlay" />

            <div className="home-page__hero-content">
              <p className="home-page__hero-eyebrow" data-gsap>
                ◈ The Ultimate Cinema Platform
              </p>
              <h1 className="home-page__hero-title" data-gsap>
                DISCOVER<br />
                YOUR NEXT<br />
                <span className="line-accent">OBSESSION.</span>
              </h1>

              <div className="home-page__hero-meta" data-gsap>
                {["4K TRAILERS", "50K+ TITLES", "LIVE TRENDING"].map((t) => (
                  <span key={t} className="home-page__hero-meta-tag">{t}</span>
                ))}
              </div>

              <div className="home-page__hero-cta" data-gsap>
                <Link to="/register" className="btn-primary">
                  START EXPLORING ›
                </Link>
                <Link to="/login" className="btn-ghost">
                  SIGN IN
                </Link>
              </div>
            </div>

            <div className="home-page__hero-scroll">
              <span>Scroll</span>
              <div className="scroll-line" />
            </div>
          </section>

          {/* ── MARQUEE ── */}
          <div className="home-page__marquee">
            <div className="home-page__marquee-inner">
              {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
                <div key={i} className="home-page__marquee-item">
                  {item} <span className="dot" />
                </div>
              ))}
            </div>
          </div>

          {/* ── SHOWCASE SECTION ── */}
          <ShowcaseSection />

          {/* ── FEATURES ── */}
          <section className="home-page__features">
            <div className="home-page__features-header">
              <p className="section-label">◈ Platform Features</p>
              <h2>EVERYTHING<br />YOU NEED.</h2>
            </div>
            <div className="home-page__features-grid">
              {FEATURES.map((f, i) => (
                <div key={i} className="home-page__features-card">
                  <span className="feature-icon">{f.icon}</span>
                  <p className="feature-num">0{i + 1}</p>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── STATS ── */}
          <section className="home-page__stats">
            {[
              { num: "50K+", label: "Movies & Shows" },
              { num: "4K", label: "Stream Quality" },
              { num: "100M+", label: "Data Points" },
              { num: "∞", label: "Your Watchlist" },
            ].map((s) => (
              <div key={s.label} className="home-page__stats-item">
                <div className="stat-num">{s.num}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </section>

          {/* ── FOOTER CTA ── */}
          <section className="home-page__footer-cta">
            <h2>
              READY TO<br />
              <span>WATCH?</span>
            </h2>
            <p>Join millions discovering great cinema every day.</p>
            <div className="cta-group">
              <Link to="/register" className="btn-primary">
                CREATE FREE ACCOUNT
              </Link>
            </div>
          </section>
        </div>
      )}
    </>
  );
};

export default Home;