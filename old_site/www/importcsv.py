import pandas as pd
from sqlalchemy import create_engine, text

# Read the CSV file
df = pd.read_csv('return_added_output_ass_bold.csv')

# Connect to the database
engine = create_engine('mysql+pymysql://root:exhall2024@127.0.0.1/exhall_curriculum')

# Load data into a temporary table
df.to_sql('Curriculum_temp', con=engine, if_exists='replace', index=False)

# Verify data
with engine.connect() as conn:
    result = conn.execute(text("SELECT * FROM Curriculum_temp LIMIT 10")).fetchall()
    print(result)

# Replace data in the main table
with engine.connect() as conn:
    conn.execute(text("TRUNCATE TABLE Curriculum"))
    conn.execute(text("INSERT INTO Curriculum SELECT * FROM Curriculum_temp"))
    conn.execute(text("DROP TABLE Curriculum_temp"))