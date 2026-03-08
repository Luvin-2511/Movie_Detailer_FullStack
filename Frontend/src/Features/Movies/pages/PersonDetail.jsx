import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import usePersonDetail from "../hooks/usePersonDetail";
import MovieCard from "../components/Moviecard";
import Navbar from "../components/Navbar";
import "../styles/moviedetail.scss";
import "../styles/movieskeleton.scss";

const IMG_BASE_PROFILE = "https://image.tmdb.org/t/p/w500";
const PLACEHOLDER_PROFILE = "https://via.placeholder.com/500x750/060608/333?text=NO+IMAGE";

const PersonDetail = () => {
  const { id } = useParams();
  const { detail, credits, loading, error } = usePersonDetail(id);

  useEffect(() => { window.scrollTo(0, 0); }, [id]);

  if (loading) {
    return (
      <div className="detail">
        <Navbar />
        <div className="detail__skeleton">
          <div className="detail__skeleton-hero shimmer" />
          <div className="detail__skeleton-body">
            <div className="sk-title shimmer" />
            <div className="sk-meta shimmer" />
            <div className="sk-text shimmer" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className="detail">
        <Navbar />
        <div className="detail__error-state">
          <p>{error || "Person not found."}</p>
          <Link to="/browse">← Back to Browse</Link>
        </div>
      </div>
    );
  }

  const name = detail.name || "Unknown";
  const department = detail.known_for_department || "Actor";
  const biography = detail.biography || "Biography not available.";
  const profileUrl = detail.profile_path ? `${IMG_BASE_PROFILE}${detail.profile_path}` : PLACEHOLDER_PROFILE;

  return (
    <div className="detail">
      <Navbar />

      {/* ── Hero ── */}
      <section className="detail__hero">
        <div className="detail__hero-backdrop" style={{ overflow: "hidden" }}>
          {/* We use profile as backdrop with a heavy blur */}
          <img src={profileUrl} alt={name} style={{ width: "100%", filter: "blur(40px) brightness(0.4)", transform: "scale(1.2)", objectFit: "cover" }} />
        </div>
        <div className="detail__hero-gradient" />

        <div className="detail__hero-content" style={{ display: "flex", gap: "3rem", flexWrap: "wrap", alignItems: "flex-start" }}>
          <img
            src={profileUrl}
            alt={name}
            style={{ width: "240px", borderRadius: "12px", objectFit: "cover", boxShadow: "0 20px 40px rgba(0,0,0,0.6)" }}
          />

          <div style={{ flex: 1, minWidth: "300px" }}>
            <h1 className="detail__hero-title" style={{ fontSize: "clamp(3rem, 5vw, 4.5rem)", marginBottom: "0.5rem" }}>{name}</h1>

            <div className="detail__hero-meta" style={{ marginBottom: "1.5rem" }}>
              <span className="meta-item">{department.toUpperCase()}</span>
              {detail.birthday && (
                <>
                  <span className="meta-dot" />
                  <span className="meta-item">BORN: {detail.birthday}</span>
                </>
              )}
              {detail.place_of_birth && (
                <>
                  <span className="meta-dot" />
                  <span className="meta-item">{detail.place_of_birth}</span>
                </>
              )}
            </div>

            <p className="detail__hero-overview" style={{ whiteSpace: "pre-line", maxHeight: "400px", overflowY: "auto", paddingRight: "15px", lineHeight: "1.8", opacity: 0.85 }}>
              {biography}
            </p>
          </div>
        </div>
      </section>

      {/* ── Body ── */}
      <div className="detail__body">
        {/* ── Known For section ── */}
        {credits.length > 0 && (
          <section className="detail__similar-section">
            <h2>KNOWN FOR</h2>
            <div className="detail__similar-grid">
              {credits.map((movie) => (
                <MovieCard
                  key={`${movie.id}-${movie.media_type}`}
                  movie={movie}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default PersonDetail;
