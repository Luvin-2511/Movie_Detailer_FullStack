const express = require("express");
const router = express.Router();
const {
  addMovie,
  getAllMovies,
  getMovieById,
  updateMovie,
  deleteMovie,
} = require("../controllers/movie.controller");
const { protect, adminOnly } = require("../middlewares/auth.middleware");

// Public routes
router.get("/", getAllMovies);
router.get("/:id", getMovieById);

// Admin only routes
router.post("/", protect, adminOnly, addMovie);
router.put("/:id", protect, adminOnly, updateMovie);
router.delete("/:id", protect, adminOnly, deleteMovie);

module.exports = router;