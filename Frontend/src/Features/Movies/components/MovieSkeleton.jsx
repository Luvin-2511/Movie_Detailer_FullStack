import "../styles/MovieSkeleton.scss";

const MovieSkeleton = () => (
  <div className="movie-skeleton">
    <div className="movie-skeleton__poster shimmer" />
    <div className="movie-skeleton__info">
      <div className="movie-skeleton__title shimmer" />
      <div className="movie-skeleton__year shimmer" />
    </div>
  </div>
);

export const SkeletonGrid = ({ count = 20 }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <MovieSkeleton key={i} />
    ))}
  </>
);

export default MovieSkeleton;