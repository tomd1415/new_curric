-- Drop existing tables if they exist
DROP TABLE IF EXISTS curriculum CASCADE;
DROP TABLE IF EXISTS subjects CASCADE;
DROP TABLE IF EXISTS year_groups CASCADE;
DROP TABLE IF EXISTS terms CASCADE;

-- Create tables
CREATE TABLE subjects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE year_groups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(20) NOT NULL UNIQUE
);

CREATE TABLE terms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(20) NOT NULL UNIQUE
);

CREATE TABLE curriculum (
    id SERIAL PRIMARY KEY,
    subject_id INTEGER REFERENCES subjects(id),
    year_group_id INTEGER REFERENCES year_groups(id),
    term_id INTEGER REFERENCES terms(id),
    knowledge_and_skills TEXT,
    key_assessments TEXT,
    important_literacy_and_numeracy TEXT,
    wider_skills TEXT,
    how_you_can_help_your_child_at_home TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(subject_id, year_group_id, term_id)
);

-- Insert unique subjects
INSERT INTO subjects (name)
SELECT DISTINCT SUBSTRING(c."Subject", 2, LENGTH(c."Subject")-2)
FROM "Curriculum" c
WHERE c."Subject" IS NOT NULL;

-- Insert unique year groups
INSERT INTO year_groups (name)
SELECT DISTINCT SUBSTRING(c."YearGroup", 2, LENGTH(c."YearGroup")-2)
FROM "Curriculum" c
WHERE c."YearGroup" IS NOT NULL;

-- Insert terms
INSERT INTO terms (name) VALUES
('autumn_Term_1'),
('autumn_Term_2'),
('spring_Term_1'),
('spring_Term_2'),
('summer_Term_1'),
('summer_Term_2');

-- Insert curriculum data
INSERT INTO curriculum (
    subject_id, year_group_id, term_id,
    knowledge_and_skills, key_assessments,
    important_literacy_and_numeracy, wider_skills,
    how_you_can_help_your_child_at_home
)
SELECT 
    s.id as subject_id,
    y.id as year_group_id,
    t.id as term_id,
    CASE 
        WHEN t.name = 'autumn_Term_1' THEN SUBSTRING(c."Knowledge_and_skills_autumn_Term_1", 2, LENGTH(c."Knowledge_and_skills_autumn_Term_1")-2)
        WHEN t.name = 'autumn_Term_2' THEN SUBSTRING(c."Knowledge_and_skills_autumn_Term_2", 2, LENGTH(c."Knowledge_and_skills_autumn_Term_2")-2)
        WHEN t.name = 'spring_Term_1' THEN SUBSTRING(c."Knowledge_and_skills_spring_Term_1", 2, LENGTH(c."Knowledge_and_skills_spring_Term_1")-2)
        WHEN t.name = 'spring_Term_2' THEN SUBSTRING(c."Knowledge_and_skills_spring_Term_2", 2, LENGTH(c."Knowledge_and_skills_spring_Term_2")-2)
        WHEN t.name = 'summer_Term_1' THEN SUBSTRING(c."Knowledge_and_skills_summer_Term_1", 2, LENGTH(c."Knowledge_and_skills_summer_Term_1")-2)
        WHEN t.name = 'summer_Term_2' THEN SUBSTRING(c."Knowledge_and_skills_summer_Term_2", 2, LENGTH(c."Knowledge_and_skills_summer_Term_2")-2)
    END as knowledge_and_skills,
    CASE 
        WHEN t.name = 'autumn_Term_1' THEN SUBSTRING(c."key_assessments_au1", 2, LENGTH(c."key_assessments_au1")-2)
        WHEN t.name = 'autumn_Term_2' THEN SUBSTRING(c."key_assessments_au2", 2, LENGTH(c."key_assessments_au2")-2)
        WHEN t.name = 'spring_Term_1' THEN SUBSTRING(c."key_assessments_sp1", 2, LENGTH(c."key_assessments_sp1")-2)
        WHEN t.name = 'spring_Term_2' THEN SUBSTRING(c."key_assessments_sp2", 2, LENGTH(c."key_assessments_sp2")-2)
        WHEN t.name = 'summer_Term_1' THEN SUBSTRING(c."key_assessments_su1", 2, LENGTH(c."key_assessments_su1")-2)
        WHEN t.name = 'summer_Term_2' THEN SUBSTRING(c."key_assessments_su2", 2, LENGTH(c."key_assessments_su2")-2)
    END as key_assessments,
    SUBSTRING(c."Important_literacy_and_numeracy", 2, LENGTH(c."Important_literacy_and_numeracy")-2) as important_literacy_and_numeracy,
    SUBSTRING(c."Wider_skills", 2, LENGTH(c."Wider_skills")-2) as wider_skills,
    SUBSTRING(c."How_you_can_help_your_child_at_home", 2, LENGTH(c."How_you_can_help_your_child_at_home")-2) as how_you_can_help_your_child_at_home
FROM "Curriculum" c
CROSS JOIN subjects s
CROSS JOIN year_groups y
CROSS JOIN terms t
WHERE s.name = SUBSTRING(c."Subject", 2, LENGTH(c."Subject")-2)
AND y.name = SUBSTRING(c."YearGroup", 2, LENGTH(c."YearGroup")-2)
ON CONFLICT (subject_id, year_group_id, term_id) 
DO UPDATE SET 
    knowledge_and_skills = EXCLUDED.knowledge_and_skills,
    key_assessments = EXCLUDED.key_assessments,
    important_literacy_and_numeracy = EXCLUDED.important_literacy_and_numeracy,
    wider_skills = EXCLUDED.wider_skills,
    how_you_can_help_your_child_at_home = EXCLUDED.how_you_can_help_your_child_at_home,
    updated_at = CURRENT_TIMESTAMP; 