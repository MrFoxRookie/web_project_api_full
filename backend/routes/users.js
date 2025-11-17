const express = require('express');
const router = express.Router();
const {getAllUsers, getUser, createUser, updateUser, updateUserAvatar} = require('../controllers/users');

router.get('/users', getAllUsers);
router.get('/users/:userId', getUser);
router.post('/users', createUser);
router.patch('/users/me', updateUser);
router.patch('/users/me/avatar', updateUserAvatar);

module.exports = router;

