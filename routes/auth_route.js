const express = require('express');


const { loginUser, registerUser, changeActiveStatus, userInfo, clearDB } = require('../controllers/user_controller');
const { authenticateToken } = require('../config/authenticator');

const router = express.Router();

router.post("/login", loginUser);

router.post("/register", registerUser);

//can access only authenticate user
router.get("/me", authenticateToken, userInfo);

router.get("/clear", clearDB);

router.patch("/toggleActiveStatus", authenticateToken,  changeActiveStatus);

module.exports = router;