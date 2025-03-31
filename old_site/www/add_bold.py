import csv

def add_b_tags(text):
    lines = text.split('\n')
    if not lines[0].startswith('[b]'):
        lines[0] = '[b]' + lines[0]
    if not lines[0].endswith('[/b]'):
        lines[0] = lines[0] + '[/b]'
    return '\n'.join(lines)

def process_csv(input_file, output_file):
    with open(input_file, mode='r', newline='', encoding='utf-8') as infile:
        reader = csv.DictReader(infile)
        fieldnames = reader.fieldnames
        rows = list(reader)

    for row in rows:
        for key in row.keys():
            if key.startswith('Knowledge_and_skills_'):
                row[key] = add_b_tags(row[key])

    with open(output_file, mode='w', newline='', encoding='utf-8') as outfile:
        writer = csv.DictWriter(outfile, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

input_file = 'return_added_output_ass.csv'  # replace with your input file path
output_file = 'return_added_output_ass_bold.csv'  # replace with your desired output file path

process_csv(input_file, output_file)
