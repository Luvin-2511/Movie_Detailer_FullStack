import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  loginUser, registerUser, logoutUser, clearAuthError,
  selectUser, selectAuthLoading, selectAuthError,
  selectIsAuthenticated, selectIsAdmin,
} from "../../../store/slices/AuthSlice";

const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user            = useSelector(selectUser);
  const loading         = useSelector(selectAuthLoading);
  const error           = useSelector(selectAuthError);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isAdmin         = useSelector(selectIsAdmin);

  const handleLogin = async (formData) => {
    const result = await dispatch(loginUser(formData));
    if (loginUser.fulfilled.match(result)) navigate("/browse");
  };

  const handleRegister = async (formData) => {
    const result = await dispatch(registerUser(formData));
    if (registerUser.fulfilled.match(result)) navigate("/browse");
  };

  const logout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
  };

  const clearError = () => dispatch(clearAuthError());

  return { user, loading, error, isAuthenticated, isAdmin,
           handleLogin, handleRegister, logout, clearError };
};

export default useAuth;