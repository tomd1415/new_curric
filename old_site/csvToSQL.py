import pandas as pd
import mysql.connector
from mysql.connector import Error

# Function to create a database connection
def create_connection(host_name, user_name, user_password, db_name):
    connection = None
    try:
        connection = mysql.connector.connect(
            host=host_name,
            user=user_name,
            passwd=user_password,
            database=db_name
        )
        print("Connection to MariaDB successful")
    except Error as e:
        print(f"The error '{e}' occurred")
    return connection

# Function to execute a single query
def execute_query(connection, query, data):
    cursor = connection.cursor()
    try:
        cursor.executemany(query, data)
        connection.commit()
        print("Query executed successfully")
    except Error as e:
        print(f"The error '{e}' occurred")

# Connection details
host_name = "127.0.0.1"
user_name = "root"
user_password = "exhall2024"
db_name = "exhall_curriculum"

# Create a database connection
connection = create_connection(host_name, user_name, user_password, db_name)

# Read the CSV file
csv_file_path = "./CSVfiles/Exhall-Science.csv"
df = pd.read_csv(csv_file_path)

# Replace NaN values with empty strings
df.fillna("", inplace=True)

# Prepare the insert query
insert_query = """
INSERT INTO subject_overview (subject, Year, Term, Area_of_study, Literacy_focus, Numeracy_focus, SMSC) 
VALUES (%s, %s, %s, %s, %s, %s, %s)
"""

# Prepare the data to be inserted
data = [
    ('Science', row['Year'], row['Term'], row['Area_of_study'], row['Literacy_focus'], row['Numeracy_focus'], row['SMSC'])
    for index, row in df.iterrows()
]

# Execute the query
execute_query(connection, insert_query, data)

# Close the connection
connection.close()
