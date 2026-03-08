import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../Auth/hooks/useAuth";
import "../styles/MovieCard.scss";

const IMG_BASE = "https://image.tmdb.org/t/p/w500";
const PLACEHOLDER = "https://via.placeholder.com/500x750/0a0a0a/333?text=NO+POSTER";

const MovieCard = ({ movie }) => {
  const navigate  = useNavigate();
  const { isAuthenticated } = useAuth();
  const [imgErr, setImgErr] = useState(false);

  const title      = movie.title || movie.name || "Untitled";
  const year       = (movie.release_date || movie.first_air_date || "").slice(0, 4);
  const rating     = movie.vote_average?.toFixed(1) || "N/A";
  const type       = movie.media_type === "tv" ? "TV" : "FILM";
  const poster     = movie.poster_path && !imgErr
    ? `${IMG_BASE}${movie.poster_path}`
    : PLACEHOLDER;

  const ratingColor =
    rating >= 8 ? "#e8ff00" :
    rating >= 6 ? "#00c8ff" :
    rating >= 4 ? "#ff9500" : "#ff3c5a";

  const handleClick = () => {
    const mediaType = movie.media_type || "movie";
    navigate(`/${mediaType}/${movie.id}`);
  };

  return (
    <div className="movie-card" onClick={handleClick}>
      <div className="movie-card__poster">
        <img
          src={poster}
          alt={title}
          onError={() => setImgErr(true)}
          loading="lazy"
        />

        {/* Overlay */}
        <div className="movie-card__overlay">
          <button className="movie-card__play">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </button>
        </div>

        {/* Type badge */}
        <span className="movie-card__type">{type}</span>

        {/* Rating badge */}
        <span className="movie-card__rating" style={{ "--rc": ratingColor }}>
          ★ {rating}
        </span>
      </div>

      <div className="movie-card__info">
        <h3 className="movie-card__title">{title}</h3>
        <span className="movie-card__year">{year}</span>
      </div>
    </div>
  );
};

export default MovieCard;