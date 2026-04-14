// controllers/fileController.js
const pool = require('../db/pool');
const { calculateScore } = require('../services/quizService');

// Get all files with category/type/subtype info (for browsing)
exports.getFilesHierarchy = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        c.id as category_id, c.name as category_name, c.display_name,
        t.id as type_id, t.name as type_name,
        s.id as subtype_id, s.name as subtype_name,
        f.id as file_id, f.name as file_name
      FROM categories c
      LEFT JOIN types t ON c.id = t.category_id
      LEFT JOIN subtypes s ON t.id = s.type_id
      LEFT JOIN files f ON s.id = f.subtype_id
      ORDER BY c.id, t.order_index, s.id, f.id
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get single file with notes, example codes, demo, quiz
exports.getFileById = async (req, res) => {
  const { id } = req.params;
  try {
    const fileResult = await pool.query('SELECT * FROM files WHERE id = $1', [id]);
    if (fileResult.rows.length === 0) {
      return res.status(404).json({ error: 'File not found' });
    }
    const file = fileResult.rows[0];

    const codesResult = await pool.query(
      'SELECT * FROM example_codes WHERE file_id = $1 ORDER BY language, order_index',
      [id]
    );
    
    const quizResult = await pool.query('SELECT id, title FROM quizzes WHERE file_id = $1', [id]);
    let questions = [];
    if (quizResult.rows.length > 0) {
      const quizId = quizResult.rows[0].id;
      const questionsResult = await pool.query(
        'SELECT id, question_text, option_a, option_b, option_c, option_d FROM quiz_questions WHERE quiz_id = $1 ORDER BY order_index',
        [quizId]
      );
      questions = questionsResult.rows;
    }
    
    res.json({
      file,
      example_codes: codesResult.rows,
      quiz: quizResult.rows[0] ? { ...quizResult.rows[0], questions } : null
    });
  } catch (err) {
    console.error('Get file by ID error:', err);
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
};

// Submit quiz answers
exports.submitQuiz = async (req, res) => {
  const { id } = req.params; // file id
  const { answers } = req.body;
  const userId = req.user.id;
  
  console.log('Quiz submission received:', { fileId: id, userId, answersCount: answers?.length });
  
  if (!answers || !Array.isArray(answers)) {
    return res.status(400).json({ error: 'Answers array is required' });
  }
  
  try {
    // Get quiz id for this file
    const quizRes = await pool.query('SELECT id FROM quizzes WHERE file_id = $1', [id]);
    if (quizRes.rows.length === 0) {
      return res.status(404).json({ error: 'No quiz for this file' });
    }
    const quizId = quizRes.rows[0].id;
    
    // Get all questions with correct answers
    const questionsRes = await pool.query(
      'SELECT id, correct_option FROM quiz_questions WHERE quiz_id = $1 ORDER BY order_index',
      [quizId]
    );
    const questions = questionsRes.rows;
    
    if (questions.length === 0) {
      return res.status(400).json({ error: 'Quiz has no questions' });
    }
    
    // Map user answers
    const userAnswersMap = {};
    for (const ans of answers) {
      userAnswersMap[ans.question_id] = ans.selected_option;
    }
    
    // Calculate score
    let correctCount = 0;
    for (const q of questions) {
      const userAnswer = userAnswersMap[q.id];
      if (userAnswer && userAnswer.toUpperCase() === q.correct_option) {
        correctCount++;
      }
    }
    
    const score = Math.round((correctCount / questions.length) * 100);
    
    // Store attempt
    await pool.query(
      `INSERT INTO user_quiz_attempts (user_id, quiz_id, score, answers) 
       VALUES ($1, $2, $3, $4) 
       ON CONFLICT (user_id, quiz_id) 
       DO UPDATE SET score = $3, answers = $4, completed_at = CURRENT_TIMESTAMP`,
      [userId, quizId, score, JSON.stringify(answers)]
    );
    
    res.json({ 
      score, 
      message: `You scored ${score}% (${correctCount}/${questions.length} correct)`,
      correctCount,
      totalQuestions: questions.length
    });
  } catch (err) {
    console.error('Quiz submission error:', err);
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
};