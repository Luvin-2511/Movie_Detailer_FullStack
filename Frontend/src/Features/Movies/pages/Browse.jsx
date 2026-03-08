import { useRef, useState, useEffect } from "react";
import useMovies from "../hooks/useMovies";
import useInfiniteScroll from "../hooks/Useinfinitescroll";
import MovieCard from "../components/Moviecard";
import { SkeletonGrid } from "../components/MovieSkeleton";
import Navbar from "../components/Navbar";
import { fetchGenresAPI } from "../services/movies.api";
import "../styles/browse.scss";

const CATEGORIES = [
  { key: "trending", label: "Trending"  },
  { key: "movies",   label: "Movies"    },
  { key: "tv",       label: "TV Shows"  },
  { key: "toprated", label: "Top Rated" },
];

const Browse = () => {
  const [genresList, setGenresList] = useState([]);
  const {
    movies, loading, error, hasMore, loadMore,
    activeCategory, searchQuery, genreId, changeCategory, changeSearch, changeGenre
  } = useMovies();

  // Fetch genres on mount
  useEffect(() => {
    fetchGenresAPI()
      .then(res => setGenresList(res.data.genres || []))
      .catch(err => console.error("Failed to load genres:", err));
  }, []);

  const sentinelRef = useInfiniteScroll(loadMore, hasMore && !loading);
  const isSearching = searchQuery.trim().length > 0;
  const activeLabel = CATEGORIES.find((c) => c.key === activeCategory)?.label || "Trending";

  return (
    <div className="browse">
      <Navbar />

      {/* ── Header ── */}
      <div className="browse__header">
        <p className="browse__header-eyebrow">◈ Explore</p>
        <h1 className="browse__header-title">
          {isSearching ? `RESULTS FOR "${searchQuery.toUpperCase()}"` : activeLabel.toUpperCase()}
        </h1>
      </div>

      {/* ── Controls ── */}
      <div className="browse__controls">
        <div className="browse__tabs">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              className={`browse__tab ${activeCategory === cat.key && !isSearching ? "browse__tab--active" : ""}`}
              onClick={() => changeCategory(cat.key)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="browse__search">
          <svg className="browse__search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Search movies, shows..."
            value={searchQuery}
            onChange={(e) => changeSearch(e.target.value)}
          />
          {searchQuery && (
            <button className="browse__search-clear" onClick={() => changeSearch("")}>×</button>
          )}
        </div>

        {/* ── Genre Dropdown ── */}
        {(activeCategory === "movies" || activeCategory === "tv") && !isSearching && (
          <div className="browse__genre-filter">
            <select
              value={genreId || ""}
              onChange={(e) => changeGenre(e.target.value)}
              className="browse__genre-select"
              style={{
                marginLeft: "1rem",
                padding: "0.55rem 1rem",
                background: "rgba(var(--text-rgb), 0.03)",
                border: "1px solid rgba(var(--text-rgb), 0.08)",
                color: "var(--text-color)",
                borderRadius: "30px",
                fontFamily: "DM Sans, sans-serif",
                fontSize: "0.85rem",
                outline: "none",
                cursor: "pointer"
              }}
            >
              <option value="">All Genres</option>
              {genresList.map(g => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </div>
        )}

        {!loading && movies.length > 0 && (
          <span className="browse__count">{movies.length} titles</span>
        )}
      </div>

      {/* ── Grid ── */}
      <div className="browse__grid">
        {error && <div className="browse__error">{error}</div>}
        {loading && movies.length === 0 && <SkeletonGrid count={20} />}
        {!loading && !error && movies.length === 0 && (
          <div className="browse__empty">
            <div className="empty-icon">🎬</div>
            <h3>NOTHING FOUND</h3>
            <p>Try a different search or category.</p>
          </div>
        )}
        {movies.map((movie) => (
          <MovieCard key={`${movie.id}-${movie.media_type}`} movie={movie} />
        ))}
        {loading && movies.length > 0 && (
          <div className="browse__loader"><div className="browse__loader-ring" /></div>
        )}
        {!hasMore && movies.length > 0 && !loading && (
          <div className="browse__end">End of results</div>
        )}
        <div ref={sentinelRef} className="browse__sentinel" />
      </div>
    </div>
  );
};

export default Browse;