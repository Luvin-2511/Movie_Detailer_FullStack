import { useRef, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import useAuth from "../../Auth/hooks/useAuth";
import "../styles/Navbar.scss";

const Navbar = () => {
  const overlayRef   = useRef(null);
  const menuLinksRef = useRef([]);
  const blocksRef    = useRef(null);
  const location     = useLocation().pathname;
  const navigate     = useNavigate();
  const { user, isAdmin, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mounted,  setMounted]  = useState(false);

  const isHome = location === "/";

  const menuItems = [
    { label: "Browse",    to: "/browse"    },
    { label: "Favorites", to: "/favorites", auth: true      },
    { label: "History",   to: "/history",   auth: true      },
    { label: "Admin",     to: "/admin",     adminOnly: true  },
  ].filter((item) => {
    if (item.adminOnly) return isAdmin;
    if (item.auth)      return !!user;
    return true;
  });

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (overlayRef.current)
      gsap.set(overlayRef.current, { display: "none", yPercent: -100 });
    setScrolled(false);
  }, [location]);

  useEffect(() => {
    if (isHome) return;
    const onScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome, location]);

  useEffect(() => {
    if (isHome || !blocksRef.current) return;
    gsap.to(blocksRef.current, {
      y: scrolled ? -180 : 0,
      duration: 0.5,
      ease: "power3.inOut",
    });
  }, [scrolled, isHome]);

  const openMenu = () => {
    gsap.set(overlayRef.current, { display: "flex", yPercent: -100 });
    gsap.to(overlayRef.current, { yPercent: 0, duration: 0.65, ease: "power3.inOut" });
    gsap.fromTo(
      menuLinksRef.current.filter(Boolean),
      { yPercent: 110, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 0.55, stagger: 0.07, ease: "power3.out", delay: 0.3 }
    );
  };

  const closeMenu = () => {
    gsap.to(overlayRef.current, {
      yPercent: -100, duration: 0.55, ease: "power3.inOut",
      onComplete: () => gsap.set(overlayRef.current, { display: "none" }),
    });
  };

  const handleNavClick = (to) => { closeMenu(); setTimeout(() => navigate(to), 320); };
  const handleLogout   = ()   => { closeMenu(); setTimeout(() => logout(), 320); };

  return (
    <>
      <div ref={overlayRef} className="nav-overlay">
        <Link to="/" onClick={closeMenu} className="nav-overlay__logo">CINEVERSE</Link>
        <button className="nav-overlay__close" onClick={closeMenu}><span /><span /></button>

        <nav className="nav-overlay__links">
          {menuItems.map((item, i) => (
            <div key={item.to} className="nav-overlay__item"
              ref={(el) => (menuLinksRef.current[i] = el)}>
              <button className="nav-overlay__link" onClick={() => handleNavClick(item.to)}>
                <span className="nav-overlay__link-num">0{i + 1}</span>
              {item.label}
                <span className="nav-overlay__link-arrow">→</span>
              </button>
            </div>
          ))}
          {user && (
            <div className="nav-overlay__item nav-overlay__item--logout"
              ref={(el) => (menuLinksRef.current[menuItems.length] = el)}>
              <button className="nav-overlay__link nav-overlay__link--logout" onClick={handleLogout}>
                <span className="nav-overlay__link-num">—</span>Logout
              </button>
            </div>
          )}
        </nav>

        {user && (
          <div className="nav-overlay__user">
            <span className="nav-overlay__user-dot" />
            <span>{user.name || user.email}</span>
            {isAdmin && <span className="nav-overlay__user-badge">ADMIN</span>}
          </div>
        )}
        <div className="nav-overlay__footer">
          <span>© {new Date().getFullYear()} CINEVERSE</span>
          <span>ALL RIGHTS RESERVED</span>
        </div>
      </div>

      {isHome && mounted && (
        <div className="nav-home-trigger" onClick={openMenu}>
          <div className="nav-home-trigger__bg" />
          <div className="nav-home-trigger__line nav-home-trigger__line--long" />
          <div className="nav-home-trigger__line nav-home-trigger__line--short" />
        </div>
      )}

      {!isHome && mounted && (
        <div className="nav-blocks" ref={blocksRef}>
          <div className="nav-block nav-block--menu" onClick={openMenu}>
            <div className="nav-block__hover-bg" />
            <div className="nav-block__lines">
              <span className="nav-block__line nav-block__line--long" />
              <span className="nav-block__line nav-block__line--short" />
            </div>
            <span className="nav-block__label">MENU</span>
          </div>
          <div className="nav-block nav-block--mid" onClick={openMenu}>
            <div className="nav-block__hover-bg" />
            <span className="nav-block__label">BROWSE</span>
          </div>
          <div className="nav-block nav-block--wide" onClick={openMenu}>
            <div className="nav-block__hover-bg" />
            <span className="nav-block__label">
              {user ? (user.name || user.email).toUpperCase() : "EXPLORE"}
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;