#!/bin/bash

# Install required Python packages
pip install psycopg2-binary

# Run the Python migration script
echo "Running migration..."
python3 migrate_data.py

echo "Migration complete!" 