import { useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMovies, setActiveCategory, setSearchQuery,
  selectMovies, selectMoviesLoading, selectMoviesError,
  selectHasMore, selectMoviePage, selectActiveCategory, selectSearchQuery,
} from "../../../store/slices/MovieSlice";

const DEBOUNCE_MS = 500;

const useMovies = () => {
  const dispatch      = useDispatch();
  const debounceTimer = useRef(null);

  const movies         = useSelector(selectMovies);
  const loading        = useSelector(selectMoviesLoading);
  const error          = useSelector(selectMoviesError);
  const hasMore        = useSelector(selectHasMore);
  const page           = useSelector(selectMoviePage);
  const activeCategory = useSelector(selectActiveCategory);
  const searchQuery    = useSelector(selectSearchQuery);

  // Fetch page 1 when category or search changes (debounced)
  useEffect(() => {
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      dispatch(fetchMovies({ category: activeCategory, searchQuery, page: 1 }));
    }, searchQuery ? DEBOUNCE_MS : 0);
    return () => clearTimeout(debounceTimer.current);
  }, [activeCategory, searchQuery]);

  // Load next page
  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;
    dispatch(fetchMovies({ category: activeCategory, searchQuery, page: page + 1 }));
  }, [loading, hasMore, page, activeCategory, searchQuery]);

  const changeCategory = useCallback((cat) => dispatch(setActiveCategory(cat)), []);
  const changeSearch   = useCallback((q)   => dispatch(setSearchQuery(q)),      []);

  return { movies, loading, error, hasMore, loadMore,
           activeCategory, searchQuery, changeCategory, changeSearch };
};

export default useMovies;