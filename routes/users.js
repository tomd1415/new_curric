const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');
const db = require('../db');
const { auth, adminOnly } = require('../middleware/auth');

// Get all users (admin only)
router.get('/', auth, adminOnly, async (req, res) => {
  try {
    const users = await db.query('SELECT id, username, email, role, created_at FROM users ORDER BY username');
    res.json(users.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get user by id (admin only, or self)
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if user is admin or trying to access their own profile
    if (req.user.role !== 'admin' && req.user.id !== parseInt(id)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const user = await db.query(
      'SELECT id, username, email, role, created_at FROM users WHERE id = $1',
      [id]
    );
    
    if (user.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Create user (admin only)
router.post('/', [
  auth,
  adminOnly,
  check('username', 'Username is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
  check('role', 'Role must be admin, teacher, or subject_leader').isIn(['admin', 'teacher', 'subject_leader'])
], async (req, res) => {
  // Validate input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password, role } = req.body;

  try {
    // Check if user exists
    const userExists = await db.query(
      'SELECT * FROM users WHERE username = $1 OR email = $2',
      [username, email]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await db.query(
      'INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, username, email, role',
      [username, email, hashedPassword, role]
    );

    res.status(201).json(newUser.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update user (admin only, or self)
router.put('/:id', [
  auth,
  check('username', 'Username is required').optional().not().isEmpty(),
  check('email', 'Please include a valid email').optional().isEmail(),
  check('password', 'Password must be at least 6 characters').optional().isLength({ min: 6 }),
  check('role', 'Role must be admin, teacher, or subject_leader').optional().isIn(['admin', 'teacher', 'subject_leader'])
], async (req, res) => {
  // Validate input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { username, email, password, role } = req.body;

  try {
    // Check if user exists
    const user = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    
    if (user.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if user is admin or trying to update their own profile
    if (req.user.role !== 'admin' && req.user.id !== parseInt(id)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Only admins can change roles
    if (role && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can change roles' });
    }

    // Start building update query
    let updateQuery = 'UPDATE users SET ';
    const values = [];
    let paramIndex = 1;
    
    if (username) {
      updateQuery += `username = $${paramIndex}, `;
      values.push(username);
      paramIndex++;
    }
    
    if (email) {
      updateQuery += `email = $${paramIndex}, `;
      values.push(email);
      paramIndex++;
    }
    
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updateQuery += `password_hash = $${paramIndex}, `;
      values.push(hashedPassword);
      paramIndex++;
    }
    
    if (role) {
      updateQuery += `role = $${paramIndex}, `;
      values.push(role);
      paramIndex++;
    }
    
    // Remove trailing comma and space
    updateQuery = updateQuery.slice(0, -2);
    
    // Add WHERE clause and RETURNING
    updateQuery += ` WHERE id = $${paramIndex} RETURNING id, username, email, role`;
    values.push(id);
    
    // Execute update
    const updatedUser = await db.query(updateQuery, values);
    
    res.json(updatedUser.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete user (admin only)
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if user exists
    const user = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    
    if (user.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if user is an admin
    if (user.rows[0].role === 'admin') {
      // Count number of admins
      const adminCount = await db.query('SELECT COUNT(*) FROM users WHERE role = $1', ['admin']);
      
      if (parseInt(adminCount.rows[0].count) <= 1) {
        return res.status(400).json({ message: 'Cannot delete the last admin user' });
      }
    }
    
    // Delete user's subject leader assignments
    await db.query('DELETE FROM subject_leaders WHERE user_id = $1', [id]);
    
    // Delete user
    await db.query('DELETE FROM users WHERE id = $1', [id]);
    
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get subjects assigned to a user
router.get('/:id/subjects', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if user is admin or trying to access their own subjects
    if (req.user.role !== 'admin' && req.user.id !== parseInt(id)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const subjects = await db.query(`
      SELECT s.id, s.name, s.description
      FROM subjects s
      JOIN subject_leaders sl ON s.id = sl.subject_id
      WHERE sl.user_id = $1
      ORDER BY s.name
    `, [id]);
    
    res.json(subjects.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get current user profile
router.get('/me/profile', auth, async (req, res) => {
  try {
    const user = await db.query(
      'SELECT id, username, email, role, created_at FROM users WHERE id = $1',
      [req.user.id]
    );
    
    if (user.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
