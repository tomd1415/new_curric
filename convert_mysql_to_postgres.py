#!/usr/bin/env python3

import re

def convert_mysql_to_postgres(input_file, output_file):
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Remove MySQL-specific syntax
    content = re.sub(r'/\*![0-9]*\s[^;]*;', '', content)  # Remove MySQL version specific commands
    content = re.sub(r'ENGINE=InnoDB', '', content)
    content = re.sub(r'DEFAULT CHARSET=[^;\s]+', '', content)
    content = re.sub(r'COLLATE=[^;\s]+', '', content)
    content = re.sub(r'CHARACTER SET [^;\s]+', '', content)
    content = re.sub(r'LOCK TABLES[^;]*;', '', content)
    content = re.sub(r'UNLOCK TABLES;', '', content)
    content = re.sub(r'USE [^;]*;', '', content)
    content = re.sub(r'CREATE DATABASE[^;]*;', '', content)
    content = re.sub(r'int\([0-9]+\)', 'integer', content)
    content = re.sub(r'AUTO_INCREMENT', 'SERIAL', content)
    content = re.sub(r'`', '"', content)

    # Extract INSERT statements for Curriculum table
    curriculum_inserts = []
    for match in re.finditer(r'INSERT INTO "Curriculum" VALUES\s*\((.*?)\);', content, re.DOTALL):
        values = match.group(1)
        # Split into individual rows, handling escaped commas within strings
        rows = []
        current_row = []
        current_value = ''
        in_string = False
        escaped = False
        
        for char in values:
            if char == '\\' and not escaped:
                escaped = True
                current_value += char
            elif char == "'" and not escaped:
                in_string = not in_string
                current_value += char
            elif char == ',' and not in_string:
                current_row.append(current_value.strip())
                current_value = ''
            elif char == '(' and not in_string:
                if current_row:
                    rows.append(current_row)
                current_row = []
            elif char == ')' and not in_string:
                if current_value:
                    current_row.append(current_value.strip())
                if current_row:
                    rows.append(current_row)
                current_row = []
                current_value = ''
            else:
                current_value += char
                escaped = False
        
        if current_row:
            rows.append(current_row)
        
        # Format rows for PostgreSQL
        for row in rows:
            if len(row) >= 19:  # Ensure we have all required fields
                curriculum_inserts.append(f"({','.join(row)})")

    # Write PostgreSQL-compatible SQL
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write('-- Drop existing tables\n')
        f.write('DROP TABLE IF EXISTS "Curriculum" CASCADE;\n\n')
        
        f.write('-- Create Curriculum table\n')
        f.write("""CREATE TABLE "Curriculum" (
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
);\n\n""")
        
        f.write('-- Insert Curriculum data\n')
        if curriculum_inserts:
            f.write('INSERT INTO "Curriculum" VALUES\n')
            f.write(',\n'.join(curriculum_inserts))
            f.write(';\n')

if __name__ == '__main__':
    convert_mysql_to_postgres('old_site/complete_mariadb_dump.sql', 'old_site/postgres_dump.sql') 