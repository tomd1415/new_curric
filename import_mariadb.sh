#!/bin/bash

# Convert MariaDB dump to PostgreSQL format
sed -i.bak \
    -e 's/`//g' \
    -e 's/AUTO_INCREMENT/SERIAL/g' \
    -e 's/int([0-9]*)/integer/g' \
    -e 's/ENGINE=InnoDB//g' \
    -e 's/DEFAULT CHARSET=utf8mb4//g' \
    -e 's/COLLATE=utf8mb4_general_ci//g' \
    -e 's/DEFAULT CHARSET=latin1//g' \
    -e 's/COLLATE=latin1_swedish_ci//g' \
    -e 's/DEFAULT CHARACTER SET utf8mb4//g' \
    -e 's/COLLATE utf8mb4_general_ci//g' \
    -e 's/CHARACTER SET utf8mb4//g' \
    -e 's/COLLATE utf8mb4_0900_ai_ci//g' \
    -e 's/DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP/DEFAULT CURRENT_TIMESTAMP/g' \
    -e 's/LOCK TABLES [^;]*;//g' \
    -e 's/UNLOCK TABLES;//g' \
    -e 's/CREATE DATABASE/-- CREATE DATABASE/g' \
    -e 's/USE [^;]*;//g' \
    -e '/^\/\*![0-9]* SET/d' \
    -e '/^\/\*![0-9]* LOCK/d' \
    -e '/^\/\*![0-9]* UNLOCK/d' \
    -e '/^\/\*![0-9]* DROP/d' \
    -e '/^\/\*![0-9]* CREATE/d' \
    -e '/^\/\*![0-9]* ALTER/d' \
    -e '/^\/\*![0-9]* SET/d' \
    -e '/^\/\*![0-9]* DISABLE/d' \
    -e '/^\/\*![0-9]* ENABLE/d' \
    old_site/complete_mariadb_dump.sql

# Import into PostgreSQL
psql -U curric_user exhall_curriculum < old_site/complete_mariadb_dump.sql

# Run the migration script
psql -U curric_user exhall_curriculum -f migrate_data.sql 