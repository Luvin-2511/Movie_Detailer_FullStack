const express = require("express");
const router = express.Router();
const {
  getStats,
  getAllUsers,
  getUserById,
  banUser,
  unbanUser,
  deleteUser,
} = require("../controllers/admin.controller");
const { protect, adminOnly } = require("../middlewares/auth.middleware");

router.use(protect, adminOnly);

router.get("/stats",          getStats);
router.get("/users",          getAllUsers);
router.get("/users/:id",      getUserById);
router.put("/users/:id/ban",  banUser);
router.put("/users/:id/unban",unbanUser);
router.delete("/users/:id",   deleteUser);

module.exports = router;