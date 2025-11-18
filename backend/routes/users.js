const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  updateUserAvatar,
  login,
} = require("../controllers/users");

router.post("/signin", login);

router.get("/users", getAllUsers);
router.get("/users/:userId", getUser);
router.post("/users", createUser);
router.patch("/users/me", updateUser);
router.patch("/users/me/avatar", updateUserAvatar);

module.exports = router;
