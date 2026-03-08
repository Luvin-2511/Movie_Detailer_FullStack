import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchHistory, addToHistory, clearHistory,
  selectHistory, selectHistLoading, selectHistError,
} from "../../../store/slices/userSlice";
import { selectIsAuthenticated } from "../../../store/slices/authSlice";

const useHistory = () => {
  const dispatch        = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const history         = useSelector(selectHistory);
  const loading         = useSelector(selectHistLoading);
  const error           = useSelector(selectHistError);

  useEffect(() => {
    if (isAuthenticated && history.length === 0)
      dispatch(fetchHistory());
  }, [isAuthenticated]);

  return {
    history,
    loading,
    error,
    addToHistory: (movie)  => dispatch(addToHistory(movie)),
    clearHistory: ()       => dispatch(clearHistory()),
  };
};

export default useHistory;