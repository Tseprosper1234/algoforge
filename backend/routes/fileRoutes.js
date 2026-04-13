const express = require('express');
const { getFilesHierarchy, getFileById, submitQuiz } = require('../controllers/fileController');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/hierarchy', getFilesHierarchy); // public browse
router.get('/:id', getFileById); // public view file details
router.post('/:id/quiz/submit', auth, submitQuiz);

module.exports = router;