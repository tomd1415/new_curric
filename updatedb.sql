-- Add new columns to curriculum_plans table to match the old detailed data
ALTER TABLE curriculum_plans ADD COLUMN knowledge_skills_au1 TEXT;
ALTER TABLE curriculum_plans ADD COLUMN knowledge_skills_au2 TEXT;
ALTER TABLE curriculum_plans ADD COLUMN knowledge_skills_sp1 TEXT;
ALTER TABLE curriculum_plans ADD COLUMN knowledge_skills_sp2 TEXT;
ALTER TABLE curriculum_plans ADD COLUMN knowledge_skills_su1 TEXT;
ALTER TABLE curriculum_plans ADD COLUMN knowledge_skills_su2 TEXT;
ALTER TABLE curriculum_plans ADD COLUMN key_assessments TEXT;
ALTER TABLE curriculum_plans ADD COLUMN key_assessments_au1 TEXT;
ALTER TABLE curriculum_plans ADD COLUMN key_assessments_au2 TEXT;
ALTER TABLE curriculum_plans ADD COLUMN key_assessments_sp1 TEXT;
ALTER TABLE curriculum_plans ADD COLUMN key_assessments_sp2 TEXT;
ALTER TABLE curriculum_plans ADD COLUMN key_assessments_su1 TEXT;
ALTER TABLE curriculum_plans ADD COLUMN key_assessments_su2 TEXT;
ALTER TABLE curriculum_plans ADD COLUMN important_literacy_numeracy TEXT;
ALTER TABLE curriculum_plans ADD COLUMN wider_skills TEXT;
ALTER TABLE curriculum_plans ADD COLUMN help_at_home TEXT;
