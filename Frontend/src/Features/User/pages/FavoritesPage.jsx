import UserPageLayout from "../components/UserPageLayout";
import useFavorites from "../hooks/useFavorites";
import MovieCard from "../../Movies/components/MovieCard";
import { SkeletonGrid } from "../../Movies/components/MovieSkeleton";
import { Link } from "react-router-dom";
import "../styles/UserPages.scss";

const FavoritesPage = () => {
  const { favorites, loading, error, removeFavorite } = useFavorites();

  // Normalise backend shape → MovieCard shape
  const toCardShape = (fav) => ({
    id:           fav.movieId,
    title:        fav.title,
    poster_path:  fav.posterPath  || null,
    vote_average: fav.rating      || 0,
    media_type:   fav.mediaType   || "movie",
    release_date: fav.year ? `${fav.year}-01-01` : "",
  });

  return (
    <UserPageLayout>
      <div className="user-page">

        {/* ── Header ── */}
        <div className="user-page__header">
          <div className="user-page__header-left">
            <p className="user-page__eyebrow">◈ Your Collection</p>
            <h1 className="user-page__title">FAVORITES</h1>
            {!loading && (
              <span className="user-page__count">
                {favorites.length} {favorites.length === 1 ? "title" : "titles"}
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
        {!loading && !error && favorites.length === 0 && (
          <div className="user-page__empty">
            <div className="user-page__empty-icon">♡</div>
            <h3>NO FAVORITES YET</h3>
            <p>Save movies and shows you love to find them here.</p>
            <Link to="/browse">Browse titles →</Link>
          </div>
        )}

        {/* ── Grid ── */}
        {!loading && favorites.length > 0 && (
          <div className="user-page__grid">
            {favorites.map((fav) => (
              <MovieCard
                key={fav.movieId}
                movie={toCardShape(fav)}
                onRemove={() => removeFavorite(fav.movieId)}
                showRemove
              />
            ))}
          </div>
        )}

      </div>
    </UserPageLayout>
  );
};

export default FavoritesPage;