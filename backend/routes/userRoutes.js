// routes/userRoutes.js
const express = require('express');
const { getProfile, updateProfile, getQuizProgress, uploadAvatar } = require('../controllers/userController');
const auth = require('../middleware/auth');
const { avatarUpload } = require('../middleware/upload');
const router = express.Router();

router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);
router.post('/profile/avatar', auth, avatarUpload.single('avatar'), uploadAvatar);
router.get('/quiz-progress', auth, getQuizProgress);

module.exports = router;