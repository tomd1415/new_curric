#!/bin/bash

# Make a backup of the original file
cp old_site/old_exhall_curric_dump.sql old_site/old_exhall_curric_dump.sql.bak

# Extract the INSERT statements and convert to CSV
grep "^INSERT INTO.*VALUES" old_site/old_exhall_curric_dump.sql | \
  grep "Curriculum" | \
  sed 's/INSERT INTO "Curriculum" VALUES (//' | \
  sed 's/),(/\n/g' | \
  sed 's/);$//' | \
  sed "s/\\\'/''/g" | \
  sed 's/\\n/\n/g' | \
  sed 's/\\r//g' > old_site/old_exhall_curric_dump.csv

echo "MySQL dump converted to CSV format" 