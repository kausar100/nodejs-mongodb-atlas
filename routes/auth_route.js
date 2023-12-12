const express = require('express');


const { loginUser, registerUser, updateUserLocation } = require('../controllers/user_controller');
const { authenticateToken } = require('../config/authenticator');

const router = express.Router();

router.post("/login", loginUser);

router.post("/register", registerUser);

router.patch("/update_location", authenticateToken,  updateUserLocation);

module.exports = router;