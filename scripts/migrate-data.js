// scripts/migrate-csv-data.js
const fs = require('fs');
const csv = require('csv-parser');
const { Pool } = require('pg');
require('dotenv').config();

// PostgreSQL connection
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function migrateData() {
  try {
    console.log('Starting CSV data migration...');
    
    // Read the CSV file
    const results = [];
    fs.createReadStream('Exhallart.csv')
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        console.log(`Read ${results.length} rows from CSV`);
        
        // Process each row
        for (const row of results) {
          // Find or create subject
          let subjectRes = await pool.query(
            'SELECT id FROM subjects WHERE name = $1',
            [row.Area_of_study]
          );
          
          let subjectId;
          if (subjectRes.rows.length === 0) {
            const newSubject = await pool.query(
              'INSERT INTO subjects (name) VALUES ($1) RETURNING id',
              [row.Area_of_study]
            );
            subjectId = newSubject.rows[0].id;
          } else {
            subjectId = subjectRes.rows[0].id;
          }
          
          // Find or create year group
          let yearGroupRes = await pool.query(
            'SELECT id FROM year_groups WHERE name = $1',
            [row.Year]
          );
          
          let yearGroupId;
          if (yearGroupRes.rows.length === 0) {
            // Extract key stage from year group
            let keyStage = null;
            if (row.Year.includes('Year 1') || row.Year.includes('Year 2')) {
              keyStage = 'KS1';
            } else if (row.Year.includes('Year 3') || row.Year.includes('Year 4') || 
                       row.Year.includes('Year 5') || row.Year.includes('Year 6')) {
              keyStage = 'KS2';
            } else if (row.Year.includes('Year 7') || row.Year.includes('Year 8') || 
                       row.Year.includes('Year 9')) {
              keyStage = 'KS3';
            } else if (row.Year.includes('Year 10') || row.Year.includes('Year 11')) {
              keyStage = 'KS4';
            } else if (row.Year.includes('Post 16')) {
              keyStage = 'KS5';
            }
            
            const newYearGroup = await pool.query(
              'INSERT INTO year_groups (name, key_stage) VALUES ($1, $2) RETURNING id',
              [row.Year, keyStage]
            );
            yearGroupId = newYearGroup.rows[0].id;
          } else {
            yearGroupId = yearGroupRes.rows[0].id;
          }
          
          // Find or create term
          let termRes = await pool.query(
            'SELECT id FROM terms WHERE name = $1',
            [row.Term]
          );
          
          let termId;
          if (termRes.rows.length === 0) {
            const newTerm = await pool.query(
              'INSERT INTO terms (name, academic_year) VALUES ($1, $2) RETURNING id',
              [row.Term, '2024-2025']
            );
            termId = newTerm.rows[0].id;
          } else {
            termId = termRes.rows[0].id;
          }
          
          // Insert or update curriculum plan
          await pool.query(`
            INSERT INTO curriculum_plans 
            (subject_id, year_group_id, term_id, area_of_study, literacy_focus, numeracy_focus, smsc,
             knowledge_skills_au1, knowledge_skills_au2, knowledge_skills_sp1, knowledge_skills_sp2, 
             knowledge_skills_su1, knowledge_skills_su2, key_assessments, key_assessments_au1, 
             key_assessments_au2, key_assessments_sp1, key_assessments_sp2, key_assessments_su1, 
             key_assessments_su2, help_at_home, wider_skills)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)
            ON CONFLICT (subject_id, year_group_id, term_id) 
            DO UPDATE SET 
            area_of_study = $4, literacy_focus = $5, numeracy_focus = $6, smsc = $7,
            knowledge_skills_au1 = $8, knowledge_skills_au2 = $9, knowledge_skills_sp1 = $10, 
            knowledge_skills_sp2 = $11, knowledge_skills_su1 = $12, knowledge_skills_su2 = $13,
            key_assessments = $14, key_assessments_au1 = $15, key_assessments_au2 = $16,
            key_assessments_sp1 = $17, key_assessments_sp2 = $18, key_assessments_su1 = $19,
            key_assessments_su2 = $20, help_at_home = $21, wider_skills = $22
          `, [
            subjectId, yearGroupId, termId, 
            row.Area_of_study, row.Literacy_focus, row.Numeracy_focus, row.SMSC,
            row.Knowledge_and_skills_autumn_Term_1, row.Knowledge_and_skills_autumn_Term_2,
            row.Knowledge_and_skills_spring_Term_1, row.Knowledge_and_skills_spring_Term_2,
            row.Knowledge_and_skills_summer_Term_1, row.Knowledge_and_skills_summer_Term_2,
            row.Key_Assessments, row.key_assessments_au1, row.key_assessments_au2,
            row.key_assessments_sp1, row.key_assessments_sp2, row.key_assessments_su1,
            row.key_assessments_su2, row.How_you_can_help_your_child_at_home, row.Wider_skills
          ]);
          
          console.log(`Processed row for ${row.Area_of_study} - ${row.Year} - ${row.Term}`);
        }
        
        console.log('Data migration completed successfully');
        await pool.end();
      });
  } catch (err) {
    console.error('Error during migration:', err);
    await pool.end();
  }
}

migrateData();
