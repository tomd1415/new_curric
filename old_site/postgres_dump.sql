-- Drop existing tables
DROP TABLE IF EXISTS "Curriculum" CASCADE;

-- Create Curriculum table
CREATE TABLE "Curriculum" (
    "id" integer NOT NULL,
    "Subject" varchar(255) DEFAULT NULL,
    "YearGroup" varchar(50) DEFAULT NULL,
    "Knowledge_and_skills_autumn_Term_1" text DEFAULT NULL,
    "Knowledge_and_skills_autumn_Term_2" text DEFAULT NULL,
    "Knowledge_and_skills_spring_Term_1" text DEFAULT NULL,
    "Knowledge_and_skills_spring_Term_2" text DEFAULT NULL,
    "Knowledge_and_skills_summer_Term_1" text DEFAULT NULL,
    "Knowledge_and_skills_summer_Term_2" text DEFAULT NULL,
    "Key_Assessments" text DEFAULT NULL,
    "Important_literacy_and_numeracy" text DEFAULT NULL,
    "Wider_skills" text DEFAULT NULL,
    "How_you_can_help_your_child_at_home" text DEFAULT NULL,
    "key_assessments_au1" text DEFAULT NULL,
    "key_assessments_au2" text DEFAULT NULL,
    "key_assessments_sp1" text DEFAULT NULL,
    "key_assessments_sp2" text DEFAULT NULL,
    "key_assessments_su1" text DEFAULT NULL,
    "key_assessments_su2" text DEFAULT NULL,
    PRIMARY KEY ("id")
);

-- Insert Curriculum data
