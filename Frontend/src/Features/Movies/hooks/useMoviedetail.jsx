import { useState, useEffect } from "react";
import {
  fetchMovieDetailAPI,
  fetchTVDetailAPI,
  fetchMovieVideosAPI,
  fetchTVVideosAPI,
  fetchMovieCreditsAPI,
  fetchSimilarAPI,
} from "../services/movies.api";

const useMovieDetail = (id, mediaType = "movie") => {
  const [detail,  setDetail]  = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [cast,    setCast]    = useState([]);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setLoading(true);
      setError("");
      setDetail(null);
      setTrailer(null);
      setCast([]);
      setSimilar([]);

      try {
        const isTV = mediaType === "tv";

        const [detailRes, videosRes, similarRes, creditsRes] = await Promise.allSettled([
          isTV ? fetchTVDetailAPI(id)      : fetchMovieDetailAPI(id),
          isTV ? fetchTVVideosAPI(id)      : fetchMovieVideosAPI(id),
          fetchSimilarAPI(id, mediaType),
          isTV ? Promise.resolve(null)     : fetchMovieCreditsAPI(id),
        ]);

        // Detail
        if (detailRes.status === "fulfilled") {
          setDetail(detailRes.value.data);
        }

        // Trailer — prefer official YouTube trailer
        if (videosRes.status === "fulfilled") {
          const videos = videosRes.value.data.results || [];
          const found =
            videos.find((v) => v.type === "Trailer" && v.site === "YouTube") ||
            videos.find((v) => v.site === "YouTube") ||
            null;
          setTrailer(found);
        }

        // Cast
        if (creditsRes.status === "fulfilled" && creditsRes.value) {
          setCast((creditsRes.value.data.cast || []).slice(0, 12));
        }

        // Similar
        if (similarRes.status === "fulfilled") {
          setSimilar((similarRes.value.data.results || []).slice(0, 12));
        }

      } catch (err) {
        setError("Failed to load movie details.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id, mediaType]);

  return { detail, trailer, cast, similar, loading, error };
};

export default useMovieDetail;