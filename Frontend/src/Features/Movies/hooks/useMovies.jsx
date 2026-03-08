import { useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMovies, setActiveCategory, setSearchQuery, setGenreId,
  selectMovies, selectMoviesLoading, selectMoviesError,
  selectHasMore, selectMoviePage, selectActiveCategory, selectSearchQuery, selectGenreId,
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
  const genreId        = useSelector(selectGenreId);

  // Fetch page 1 when category or search or genre changes (debounced)
  useEffect(() => {
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      dispatch(fetchMovies({ category: activeCategory, searchQuery, genreId, page: 1 }));
    }, searchQuery ? DEBOUNCE_MS : 0);
    return () => clearTimeout(debounceTimer.current);
  }, [activeCategory, searchQuery, genreId]);

  // Load next page
  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;
    dispatch(fetchMovies({ category: activeCategory, searchQuery, genreId, page: page + 1 }));
  }, [loading, hasMore, page, activeCategory, searchQuery, genreId]);

  const changeCategory = useCallback((cat) => dispatch(setActiveCategory(cat)), []);
  const changeSearch   = useCallback((q)   => dispatch(setSearchQuery(q)),      []);
  const changeGenre    = useCallback((gId) => dispatch(setGenreId(gId)),        []);

  return { movies, loading, error, hasMore, loadMore,
           activeCategory, searchQuery, genreId, changeCategory, changeSearch, changeGenre };
};

export default useMovies;