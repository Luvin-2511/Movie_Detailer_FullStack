import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectActiveTab, setActiveTab } from "../../../store/slices/AdminSlice.js";
import useAdminUsers  from "../hooks/useAdminUsers.jsx";
import useAdminMovies from "../hooks/useAdminMovies.jsx";
import useAdminStats  from "../hooks/useAdminStats.jsx";

import MovieFormModal from "../components/Movieformodal.jsx";
import Navbar from "../../Movies/components/Navbar.jsx";
import "../styles/admindashboard.scss";
import "../styles/adminmodals.scss";

const IMG_BASE = "https://image.tmdb.org/t/p/w92";

// ── Stat Card ─────────────────────────────────────────────────
const StatCard = ({ value, label, accent = "#e8ff00" }) => (
  <div className="admin__stat-card" style={{ "--accent": accent }}>
    <div className="admin__stat-card-value">{value ?? "—"}</div>
    <div className="admin__stat-card-label">{label}</div>
  </div>
);

// ── Delete Confirm ────────────────────────────────────────────
const DeleteConfirm = ({ label, onConfirm, onCancel }) => (
  <div className="delete-confirm">
    <div className="delete-confirm__box">
      <div className="delete-confirm__icon">⚠️</div>
      <h2 className="delete-confirm__title">DELETE?</h2>
      <p className="delete-confirm__text">
        Are you sure you want to permanently delete <strong>{label}</strong>? This cannot be undone.
      </p>
      <div className="delete-confirm__actions">
        <button className="delete-confirm__confirm" onClick={onConfirm}>Delete</button>
        <button className="delete-confirm__cancel"  onClick={onCancel}>Cancel</button>
      </div>
    </div>
  </div>
);

// ── Overview Tab ──────────────────────────────────────────────
const OverviewTab = ({ stats, loading }) => (
  <div>
    <div className="admin__page-header">
      <div>
        <p className="admin__page-eyebrow">◈ Dashboard</p>
        <h1 className="admin__page-title">OVERVIEW</h1>
      </div>
    </div>

    {loading && (
      <div className="admin__stats">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="admin__stat-card">
            <div className="admin__skeleton-row" style={{ height: 40, marginBottom: 8 }} />
            <div className="admin__skeleton-row" style={{ height: 12, width: "60%" }} />
          </div>
        ))}
      </div>
    )}

    {stats && (
      <div className="admin__stats">
        <StatCard value={stats.totalUsers}  label="Total Users"   accent="#e8ff00" />
        <StatCard value={stats.activeUsers} label="Active Users"  accent="#00c8ff" />
        <StatCard value={stats.bannedUsers} label="Banned Users"  accent="#ff4d4d" />
        <StatCard value={stats.adminUsers}  label="Admins"        accent="#b47cff" />
        <StatCard value={stats.totalMovies} label="Movies in DB"  accent="#ff9500" />
      </div>
    )}
  </div>
);

