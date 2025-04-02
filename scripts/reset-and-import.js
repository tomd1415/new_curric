// scripts/reset-and-import.js
const fs = require('fs');
const { Pool } = require('pg');
const csv = require('csv-parser');
require('dotenv').config();

// PostgreSQL connection
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function resetAndImportData() {
  const client = await pool.connect();
  
  try {
    console.log('Starting database reset and import process...');
    
    // Begin transaction
    await client.query('BEGIN');
    
    // 1. Drop all existing tables (in correct order to handle foreign keys)
    console.log('Dropping existing tables...');
    await client.query(`
      DROP TABLE IF EXISTS change_logs CASCADE;
      DROP TABLE IF EXISTS subject_leaders CASCADE;
      DROP TABLE IF EXISTS curriculum_plans CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
      DROP TABLE IF EXISTS terms CASCADE;
      DROP TABLE IF EXISTS year_groups CASCADE;
      DROP TABLE IF EXISTS subjects CASCADE;
    `);
    
    // 2. Create tables with correct schema
    console.log('Creating new tables...');
    
    // Create subjects table
    await client.query(`
      CREATE TABLE subjects (
          id SERIAL PRIMARY KEY,
          name VARCHAR(50) NOT NULL UNIQUE,
          description TEXT
      );
    `);
    
    // Create year_groups table
    await client.query(`
      CREATE TABLE year_groups (
          id SERIAL PRIMARY KEY,
          name VARCHAR(20) NOT NULL UNIQUE,
          key_stage VARCHAR(20)
      );
    `);
    
    // Create terms table
    await client.query(`
      CREATE TABLE terms (
          id SERIAL PRIMARY KEY,
          name VARCHAR(20) NOT NULL UNIQUE,
          academic_year VARCHAR(20)
      );
    `);
    
    // Create users table
    await client.query(`
      CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          username VARCHAR(50) NOT NULL UNIQUE,
          email VARCHAR(100) NOT NULL UNIQUE,
          password_hash VARCHAR(255) NOT NULL,
          role VARCHAR(20) CHECK (role IN ('admin', 'teacher', 'subject_leader')),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Create curriculum_plans table
    await client.query(`
      CREATE TABLE curriculum_plans (
          id SERIAL PRIMARY KEY,
          subject_id INTEGER REFERENCES subjects(id),
          year_group_id INTEGER REFERENCES year_groups(id),
          term_id INTEGER REFERENCES terms(id),
          area_of_study TEXT,
          literacy_focus TEXT,
          numeracy_focus TEXT,
          smsc TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(subject_id, year_group_id, term_id)
      );
    `);
    
    // Create subject_leaders table
    await client.query(`
      CREATE TABLE subject_leaders (
          user_id INTEGER REFERENCES users(id),
          subject_id INTEGER REFERENCES subjects(id),
          PRIMARY KEY (user_id, subject_id)
      );
    `);
    
    // Create change_logs table
    await client.query(`
      CREATE TABLE change_logs (
          id SERIAL PRIMARY KEY,
          curriculum_plan_id INTEGER REFERENCES curriculum_plans(id),
          user_id INTEGER REFERENCES users(id),
          timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          action VARCHAR(20) CHECK (action IN ('create', 'update', 'delete'))
      );
    `);
    
    // Create function to update updated_at column
    await client.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);
    
    // Create trigger to automatically update updated_at
    await client.query(`
      CREATE TRIGGER update_curriculum_plans_updated_at
      BEFORE UPDATE ON curriculum_plans
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
    `);
    
    // 3. Create a default admin user
    const bcrypt = require('bcrypt');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    await client.query(`
      INSERT INTO users (username, email, password_hash, role)
      VALUES ('admin', 'admin@exhall.school', $1, 'admin')
    `, [hashedPassword]);
    
    console.log('Default admin user created (username: admin, password: admin123)');
    
    // 4. Import data from CSV files
    console.log('Importing data from CSV files...');
    
    // Create terms
    const terms = [
      { name: 'Autumn 1', academic_year: '2024-2025' },
      { name: 'Autumn 2', academic_year: '2024-2025' },
      { name: 'Spring 1', academic_year: '2024-2025' },
      { name: 'Spring 2', academic_year: '2024-2025' },
      { name: 'Summer 1', academic_year: '2024-2025' },
      { name: 'Summer 2', academic_year: '2024-2025' }
    ];
    
    for (const term of terms) {
      await client.query(
        'INSERT INTO terms (name, academic_year) VALUES ($1, $2) ON CONFLICT (name) DO NOTHING',
        [term.name, term.academic_year]
      );
    }
    
    // Import subjects and curriculum from subject_overview.txt
    // First, parse the file and extract unique subjects and year groups
    const uniqueSubjects = new Set();
    const uniqueYearGroups = new Set();
    
    const subjectOverviewData = await parseCSV('subject_overview.txt');
    
    // Extract unique subjects and year groups
    subjectOverviewData.forEach(row => {
      if (row.subject) uniqueSubjects.add(row.subject);
      if (row.Year) uniqueYearGroups.add(row.Year);
    });
    
    // Insert subjects
    for (const subject of uniqueSubjects) {
      await client.query(
        'INSERT INTO subjects (name) VALUES ($1) ON CONFLICT (name) DO NOTHING',
        [subject]
      );
    }
    
    // Insert year groups
    for (const yearGroup of uniqueYearGroups) {
      // Determine key stage
      let keyStage = null;
      if (yearGroup.includes('Year 1') || yearGroup.includes('Year 2')) {
        keyStage = 'KS1';
      } else if (yearGroup.includes('Year 3') || yearGroup.includes('Year 4') || 
                 yearGroup.includes('Year 5') || yearGroup.includes('Year 6')) {
        keyStage = 'KS2';
      } else if (yearGroup.includes('Year 7') || yearGroup.includes('Year 8') || 
                 yearGroup.includes('Year 9')) {
        keyStage = 'KS3';
      } else if (yearGroup.includes('Year 10') || yearGroup.includes('Year 11')) {
        keyStage = 'KS4';
      } else if (yearGroup.includes('Post 16')) {
        keyStage = 'KS5';
      }
      
      await client.query(
        'INSERT INTO year_groups (name, key_stage) VALUES ($1, $2) ON CONFLICT (name) DO NOTHING',
        [yearGroup, keyStage]
      );
    }
    
    // Insert curriculum data from subject_overview.txt
    for (const row of subjectOverviewData) {
      try {
        // Get IDs
        const subjectRes = await client.query('SELECT id FROM subjects WHERE name = $1', [row.subject]);
        const yearGroupRes = await client.query('SELECT id FROM year_groups WHERE name = $1', [row.Year]);
        const termRes = await client.query('SELECT id FROM terms WHERE name = $1', [row.Term]);
        
        if (subjectRes.rows.length > 0 && yearGroupRes.rows.length > 0 && termRes.rows.length > 0) {
          const subjectId = subjectRes.rows[0].id;
          const yearGroupId = yearGroupRes.rows[0].id;
          const termId = termRes.rows[0].id;
          
          await client.query(
            `INSERT INTO curriculum_plans 
             (subject_id, year_group_id, term_id, area_of_study, literacy_focus, numeracy_focus, smsc) 
             VALUES ($1, $2, $3, $4, $5, $6, $7) 
             ON CONFLICT (subject_id, year_group_id, term_id) DO UPDATE 
             SET area_of_study = $4, literacy_focus = $5, numeracy_focus = $6, smsc = $7`,
            [
              subjectId, 
              yearGroupId, 
              termId, 
              row.Area_of_study, 
              row.Literacy_focus, 
              row.Numeracy_focus, 
              row.SMSC
            ]
          );
        }
      } catch (err) {
        console.error(`Error importing row for ${row.subject}, ${row.Year}, ${row.Term}:`, err.message);
      }
    }
    
    // Also import data from Curriculum.txt if it has different structure
    const curriculumData = await parseCurriculumTxt('Curriculum.txt');
    
    for (const row of curriculumData) {
      try {
        // For Curriculum.txt, we expect a different structure
        // Check if subject and year_group exist
        if (!row.Subject || !row.Year) continue;
        
        // Get or create subject
        const subjectRes = await client.query(
          'SELECT id FROM subjects WHERE name = $1',
          [row.Subject]
        );
        
        let subjectId;
        if (subjectRes.rows.length === 0) {
          const newSubject = await client.query(
            'INSERT INTO subjects (name) VALUES ($1) RETURNING id',
            [row.Subject]
          );
          subjectId = newSubject.rows[0].id;
        } else {
          subjectId = subjectRes.rows[0].id;
        }
        
        // Get or create year_group
        const yearGroupRes = await client.query(
          'SELECT id FROM year_groups WHERE name = $1',
          [row.Year]
        );
        
        let yearGroupId;
        if (yearGroupRes.rows.length === 0) {
          // Determine key stage
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
          
          const newYearGroup = await client.query(
            'INSERT INTO year_groups (name, key_stage) VALUES ($1, $2) RETURNING id',
            [row.Year, keyStage]
          );
          yearGroupId = newYearGroup.rows[0].id;
        } else {
          yearGroupId = yearGroupRes.rows[0].id;
        }
        
        // Process each term
        for (let i = 1; i <= 6; i++) {
          const termName = i <= 2 ? `Autumn ${i}` : i <= 4 ? `Spring ${i-2}` : `Summer ${i-4}`;
          const termRes = await client.query('SELECT id FROM terms WHERE name = $1', [termName]);
          
          if (termRes.rows.length > 0) {
            const termId = termRes.rows[0].id;
            
            // Check if we have data for this term
            const areaOfStudy = row[`area_of_study_${termName.toLowerCase().replace(' ', '_')}`] || '';
            const literacyFocus = row[`literacy_focus_${termName.toLowerCase().replace(' ', '_')}`] || '';
            const numeracyFocus = row[`numeracy_focus_${termName.toLowerCase().replace(' ', '_')}`] || '';
            const smsc = row[`smsc_${termName.toLowerCase().replace(' ', '_')}`] || '';
            
            // Insert or update curriculum plan
            await client.query(
              `INSERT INTO curriculum_plans 
               (subject_id, year_group_id, term_id, area_of_study, literacy_focus, numeracy_focus, smsc) 
               VALUES ($1, $2, $3, $4, $5, $6, $7) 
               ON CONFLICT (subject_id, year_group_id, term_id) DO UPDATE 
               SET area_of_study = $4, literacy_focus = $5, numeracy_focus = $6, smsc = $7`,
              [subjectId, yearGroupId, termId, areaOfStudy, literacyFocus, numeracyFocus, smsc]
            );
          }
        }
      } catch (err) {
        console.error(`Error importing curriculum row for ${row.Subject}, ${row.Year}:`, err.message);
      }
    }
    
    // Commit transaction
    await client.query('COMMIT');
    console.log('Database reset and data import completed successfully');
    
  } catch (err) {
    // Rollback transaction on error
    await client.query('ROLLBACK');
    console.error('Error during database reset and import:', err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

// Helper function to parse CSV files
function parseCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
}

// Helper function to parse Curriculum.txt which might have a different format
async function parseCurriculumTxt(filePath) {
  // Since your Curriculum.txt might have a custom format, you might need to
  // adapt this function to match your specific file structure
  try {
    const fileContent = await fs.promises.readFile(filePath, 'utf8');
    const lines = fileContent.split('\n');
    const results = [];
    
    // This is a simple parser that assumes CSV format with quotes
    // You might need to adapt it based on your actual file structure
    let currentRow = {};
    let currentField = '';
    
    for (const line of lines) {
      // Skip empty lines
      if (line.trim() === '') continue;
      
      // Check if line starts with quotes (new row)
      if (line.startsWith('"')) {
        if (Object.keys(currentRow).length > 0) {
          results.push(currentRow);
        }
        
        // Start new row
        currentRow = {};
        const parts = line.split('","');
        
        // Extract fields
        if (parts.length >= 3) {
          const id = parts[0].replace('"', '');
          const subject = parts[1];
          const yearGroup = parts[2];
          const areaOfStudyAutumn1 = parts[3] ? parts[3].replace('"', '') : '';
          
          currentRow = {
            id,
            Subject: subject,
            Year: yearGroup,
            area_of_study_autumn_1: areaOfStudyAutumn1,
            literacy_focus_autumn_1: '',
            numeracy_focus_autumn_1: '',
            smsc_autumn_1: ''
          };
        }
      } else if (line.startsWith('"')) {
        // Continue previous field or start new field
        const content = line.replace(/^"|"$/g, '');
        
        // Determine which field we're processing based on content patterns
        // This is a simplification - you'll need to adapt based on your data
        if (currentField === 'area_of_study_autumn_1') {
          currentRow.area_of_study_autumn_1 += '\n' + content;
        } else if (currentField === 'literacy_focus_autumn_1') {
          currentRow.literacy_focus_autumn_1 += '\n' + content;
        } else if (currentField === 'numeracy_focus_autumn_1') {
          currentRow.numeracy_focus_autumn_1 += '\n' + content;
        } else if (currentField === 'smsc_autumn_1') {
          currentRow.smsc_autumn_1 += '\n' + content;
        } else {
          // Try to determine which field based on content
          if (content.includes('literacy') || content.includes('reading')) {
            currentField = 'literacy_focus_autumn_1';
            currentRow.literacy_focus_autumn_1 = content;
          } else if (content.includes('numeracy') || content.includes('math')) {
            currentField = 'numeracy_focus_autumn_1';
            currentRow.numeracy_focus_autumn_1 = content;
          } else if (content.includes('spiritual') || content.includes('moral') || 
                     content.includes('social') || content.includes('cultural')) {
            currentField = 'smsc_autumn_1';
            currentRow.smsc_autumn_1 = content;
          } else {
            // Default to area of study
            currentField = 'area_of_study_autumn_1';
            currentRow.area_of_study_autumn_1 += '\n' + content;
          }
        }
      }
    }
    
    // Add the last row
    if (Object.keys(currentRow).length > 0) {
      results.push(currentRow);
    }
    
    return results;
  } catch (err) {
    console.error('Error parsing Curriculum.txt:', err);
    return [];
  }
}

// Run the reset and import function
resetAndImportData().catch(err => {
  console.error('Reset and import process failed:', err);
  process.exit(1);
});
