# Exhall Curriculum Management System

## Project Overview
A web-based curriculum management system for Exhall School, allowing teachers to view and update subject plans across year groups. This system replaces the previous workflow of managing curriculum documents through PDFs and PowerPoint files.

## Technology Stack
- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL
- **Frontend**: React with Tailwind CSS
- **Authentication**: JWT (with plans for future Microsoft integration)

## Initial Setup

### Database Setup

### 1. Install PostgreSQL if not already installed:

#### On Debian
```
sudo apt update
sudo apt install postgresql postgresql-contrib
```
#### On Gentoo
```
emerge --ask dev-db/postgresql
```
### 2. Create a new PostgreSQL user for the application:

#### Log in as the postgres user
```
sudo -u postgres psql
```
#### Create the new role
```
CREATE ROLE curric_user WITH LOGIN PASSWORD 'your_secure_password';
```
##### Create the database
```
CREATE DATABASE exhall_curriculum;
```
#### Grant privileges
```
GRANT ALL PRIVILEGES ON DATABASE exhall_curriculum TO curric_user;
```
#### Make curric_user the owner
```
ALTER DATABASE exhall_curriculum OWNER TO curric_user;
```
#### Exit
```
\q
```

### 3. Create the database schema:

#### Connect to the database as the new user
```
psql -U curric_user -d exhall_curriculum
```
### 4. Execute the following SQL to create the initial tables:
```
-- Create subjects table
CREATE TABLE subjects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT
);

-- Create year_groups table
CREATE TABLE year_groups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(20) NOT NULL UNIQUE,
    key_stage VARCHAR(20)
);

-- Create terms table
CREATE TABLE terms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(20) NOT NULL UNIQUE,
    academic_year VARCHAR(20)
);

-- Create curriculum_plans table
CREATE TABLE curriculum_plans (
    id SERIAL PRIMARY KEY,
    subject_id INTEGER REFERENCES subjects(id),
    year_group_id INTEGER REFERENCES year_groups(id),
    term_id INTEGER REFERENCES terms(id),
    area_of_study TEXT,
    literacy_focus TEXT,
    numeracy_focus TEXT,
    smsc TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(subject_id, year_group_id, term_id)
);

-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('admin', 'teacher', 'subject_leader')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create subject_leaders table (junction table for many-to-many relationship)
CREATE TABLE subject_leaders (
    user_id INTEGER REFERENCES users(id),
    subject_id INTEGER REFERENCES subjects(id),
    PRIMARY KEY (user_id, subject_id)
);

-- Create change_logs table
CREATE TABLE change_logs (
    id SERIAL PRIMARY KEY,
    curriculum_plan_id INTEGER REFERENCES curriculum_plans(id),
    user_id INTEGER REFERENCES users(id),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    action VARCHAR(20) CHECK (action IN ('create', 'update', 'delete'))
);

-- Create function to update the "updated_at" column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update "updated_at"
CREATE TRIGGER update_curriculum_plans_updated_at
BEFORE UPDATE ON curriculum_plans
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```
## Environment Configuration

### 1. Create a `.env` file at the root of your project:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=exhall_curriculum
DB_USER=curric_user
DB_PASSWORD=your_secure_password
JWT_SECRET=your_jwt_secret_key
```
## Repository Setup

### 1. Initialize Git repository:
```
git init
```
### 2. Create a `.gitignore` file:
```
node_modules/
.env
.DS_Store
npm-debug.log
dist/
build/
```
### 3. Connect to GitHub repository: 
```
git remote add origin https://github.com/yourusername/exhall-curriculum.git
```
## Project Structure

The project follows this structure:
```
exhall-curriculum/
├── client/                  # React frontend
├── server/                  # Node.js backend
│   ├── controllers/         # Route controllers
│   ├── middlewares/         # Express middlewares
│   ├── models/              # Database models
│   ├── routes/              # API routes
│   ├── utils/               # Utility functions
│   └── index.js             # Entry point
├── .env                     # Environment variables (not tracked by Git)
├── .gitignore               # Git ignore file
└── README.md                # Project documentation
```
## Development Roadmap

### 1. **Phase 1**: Basic setup and authentication
   - Set up backend API with Express
   - Implement user authentication with JWT
   - Create basic database models

### 2. **Phase 2**: Core curriculum management
   - Implement CRUD operations for curriculum plans
   - Set up role-based access controls
   - Create frontend views for curriculum display

### 3. **Phase 3**: Enhanced features
   - Improve UI/UX
   - Add reporting capabilities
   - Implement data import/export tools

## Future Plans

- Microsoft authentication integration
- AI integration for curriculum analysis and reporting
- Resource attachment functionality for detailed plans
