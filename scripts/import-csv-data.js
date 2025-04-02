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

// Arrays to store data from CSV files
const overviewData = [];
const detailedData = [];

// Read the overview CSV file
fs.createReadStream('data/subject_overview.csv')
  .pipe(csv())
  .on('data', (row) => {
    overviewData.push(row);
  })
  .on('end', async () => {
    console.log('Overview CSV file successfully processed');
    
    // Read the detailed curriculum data
    // This is in a custom format, so we'll need to parse it differently
    const fileContent = fs.readFileSync('data/Curriculum.txt', 'utf8');
    
    // Parse your curriculum.txt file here
    // This would depend on the exact format of your file
    // For example, splitting by line and then by commas or other delimiters
    const lines = fileContent.split('\n');
    const currentRecord = {};
    
    for (const line of lines) {
      // Parse each line based on your format
      // This is a simplified example; you'll need to adjust based on your actual format
      if (line.startsWith('"')) {
        // This looks like a new record
        if (Object.keys(currentRecord).length > 0) {
          detailedData.push({...currentRecord});
        }
        
        // Parse the line to get ID, Subject, YearGroup, etc.
        const parts = line.split('","');
        currentRecord.id = parts[0].replace('"', '');
        currentRecord.subject = parts[1];
        currentRecord.yearGroup = parts[2];
        // Continue with other fields...
      } else {
        // This is a continuation of the current record
        // Append to the appropriate field
        // This depends on your specific format
      }
    }
    
    // Add the last record
    if (Object.keys(currentRecord).length > 0) {
      detailedData.push({...currentRecord});
    }
    
    // Now we have both datasets, start migrating
    await migrateData();
  });

async function migrateData() {
  // First, make sure all subjects exist
  const subjectsToInsert = [...new Set(overviewData.map(row => row.subject))];
  for (const subject of subjectsToInsert) {
    await pool.query(
      'INSERT INTO subjects (name) VALUES ($1) ON CONFLICT (name) DO NOTHING',
      [subject]
    );
  }
  
  // Insert year groups
  const yearGroupsToInsert = [...new Set(overviewData.map(row => row.Year))];
  for (const yearGroup of yearGroupsToInsert) {
    // Determine key stage
    let keyStage = null;
    if (yearGroup.includes('Year 1') || yearGroup.includes('Year 2')) {
      keyStage = 'KS1';
    } else if (/Year [3-6]/.test(yearGroup)) {
      keyStage = 'KS2';
    } else if (/Year [7-9]/.test(yearGroup)) {
      keyStage = 'KS3';
    } else if (/Year 1[0-1]/.test(yearGroup)) {
      keyStage = 'KS4';
    } else if (yearGroup.includes('Post 16')) {
      keyStage = 'KS5';
    }
    
    await pool.query(
      'INSERT INTO year_groups (name, key_stage) VALUES ($1, $2) ON CONFLICT (name) DO NOTHING',
      [yearGroup, keyStage]
    );
  }
  
  // Insert terms
  const terms = [
    { name: 'Autumn 1', academic_year: '2024-2025' },
    { name: 'Autumn 2', academic_year: '2024-2025' },
    { name: 'Spring 1', academic_year: '2024-2025' },
    { name: 'Spring 2', academic_year: '2024-2025' },
    { name: 'Summer 1', academic_year: '2024-2025' },
    { name: 'Summer 2', academic_year: '2024-2025' }
  ];
  
  for (const term of terms) {
    await pool.query(
      'INSERT INTO terms (name, academic_year) VALUES ($1, $2) ON CONFLICT (name) DO NOTHING',
      [term.name, term.academic_year]
    );
  }
  
  // Now, insert curriculum plans
  for (const row of overviewData) {
    // Get IDs
    const subjectResult = await pool.query('SELECT id FROM subjects WHERE name = $1', [row.subject]);
    if (subjectResult.rows.length === 0) continue;
    
    const yearGroupResult = await pool.query('SELECT id FROM year_groups WHERE name = $1', [row.Year]);
    if (yearGroupResult.rows.length === 0) continue;
    
    const termResult = await pool.query('SELECT id FROM terms WHERE name = $1', [row.Term]);
    if (termResult.rows.length === 0) continue;
    
    const subjectId = subjectResult.rows[0].id;
    const yearGroupId = yearGroupResult.rows[0].id;
    const termId = termResult.rows[0].id;
    
    // Find matching detailed data if available
    const detailedRow = detailedData.find(d => 
      d.subject === row.subject && 
      d.yearGroup === row.Year
    );
    
    // Insert or update curriculum plan
    await pool.query(`
      INSERT INTO curriculum_plans 
      (subject_id, year_group_id, term_id, area_of_study, literacy_focus, numeracy_focus, smsc,
       knowledge_skills_au1, knowledge_skills_au2, knowledge_skills_sp1, knowledge_skills_sp2, 
       knowledge_skills_su1, knowledge_skills_su2, key_assessments, key_assessments_au1, 
       key_assessments_au2, key_assessments_sp1, key_assessments_sp2, key_assessments_su1, 
       key_assessments_su2, important_literacy_numeracy, wider_skills, help_at_home)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23)
      ON CONFLICT (subject_id, year_group_id, term_id) 
      DO UPDATE SET 
        area_of_study = $4, 
        literacy_focus = $5, 
        numeracy_focus = $6, 
        smsc = $7,
        knowledge_skills_au1 = $8,
        knowledge_skills_au2 = $9,
        knowledge_skills_sp1 = $10,
        knowledge_skills_sp2 = $11,
        knowledge_skills_su1 = $12,
        knowledge_skills_su2 = $13,
        key_assessments = $14,
        key_assessments_au1 = $15,
        key_assessments_au2 = $16,
        key_assessments_sp1 = $17,
        key_assessments_sp2 = $18,
        key_assessments_su1 = $19,
        key_assessments_su2 = $20,
        important_literacy_numeracy = $21,
        wider_skills = $22,
        help_at_home = $23
    `, [
      subjectId, 
      yearGroupId, 
      termId, 
      row.Area_of_study, 
      row.Literacy_focus, 
      row.Numeracy_focus, 
      row.SMSC,
      detailedRow?.knowledge_skills_au1 || null,
      detailedRow?.knowledge_skills_au2 || null,
      detailedRow?.knowledge_skills_sp1 || null,
      detailedRow?.knowledge_skills_sp2 || null,
      detailedRow?.knowledge_skills_su1 || null,
      detailedRow?.knowledge_skills_su2 || null,
      detailedRow?.key_assessments || null,
      detailedRow?.key_assessments_au1 || null,
      detailedRow?.key_assessments_au2 || null,
      detailedRow?.key_assessments_sp1 || null,
      detailedRow?.key_assessments_sp2 || null,
      detailedRow?.key_assessments_su1 || null,
      detailedRow?.key_assessments_su2 || null,
      detailedRow?.important_literacy_numeracy || null,
      detailedRow?.wider_skills || null,
      detailedRow?.help_at_home || null
    ]);
  }
  
  console.log('Data migration completed successfully');
  await pool.end();
}
