import { useRef } from "react";
import useMovies from "../hooks/useMovies";
import useInfiniteScroll from "../hooks/useinfinitescroll";
import MovieCard from "../components/Moviecard";
import { SkeletonGrid } from "../components/MovieSkeleton";
import Navbar from "../components/Navbar";
import "../styles/Browse.scss";

const CATEGORIES = [
  { key: "trending", label: "Trending"  },
  { key: "movies",   label: "Movies"    },
  { key: "tv",       label: "TV Shows"  },
  { key: "toprated", label: "Top Rated" },
];

const Browse = () => {
  const {
    movies, loading, error, hasMore, loadMore,
    activeCategory, searchQuery, changeCategory, changeSearch,
  } = useMovies();

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