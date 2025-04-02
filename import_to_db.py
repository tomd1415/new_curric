#!/usr/bin/env python3

import csv
import psycopg2
from psycopg2.extras import execute_values
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Database connection parameters from .env
DB_PARAMS = {
    'host': os.getenv('DB_HOST'),
    'port': os.getenv('DB_PORT'),
    'dbname': os.getenv('DB_NAME'),
    'user': os.getenv('DB_USER'),
    'password': os.getenv('DB_PASSWORD')
}

def read_csv_data():
    """Read the processed CSV data"""
    with open('old_site/curriculum_data.csv', 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        return list(reader)

def import_data(conn, data):
    """Import data into the subject_overview table"""
    with conn.cursor() as cur:
        for row in data:
            # Process each term
            for term_num in range(1, 7):
                knowledge = row.get(f'Term{term_num}Knowledge', '')
                skills = row.get(f'Term{term_num}Skills', '')
                
                if not knowledge and not skills:
                    continue
                
                # Map term number to term name
                term_mapping = {
                    1: 'Autumn 1',
                    2: 'Autumn 2',
                    3: 'Spring 1',
                    4: 'Spring 2',
                    5: 'Summer 1',
                    6: 'Summer 2'
                }
                
                # Insert the data
                cur.execute("""
                    INSERT INTO subject_overview 
                    (subject, Year, Term, Area_of_study, Literacy_focus, Numeracy_focus, SMSC)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                    ON CONFLICT (subject, Year, Term) DO UPDATE
                    SET Area_of_study = EXCLUDED.Area_of_study,
                        Literacy_focus = EXCLUDED.Literacy_focus,
                        Numeracy_focus = EXCLUDED.Numeracy_focus,
                        SMSC = EXCLUDED.SMSC
                """, (
                    row['Subject'],
                    row['YearGroup'],
                    term_mapping[term_num],
                    knowledge,
                    row.get('Literacy', ''),
                    row.get('Numeracy', ''),
                    row.get('Personal Development', '')
                ))
        conn.commit()

def main():
    try:
        # Connect to the database
        conn = psycopg2.connect(**DB_PARAMS)
        print("Connected to database successfully")
        
        # Read CSV data
        data = read_csv_data()
        print(f"Read {len(data)} rows from CSV")
        
        # Import data
        import_data(conn, data)
        print("Data import completed successfully")
        
    except Exception as e:
        print(f"Error: {e}")
        if conn:
            conn.rollback()
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    main() 