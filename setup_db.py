import psycopg2
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

def setup_database():
    """Create the subject_overview table"""
    conn = None
    try:
        # Connect to the database
        conn = psycopg2.connect(**DB_PARAMS)
        print("Connected to database successfully")
        
        # Create cursor
        cur = conn.cursor()
        
        # Create the subject_overview table
        cur.execute("""
            CREATE TABLE IF NOT EXISTS subject_overview (
                id SERIAL PRIMARY KEY,
                subject VARCHAR(50),
                Year VARCHAR(60),
                Term VARCHAR(10),
                Area_of_study TEXT,
                Literacy_focus TEXT,
                Numeracy_focus TEXT,
                SMSC TEXT,
                UNIQUE(subject, Year, Term)
            )
        """)
        
        # Commit the changes
        conn.commit()
        print("Database schema created successfully")
        
    except Exception as e:
        print(f"Error: {e}")
        if conn:
            conn.rollback()
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    setup_database() 