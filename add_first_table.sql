-- Create subjects table
CREATE TABLE subjects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT
);

-- Create year_groups table
CREATE TABLE year_groups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(20) NOT NULL UNIQUE,
    key_stage VARCHAR(20)
);

-- Create terms table
CREATE TABLE terms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(20) NOT NULL UNIQUE,
    academic_year VARCHAR(20)
);

-- Create curriculum_plans table
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

-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('admin', 'teacher', 'subject_leader')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create subject_leaders table (junction table for many-to-many relationship)
CREATE TABLE subject_leaders (
    user_id INTEGER REFERENCES users(id),
    subject_id INTEGER REFERENCES subjects(id),
    PRIMARY KEY (user_id, subject_id)
);

-- Create change_logs table
CREATE TABLE change_logs (
    id SERIAL PRIMARY KEY,
    curriculum_plan_id INTEGER REFERENCES curriculum_plans(id),
    user_id INTEGER REFERENCES users(id),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    action VARCHAR(20) CHECK (action IN ('create', 'update', 'delete'))
);

-- Create function to update the "updated_at" column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update "updated_at"
CREATE TRIGGER update_curriculum_plans_updated_at
BEFORE UPDATE ON curriculum_plans
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
