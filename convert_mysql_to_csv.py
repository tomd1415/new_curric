#!/usr/bin/env python3

import csv
import re

def extract_values(content):
    # Find the INSERT statement for Curriculum table
    insert_pattern = r"INSERT INTO Curriculum VALUES\s*\n(.*?)(?=\n--)"
    match = re.search(insert_pattern, content, re.DOTALL)
    
    if not match:
        print("No INSERT statement found")
        return [], [], []
        
    # Get all the rows
    values_str = match.group(1)
    rows_pattern = r"\((.*?)\)(?:,|\s*$)"
    row_matches = re.finditer(rows_pattern, values_str, re.DOTALL)
    
    rows = []
    subjects = set()
    year_groups = set()
    
    for row_match in row_matches:
        values_str = row_match.group(1)
        # Split values while handling commas within quotes
        values = []
        current_value = ""
        in_quotes = False
        escaped = False
        
        for char in values_str:
            if char == '\\' and not escaped:
                escaped = True
                current_value += char
            elif char == "'" and not escaped:
                in_quotes = not in_quotes
                current_value += char
            elif char == ',' and not in_quotes:
                # Clean up the value
                value = current_value.strip()
                if value.startswith("'") and value.endswith("'"):
                    value = value[1:-1]  # Remove quotes
                value = value.replace('\\n', '\n')  # Convert \n to newlines
                values.append(value)
                current_value = ""
            else:
                current_value += char
                escaped = False
        
        # Don't forget the last value
        if current_value:
            value = current_value.strip()
            if value.startswith("'") and value.endswith("'"):
                value = value[1:-1]  # Remove quotes
            value = value.replace('\\n', '\n')  # Convert \n to newlines
            values.append(value)
        
        if len(values) >= 19:  # Ensure we have all required fields
            # Extract subject and year group
            subject = values[1]
            year_group = values[2]
            
            # Only add valid year groups (Year 7, 8, 9)
            if year_group.startswith('Year ') and year_group.split()[1] in ['7', '8', '9']:
                subjects.add(subject)
                year_groups.add(year_group)
                rows.append(values)
    
    return rows, sorted(list(subjects)), sorted(list(year_groups))

# Read the SQL file
with open('old_site/complete_mariadb_dump.sql', 'r', encoding='utf-8') as f:
    content = f.read()

print(f"Found content length: {len(content)}")

# Extract values and get unique subjects/year groups
rows, subjects, year_groups = extract_values(content)

print(f"\nTotal rows to write: {len(rows)}")
print(f"\nUnique subjects: {len(subjects)}")
print(f"Unique year groups: {len(year_groups)}")
print("\nSubjects:")
for subject in subjects:
    print(f"- {subject}")
print("\nYear groups:")
for year_group in year_groups:
    print(f"- {year_group}")

# Define headers based on the expected structure
headers = [
    'id', 'Subject', 'YearGroup', 'Term1Knowledge', 'Term1Skills',
    'Term2Knowledge', 'Term2Skills', 'Term3Knowledge', 'Term3Skills',
    'Term4Knowledge', 'Term4Skills', 'Term5Knowledge', 'Term5Skills',
    'Term6Knowledge', 'Term6Skills', 'Assessment', 'LiteracyNumeracy',
    'PersonalDevelopment', 'HomeLearning', 'Term1Assessment', 'Term2Assessment',
    'Term3Assessment', 'Term4Assessment', 'Term5Assessment', 'Term6Assessment'
]

# Write to CSV
with open('old_site/curriculum_data.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerow(headers)
    writer.writerows(rows) 