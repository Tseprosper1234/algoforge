// controllers/userController.js
const pool = require('../db/pool');
const { uploadFile } = require('../services/supabaseStorage');

// Upload avatar
/*exports.uploadAvatar = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const avatarUrl = `/uploads/avatars/${req.file.filename}`;
  try {
    await pool.query('UPDATE users SET avatar_url = $1 WHERE id = $2', [avatarUrl, req.user.id]);
    res.json({ avatarUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save avatar' });
  }
};*/

// Upload avatar to Supabase Storage
exports.uploadAvatar = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  try {
    // Upload to Supabase Storage
    const { publicUrl, filePath } = await uploadFile(
      req.file,
      'avatars',
      'users',
      req.user.id
    );
    
    // Update user's avatar URL in database
    await pool.query('UPDATE users SET avatar_url = $1 WHERE id = $2', [publicUrl, req.user.id]);
    
    res.json({ avatarUrl: publicUrl });
  } catch (err) {
    console.error('Avatar upload error:', err);
    res.status(500).json({ error: 'Failed to upload avatar: ' + err.message });
  }
};


// Get user profile with avatar
exports.getProfile = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, email, username, avatar_url, created_at FROM users WHERE id = $1', [req.user.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update profile (username only, avatar handled separately)
exports.updateProfile = async (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: 'Username required' });
  try {
    await pool.query('UPDATE users SET username = $1 WHERE id = $2', [username, req.user.id]);
    res.json({ message: 'Profile updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getQuizProgress = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT q.title, uqa.score, uqa.completed_at, f.name as file_name
      FROM user_quiz_attempts uqa
      JOIN quizzes q ON uqa.quiz_id = q.id
      JOIN files f ON q.file_id = f.id
      WHERE uqa.user_id = $1
      ORDER BY uqa.completed_at DESC
    `, [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};