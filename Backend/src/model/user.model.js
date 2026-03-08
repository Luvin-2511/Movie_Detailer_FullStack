const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String, required: [true, "Name is required"], trim: true,
    },
    email: {
      type: String, required: [true, "Email is required"],
      unique: true, lowercase: true, trim: true,
    },
    password: {
      type: String, required: [true, "Password is required"],
      minlength: 6, select: false,
    },
    role: {
      type: String, enum: ["user", "admin"], default: "user",
    },
    isBanned: { type: Boolean, default: false },
    avatar:   { type: String,  default: ""    },

    favorites: [
      {
        movieId:    { type: String },
        title:      { type: String },
        posterPath: { type: String, default: "" },
        mediaType:  { type: String, enum: ["movie", "tv"], default: "movie" },
        rating:     { type: Number, default: 0  },
        year:       { type: String, default: "" },
        addedAt:    { type: Date,   default: Date.now },
      },
    ],

    watchlist: [
      {
        movieId:    { type: String },
        title:      { type: String },
        posterPath: { type: String, default: "" },
        mediaType:  { type: String, enum: ["movie", "tv", "person"], default: "movie" },
        rating:     { type: Number, default: 0  },
        year:       { type: String, default: "" },
        addedAt:    { type: Date,   default: Date.now },
      },
    ],

    watchHistory: [
      {
        movieId:    { type: String },
        title:      { type: String },
        posterPath: { type: String, default: "" },
        mediaType:  { type: String, enum: ["movie", "tv"], default: "movie" },
        rating:     { type: Number, default: 0  },
        year:       { type: String, default: "" },
        watchedAt:  { type: String, default: () => new Date().toISOString() },
      },
    ],
  },
  { timestamps: true }
);

userSchema.methods.comparePassword = async function (candidate) {
  return await bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model("User", userSchema);