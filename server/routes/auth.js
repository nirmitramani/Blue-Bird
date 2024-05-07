const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController');
const verifyToken = require("../middleware/verifyToken");

router.post('/sign-up', authController.signUp);
router.post('/sign-in/:role', authController.signIn);
router.post("/:role", verifyToken);

module.exports = router;
