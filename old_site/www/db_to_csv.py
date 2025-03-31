import csv
import mysql.connector

# Database connection parameters
db_params = {
    'database': 'exhall_curriculum',
    'user': 'root',
    'password': 'exhall2024',
    'host': '127.0.0.1',  # Or your host
    'port': 3306  # Default port for MariaDB
}

try:
    # Establish a database connection
    conn = mysql.connector.connect(**db_params)
    cur = conn.cursor()

    # Query to select all data from the table
    query = "SELECT * FROM Curriculum"

    # Execute the query
    cur.execute(query)

    # Fetch all the rows
    rows = cur.fetchall()

    # Get the column names
    column_names = [desc[0] for desc in cur.description]

    # Output CSV file path
    output_file = 'output.csv'

    # Write data to CSV file
    with open(output_file, mode='w', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        # Write the column headers
        writer.writerow(column_names)
        # Write the rows
        writer.writerows(rows)

    # Close the cursor and connection
    cur.close()
    conn.close()

    print(f"Data has been successfully exported to {output_file}")

except mysql.connector.Error as err:
    print(f"Error: {err}")
