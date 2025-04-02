-- Create the old Curriculum table
CREATE TABLE "Curriculum" (
    "id" SERIAL PRIMARY KEY,
    "Subject" VARCHAR(255),
    "YearGroup" VARCHAR(50),
    "Knowledge_and_skills_autumn_Term_1" TEXT,
    "Knowledge_and_skills_autumn_Term_2" TEXT,
    "Knowledge_and_skills_spring_Term_1" TEXT,
    "Knowledge_and_skills_spring_Term_2" TEXT,
    "Knowledge_and_skills_summer_Term_1" TEXT,
    "Knowledge_and_skills_summer_Term_2" TEXT,
    "Key_Assessments" TEXT,
    "Important_literacy_and_numeracy" TEXT,
    "Wider_skills" TEXT,
    "How_you_can_help_your_child_at_home" TEXT,
    "key_assessments_au1" TEXT,
    "key_assessments_au2" TEXT,
    "key_assessments_sp1" TEXT,
    "key_assessments_sp2" TEXT,
    "key_assessments_su1" TEXT,
    "key_assessments_su2" TEXT
); 