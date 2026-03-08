
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const { errorHandler, notFound } = require("./middlewares/error.middleware");

// Route imports
const authRoutes = require("./routes/auth.route");
const userRoutes = require("./routes/user.route");
const movieRoutes = require("./routes/movie.route");
const adminRoutes = require("./routes/admin.route");


const app = express();

// ─── Middlewares ──────────────────────────────────────────────
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.FRONTEND_URL, // set this to your Vercel URL in Render env vars
]
  .filter(Boolean)
  .map(url => url.endsWith('/') ? url.slice(0, -1) : url);

app.use(
  cors({
    origin: (origin, callback) => {
      // Clean incoming origin just in case
      const cleanOrigin = origin && origin.endsWith('/') ? origin.slice(0, -1) : origin;
      
      // Allow requests with no origin (e.g. mobile apps, curl, Postman)
      // Also automatically allow any vercel.app deploy preview
      if (!cleanOrigin || allowedOrigins.includes(cleanOrigin) || cleanOrigin.endsWith(".vercel.app")) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked for origin: ${origin}`));
      }
    },
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ─── Health Check ─────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Movie Platform API is running 🎬" });
});

// ─── Routes ───────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/admin", adminRoutes);

// ─── Error Handling ───────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);



module.exports = app