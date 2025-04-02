const express = require('express');
const router = express.Router();
const db = require('../db');
const { auth, subjectLeaderOnly } = require('../middleware/auth');

// Get all curriculum plans
router.get('/', async (req, res) => {
  try {
    const curriculumPlans = await db.query(`
      SELECT 
        cp.id,
        s.name as subject,
        yg.name as year_group,
        t.name as term,
        cp.area_of_study,
        cp.literacy_focus,
        cp.numeracy_focus,
        cp.smsc
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
router.get('/subject/:subject', async (req, res) => {
  try {
    const { subject } = req.params;
    
    const curriculumPlans = await db.query(`
      SELECT 
        cp.id,
        s.name as subject,
        yg.name as year_group,
        t.name as term,
        cp.area_of_study,
        cp.literacy_focus,
        cp.numeracy_focus,
        cp.smsc
      FROM curriculum_plans cp
      JOIN subjects s ON cp.subject_id = s.id
      JOIN year_groups yg ON cp.year_group_id = yg.id
      JOIN terms t ON cp.term_id = t.id
      WHERE LOWER(s.name) = LOWER($1)
      ORDER BY yg.name, t.name
    `, [subject]);
    
    res.json(curriculumPlans.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get curriculum plans by year group
router.get('/year-group/:yearGroup', async (req, res) => {
  try {
    const { yearGroup } = req.params;
    
    const curriculumPlans = await db.query(`
      SELECT 
        cp.id,
        s.name as subject,
        yg.name as year_group,
        t.name as term,
        cp.area_of_study,
        cp.literacy_focus,
        cp.numeracy_focus,
        cp.smsc
      FROM curriculum_plans cp
      JOIN subjects s ON cp.subject_id = s.id
      JOIN year_groups yg ON cp.year_group_id = yg.id
      JOIN terms t ON cp.term_id = t.id
      WHERE yg.name = $1
      ORDER BY s.name, t.name
    `, [yearGroup]);
    
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
      SELECT 
        cp.id,
        s.name as subject,
        yg.name as year_group,
        t.name as term,
        cp.area_of_study,
        cp.literacy_focus,
        cp.numeracy_focus,
        cp.smsc
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
    const { subject, year_group, term, area_of_study, literacy_focus, numeracy_focus, smsc } = req.body;
    
    // Get IDs for subject, year group, and term
    const subjectResult = await db.query('SELECT id FROM subjects WHERE name = $1', [subject]);
    const yearGroupResult = await db.query('SELECT id FROM year_groups WHERE name = $1', [year_group]);
    const termResult = await db.query('SELECT id FROM terms WHERE name = $1', [term]);
    
    if (subjectResult.rows.length === 0 || yearGroupResult.rows.length === 0 || termResult.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid subject, year group, or term' });
    }
    
    const subjectId = subjectResult.rows[0].id;
    const yearGroupId = yearGroupResult.rows[0].id;
    const termId = termResult.rows[0].id;
    
    // Check if curriculum plan already exists
    const existingPlan = await db.query(
      'SELECT 1 FROM curriculum_plans WHERE subject_id = $1 AND year_group_id = $2 AND term_id = $3',
      [subjectId, yearGroupId, termId]
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
      [subjectId, yearGroupId, termId, area_of_study, literacy_focus, numeracy_focus, smsc]
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
    const { 
      area_of_study, literacy_focus, numeracy_focus, smsc,
      knowledge_skills_au1, knowledge_skills_au2, knowledge_skills_sp1, knowledge_skills_sp2,
      knowledge_skills_su1, knowledge_skills_su2, key_assessments, key_assessments_au1,
      key_assessments_au2, key_assessments_sp1, key_assessments_sp2, key_assessments_su1,
      key_assessments_su2, help_at_home, wider_skills 
    } = req.body;
    
    // Check if plan exists
    const plan = await db.query('SELECT subject_id FROM curriculum_plans WHERE id = $1', [id]);
    
    if (plan.rows.length === 0) {
      return res.status(404).json({ message: 'Curriculum plan not found' });
    }
    
    // Update plan
    await db.query(
      `UPDATE curriculum_plans 
       SET area_of_study = $1, literacy_focus = $2, numeracy_focus = $3, smsc = $4,
           knowledge_skills_au1 = $5, knowledge_skills_au2 = $6, knowledge_skills_sp1 = $7, 
           knowledge_skills_sp2 = $8, knowledge_skills_su1 = $9, knowledge_skills_su2 = $10,
           key_assessments = $11, key_assessments_au1 = $12, key_assessments_au2 = $13,
           key_assessments_sp1 = $14, key_assessments_sp2 = $15, key_assessments_su1 = $16,
           key_assessments_su2 = $17, help_at_home = $18, wider_skills = $19
       WHERE id = $20`,
      [
        area_of_study, literacy_focus, numeracy_focus, smsc,
        knowledge_skills_au1, knowledge_skills_au2, knowledge_skills_sp1, knowledge_skills_sp2,
        knowledge_skills_su1, knowledge_skills_su2, key_assessments, key_assessments_au1,
        key_assessments_au2, key_assessments_sp1, key_assessments_sp2, key_assessments_su1,
        key_assessments_su2, help_at_home, wider_skills, id
      ]
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
    
    // Delete plan
    await db.query('DELETE FROM curriculum_plans WHERE id = $1', [id]);
    
    res.json({ message: 'Curriculum plan deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});
// Add these routes to your existing routes/curriculum.js file

// Get curriculum overview (table format)
router.get('/overview', async (req, res) => {
  try {
    const curriculumPlans = await db.query(`
      SELECT cp.id, s.name as subject, yg.name as year_group, t.name as term, 
             cp.area_of_study, cp.literacy_focus, cp.numeracy_focus, cp.smsc
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

// Get curriculum detailed view
router.get('/detailed/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const curriculumPlan = await db.query(`
      SELECT cp.id, s.name as subject, s.id as subject_id,
             yg.name as year_group, yg.id as year_group_id,
             t.name as term, t.id as term_id,
             cp.area_of_study, cp.literacy_focus, cp.numeracy_focus, cp.smsc,
             cp.knowledge_skills_au1, cp.knowledge_skills_au2,
             cp.knowledge_skills_sp1, cp.knowledge_skills_sp2,
             cp.knowledge_skills_su1, cp.knowledge_skills_su2,
             cp.key_assessments, cp.key_assessments_au1, cp.key_assessments_au2,
             cp.key_assessments_sp1, cp.key_assessments_sp2,
             cp.key_assessments_su1, cp.key_assessments_su2,
             cp.help_at_home, cp.wider_skills,
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

module.exports = router;
