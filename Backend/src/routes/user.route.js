const express = require("express");
const router = express.Router();
const {
  addFavorite,
  removeFavorite,
  getFavorites,
  addToHistory,
  getHistory,
  clearHistory,
  addWatchlist,
  removeWatchlist,
  getWatchlist,
} = require("../controllers/user.controller");
const { protect } = require("../middlewares/auth.middleware");

// All user routes are protected
router.use(protect);

// Favorites
router.get("/favorites", getFavorites);
router.post("/favorites", addFavorite);
router.delete("/favorites/:movieId", removeFavorite);

// Watchlist
router.get("/watchlist", getWatchlist);
router.post("/watchlist", addWatchlist);
router.delete("/watchlist/:movieId", removeWatchlist);

// Watch History
router.get("/history", getHistory);
router.post("/history", addToHistory);
router.delete("/history", clearHistory);

module.exports = router;