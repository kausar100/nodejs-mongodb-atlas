const express = require('express');

const router = express.Router();

const { getActiveUsers, getAllUsers} = require('../controllers/user_controller');
const { authenticateToken } = require('../config/authenticator');

router.get("/users", authenticateToken, getAllUsers);

router.get("/active_users", authenticateToken, getActiveUsers);

module.exports = router;