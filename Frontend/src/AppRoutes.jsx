import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Public    from "./Features/Auth/components/Public.jsx";
import Private   from "./Features/Movies/components/Private.jsx";
import AdminOnly from "./Features/Admin/components/AdminOnly.jsx";
import PageLoader from "./Features/Auth/components/PageLoader.jsx";

const Home           = lazy(() => import("./Features/Auth/Pages/Home.jsx"));
const Login          = lazy(() => import("./Features/Auth/Pages/Login.jsx"));
const Register       = lazy(() => import("./Features/Auth/Pages/Register.jsx"));
const Browse         = lazy(() => import("./Features/Movies/Pages/Browse.jsx"));
const MovieDetail    = lazy(() => import("./Features/Movies/Pages/MovieDetail.jsx"));
const FavoritesPage  = lazy(() => import("./Features/User/Pages/FavoritesPage.jsx"));
const HistoryPage    = lazy(() => import("./Features/User/Pages/HistoryPage.jsx"));
const AdminDashboard = lazy(() => import("./Features/Admin/Pages/AdminDashboard.jsx"));

const Spinner = () => (
  <div style={{
    position: "fixed", inset: 0, background: "#060608",
    display: "flex", alignItems: "center", justifyContent: "center",
  }}>
    <div style={{
      width: 36, height: 36,
      border: "2px solid rgba(232,255,0,0.15)",
      borderTopColor: "#e8ff00",
      borderRadius: "50%",
      animation: "spin 0.7s linear infinite",
    }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

const AppRoutes = () => (
  <BrowserRouter>
    <Suspense fallback={<Spinner />}>
      <PageLoader>
        <Routes>
          <Route path="/"          element={<Home />} />
          <Route path="/login"     element={<Public><Login /></Public>} />
          <Route path="/register"  element={<Public><Register /></Public>} />
          <Route path="/browse"    element={<Private><Browse /></Private>} />
          <Route path="/movie/:id" element={<Private><MovieDetail /></Private>} />
          <Route path="/tv/:id"    element={<Private><MovieDetail /></Private>} />
          <Route path="/favorites" element={<Private><FavoritesPage /></Private>} />
          <Route path="/history"   element={<Private><HistoryPage /></Private>} />
          <Route path="/admin"     element={<AdminOnly><AdminDashboard /></AdminOnly>} />
          <Route path="*"          element={<Navigate to="/" replace />} />
        </Routes>
      </PageLoader>
    </Suspense>
  </BrowserRouter>
);

export default AppRoutes;