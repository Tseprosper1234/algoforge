const express = require('express');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const adminController = require('../controllers/adminController');
const router = express.Router();

// All admin routes require auth + admin role
router.use(auth, admin);

// User management
router.get('/users', adminController.getUsers);
router.put('/users/:id/ban', adminController.banUser);
router.put('/users/:id/role', adminController.toggleAdminRole);
router.put('/users/:id/role', adminController.toggleAdminRole);

// Categories
router.get('/categories', adminController.getCategories);
router.post('/categories', adminController.createCategory);
router.put('/categories/:id', adminController.updateCategory);
router.delete('/categories/:id', adminController.deleteCategory);

// Types
router.get('/types', adminController.getTypes);
router.post('/types', adminController.createType);
router.put('/types/:id', adminController.updateType);
router.delete('/types/:id', adminController.deleteType);

// Subtypes
router.get('/subtypes', adminController.getSubtypes);
router.post('/subtypes', adminController.createSubtype);
router.put('/subtypes/:id', adminController.updateSubtype);
router.delete('/subtypes/:id', adminController.deleteSubtype);

// Files
router.get('/files', adminController.getFiles);
router.post('/files', adminController.createFile);
router.put('/files/:id', adminController.updateFile);
router.delete('/files/:id', adminController.deleteFile);

// Example codes - ADD THESE MISSING ROUTES
router.get('/example-codes', adminController.getExampleCodes);
router.post('/example-codes', adminController.addExampleCode);
router.put('/example-codes/:id', adminController.updateExampleCode);
router.delete('/example-codes/:id', adminController.deleteExampleCode);

// Quizzes - ADD THESE MISSING ROUTES
router.get('/quizzes', adminController.getQuizzes);
router.get('/quizzes/:id/questions', adminController.getQuizQuestions);
router.post('/quizzes', adminController.createQuiz);
router.post('/quiz-questions', adminController.addQuizQuestion);
router.put('/quiz-questions/:id', adminController.updateQuizQuestion);
router.delete('/quiz-questions/:id', adminController.deleteQuizQuestion);

// Statistics
router.get('/statistics', adminController.getStatistics);

// Chat moderation
router.delete('/chat-messages/:id', adminController.deleteChatMessage);

module.exports = router;