#!/usr/bin/env python3

import csv
import re

def clean_text(text):
    # Remove BBCode tags and extra whitespace
    text = re.sub(r'\[.*?\]', '', text)
    text = ' '.join(text.split())
    return text

def process_curriculum_file():
    rows = []
    with open('Curriculum.txt', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Split into lines and clean up line wrapping
    lines = []
    current_line = ''
    
    for line in content.split('\n'):
        line = line.strip()
        if not line:
            continue
            
        if line.startswith('"'):
            if current_line:
                lines.append(current_line)
            current_line = line
        else:
            current_line += ' ' + line
    
    if current_line:
        lines.append(current_line)
    
    # Process the cleaned lines
    current_row = None
    current_field = None
    
    for line in lines:
        # Parse the CSV line
        row = next(csv.reader([line]))
        
        if not row:
            continue
            
        # If this is a new entry (starts with an ID)
        if row[0].strip('"').isdigit():
            if current_row:
                rows.append(current_row)
            current_row = {
                'id': row[0].strip('"'),
                'Subject': row[1].strip('"'),
                'YearGroup': row[2].strip('"'),
                'Term1Knowledge': clean_text(row[3].strip('"')) if len(row) > 3 else '',
                'Term1Skills': '',
                'Term2Knowledge': '',
                'Term2Skills': '',
                'Term3Knowledge': '',
                'Term3Skills': '',
                'Term4Knowledge': '',
                'Term4Skills': '',
                'Term5Knowledge': '',
                'Term5Skills': '',
                'Term6Knowledge': '',
                'Term6Skills': '',
                'Assessment': '',
                'LiteracyNumeracy': '',
                'PersonalDevelopment': '',
                'HomeLearning': '',
                'Term1Assessment': '',
                'Term2Assessment': '',
                'Term3Assessment': '',
                'Term4Assessment': '',
                'Term5Assessment': '',
                'Term6Assessment': ''
            }
            current_field = 'Term1Knowledge'
        elif current_row:
            # This is a continuation of the current entry
            text = clean_text(row[0].strip('"'))
            if current_field == 'Term1Knowledge':
                current_row['Term1Skills'] = text
                current_field = 'Term1Skills'
            elif current_field == 'Term1Skills':
                current_row['Assessment'] = text
                current_field = 'Assessment'
            elif current_field == 'Assessment':
                current_row['LiteracyNumeracy'] = text
                current_field = 'LiteracyNumeracy'
            elif current_field == 'LiteracyNumeracy':
                current_row['PersonalDevelopment'] = text
                current_field = 'PersonalDevelopment'
    
    if current_row:
        rows.append(current_row)
    
    return rows

def process_subject_overview_file():
    rows = []
    with open('subject_overview.txt', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Split into lines and clean up line wrapping
    lines = []
    current_line = ''
    
    for line in content.split('\n'):
        line = line.strip()
        if not line:
            continue
            
        if current_line:
            current_line += ' ' + line
        else:
            current_line = line
            
        # If we have a complete row (starts with a quoted number)
        if re.match(r'^"\d+"', line):
            if current_line and current_line != line:
                lines.append(current_line[:-len(line)].strip())
            current_line = line
    
    if current_line:
        lines.append(current_line)
    
    # Process the cleaned lines
    for line in lines:
        # Parse the CSV line
        try:
            row = next(csv.reader([line]))
        except:
            continue
        
        if not row or len(row) < 5:  # We need at least id, subject, year, term, and knowledge
            continue
            
        if not row[0].strip('"').isdigit():
            continue
            
        id = row[0].strip('"')
        subject = row[1].strip('"')
        year_group = row[2].strip('"')
        term = row[3].strip('"')
        
        # Map term names to numbers
        term_map = {
            'Autumn 1': 1, 'Autumn 2': 2,
            'Spring 1': 3, 'Spring 2': 4,
            'Summer 1': 5, 'Summer 2': 6
        }
        
        if term not in term_map:
            continue
            
        term_num = term_map[term]
        
        # Create row
        current_row = {
            'id': id,
            'Subject': subject,
            'YearGroup': year_group,
            'Term1Knowledge': '',
            'Term1Skills': '',
            'Term2Knowledge': '',
            'Term2Skills': '',
            'Term3Knowledge': '',
            'Term3Skills': '',
            'Term4Knowledge': '',
            'Term4Skills': '',
            'Term5Knowledge': '',
            'Term5Skills': '',
            'Term6Knowledge': '',
            'Term6Skills': '',
            'Assessment': '',
            'LiteracyNumeracy': row[5].strip('"') if len(row) > 5 else '',
            'PersonalDevelopment': row[7].strip('"') if len(row) > 7 else '',
            'HomeLearning': '',
            'Term1Assessment': '',
            'Term2Assessment': '',
            'Term3Assessment': '',
            'Term4Assessment': '',
            'Term5Assessment': '',
            'Term6Assessment': ''
        }
        
        # Add knowledge
        if len(row) > 4:
            current_row[f'Term{term_num}Knowledge'] = clean_text(row[4].strip('"'))
        
        # Add skills (numeracy)
        if len(row) > 6:
            current_row[f'Term{term_num}Skills'] = clean_text(row[6].strip('"'))
            
        rows.append(current_row)
    return rows

def main():
    # Process both files
    curriculum_rows = process_curriculum_file()
    subject_overview_rows = process_subject_overview_file()
    
    # Combine rows
    all_rows = curriculum_rows + subject_overview_rows
    
    # Write to output file
    with open('old_site/curriculum_data.csv', 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=[
            'id', 'Subject', 'YearGroup', 'Term1Knowledge', 'Term1Skills',
            'Term2Knowledge', 'Term2Skills', 'Term3Knowledge', 'Term3Skills',
            'Term4Knowledge', 'Term4Skills', 'Term5Knowledge', 'Term5Skills',
            'Term6Knowledge', 'Term6Skills', 'Assessment', 'LiteracyNumeracy',
            'PersonalDevelopment', 'HomeLearning', 'Term1Assessment',
            'Term2Assessment', 'Term3Assessment', 'Term4Assessment',
            'Term5Assessment', 'Term6Assessment'
        ])
        writer.writeheader()
        writer.writerows(all_rows)
    
    print(f"Processed {len(curriculum_rows)} rows from Curriculum.txt")
    print(f"Processed {len(subject_overview_rows)} rows from subject_overview.txt")
    print(f"Total rows written: {len(all_rows)}")

if __name__ == '__main__':
    main() 