const User  = require("../model/user.model");
const Movie = require("../model/movie.model");

// @desc    Get platform stats (Admin)
// @route   GET /api/admin/stats
// @access  Admin
const getStats = async (req, res, next) => {
  try {
    const [totalUsers, bannedUsers, adminUsers, totalMovies] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isBanned: true }),
      User.countDocuments({ role: "admin" }),
      Movie.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        activeUsers: totalUsers - bannedUsers,
        bannedUsers,
        adminUsers,
        totalMovies,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (Admin)
// @route   GET /api/admin/users
// @access  Admin
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: users.length, users });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single user (Admin)
// @route   GET /api/admin/users/:id
// @access  Admin
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Ban user (Admin)
// @route   PUT /api/admin/users/:id/ban
// @access  Admin
const banUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    if (user.role === "admin") {
      return res.status(400).json({ message: "Cannot ban an admin." });
    }

    user.isBanned = true;
    await user.save();

    res.status(200).json({ success: true, message: `User ${user.email} banned.` });
  } catch (error) {
    next(error);
  }
};

// @desc    Unban user (Admin)
// @route   PUT /api/admin/users/:id/unban
// @access  Admin
const unbanUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.isBanned = false;
    await user.save();

    res.status(200).json({ success: true, message: `User ${user.email} unbanned.` });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user (Admin)
// @route   DELETE /api/admin/users/:id
// @access  Admin
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    if (user.role === "admin") {
      return res.status(400).json({ message: "Cannot delete an admin." });
    }

    await user.deleteOne();
    res.status(200).json({ success: true, message: "User deleted." });
  } catch (error) {
    next(error);
  }
};

module.exports = { getStats, getAllUsers, getUserById, banUser, unbanUser, deleteUser };