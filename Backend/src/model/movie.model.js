const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Movie title is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "Description not available",
    },
    poster: {
      type: String,
      default: "",
    },
    movieId: {
      type: String,
      unique: true,
      required: [true, "Movie ID is required"],
    },
    releaseDate: {
      type: String,
      default: "",
    },
    trailerLink: {
      type: String,
      default: "",
    },
    genre: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      enum: ["movie", "tv", "trending", "popular"],
      default: "movie",
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Movie", movieSchema);