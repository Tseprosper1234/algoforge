const express = require('express');
const { register, login, forgotPassword, resetPassword, verifyEmail, resendVerification, verifyResetCode, getMe } = require('../controllers/authController');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/verify-reset-code', verifyResetCode);
router.post('/reset-password', resetPassword);
router.post('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerification);
router.get('/me', auth, getMe);

module.exports = router;
