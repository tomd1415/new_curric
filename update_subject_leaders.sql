-- Drop the existing subject_leaders table
DROP TABLE IF EXISTS subject_leaders;

-- Create the new subject_leaders table with subject_name instead of subject_id
CREATE TABLE subject_leaders (
    user_id INTEGER REFERENCES users(id),
    subject_name VARCHAR(50),
    PRIMARY KEY (user_id, subject_name)
); 