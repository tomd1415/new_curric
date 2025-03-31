// remember to come back and write this code late
const express = require('express');
const router = express.Router();
const db = require('../db');
const { auth, adminOnly, subjectLeaderOnly } = require('../middleware/auth');

// Get all subjects
router.get('/', async (req, res) => {
  try {
    const subjects = await db.query('SELECT * FROM subjects ORDER BY name');
    res.json(subjects.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get subject by id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const subject = await db.query('SELECT * FROM subjects WHERE id = $1', [id]);
    
    if (subject.rows.length === 0) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    
    res.json(subject.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Create subject (admin only)
router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const { name, description } = req.body;
    
    // Check if subject already exists
    const subjectExists = await db.query('SELECT * FROM subjects WHERE name = $1', [name]);
    
    if (subjectExists.rows.length > 0) {
      return res.status(400).json({ message: 'Subject already exists' });
    }
    
    // Create subject
    const newSubject = await db.query(
      'INSERT INTO subjects (name, description) VALUES ($1, $2) RETURNING *',
      [name, description]
    );
    
    res.status(201).json(newSubject.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update subject (admin only)
router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    
    // Check if subject exists
    const subject = await db.query('SELECT * FROM subjects WHERE id = $1', [id]);
    
    if (subject.rows.length === 0) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    
    // Update subject
    const updatedSubject = await db.query(
      'UPDATE subjects SET name = $1, description = $2 WHERE id = $3 RETURNING *',
      [name, description, id]
    );
    
    res.json(updatedSubject.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete subject (admin only)
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if subject exists
    const subject = await db.query('SELECT * FROM subjects WHERE id = $1', [id]);
    
    if (subject.rows.length === 0) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    
    // Check if subject has curriculum plans
    const curriculumPlans = await db.query(
      'SELECT * FROM curriculum_plans WHERE subject_id = $1',
      [id]
    );
    
    if (curriculumPlans.rows.length > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete subject with existing curriculum plans' 
      });
    }
    
    // Delete subject leaders for this subject
    await db.query('DELETE FROM subject_leaders WHERE subject_id = $1', [id]);
    
    // Delete subject
    await db.query('DELETE FROM subjects WHERE id = $1', [id]);
    
    res.json({ message: 'Subject deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get subject leaders for a subject
router.get('/:id/leaders', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    const subjectLeaders = await db.query(`
      SELECT u.id, u.username, u.email
      FROM users u
      JOIN subject_leaders sl ON u.id = sl.user_id
      WHERE sl.subject_id = $1
    `, [id]);
    
    res.json(subjectLeaders.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Assign subject leader to subject (admin only)
router.post('/:id/leaders', auth, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.body;
    
    // Check if subject exists
    const subject = await db.query('SELECT * FROM subjects WHERE id = $1', [id]);
    
    if (subject.rows.length === 0) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    
    // Check if user exists
    const user = await db.query('SELECT * FROM users WHERE id = $1', [user_id]);
    
    if (user.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if user is already a subject leader for this subject
    const existingLeader = await db.query(
      'SELECT * FROM subject_leaders WHERE subject_id = $1 AND user_id = $2',
      [id, user_id]
    );
    
    if (existingLeader.rows.length > 0) {
      return res.status(400).json({ message: 'User is already a subject leader for this subject' });
    }
    
    // Assign subject leader
    await db.query(
      'INSERT INTO subject_leaders (subject_id, user_id) VALUES ($1, $2)',
      [id, user_id]
    );
    
    res.status(201).json({ message: 'Subject leader assigned successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Remove subject leader from subject (admin only)
router.delete('/:subjectId/leaders/:userId', auth, adminOnly, async (req, res) => {
  try {
    const { subjectId, userId } = req.params;
    
    // Check if the relationship exists
    const leaderRelationship = await db.query(
      'SELECT * FROM subject_leaders WHERE subject_id = $1 AND user_id = $2',
      [subjectId, userId]
    );
    
    if (leaderRelationship.rows.length === 0) {
      return res.status(404).json({ message: 'Subject leader relationship not found' });
    }
    
    // Remove subject leader
    await db.query(
      'DELETE FROM subject_leaders WHERE subject_id = $1 AND user_id = $2',
      [subjectId, userId]
    );
    
    res.json({ message: 'Subject leader removed successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
