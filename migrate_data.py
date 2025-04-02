#!/usr/bin/env python3

import psycopg
import csv
from pathlib import Path

def migrate_data():
    try:
        # Connect to the PostgreSQL database
        conn = psycopg.connect(dbname='exhall_curriculum', user='curric_user')
        cur = conn.cursor()

        # Drop existing tables if they exist
        cur.execute("""
            DROP TABLE IF EXISTS curriculum;
            DROP TABLE IF EXISTS subjects;
            DROP TABLE IF EXISTS year_groups;
            DROP TABLE IF EXISTS terms;
        """)

        # Create tables
        cur.execute("""
            CREATE TABLE subjects (
                id SERIAL PRIMARY KEY,
                name TEXT UNIQUE NOT NULL
            );

            CREATE TABLE year_groups (
                id SERIAL PRIMARY KEY,
                name TEXT UNIQUE NOT NULL
            );

            CREATE TABLE terms (
                id SERIAL PRIMARY KEY,
                name TEXT UNIQUE NOT NULL
            );

            CREATE TABLE curriculum (
                id SERIAL PRIMARY KEY,
                subject_id INTEGER REFERENCES subjects(id),
                year_group_id INTEGER REFERENCES year_groups(id),
                term1_knowledge TEXT,
                term1_skills TEXT,
                term2_knowledge TEXT,
                term2_skills TEXT,
                term3_knowledge TEXT,
                term3_skills TEXT,
                term4_knowledge TEXT,
                term4_skills TEXT,
                term5_knowledge TEXT,
                term5_skills TEXT,
                term6_knowledge TEXT,
                term6_skills TEXT,
                assessment TEXT,
                literacy_numeracy TEXT,
                personal_development TEXT,
                home_learning TEXT,
                term1_assessment TEXT,
                term2_assessment TEXT,
                term3_assessment TEXT,
                term4_assessment TEXT,
                term5_assessment TEXT,
                term6_assessment TEXT
            );
        """)

        # Read CSV file
        csv_file = Path('old_site/curriculum_data.csv')
        with open(csv_file, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            
            # Extract unique subjects and year groups
            subjects = set()
            year_groups = set()
            
            for row in reader:
                subjects.add(row['Subject'])
                year_groups.add(row['YearGroup'])

            # Insert subjects
            for subject in subjects:
                cur.execute("INSERT INTO subjects (name) VALUES (%s) ON CONFLICT (name) DO NOTHING", (subject,))

            # Insert year groups
            for year_group in year_groups:
                cur.execute("INSERT INTO year_groups (name) VALUES (%s) ON CONFLICT (name) DO NOTHING", (year_group,))

            # Reset file pointer
            f.seek(0)
            next(reader)  # Skip header row

            # Insert curriculum data
            for row in reader:
                # Get subject_id and year_group_id
                cur.execute("SELECT id FROM subjects WHERE name = %s", (row['Subject'],))
                subject_id = cur.fetchone()[0]
                
                cur.execute("SELECT id FROM year_groups WHERE name = %s", (row['YearGroup'],))
                year_group_id = cur.fetchone()[0]
                
                # Insert curriculum data
                cur.execute("""
                    INSERT INTO curriculum (
                        subject_id, year_group_id,
                        term1_knowledge, term1_skills,
                        term2_knowledge, term2_skills,
                        term3_knowledge, term3_skills,
                        term4_knowledge, term4_skills,
                        term5_knowledge, term5_skills,
                        term6_knowledge, term6_skills,
                        assessment, literacy_numeracy,
                        personal_development, home_learning,
                        term1_assessment, term2_assessment,
                        term3_assessment, term4_assessment,
                        term5_assessment, term6_assessment
                    ) VALUES (
                        %s, %s,
                        %s, %s, %s, %s, %s, %s,
                        %s, %s, %s, %s, %s, %s,
                        %s, %s, %s, %s,
                        %s, %s, %s, %s, %s, %s
                    )
                """, (
                    subject_id, year_group_id,
                    row['Term1Knowledge'], row['Term1Skills'],
                    row['Term2Knowledge'], row['Term2Skills'],
                    row['Term3Knowledge'], row['Term3Skills'],
                    row['Term4Knowledge'], row['Term4Skills'],
                    row['Term5Knowledge'], row['Term5Skills'],
                    row['Term6Knowledge'], row['Term6Skills'],
                    row['Assessment'], row['LiteracyNumeracy'],
                    row['PersonalDevelopment'], row['HomeLearning'],
                    row['Term1Assessment'], row['Term2Assessment'],
                    row['Term3Assessment'], row['Term4Assessment'],
                    row['Term5Assessment'], row['Term6Assessment']
                ))

        # Commit the transaction
        conn.commit()
        print("Migration completed successfully!")

    except Exception as e:
        print(f"Error during migration: {e}")
        conn.rollback()
    finally:
        cur.close()
        conn.close()

if __name__ == "__main__":
    migrate_data() 