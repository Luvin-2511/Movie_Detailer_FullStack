import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import useMovieDetail from "../hooks/useMoviedetail";
import useAuth from "../../Auth/hooks/useAuth";
import useFavorites from "../../User/hooks/useFavorites";
import useWatchlist from "../../User/hooks/useWatchlist";
import { addToHistory } from "../../../store/slices/UserSlice";
import MovieCard from "../components/Moviecard";
import Navbar from "../components/Navbar";
import "../styles/moviedetail.scss";
import "../styles/movieskeleton.scss";

const IMG_BASE_BACKDROP = "https://image.tmdb.org/t/p/original";
const IMG_BASE_POSTER = "https://image.tmdb.org/t/p/w500";
const IMG_BASE_FACE = "https://image.tmdb.org/t/p/w185";
const PLACEHOLDER_FACE = "https://via.placeholder.com/185x278/111/333?text=?";

// ── Trailer Modal ─────────────────────────────────────────────
const TrailerModal = ({ videoKey, onClose }) => {
  // Close on backdrop click
  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="detail__modal-overlay" onClick={handleBackdrop}>
      <button className="detail__modal-overlay-close" onClick={onClose}>✕</button>
      <div className="detail__modal-frame">
        <iframe
          src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&rel=0`}
          title="Trailer"
          allow="autoplay; encrypted-media; fullscreen"
          allowFullScreen
        />
      </div>
    </div>
  );
};

// ── Main Detail Page ──────────────────────────────────────────
const MovieDetail = () => {
  const { type = "movie", id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { addFavorite, removeFavorite, isFavorited } = useFavorites();
  const { addWatchlist, removeWatchlist, isWatchlisted } = useWatchlist();

  const { detail, trailer, cast, similar, loading, error } = useMovieDetail(id, type);
  const [modalOpen, setModalOpen] = useState(false);

  // Scroll to top on mount
  useEffect(() => { window.scrollTo(0, 0); }, [id]);

  // ── Step 4: Auto-save to watch history once detail loads ──
  useEffect(() => {
    if (!detail || !user) return;
    dispatch(addToHistory({
      movieId: String(detail.id),
      title: detail.title || detail.name,
      posterPath: detail.poster_path || "",
      mediaType: type,
      rating: detail.vote_average || 0,
      year: (detail.release_date || detail.first_air_date || "").slice(0, 4),
      watchedAt: new Date().toISOString(),
    }));
  }, [detail?.id]);

  const isFav = detail ? isFavorited(detail.id) : false;

  const toggleFav = () => {
    if (!detail) return;
    const payload = {
      movieId: String(detail.id),
      title: detail.title || detail.name,
      posterPath: detail.poster_path || "",
      mediaType: type,
      rating: detail.vote_average || 0,
      year: (detail.release_date || detail.first_air_date || "").slice(0, 4),
    };
    isFav ? removeFavorite(String(detail.id)) : addFavorite(payload);
  };

  const isWatch = detail ? isWatchlisted(detail.id) : false;

  const toggleWatchlist = () => {
    if (!detail) return;
    const payload = {
      movieId: String(detail.id),
      title: detail.title || detail.name,
      posterPath: detail.poster_path || "",
      mediaType: type,
      rating: detail.vote_average || 0,
      year: (detail.release_date || detail.first_air_date || "").slice(0, 4),
    };
    isWatch ? removeWatchlist(String(detail.id)) : addWatchlist(payload);
  };

  // ── Loading skeleton ──
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

  // ── Error state ──
  if (error || !detail) {
    return (
      <div className="detail">
        <div className="detail__error-state">
          <p>{error || "Movie not found."}</p>
          <Link to="/browse">← Back to Browse</Link>
        </div>
      </div>
    );
  }

  // ── Data helpers ──
  const title = detail.title || detail.name || "Untitled";
  const year = (detail.release_date || detail.first_air_date || "").slice(0, 4);
  const runtime = detail.runtime ? `${Math.floor(detail.runtime / 60)}h ${detail.runtime % 60}m` : null;
  const rating = detail.vote_average?.toFixed(1);
  const votes = detail.vote_count?.toLocaleString();
  const overview = detail.overview || "Description not available.";
  const genres = detail.genres || [];
  const backdrop = detail.backdrop_path ? `${IMG_BASE_BACKDROP}${detail.backdrop_path}` : null;
  const thumbUrl = trailer ? `https://img.youtube.com/vi/${trailer.key}/maxresdefault.jpg` : null;

  return (
    <div className="detail">
      {modalOpen && trailer && (
        <TrailerModal videoKey={trailer.key} onClose={() => setModalOpen(false)} />
      )}
      <Navbar />

      {/* ── Hero ── */}
      <section className="detail__hero">
        <div className="detail__hero-backdrop">
          {backdrop
            ? <img src={backdrop} alt={title} />
            : <div style={{ width: "100%", height: "100%", background: "#111" }} />
          }
        </div>
        <div className="detail__hero-gradient" />

        <div className="detail__hero-content">
          {/* Genres */}
          {genres.length > 0 && (
            <div className="detail__hero-genres">
              {genres.slice(0, 4).map((g) => (
                <span key={g.id}>{g.name}</span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="detail__hero-title">{title}</h1>

          {/* Meta */}
          <div className="detail__hero-meta">
            {rating && (
              <span className="meta-item meta-item--rating">★ {rating}</span>
            )}
            {rating && <span className="meta-dot" />}
            {votes && <span className="meta-item">{votes} votes</span>}
            {year && <><span className="meta-dot" /><span className="meta-item">{year}</span></>}
            {runtime && <><span className="meta-dot" /><span className="meta-item">{runtime}</span></>}
          </div>

          {/* Overview */}
          <p className="detail__hero-overview">{overview}</p>

          {/* Actions */}
          <div className="detail__hero-actions">
            {trailer ? (
              <button className="detail__hero-play" onClick={() => setModalOpen(true)}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
                WATCH TRAILER
              </button>
            ) : (
              <button className="detail__hero-play" disabled style={{ opacity: 0.4, cursor: "not-allowed" }}>
                TRAILER UNAVAILABLE
              </button>
            )}

            <button
              className={`detail__hero-fav ${isFav ? "detail__hero-fav--active" : ""}`}
              onClick={toggleFav}
              title="Favorite"
              style={{ width: "45px", height: "45px", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill={isFav ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
            <button
              className={`detail__hero-fav ${isWatch ? "detail__hero-fav--active" : ""}`}
              onClick={toggleWatchlist}
              title="Watchlist"
              style={{ padding: "0 1.2rem", fontWeight: "600" }}
            >
              {isWatch ? "✓ WATCHLIST" : "+ WATCHLIST"}
            </button>
          </div>
        </div>
      </section>

      {/* ── Body ── */}
      <div className="detail__body">

        {/* ── Trailer thumbnail section ── */}
        <section className="detail__trailer-section">
          <p className="detail__trailer-section-label">◈ Trailer</p>
          <h2>WATCH THE TRAILER</h2>

          {trailer ? (
            <div className="detail__trailer-thumb" onClick={() => setModalOpen(true)}>
              <img
                src={thumbUrl}
                alt="Trailer thumbnail"
                onError={(e) => { e.target.src = `https://img.youtube.com/vi/${trailer.key}/hqdefault.jpg`; }}
              />
              <div className="detail__trailer-thumb-play">
                <div className="play-ring">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <span className="play-label">Play Trailer</span>
              </div>
            </div>
          ) : (
            <div className="detail__trailer-unavailable">
              Trailer for this movie is currently unavailable.
            </div>
          )}
        </section>

        {/* ── Cast section ── */}
        {cast.length > 0 && (
          <section className="detail__cast-section">
            <h2>CAST</h2>
            <div className="detail__cast-grid">
              {cast.map((member) => (
                <div key={member.id} className="detail__cast-card">
                  <img
                    className="detail__cast-card-img"
                    src={member.profile_path ? `${IMG_BASE_FACE}${member.profile_path}` : PLACEHOLDER_FACE}
                    alt={member.name}
                    loading="lazy"
                    onError={(e) => { e.target.src = PLACEHOLDER_FACE; }}
                  />
                  <p className="detail__cast-card-name">{member.name}</p>
                  <p className="detail__cast-card-character">{member.character}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Similar movies ── */}
        {similar.length > 0 && (
          <section className="detail__similar-section">
            <h2>YOU MIGHT ALSO LIKE</h2>
            <div className="detail__similar-grid">
              {similar.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={{ ...movie, media_type: type }}
                />
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
};

export default MovieDetail;