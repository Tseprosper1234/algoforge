// controllers/chatController.js
const pool = require('../db/pool');
const { uploadFile } = require('../services/supabaseStorage');

// Get messages (with pagination and threaded replies)
exports.getMessages = async (req, res) => {
  const limit = parseInt(req.query.limit) || 50;
  const offset = parseInt(req.query.offset) || 0;
  
  try {
    // Get all messages ordered by creation date
    const result = await pool.query(`
      SELECT 
        cm.*, 
        u.username, 
        u.email, 
        u.avatar_url
      FROM chat_messages cm
      LEFT JOIN users u ON cm.user_id = u.id
      WHERE cm.is_deleted_by_admin = false
      ORDER BY cm.created_at ASC
    `);
    
    // Fetch parent message details for replies
    const messagesWithReplies = await Promise.all(result.rows.map(async (msg) => {
      if (msg.parent_id) {
        const parentResult = await pool.query(`
          SELECT 
            parent.id,
            parent.content,
            parent.message_type,
            parent.created_at,
            parent_user.username
          FROM chat_messages parent
          LEFT JOIN users parent_user ON parent.user_id = parent_user.id
          WHERE parent.id = $1
        `, [msg.parent_id]);
        
        if (parentResult.rows.length > 0) {
          return {
            ...msg,
            reply_to: parentResult.rows[0]
          };
        }
      }
      return msg;
    }));
    
    // Build threaded message structure
    const messageMap = new Map();
    const rootMessages = [];
    
    messagesWithReplies.forEach(msg => {
      messageMap.set(msg.id, { ...msg, replies: [] });
    });
    
    messagesWithReplies.forEach(msg => {
      if (msg.parent_id && messageMap.has(msg.parent_id)) {
        const parent = messageMap.get(msg.parent_id);
        parent.replies.push(messageMap.get(msg.id));
      } else if (!msg.parent_id) {
        rootMessages.push(messageMap.get(msg.id));
      }
    });
    
    // Sort root messages by date (newest first)
    rootMessages.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    // Sort replies within each parent by date (oldest first)
    rootMessages.forEach(root => {
      root.replies.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    });
    
    // Flatten the threaded structure for display
    const flattenedMessages = [];
    rootMessages.forEach(root => {
      flattenedMessages.push(root);
      root.replies.forEach(reply => {
        flattenedMessages.push(reply);
      });
    });
    
    // Apply pagination
    const paginatedMessages = flattenedMessages.slice(offset, offset + limit);
    
    res.json(paginatedMessages);
  } catch (err) {
    console.error('Error in getMessages:', err);
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
};

// Send text message (with optional reply)
exports.sendTextMessage = async (req, res) => {
  const { content, parent_id, reply_to_username } = req.body;
  
  if (!content) {
    return res.status(400).json({ error: 'Message content required' });
  }
  
  try {
    const result = await pool.query(
      `INSERT INTO chat_messages (user_id, message_type, content, parent_id, reply_to_username) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [req.user.id, 'text', content, parent_id || null, reply_to_username || null]
    );
    
    // Get the user's info
    const userResult = await pool.query(
      'SELECT username, email, avatar_url FROM users WHERE id = $1',
      [req.user.id]
    );
    
    const newMsg = {
      ...result.rows[0],
      username: userResult.rows[0].username,
      email: userResult.rows[0].email,
      avatar_url: userResult.rows[0].avatar_url
    };
    
    res.status(201).json(newMsg);
  } catch (err) {
    console.error('Send message error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Upload file attachment to Supabase Storage
exports.uploadAttachment = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  const file = req.file;
  let messageType = 'file';
  if (file.mimetype.startsWith('image/')) messageType = 'image';
  else if (file.mimetype.startsWith('video/')) messageType = 'video';
  
  const { parent_id, reply_to_username } = req.body;
  
  try {
    // Upload to Supabase Storage
    const { publicUrl, filePath } = await uploadFile(
      file,
      'chat-files',
      'messages',
      req.user.id
    );
    
    // Save message with Supabase URL
    const result = await pool.query(
      `INSERT INTO chat_messages (user_id, message_type, content, file_url, file_size, mime_type, parent_id, reply_to_username)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [req.user.id, messageType, file.originalname, publicUrl, file.size, file.mimetype, parent_id || null, reply_to_username || null]
    );
    
    // Get user info
    const userResult = await pool.query(
      'SELECT username, email, avatar_url FROM users WHERE id = $1',
      [req.user.id]
    );
    
    const newMsg = {
      ...result.rows[0],
      username: userResult.rows[0].username,
      email: userResult.rows[0].email,
      avatar_url: userResult.rows[0].avatar_url
    };
    
    res.status(201).json(newMsg);
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Failed to upload file: ' + err.message });
  }
};
