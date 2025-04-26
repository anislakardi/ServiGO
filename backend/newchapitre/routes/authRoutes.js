const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Routes d'authentification
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgot/send',   authController.sendResetCode);
router.post('/forgot/verify', authController.verifyResetCode);
router.post('/forgot/reset',  authController.resetPassword);

module.exports = router;