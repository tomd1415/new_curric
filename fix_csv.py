import csv
import re

# Define the header
header = ['id', 'Subject', 'YearGroup', 'Term1Knowledge', 'Term1Skills', 'Term2Knowledge', 'Term2Skills', 'Term3Knowledge', 'Term3Skills', 'Term4Knowledge', 'Term4Skills', 'Term5Knowledge', 'Term5Skills', 'Term6Knowledge', 'Term6Skills', 'Assessment', 'LiteracyNumeracy', 'PersonalDevelopment', 'HomeLearning', 'Term1Assessment', 'Term2Assessment', 'Term3Assessment', 'Term4Assessment', 'Term5Assessment', 'Term6Assessment']

# Read the original file
with open('old_site/curriculum_data.csv', 'r', encoding='utf-8') as f:
    content = f.read()

# Process the content
lines = []
current_line = ''

for line in content.split('\n'):
    line = line.strip()
    if not line:
        continue
    
    # Skip the header line we just wrote
    if line.startswith('id,Subject,YearGroup'):
        continue
        
    if current_line:
        current_line += line
    else:
        current_line = line
        
    # Count the number of commas outside of quotes
    comma_count = len(re.findall(r',(?=(?:[^"]*"[^"]*")*[^"]*$)', current_line))
    
    # If we have enough commas for a complete row
    if comma_count >= len(header) - 1:
        lines.append(current_line)
        current_line = ''

# Process each line
processed_lines = []
for line in lines:
    # Split the line by commas (respecting quotes)
    fields = re.split(r',(?=(?:[^"]*"[^"]*")*[^"]*$)', line)
    if len(fields) >= len(header):
        processed_lines.append(fields[:len(header)])

# Append the data rows to the file
with open('old_site/curriculum_data.csv', 'a', encoding='utf-8', newline='') as f:
    writer = csv.writer(f)
    writer.writerows(processed_lines) 