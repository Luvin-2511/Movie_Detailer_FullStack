const Movie = require("../model/movie.model");

// @desc    Add a new movie (Admin)
// @route   POST /api/movies
// @access  Admin
const addMovie = async (req, res, next) => {
  try {
    const { title, description, poster, movieId, releaseDate, trailerLink, genre, category, rating } = req.body;

    const existing = await Movie.findOne({ movieId });
    if (existing) {
      return res.status(400).json({ message: "Movie with this ID already exists." });
    }

    const movie = await Movie.create({
      title,
      description,
      poster,
      movieId,
      releaseDate,
      trailerLink,
      genre,
      category,
      rating,
      addedBy: req.user._id,
    });

    res.status(201).json({ success: true, movie });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all movies
// @route   GET /api/movies
// @access  Public
const getAllMovies = async (req, res, next) => {
  try {
    const { category, genre, page = 1, limit = 20 } = req.query;
    const query = {};

    if (category) query.category = category;
    if (genre) query.genre = { $in: [genre] };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const movies = await Movie.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Movie.countDocuments(query);

    res.status(200).json({
      success: true,
      movies,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single movie by ID
// @route   GET /api/movies/:id
// @access  Public
const getMovieById = async (req, res, next) => {
  try {
    const movie = await Movie.findOne({ movieId: req.params.id });
    if (!movie) {
      return res.status(404).json({ message: "Movie not found." });
    }
    res.status(200).json({ success: true, movie });
  } catch (error) {
    next(error);
  }
};

// @desc    Update movie (Admin)
// @route   PUT /api/movies/:id
// @access  Admin
const updateMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findOneAndUpdate(
      { movieId: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!movie) {
      return res.status(404).json({ message: "Movie not found." });
    }

    res.status(200).json({ success: true, movie });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete movie (Admin)
// @route   DELETE /api/movies/:id
// @access  Admin
const deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findOneAndDelete({ movieId: req.params.id });
    if (!movie) {
      return res.status(404).json({ message: "Movie not found." });
    }
    res.status(200).json({ success: true, message: "Movie deleted successfully." });
  } catch (error) {
    next(error);
  }
};

module.exports = { addMovie, getAllMovies, getMovieById, updateMovie, deleteMovie };