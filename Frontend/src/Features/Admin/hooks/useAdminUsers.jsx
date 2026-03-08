import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllUsers, banUser, unbanUser, deleteUser,
  selectAdminUsers, selectUsersLoading,
} from "../../../store/slices/adminSlice";

const useAdminUsers = () => {
  const dispatch = useDispatch();
  const users    = useSelector(selectAdminUsers);
  const loading  = useSelector(selectUsersLoading);

  useEffect(() => { dispatch(fetchAllUsers()); }, []);

  return {
    users,
    loading,
    error: "",
    fetchUsers:  ()   => dispatch(fetchAllUsers()),
    banUser:     (id) => dispatch(banUser(id)),
    unbanUser:   (id) => dispatch(unbanUser(id)),
    deleteUser:  (id) => dispatch(deleteUser(id)),
  };
};

export default useAdminUsers;