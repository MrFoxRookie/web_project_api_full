const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUser,
  updateUser,
  updateUserAvatar,
  getCurrentUser,
} = require("../controllers/users");
const { celebrate, Joi } = require("celebrate");
const validator = require("validator");

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

router.get("/users", getAllUsers);
router.get("/users/me", getCurrentUser);

router.get(
  "/users/:userId",
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().hex().length(24).required(),
    }),
  }),
  getUser
);

router.patch(
  "/users/me",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      about: Joi.string().min(2).max(30).required(),
    }),
  }),
  updateUser
);

router.patch(
  "/users/me/avatar",
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().custom(validateURL).required(),
    }),
  }),
  updateUserAvatar
);

module.exports = router;
