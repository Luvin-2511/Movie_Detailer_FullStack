import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllMoviesAdmin, addMovie, updateMovie, deleteMovie,
  selectAdminMovies, selectMoviesLoading,
} from "../../../store/slices/AdminSlice";

const useAdminMovies = () => {
  const dispatch = useDispatch();
  const movies   = useSelector(selectAdminMovies);
  const loading  = useSelector(selectMoviesLoading);

  useEffect(() => { dispatch(fetchAllMoviesAdmin()); }, []);

  return {
    movies,
    loading,
    error: "",
    fetchMovies:  ()          => dispatch(fetchAllMoviesAdmin()),
    addMovie:     (data)      => dispatch(addMovie(data)).unwrap(),
    updateMovie:  (id, data)  => dispatch(updateMovie({ id, data })).unwrap(),
    deleteMovie:  (id)        => dispatch(deleteMovie(id)),
  };
};

export default useAdminMovies;