// ── Users Tab ─────────────────────────────────────────────────
const UsersTab = ({ users, loading, error, banUser, unbanUser, deleteUser }) => {
  const [search,  setSearch]  = useState("");
  const [confirm, setConfirm] = useState(null); // { id, name }

  const filtered = users.filter((u) =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {confirm && (
        <DeleteConfirm
          label={confirm.name}
          onConfirm={() => { deleteUser(confirm.id); setConfirm(null); }}
          onCancel={() => setConfirm(null)}
        />
      )}

      <div className="admin__page-header">
        <div>
          <p className="admin__page-eyebrow">◈ Manage</p>
          <h1 className="admin__page-title">USERS</h1>
        </div>
        <div className="admin__search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {error && <div className="admin__error">{error}</div>}

      <div className="admin__table-wrap">
        <table className="admin__table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Favorites</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && Array.from({ length: 8 }).map((_, i) => (
              <tr key={i}>
                <td colSpan={6}><div className="admin__skeleton-row" /></td>
              </tr>
            ))}

            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="admin__empty">No users found.</td>
              </tr>
            )}

            {!loading && filtered.map((user) => (
              <tr key={user._id}>
                <td>
                  <span className="admin__avatar">
                    {(user.name || user.email)?.[0]?.toUpperCase()}
                  </span>
                  {user.name || "—"}
                </td>
                <td>{user.email}</td>
                <td>
                  <span className={`admin__badge admin__badge--${user.role}`}>
                    {user.role}
                  </span>
                </td>
                <td>
                  <span className={`admin__badge admin__badge--${user.isBanned ? "banned" : "active"}`}>
                    {user.isBanned ? "Banned" : "Active"}
                  </span>
                </td>
                <td>{user.favorites?.length ?? 0}</td>
                <td>
                  {user.role !== "admin" && (
                    <div className="admin__actions">
                      {user.isBanned
                        ? <button className="admin__action-btn admin__action-btn--unban"  onClick={() => unbanUser(user._id)}>Unban</button>
                        : <button className="admin__action-btn admin__action-btn--ban"    onClick={() => banUser(user._id)}>Ban</button>
                      }
                      <button
                        className="admin__action-btn admin__action-btn--delete"
                        onClick={() => setConfirm({ id: user._id, name: user.name || user.email })}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ── Movies Tab ────────────────────────────────────────────────
const MoviesTab = ({ movies, loading, error, addMovie, updateMovie, deleteMovie }) => {
  const [search,   setSearch]   = useState("");
  const [modal,    setModal]    = useState(null); // null | "add" | movie object
  const [confirm,  setConfirm]  = useState(null);

  const filtered = movies.filter((m) =>
    m.title?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async (data) => {
    if (modal === "add") await addMovie(data);
    else                  await updateMovie(modal._id, data);
  };

  return (
    <div>
      {modal && (
        <MovieFormModal
          movie={modal === "add" ? null : modal}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}

      {confirm && (
        <DeleteConfirm
          label={confirm.title}
          onConfirm={() => { deleteMovie(confirm.id); setConfirm(null); }}
          onCancel={() => setConfirm(null)}
        />
      )}

      <div className="admin__page-header">
        <div>
          <p className="admin__page-eyebrow">◈ Manage</p>
          <h1 className="admin__page-title">MOVIES</h1>
        </div>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
          <div className="admin__search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Search movies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="admin__action-btn admin__action-btn--add" onClick={() => setModal("add")}>
            + Add Movie
          </button>
        </div>
      </div>

      {error && <div className="admin__error">{error}</div>}

      <div className="admin__table-wrap">
        <table className="admin__table">
          <thead>
            <tr>
              <th>Poster</th>
              <th>Title</th>
              <th>Year</th>
              <th>Rating</th>
              <th>Genre</th>
              <th>TMDB ID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && Array.from({ length: 8 }).map((_, i) => (
              <tr key={i}>
                <td colSpan={7}><div className="admin__skeleton-row" /></td>
              </tr>
            ))}

            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="admin__empty">
                  {movies.length === 0 ? "No movies in database. Add one above." : "No results."}
                </td>
              </tr>
            )}

            {!loading && filtered.map((movie) => (
              <tr key={movie._id}>
                <td>
                  <img
                    className="admin__movie-poster"
                    src={movie.posterPath ? `${IMG_BASE}${movie.posterPath}` : "https://via.placeholder.com/32x48/111/333?text=?"}
                    alt={movie.title}
                    onError={(e) => { e.target.src = "https://via.placeholder.com/32x48/111/333?text=?"; }}
                  />
                </td>
                <td>{movie.title}</td>
                <td>{movie.releaseDate?.slice(0, 4) || "—"}</td>
                <td>{movie.rating ? `★ ${movie.rating}` : "—"}</td>
                <td>{movie.genre || "—"}</td>
                <td style={{ fontFamily: "monospace", fontSize: "0.72rem", color: "rgba(255,255,255,0.3)" }}>
                  {movie.tmdbId || "—"}
                </td>
                <td>
                  <div className="admin__actions">
                    <button
                      className="admin__action-btn admin__action-btn--edit"
                      onClick={() => setModal(movie)}
                    >
                      Edit
                    </button>
                    <button
                      className="admin__action-btn admin__action-btn--delete"
                      onClick={() => setConfirm({ id: movie._id, title: movie.title })}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ── Main Admin Dashboard ──────────────────────────────────────
const AdminDashboard = () => {
  const navigate = useNavigate();
  const activeTab = useSelector(selectActiveTab);
  const dispatch = useDispatch();

  const { stats,  loading: statsLoading  } = useAdminStats();
  const { users,  loading: usersLoading,  error: usersError,  banUser, unbanUser, deleteUser } = useAdminUsers();
  const { movies, loading: moviesLoading, error: moviesError, addMovie, updateMovie, deleteMovie } = useAdminMovies();

  const TABS = [
    { key: "overview", label: "Overview", icon: "◈" },
    { key: "users",    label: "Users",    icon: "◉" },
    { key: "movies",   label: "Movies",   icon: "◫" },
  ];

  return (
    <div className="admin">
      <Navbar />

      {/* ── Sidebar ── */}
      <aside className="admin__sidebar">
        <div className="admin__sidebar-logo">
          <span>CINEVERSE</span>
          <small>Admin Panel</small>
        </div>

        <nav className="admin__sidebar-nav">
          {TABS.map(({ key, label, icon }) => (
            <button
              key={key}
              className={`admin__sidebar-link ${activeTab === key ? "admin__sidebar-link--active" : ""}`}
              onClick={() => dispatch(setActiveTab(key))}
            >
              <span className="link-icon">{icon}</span>
              {label}
            </button>
          ))}
        </nav>

        <div className="admin__sidebar-bottom">
          <button className="admin__sidebar-back" onClick={() => navigate("/browse")}>
            ← Back to Site
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="admin__main">
        {activeTab === "overview" && (
          <OverviewTab stats={stats} loading={statsLoading} />
        )}
        {activeTab === "users" && (
          <UsersTab
            users={users} loading={usersLoading} error={usersError}
            banUser={banUser} unbanUser={unbanUser} deleteUser={deleteUser}
          />
        )}
        {activeTab === "movies" && (
          <MoviesTab
            movies={movies} loading={moviesLoading} error={moviesError}
            addMovie={addMovie} updateMovie={updateMovie} deleteMovie={deleteMovie}
          />
        )}
      </main>

    </div>
  );
};

export default AdminDashboard;