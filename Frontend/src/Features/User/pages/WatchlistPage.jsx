import UserPageLayout from "../components/userPageLayout";
import useWatchlist from "../hooks/useWatchlist";
import MovieCard from "../../Movies/components/Moviecard";
import { SkeletonGrid } from "../../Movies/components/MovieSkeleton";
import { Link } from "react-router-dom";
import "../styles/userPages.scss";

const WatchlistPage = () => {
  const { watchlist, loading, error, removeWatchlist } = useWatchlist();

  // Normalise backend shape → MovieCard shape
  const toCardShape = (w) => ({
    id:           w.movieId,
    title:        w.title,
    poster_path:  w.posterPath  || null,
    vote_average: w.rating      || 0,
    media_type:   w.mediaType   || "movie",
    release_date: w.year ? `${w.year}-01-01` : "",
  });

  return (
    <UserPageLayout>
      <div className="user-page">

        {/* ── Header ── */}
        <div className="user-page__header">
          <div className="user-page__header-left">
            <p className="user-page__eyebrow">◈ Your Next Watch</p>
            <h1 className="user-page__title">WATCHLIST</h1>
            {!loading && (
              <span className="user-page__count">
                {watchlist.length} {watchlist.length === 1 ? "title" : "titles"}
              </span>
            )}
          </div>
        </div>

        {/* ── Error ── */}
        {error && <p className="user-page__error">{error}</p>}

        {/* ── Loading ── */}
        {loading && (
          <div className="user-page__skeleton-grid">
            <SkeletonGrid count={12} />
          </div>
        )}

        {/* ── Empty ── */}
        {!loading && !error && watchlist.length === 0 && (
          <div className="user-page__empty">
            <div className="user-page__empty-icon">📌</div>
            <h3>NO WATCHLIST YET</h3>
            <p>Save movies and shows you want to watch later.</p>
            <Link to="/browse">Browse titles →</Link>
          </div>
        )}

        {/* ── Grid ── */}
        {!loading && watchlist.length > 0 && (
          <div className="user-page__grid">
            {watchlist.map((w) => (
              <MovieCard
                key={w.movieId}
                movie={toCardShape(w)}
                onRemove={() => removeWatchlist(w.movieId)}
                showRemove
              />
            ))}
          </div>
        )}

      </div>
    </UserPageLayout>
  );
};

export default WatchlistPage;
