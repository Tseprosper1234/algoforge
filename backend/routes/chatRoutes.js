// routes/chatRoutes.js
const express = require('express');
const { getMessages, sendTextMessage, uploadAttachment } = require('../controllers/chatController');
const auth = require('../middleware/auth');
const { chatUpload } = require('../middleware/upload');
const router = express.Router();

router.get('/messages', auth, getMessages);
router.post('/messages/text', auth, sendTextMessage);
router.post('/upload', auth, chatUpload.single('file'), uploadAttachment);

module.exports = router;