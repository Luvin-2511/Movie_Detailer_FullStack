import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchWatchlist, addWatchlist, removeWatchlist,
  selectWatchlist, selectWatchLoading, selectWatchError, selectIsWatchlisted,
} from "../../../store/slices/UserSlice";
import { selectIsAuthenticated } from "../../../store/slices/AuthSlice";

const useWatchlist = () => {
  const dispatch        = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const watchlist       = useSelector(selectWatchlist);
  const loading         = useSelector(selectWatchLoading);
  const error           = useSelector(selectWatchError);

  useEffect(() => {
    if (isAuthenticated && watchlist.length === 0)
      dispatch(fetchWatchlist());
  }, [isAuthenticated]);

  const isWatchlisted = useCallback(
    (movieId) => selectIsWatchlisted(String(movieId))({ user: { watchlist } }),
    [watchlist]
  );

  return {
    watchlist,
    loading,
    error,
    addWatchlist:    (movie)   => dispatch(addWatchlist(movie)),
    removeWatchlist: (movieId) => dispatch(removeWatchlist(movieId)),
    isWatchlisted,
  };
};

export default useWatchlist;
