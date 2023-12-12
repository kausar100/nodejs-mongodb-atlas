const express = require('express');

const router = express.Router();

const { getActiveUsers, getAllUsers} = require('../controllers/user_controller');

router.get("/users", getAllUsers);

router.get("/active_users", getActiveUsers);

module.exports = router;