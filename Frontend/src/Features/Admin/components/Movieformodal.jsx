import { useState, useEffect } from "react";
import "../styles/AdminModals.scss";

const EMPTY = {
  title: "", overview: "", releaseDate: "",
  posterPath: "", backdropPath: "", tmdbId: "",
  rating: "", genre: "",
};

const MovieFormModal = ({ movie = null, onSave, onClose }) => {
  const [form,    setForm]    = useState(EMPTY);
  const [saving,  setSaving]  = useState(false);
  const [err,     setErr]     = useState("");

  useEffect(() => {
    if (movie) {
      setForm({
        title:        movie.title        || "",
        overview:     movie.overview     || "",
        releaseDate:  movie.releaseDate  || "",
        posterPath:   movie.posterPath   || "",
        backdropPath: movie.backdropPath || "",
        tmdbId:       movie.tmdbId       || "",
        rating:       movie.rating       || "",
        genre:        movie.genre        || "",
      });
    }
  }, [movie]);

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.title.trim()) { setErr("Title is required."); return; }
    setSaving(true); setErr("");
    try {
      await onSave(form);
      onClose();
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to save movie.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-modal" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="admin-modal__box">
        <div className="admin-modal__header">
          <h2>{movie ? "EDIT MOVIE" : "ADD MOVIE"}</h2>
          <button className="admin-modal__close" onClick={onClose}>✕</button>
        </div>

        <div className="admin-modal__body">
          {err && <p className="admin-modal__error">{err}</p>}

          <div className="admin-modal__grid">
            {[
              { name: "title",        label: "Title *",         type: "text" },
              { name: "tmdbId",       label: "TMDB ID",         type: "text" },
              { name: "releaseDate",  label: "Release Date",    type: "date" },
              { name: "rating",       label: "Rating (0–10)",   type: "number" },
              { name: "genre",        label: "Genre",           type: "text" },
              { name: "posterPath",   label: "Poster Path",     type: "text" },
              { name: "backdropPath", label: "Backdrop Path",   type: "text" },
            ].map(({ name, label, type }) => (
              <div key={name} className="admin-modal__field">
                <label>{label}</label>
                <input
                  type={type}
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  placeholder={label}
                  min={type === "number" ? 0 : undefined}
                  max={type === "number" ? 10 : undefined}
                  step={type === "number" ? 0.1 : undefined}
                />
              </div>
            ))}

            <div className="admin-modal__field admin-modal__field--full">
              <label>Overview</label>
              <textarea
                name="overview"
                value={form.overview}
                onChange={handleChange}
                placeholder="Movie description..."
                rows={4}
              />
            </div>
          </div>
        </div>

        <div className="admin-modal__footer">
          <button className="admin-modal__cancel" onClick={onClose}>Cancel</button>
          <button className="admin-modal__save" onClick={handleSubmit} disabled={saving}>
            {saving ? "Saving..." : movie ? "Save Changes" : "Add Movie"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieFormModal;