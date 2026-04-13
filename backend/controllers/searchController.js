// controllers/searchController.js
const pool = require('../db/pool');

exports.search = async (req, res) => {
  const q = req.query.q;
  if (!q || q.trim() === '') {
    return res.json({ files: [], exampleCodes: [] });
  }
  const searchTerm = `%${q}%`;
  try {
    // Search in files (name, notes)
    const filesResult = await pool.query(`
      SELECT id, name, notes, subtype_id, 'file' as type
      FROM files
      WHERE name ILIKE $1 OR notes ILIKE $1
    `, [searchTerm]);
    // Search in example codes (code)
    const codesResult = await pool.query(`
      SELECT ec.id, ec.code, ec.language, ec.file_id, f.name as file_name, 'example_code' as type
      FROM example_codes ec
      JOIN files f ON ec.file_id = f.id
      WHERE ec.code ILIKE $1
    `, [searchTerm]);
    res.json({
      files: filesResult.rows,
      exampleCodes: codesResult.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};