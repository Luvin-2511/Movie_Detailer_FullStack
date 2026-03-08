const User = require("../model/user.model");

// ── Favorites ─────────────────────────────────────────────────

const addFavorite = async (req, res, next) => {
  try {
    const { movieId, title, posterPath, mediaType, rating, year } = req.body;
    const user = await User.findById(req.user._id);

    const alreadyFav = user.favorites.find(
      (f) => f.movieId === String(movieId),
    );
    if (alreadyFav)
      return res.status(400).json({ message: "Already in favorites." });

    user.favorites.unshift({
      movieId: String(movieId),
      title,
      posterPath,
      mediaType,
      rating,
      year,
    });
    await user.save();

    res.status(200).json({ success: true, favorites: user.favorites });
  } catch (error) {
    next(error);
  }
};

const removeFavorite = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.favorites = user.favorites.filter(
      (f) => f.movieId !== req.params.movieId,
    );
    await user.save();
    res.status(200).json({ success: true, favorites: user.favorites });
  } catch (error) {
    next(error);
  }
};

const getFavorites = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({ success: true, favorites: user.favorites });
  } catch (error) {
    next(error);
  }
};

// ── Watch History ─────────────────────────────────────────────

const addToHistory = async (req, res, next) => {
  try {
    const { movieId, title, posterPath, mediaType, rating, year, watchedAt } =
      req.body;
    const user = await User.findById(req.user._id);

    // Dedup — remove existing entry, push to front
    user.watchHistory = user.watchHistory.filter(
      (h) => h.movieId !== String(movieId),
    );
    user.watchHistory.unshift({
      movieId: String(movieId),
      title,
      posterPath,
      mediaType,
      rating,
      year,
      watchedAt: watchedAt || new Date().toISOString(),
    });

    // Cap at 50
    if (user.watchHistory.length > 50)
      user.watchHistory = user.watchHistory.slice(0, 50);

    await user.save();
    res.status(200).json({ success: true, history: user.watchHistory });
  } catch (error) {
    next(error);
  }
};

const getHistory = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({ success: true, history: user.watchHistory });
  } catch (error) {
    next(error);
  }
};

const clearHistory = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.watchHistory = [];
    await user.save();
    res.status(200).json({ success: true, message: "Watch history cleared." });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addFavorite,
  removeFavorite,
  getFavorites,
  addToHistory,
  getHistory,
  clearHistory,
};
