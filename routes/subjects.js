// remember to come back and write this code late
const express = require('express');
const router = express.Router();
const db = require('../db');
const { auth, subjectLeaderOnly } = require('../middleware/auth');

// Get all subjects
router.get('/', async (req, res) => {
  try {
    const subjects = await db.query(`
      SELECT DISTINCT s.id, s.name, s.description
      FROM subjects s
      ORDER BY s.name
    `);
    
    res.json(subjects.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get subject leaders
router.get('/leaders', auth, async (req, res) => {
  try {
    const subjectLeaders = await db.query(`
      SELECT 
        u.id as user_id,
        u.username,
        u.email,
        s.id as subject_id,
        s.name as subject_name
      FROM users u
      JOIN subject_leaders sl ON u.id = sl.user_id
      JOIN subjects s ON sl.subject_id = s.id
      WHERE u.role = 'subject_leader'
      ORDER BY s.name, u.username
    `);
    
    res.json(subjectLeaders.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Assign subject leader
router.post('/leaders', auth, subjectLeaderOnly, async (req, res) => {
  try {
    const { user_id, subject_id } = req.body;
    
    // Check if user exists and is a subject leader
    const user = await db.query(
      'SELECT role FROM users WHERE id = $1',
      [user_id]
    );
    
    if (user.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (user.rows[0].role !== 'subject_leader') {
      return res.status(400).json({ message: 'User is not a subject leader' });
    }
    
    // Check if subject exists
    const subject = await db.query(
      'SELECT id FROM subjects WHERE id = $1',
      [subject_id]
    );
    
    if (subject.rows.length === 0) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    
    // Check if assignment already exists
    const existingAssignment = await db.query(
      'SELECT 1 FROM subject_leaders WHERE user_id = $1 AND subject_id = $2',
      [user_id, subject_id]
    );
    
    if (existingAssignment.rows.length > 0) {
      return res.status(400).json({ message: 'Subject leader already assigned to this subject' });
    }
    
    // Create assignment
    await db.query(
      'INSERT INTO subject_leaders (user_id, subject_id) VALUES ($1, $2)',
      [user_id, subject_id]
    );
    
    res.status(201).json({ message: 'Subject leader assigned successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Remove subject leader
router.delete('/leaders/:userId/:subjectId', auth, subjectLeaderOnly, async (req, res) => {
  try {
    const { userId, subjectId } = req.params;
    
    // Check if assignment exists
    const assignment = await db.query(
      'SELECT 1 FROM subject_leaders WHERE user_id = $1 AND subject_id = $2',
      [userId, subjectId]
    );
    
    if (assignment.rows.length === 0) {
      return res.status(404).json({ message: 'Subject leader assignment not found' });
    }
    
    // Remove assignment
    await db.query(
      'DELETE FROM subject_leaders WHERE user_id = $1 AND subject_id = $2',
      [userId, subjectId]
    );
    
    res.json({ message: 'Subject leader removed successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
