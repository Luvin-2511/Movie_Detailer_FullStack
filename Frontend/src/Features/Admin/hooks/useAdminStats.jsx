import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStats, selectStats } from "../../../store/slices/AdminSlice.js";

const useAdminStats = () => {
  const dispatch = useDispatch();
  const stats = useSelector(selectStats);

  useEffect(() => { if (!stats) dispatch(fetchStats()); }, []);

  return { stats, loading: !stats };
};

export default useAdminStats;