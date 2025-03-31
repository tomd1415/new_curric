// scripts/migrate-data.js
const mysql = require('mysql2/promise');
const { Pool } = require('pg');
require('dotenv').config();

// MySQL connection
const mysqlConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || 'exhall2024',
  database: process.env.MYSQL_DB || 'exhall_curriculum'
};

// PostgreSQL connection
const pgPool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function migrateData() {
  // MySQL connection
  const mysqlConn = await mysql.createConnection(mysqlConfig);
  console.log('Connected to MySQL database');

  try {
    // Migrate subjects
    console.log('Migrating subjects...');
    const [subjects] = await mysqlConn.query('SELECT DISTINCT Subject FROM Curriculum');
    for (const subject of subjects) {
      await pgPool.query(
        'INSERT INTO subjects (name) VALUES ($1) ON CONFLICT (name) DO NOTHING',
        [subject.Subject]
      );
    }

    // Migrate year groups
    console.log('Migrating year groups...');
    const [yearGroups] = await mysqlConn.query('SELECT DISTINCT YearGroup FROM Curriculum');
    for (const yearGroup of yearGroups) {
      // Extract key stage from year group name
      let keyStage = null;
      if (yearGroup.YearGroup.includes('Year 1') || yearGroup.YearGroup.includes('Year 2')) {
        keyStage = 'KS1';
      } else if (yearGroup.YearGroup.includes('Year 3') || yearGroup.YearGroup.includes('Year 4') || 
                 yearGroup.YearGroup.includes('Year 5') || yearGroup.YearGroup.includes('Year 6')) {
        keyStage = 'KS2';
      } else if (yearGroup.YearGroup.includes('Year 7') || yearGroup.YearGroup.includes('Year 8') || 
                 yearGroup.YearGroup.includes('Year 9')) {
        keyStage = 'KS3';
      } else if (yearGroup.YearGroup.includes('Year 10') || yearGroup.YearGroup.includes('Year 11')) {
        keyStage = 'KS4';
      } else if (yearGroup.YearGroup.includes('Post 16')) {
        keyStage = 'KS5';
      }

      await pgPool.query(
        'INSERT INTO year_groups (name, key_stage) VALUES ($1, $2) ON CONFLICT (name) DO NOTHING',
        [yearGroup.YearGroup, keyStage]
      );
    }

    // Migrate terms
    console.log('Migrating terms...');
    const terms = [
      { name: 'Autumn 1', academic_year: '2024-2025' },
      { name: 'Autumn 2', academic_year: '2024-2025' },
      { name: 'Spring 1', academic_year: '2024-2025' },
      { name: 'Spring 2', academic_year: '2024-2025' },
      { name: 'Summer 1', academic_year: '2024-2025' },
      { name: 'Summer 2', academic_year: '2024-2025' }
    ];

    for (const term of terms) {
      await pgPool.query(
        'INSERT INTO terms (name, academic_year) VALUES ($1, $2) ON CONFLICT (name) DO NOTHING',
        [term.name, term.academic_year]
      );
    }

    // Migrate curriculum plans from subject_overview table
    console.log('Migrating curriculum plans...');
    const [subjectOverviews] = await mysqlConn.query('SELECT * FROM subject_overview');
    
    for (const overview of subjectOverviews) {
      // Get IDs from the PostgreSQL database
      const subjectRes = await pgPool.query('SELECT id FROM subjects WHERE name = $1', [overview.subject]);
      const yearGroupRes = await pgPool.query('SELECT id FROM year_groups WHERE name = $1', [overview.Year]);
      const termRes = await pgPool.query('SELECT id FROM terms WHERE name = $1', [overview.Term]);
      
      if (subjectRes.rows.length > 0 && yearGroupRes.rows.length > 0 && termRes.rows.length > 0) {
        const subjectId = subjectRes.rows[0].id;
        const yearGroupId = yearGroupRes.rows[0].id;
        const termId = termRes.rows[0].id;
        
        await pgPool.query(
          `INSERT INTO curriculum_plans 
           (subject_id, year_group_id, term_id, area_of_study, literacy_focus, numeracy_focus, smsc) 
           VALUES ($1, $2, $3, $4, $5, $6, $7) 
           ON CONFLICT (subject_id, year_group_id, term_id) DO UPDATE 
           SET area_of_study = $4, literacy_focus = $5, numeracy_focus = $6, smsc = $7`,
          [
            subjectId, 
            yearGroupId, 
            termId, 
            overview.Area_of_study, 
            overview.Literacy_focus, 
            overview.Numeracy_focus, 
            overview.SMSC
          ]
        );
      }
    }

    console.log('Data migration completed successfully');
  } catch (err) {
    console.error('Error during migration:', err);
  } finally {
    await mysqlConn.end();
    await pgPool.end();
  }
}

migrateData();
