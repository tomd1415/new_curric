import csv

def process_text(text):
    return text.replace('. ', '.\n')

def process_csv(input_file, output_file):
    with open(input_file, mode='r', newline='', encoding='utf-8') as infile:
        reader = csv.DictReader(infile)
        fieldnames = reader.fieldnames
        rows = list(reader)

    for row in rows:
        for key in row.keys():
            if key.startswith('key_assessments_'):
                row[key] = process_text(row[key])

    with open(output_file, mode='w', newline='', encoding='utf-8') as outfile:
        writer = csv.DictWriter(outfile, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

input_file = 'return_added_output.csv'  # replace with your input file path
output_file = 'return_added_output_ass.csv'  # replace with your desired output file path

process_csv(input_file, output_file)