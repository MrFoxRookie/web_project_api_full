const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUser,
  updateUser,
  updateUserAvatar,
} = require("../controllers/users");

router.get("/users", getAllUsers);
router.get("/users/:userId", getUser);
router.patch("/users/me", updateUser);
router.patch("/users/me/avatar", updateUserAvatar);

module.exports = router;
