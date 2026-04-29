// controllers/adminController.js
const pool = require('../db/pool');
const { notifyNewContent } = require('../services/emailService');

// ========== User Management ==========
exports.toggleAdminRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  
  if (!role || (role !== 'admin' && role !== 'user')) {
    return res.status(400).json({ error: 'Invalid role. Must be "admin" or "user"' });
  }
  
  // Prevent self-demotion (optional but recommended)
  if (parseInt(id) === req.user.id && role !== 'admin') {
    return res.status(403).json({ error: 'You cannot remove your own admin privileges' });
  }
  
  try {
    const result = await pool.query(
      'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, email, username, role',
      [role, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ 
      message: `User role updated to ${role}`,
      user: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, email, username, role, is_banned, avatar_url, created_at FROM users ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.banUser = async (req, res) => {
  const { id } = req.params;
  const { is_banned } = req.body;
  try {
    await pool.query('UPDATE users SET is_banned = $1 WHERE id = $2', [is_banned, id]);
    res.json({ message: `User ${is_banned ? 'banned' : 'unbanned'}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// ========== Categories ==========
exports.getCategories = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.createCategory = async (req, res) => {
  const { name, display_name } = req.body;
  if (!name || !display_name) return res.status(400).json({ error: 'Name and display_name required' });
  try {
    const result = await pool.query('INSERT INTO categories (name, display_name) VALUES ($1, $2) RETURNING *', [name, display_name]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(400).json({ error: 'Category name already exists' });
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, display_name } = req.body;
  try {
    const result = await pool.query('UPDATE categories SET name = $1, display_name = $2 WHERE id = $3 RETURNING *', [name, display_name, id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Category not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM categories WHERE id = $1', [id]);
    res.json({ message: 'Category deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// ========== Types ==========
exports.getTypes = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM types ORDER BY order_index');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.createType = async (req, res) => {
  const { category_id, name, order_index } = req.body;
  if (!category_id || !name) return res.status(400).json({ error: 'category_id and name required' });
  try {
    const result = await pool.query('INSERT INTO types (category_id, name, order_index) VALUES ($1, $2, $3) RETURNING *', [category_id, name, order_index || 0]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateType = async (req, res) => {
  const { id } = req.params;
  const { name, order_index } = req.body;
  try {
    const result = await pool.query('UPDATE types SET name = $1, order_index = $2 WHERE id = $3 RETURNING *', [name, order_index, id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Type not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteType = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM types WHERE id = $1', [id]);
    res.json({ message: 'Type deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// ========== Subtypes ==========
exports.getSubtypes = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM subtypes ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.createSubtype = async (req, res) => {
  const { type_id, name } = req.body;
  if (!type_id || !name) return res.status(400).json({ error: 'type_id and name required' });
  try {
    const result = await pool.query('INSERT INTO subtypes (type_id, name) VALUES ($1, $2) RETURNING *', [type_id, name]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateSubtype = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const result = await pool.query('UPDATE subtypes SET name = $1 WHERE id = $2 RETURNING *', [name, id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Subtype not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteSubtype = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM subtypes WHERE id = $1', [id]);
    res.json({ message: 'Subtype deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// ========== Files ==========
exports.getFiles = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM files ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.createFile = async (req, res) => {
  const { subtype_id, name, notes, demo_code } = req.body;
  if (!subtype_id || !name) return res.status(400).json({ error: 'subtype_id and name required' });
  try {
    const result = await pool.query(
      'INSERT INTO files (subtype_id, name, notes, demo_code) VALUES ($1, $2, $3, $4) RETURNING *',
      [subtype_id, name, notes || '', demo_code || '']
    );
    const newFile = result.rows[0];
    // Notify all users (except admins? we'll send to all non-banned users)
    const usersResult = await pool.query('SELECT email, id FROM users WHERE is_banned = false');
    for (const user of usersResult.rows) {
      // Insert in-app notification
      await pool.query(
        'INSERT INTO notifications (user_id, type, title, message, related_file_id) VALUES ($1, $2, $3, $4, $5)',
        [user.id, 'new_content', 'New Content Added', `New file "${name}" has been added.`, newFile.id]
      );
      // Send email (optional, can be async)
      try {
        await notifyNewContent(user.email, name, newFile.id);
      } catch (emailErr) { console.error('Email failed for', user.email); }
    }
    res.status(201).json(newFile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateFile = async (req, res) => {
  const { id } = req.params;
  const { name, notes, demo_code } = req.body;
  try {
    const result = await pool.query(
      'UPDATE files SET name = $1, notes = $2, demo_code = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
      [name, notes, demo_code, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'File not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteFile = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM files WHERE id = $1', [id]);
    res.json({ message: 'File deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// ========== Example Codes ==========
exports.addExampleCode = async (req, res) => {
  const { file_id, language, code, order_index } = req.body;
  if (!file_id || !language || !code) return res.status(400).json({ error: 'file_id, language, code required' });
  try {
    const result = await pool.query(
      'INSERT INTO example_codes (file_id, language, code, order_index) VALUES ($1, $2, $3, $4) RETURNING *',
      [file_id, language, code, order_index || 0]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateExampleCode = async (req, res) => {
  const { id } = req.params;
  const { code, order_index } = req.body;
  try {
    const result = await pool.query('UPDATE example_codes SET code = $1, order_index = $2 WHERE id = $3 RETURNING *', [code, order_index, id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Example code not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteExampleCode = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM example_codes WHERE id = $1', [id]);
    res.json({ message: 'Example code deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// ========== Quizzes ==========
exports.createQuiz = async (req, res) => {
  const { file_id, title } = req.body;
  if (!file_id) return res.status(400).json({ error: 'file_id required' });
  try {
    const result = await pool.query('INSERT INTO quizzes (file_id, title) VALUES ($1, $2) RETURNING *', [file_id, title || '']);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.addQuizQuestion = async (req, res) => {
  const { quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option, order_index } = req.body;
  if (!quiz_id || !question_text || !option_a || !option_b || !option_c || !option_d || !correct_option) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const result = await pool.query(
      'INSERT INTO quiz_questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option, order_index) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *',
      [quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option, order_index || 0]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateQuizQuestion = async (req, res) => {
  const { id } = req.params;
  const { question_text, option_a, option_b, option_c, option_d, correct_option } = req.body;
  try {
    const result = await pool.query(
      'UPDATE quiz_questions SET question_text=$1, option_a=$2, option_b=$3, option_c=$4, option_d=$5, correct_option=$6 WHERE id=$7 RETURNING *',
      [question_text, option_a, option_b, option_c, option_d, correct_option, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Question not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteQuizQuestion = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM quiz_questions WHERE id = $1', [id]);
    res.json({ message: 'Question deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// ========== Statistics ==========
exports.getStatistics = async (req, res) => {
  try {
    const totalUsers = await pool.query('SELECT COUNT(*) FROM users');
    const bannedUsers = await pool.query('SELECT COUNT(*) FROM users WHERE is_banned = true');
    const totalFiles = await pool.query('SELECT COUNT(*) FROM files');
    const totalQuizAttempts = await pool.query('SELECT COUNT(*) FROM user_quiz_attempts');
    const avgScore = await pool.query('SELECT AVG(score) FROM user_quiz_attempts');
    const recentMessages = await pool.query('SELECT COUNT(*) FROM chat_messages WHERE created_at > NOW() - INTERVAL \'7 days\'');
    res.json({
      totalUsers: parseInt(totalUsers.rows[0].count),
      bannedUsers: parseInt(bannedUsers.rows[0].count),
      totalFiles: parseInt(totalFiles.rows[0].count),
      totalQuizAttempts: parseInt(totalQuizAttempts.rows[0].count),
      averageQuizScore: parseFloat(avgScore.rows[0].avg) || 0,
      messagesLast7Days: parseInt(recentMessages.rows[0].count)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// ========== Chat Moderation ==========
exports.deleteChatMessage = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('UPDATE chat_messages SET is_deleted_by_admin = true WHERE id = $1', [id]);
    res.json({ message: 'Message deleted by admin' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Add these functions to your adminController.js file

// ========== Example Codes Management ==========
exports.getExampleCodes = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT ec.*, f.name as file_name 
      FROM example_codes ec
      JOIN files f ON ec.file_id = f.id
      ORDER BY ec.file_id, ec.language, ec.order_index
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.addExampleCode = async (req, res) => {
  const { file_id, language, code, order_index } = req.body;
  if (!file_id || !language || !code) {
    return res.status(400).json({ error: 'file_id, language, and code are required' });
  }
  try {
    const result = await pool.query(
      `INSERT INTO example_codes (file_id, language, code, order_index) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [file_id, language, code, order_index || 0]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateExampleCode = async (req, res) => {
  const { id } = req.params;
  const { code, order_index } = req.body;
  try {
    const result = await pool.query(
      'UPDATE example_codes SET code = $1, order_index = $2 WHERE id = $3 RETURNING *',
      [code, order_index, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Example code not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteExampleCode = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM example_codes WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Example code not found' });
    }
    res.json({ message: 'Example code deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// ========== Quizzes Management ==========
exports.getQuizzes = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT q.*, f.name as file_name 
      FROM quizzes q
      JOIN files f ON q.file_id = f.id
      ORDER BY q.id DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getQuizQuestions = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `SELECT * FROM quiz_questions WHERE quiz_id = $1 ORDER BY order_index, id`,
      [id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.createQuiz = async (req, res) => {
  const { file_id, title } = req.body;
  if (!file_id) {
    return res.status(400).json({ error: 'file_id is required' });
  }
  try {
    // Check if quiz already exists for this file
    const existing = await pool.query('SELECT id FROM quizzes WHERE file_id = $1', [file_id]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'A quiz already exists for this file' });
    }
    
    const result = await pool.query(
      'INSERT INTO quizzes (file_id, title) VALUES ($1, $2) RETURNING *',
      [file_id, title || 'Quiz']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.addQuizQuestion = async (req, res) => {
  const { quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option, order_index } = req.body;
  if (!quiz_id || !question_text || !option_a || !option_b || !option_c || !option_d || !correct_option) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  try {
    const result = await pool.query(
      `INSERT INTO quiz_questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option, order_index) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option, order_index || 0]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateQuizQuestion = async (req, res) => {
  const { id } = req.params;
  const { question_text, option_a, option_b, option_c, option_d, correct_option } = req.body;
  try {
    const result = await pool.query(
      `UPDATE quiz_questions 
       SET question_text = $1, option_a = $2, option_b = $3, option_c = $4, option_d = $5, correct_option = $6 
       WHERE id = $7 RETURNING *`,
      [question_text, option_a, option_b, option_c, option_d, correct_option, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Question not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteQuizQuestion = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM quiz_questions WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Question not found' });
    }
    res.json({ message: 'Question deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};


// Add this function to adminController.js

// Delete user permanently from database
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  
  // Prevent admin from deleting themselves
  if (parseInt(id) === req.user.id) {
    return res.status(403).json({ error: 'You cannot delete your own account' });
  }
  
  try {
    // Check if user exists
    const userCheck = await pool.query('SELECT id FROM users WHERE id = $1', [id]);
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Delete user (cascade will delete related records)
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};