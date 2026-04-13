// controllers/authController.js
const pool = require('../db/pool');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendPasswordResetEmail, sendVerificationEmail } = require('../services/emailService');

// Modified register function
exports.register = async (req, res) => {
  const { email, password, username } = req.body;
  if (!email || !password || !username) {
    return res.status(400).json({ error: 'All fields required' });
  }
  try {
    // Check if user exists
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    // Generate 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 15 * 60000); // 15 minutes

    const result = await pool.query(
      `INSERT INTO users (email, password_hash, username, role, verification_code, verification_expires) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, email, username`,
      [email, hashedPassword, username, 'user', verificationCode, expires]
    );
    const user = result.rows[0];

    // Send verification email
    await sendVerificationEmail(email, verificationCode);

    res.status(201).json({ 
      message: 'Registration successful. Please verify your email with the 6-digit code sent.',
      userId: user.id,
      email: user.email
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// New: Verify email with code
exports.verifyEmail = async (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) {
    return res.status(400).json({ error: 'Email and verification code required' });
  }
  try {
    const result = await pool.query(
      `SELECT id, verification_code, verification_expires FROM users 
       WHERE email = $1 AND is_verified = false`,
      [email]
    );
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'User already verified or not found' });
    }
    const user = result.rows[0];
    if (user.verification_code !== code) {
      return res.status(400).json({ error: 'Invalid verification code' });
    }
    if (new Date() > new Date(user.verification_expires)) {
      return res.status(400).json({ error: 'Verification code expired. Please register again.' });
    }
    // Mark as verified
    await pool.query(
      `UPDATE users SET is_verified = true, verification_code = NULL, verification_expires = NULL 
       WHERE id = $1`,
      [user.id]
    );
    res.json({ message: 'Email verified successfully. You can now log in.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Resend verification code
exports.resendVerification = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });
  try {
    const result = await pool.query(
      `SELECT id, is_verified FROM users WHERE email = $1`,
      [email]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (result.rows[0].is_verified) {
      return res.status(400).json({ error: 'Email already verified' });
    }
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 15 * 60000);
    await pool.query(
      `UPDATE users SET verification_code = $1, verification_expires = $2 WHERE email = $3`,
      [newCode, expires, email]
    );
    await sendVerificationEmail(email, newCode);
    res.json({ message: 'New verification code sent' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Modified login – check is_verified
exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const user = result.rows[0];
    
    // Check if verified
    if (!user.is_verified) {
      return res.status(403).json({ error: 'Please verify your email before logging in. Check your inbox.' });
    }
    
    if (user.is_banned) {
      return res.status(403).json({ error: 'Your account has been banned' });
    }
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ user: { id: user.id, email: user.email, username: user.username, role: user.role }, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Forgot password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });
  try {
    const result = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 3600000); // 1 hour
    await pool.query('UPDATE users SET reset_token = $1, reset_expires = $2 WHERE email = $3', [token, expires, email]);
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}&email=${email}`;
    await sendPasswordResetEmail(email, resetLink);
    res.json({ message: 'Password reset email sent' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  const { email, token, newPassword } = req.body;
  if (!email || !token || !newPassword) {
    return res.status(400).json({ error: 'All fields required' });
  }
  try {
    const result = await pool.query('SELECT id FROM users WHERE email = $1 AND reset_token = $2 AND reset_expires > NOW()', [email, token]);
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password_hash = $1, reset_token = NULL, reset_expires = NULL WHERE email = $2', [hashedPassword, email]);
    res.json({ message: 'Password reset successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get current user
exports.getMe = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, email, username, role, is_banned, created_at FROM users WHERE id = $1', [req.user.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};