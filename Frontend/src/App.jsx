import { Provider } from "react-redux";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { restoreSession } from "./store/slices/AuthSlice.js";
import store from "./store/Store.js";
import AppRoutes from "./AppRoutes.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";

// Runs once on mount to restore JWT session from cookie
const SessionRestorer = ({ children }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(restoreSession());
  }, []);
  return children;
};

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <SessionRestorer>
          <AppRoutes />
        </SessionRestorer>
      </ThemeProvider>
    </Provider>
  );
};

export default App;