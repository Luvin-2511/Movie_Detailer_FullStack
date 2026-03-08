import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFavorites, addFavorite, removeFavorite,
  selectFavorites, selectFavLoading, selectFavError, selectIsFavorited,
} from "../../../store/slices/UserSlice";
import { selectIsAuthenticated } from "../../../store/slices/AuthSlice";

const useFavorites = () => {
  const dispatch        = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const favorites       = useSelector(selectFavorites);
  const loading         = useSelector(selectFavLoading);
  const error           = useSelector(selectFavError);

  useEffect(() => {
    if (isAuthenticated && favorites.length === 0)
      dispatch(fetchFavorites());
  }, [isAuthenticated]);

  const isFavorited = useCallback(
    (movieId) => selectIsFavorited(String(movieId))({ user: { favorites } }),
    [favorites]
  );

  return {
    favorites,
    loading,
    error,
    addFavorite:    (movie)   => dispatch(addFavorite(movie)),
    removeFavorite: (movieId) => dispatch(removeFavorite(movieId)),
    isFavorited,
  };
};

export default useFavorites;