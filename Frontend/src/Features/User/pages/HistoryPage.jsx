import { useState } from "react";
import { Link } from "react-router-dom";
import UserPageLayout from "../components/userPageLayout";
import useHistory from "../hooks/useHistory";
import "../styles/userPages.scss";

const IMG_BASE = "https://image.tmdb.org/t/p/w92";
const PLACEHOLDER = "https://via.placeholder.com/46x69/111/333?text=?";

// ── Format watched-at date ────────────────────────────────────
const timeAgo = (dateStr) => {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins  < 1)   return "Just now";
  if (mins  < 60)  return `${mins}m ago`;
  if (hours < 24)  return `${hours}h ago`;
  if (days  < 7)   return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

// ── Confirm modal ─────────────────────────────────────────────
const ConfirmModal = ({ onConfirm, onCancel }) => (
  <div className="confirm-modal">
    <div className="confirm-modal__box">
      <h2 className="confirm-modal__title">CLEAR HISTORY?</h2>
      <p className="confirm-modal__text">
        This will permanently delete your entire watch history. This action cannot be undone.
      </p>
      <div className="confirm-modal__actions">
        <button className="confirm-modal__confirm" onClick={onConfirm}>Clear All</button>
        <button className="confirm-modal__cancel"  onClick={onCancel}>Cancel</button>
      </div>
    </div>
  </div>
);

// ── History Page ──────────────────────────────────────────────
const HistoryPage = () => {
  const { history, loading, error, clearHistory } = useHistory();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleClear = async () => {
    await clearHistory();
    setShowConfirm(false);
  };

  return (
    <UserPageLayout>
      {showConfirm && (
        <ConfirmModal
          onConfirm={handleClear}
          onCancel={() => setShowConfirm(false)}
        />
      )}

      <div className="user-page">

        {/* ── Header ── */}
        <div className="user-page__header">
          <div className="user-page__header-left">
            <p className="user-page__eyebrow">◈ Your Activity</p>
            <h1 className="user-page__title">WATCH HISTORY</h1>
            {!loading && (
              <span className="user-page__count">
                {history.length} {history.length === 1 ? "title" : "titles"} watched
              </span>
            )}
          </div>

          {history.length > 0 && (
            <div className="user-page__header-actions">
              <button
                className="user-page__clear-btn"
                onClick={() => setShowConfirm(true)}
                disabled={loading}
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* ── Error ── */}
        {error && <p className="user-page__error">{error}</p>}

        {/* ── Loading skeletons ── */}
        {loading && (
          <div className="user-page__skeleton-list">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="user-page__skeleton-row" />
            ))}
          </div>
        )}

        {/* ── Empty ── */}
        {!loading && !error && history.length === 0 && (
          <div className="user-page__empty">
            <div className="user-page__empty-icon">◎</div>
            <h3>NO HISTORY YET</h3>
            <p>Movies and shows you view will appear here.</p>
            <Link to="/browse">Start watching →</Link>
          </div>
        )}

        {/* ── History list ── */}
        {!loading && history.length > 0 && (
          <div className="user-page__history-grid">
            {history.map((item, idx) => (
              <Link
                key={`${item.movieId}-${idx}`}
                to={`/${item.mediaType || "movie"}/${item.movieId}`}
                className="user-page__history-item"
              >
                <img
                  className="user-page__history-item-poster"
                  src={item.posterPath ? `${IMG_BASE}${item.posterPath}` : PLACEHOLDER}
                  alt={item.title}
                  onError={(e) => { e.target.src = PLACEHOLDER; }}
                />
                <div className="user-page__history-item-info">
                  <p className="user-page__history-item-title">{item.title}</p>
                  <div className="user-page__history-item-meta">
                    <span className="user-page__history-item-type">
                      {item.mediaType === "tv" ? "TV" : "FILM"}
                    </span>
                    {item.year && (
                      <span className="user-page__history-item-year">{item.year}</span>
                    )}
                  </div>
                </div>
                <span className="user-page__history-item-watched">
                  {timeAgo(item.watchedAt)}
                </span>
                <span className="user-page__history-item-arrow">→</span>
              </Link>
            ))}
          </div>
        )}

      </div>
    </UserPageLayout>
  );
};

export default HistoryPage;