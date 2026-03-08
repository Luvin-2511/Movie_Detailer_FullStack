import { useState, useEffect } from "react";
import { fetchPersonDetailAPI, fetchPersonCreditsAPI } from "../services/movies.api";

const usePersonDetail = (id) => {
  const [detail, setDetail] = useState(null);
  const [credits, setCredits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setLoading(true);
      setError("");
      setDetail(null);
      setCredits([]);

      try {
        const [detailRes, creditsRes] = await Promise.allSettled([
          fetchPersonDetailAPI(id),
          fetchPersonCreditsAPI(id)
        ]);

        if (detailRes.status === "fulfilled") {
          setDetail(detailRes.value.data);
        }
        if (creditsRes.status === "fulfilled") {
          // Sort credits by popularity and get top 20
          const sorted = (creditsRes.value.data.cast || [])
            .filter(c => c.poster_path || c.backdrop_path)
            .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
            .slice(0, 20);
          setCredits(sorted);
        }
      } catch (err) {
        setError("Failed to load person details.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  return { detail, credits, loading, error };
};

export default usePersonDetail;
