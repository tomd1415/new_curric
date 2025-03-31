const express = require('express');
const router = express.Router();
const db = require('../db');
const { auth, subjectLeaderOnly } = require('../middleware/auth');

// Get all curriculum plans
router.get('/', async (req, res) => {
  try {
    const curriculumPlans = await db.query(`
      SELECT cp.id, s.name as subject, yg.name as year_group, t.name as term, 
             cp.area_of_study, cp.literacy_focus, cp.numeracy_focus, cp.smsc,
             cp.created_at, cp.updated_at
      FROM curriculum_plans cp
      JOIN subjects s ON cp.subject_id = s.id
      JOIN year_groups yg ON cp.year_group_id = yg.id
      JOIN terms t ON cp.term_id = t.id
      ORDER BY s.name, yg.name, t.name
    `);
    
    res.json(curriculumPlans.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get curriculum plans by subject
router.get('/subject/:subjectId', async (req, res) => {
  try {
    const { subjectId } = req.params;
    
    const curriculumPlans = await db.query(`
      SELECT cp.id, s.name as subject, yg.name as year_group, t.name as term, 
             cp.area_of_study, cp.literacy_focus, cp.numeracy_focus, cp.smsc,
             cp.created_at, cp.updated_at
      FROM curriculum_plans cp
      JOIN subjects s ON cp.subject_id = s.id
      JOIN year_groups yg ON cp.year_group_id = yg.id
      JOIN terms t ON cp.term_id = t.id
      WHERE cp.subject_id = $1
      ORDER BY yg.name, t.name
    `, [subjectId]);
    
    res.json(curriculumPlans.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get curriculum plans by year group
router.get('/year-group/:yearGroupId', async (req, res) => {
  try {
    const { yearGroupId } = req.params;
    
    const curriculumPlans = await db.query(`
      SELECT cp.id, s.name as subject, yg.name as year_group, t.name as term, 
             cp.area_of_study, cp.literacy_focus, cp.numeracy_focus, cp.smsc,
             cp.created_at, cp.updated_at
      FROM curriculum_plans cp
      JOIN subjects s ON cp.subject_id = s.id
      JOIN year_groups yg ON cp.year_group_id = yg.id
      JOIN terms t ON cp.term_id = t.id
      WHERE cp.year_group_id = $1
      ORDER BY s.name, t.name
    `, [yearGroupId]);
    
    res.json(curriculumPlans.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get specific curriculum plan
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const curriculumPlan = await db.query(`
      SELECT cp.id, s.name as subject, s.id as subject_id,
             yg.name as year_group, yg.id as year_group_id,
             t.name as term, t.id as term_id,
             cp.area_of_study, cp.literacy_focus, cp.numeracy_focus, cp.smsc,
             cp.created_at, cp.updated_at
      FROM curriculum_plans cp
      JOIN subjects s ON cp.subject_id = s.id
      JOIN year_groups yg ON cp.year_group_id = yg.id
      JOIN terms t ON cp.term_id = t.id
      WHERE cp.id = $1
    `, [id]);
    
    if (curriculumPlan.rows.length === 0) {
      return res.status(404).json({ message: 'Curriculum plan not found' });
    }
    
    res.json(curriculumPlan.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Create curriculum plan
router.post('/', auth, subjectLeaderOnly, async (req, res) => {
  try {
    const { subject_id, year_group_id, term_id, area_of_study, literacy_focus, numeracy_focus, smsc } = req.body;
    
    // Check if curriculum plan already exists
    const existingPlan = await db.query(
      'SELECT 1 FROM curriculum_plans WHERE subject_id = $1 AND year_group_id = $2 AND term_id = $3',
      [subject_id, year_group_id, term_id]
    );
    
    if (existingPlan.rows.length > 0) {
      return res.status(400).json({ message: 'Curriculum plan already exists' });
    }
    
    // Create plan
    const newPlan = await db.query(
      `INSERT INTO curriculum_plans 
       (subject_id, year_group_id, term_id, area_of_study, literacy_focus, numeracy_focus, smsc)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id`,
      [subject_id, year_group_id, term_id, area_of_study, literacy_focus, numeracy_focus, smsc]
    );
    
    // Log change
    await db.query(
      'INSERT INTO change_logs (curriculum_plan_id, user_id, action) VALUES ($1, $2, $3)',
      [newPlan.rows[0].id, req.user.id, 'create']
    );
    
    res.status(201).json({ id: newPlan.rows[0].id, message: 'Curriculum plan created successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update curriculum plan
router.put('/:id', auth, subjectLeaderOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const { area_of_study, literacy_focus, numeracy_focus, smsc } = req.body;
    
    // Check if plan exists
    const plan = await db.query('SELECT subject_id FROM curriculum_plans WHERE id = $1', [id]);
    
    if (plan.rows.length === 0) {
      return res.status(404).json({ message: 'Curriculum plan not found' });
    }
    
    // Update plan
    await db.query(
      `UPDATE curriculum_plans 
       SET area_of_study = $1, literacy_focus = $2, numeracy_focus = $3, smsc = $4
       WHERE id = $5`,
      [area_of_study, literacy_focus, numeracy_focus, smsc, id]
    );
    
    // Log change
    await db.query(
      'INSERT INTO change_logs (curriculum_plan_id, user_id, action) VALUES ($1, $2, $3)',
      [id, req.user.id, 'update']
    );
    
    res.json({ message: 'Curriculum plan updated successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete curriculum plan
router.delete('/:id', auth, subjectLeaderOnly, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if plan exists
    const plan = await db.query('SELECT subject_id FROM curriculum_plans WHERE id = $1', [id]);
    
    if (plan.rows.length === 0) {
      return res.status(404).json({ message: 'Curriculum plan not found' });
    }
    
    // Log deletion first (before the record is gone)
    await db.query(
      'INSERT INTO change_logs (curriculum_plan_id, user_id, action) VALUES ($1, $2, $3)',
      [id, req.user.id, 'delete']
    );
    
    // Delete plan
    await db.query('DELETE FROM curriculum_plans WHERE id = $1', [id]);
    
    res.json({ message: 'Curriculum plan deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
