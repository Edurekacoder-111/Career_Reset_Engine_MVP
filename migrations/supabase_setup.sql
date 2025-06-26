-- CareerReset Database Schema for Supabase
-- Run this script in your Supabase SQL Editor

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  whatsapp TEXT,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create user_progress table
CREATE TABLE IF NOT EXISTS user_progress (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) NOT NULL,
  current_phase INTEGER DEFAULT 0 NOT NULL,
  confidence_baseline INTEGER,
  confidence_current INTEGER,
  years_experience INTEGER,
  key_skills TEXT,
  narrative TEXT,
  achievements JSONB,
  core_skills JSONB,
  skill_gaps JSONB,
  story_score INTEGER DEFAULT 0
);

-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT NOT NULL,
  salary_range TEXT,
  match_percentage INTEGER NOT NULL,
  status TEXT NOT NULL,
  description TEXT
);

-- Create user_roles table
CREATE TABLE IF NOT EXISTS user_roles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) NOT NULL,
  role_id INTEGER REFERENCES roles(id) NOT NULL,
  is_shortlisted BOOLEAN DEFAULT false,
  is_selected BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create applications table
CREATE TABLE IF NOT EXISTS applications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) NOT NULL,
  role_id INTEGER REFERENCES roles(id) NOT NULL,
  status TEXT NOT NULL,
  resume_url TEXT,
  cover_letter TEXT,
  submitted_at TIMESTAMP DEFAULT NOW() NOT NULL,
  method TEXT
);

-- Create confidence_entries table
CREATE TABLE IF NOT EXISTS confidence_entries (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) NOT NULL,
  confidence_level INTEGER NOT NULL,
  recorded_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create waitlist_entries table
CREATE TABLE IF NOT EXISTS waitlist_entries (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  type TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Insert sample roles
INSERT INTO roles (title, company, location, salary_range, match_percentage, status, description) VALUES
('Senior Product Manager', 'TechCorp', 'Bangalore', '₹25-35 LPA', 92, 'available', 'Lead product strategy and development for enterprise software solutions.'),
('Marketing Director', 'StartupXYZ', 'Mumbai', '₹30-40 LPA', 87, 'available', 'Drive marketing strategy and team growth for fintech startup.'),
('Data Science Lead', 'DataInc', 'Hyderabad', '₹35-45 LPA', 78, 'pending', 'Lead data science initiatives and ML model development.'),
('UX Design Manager', 'DesignStudio', 'Pune', '₹22-32 LPA', 73, 'locked', 'Manage UX design team and drive user experience strategy.'),
('Engineering Manager', 'DevCorp', 'Chennai', '₹28-38 LPA', 85, 'available', 'Lead engineering teams and technical architecture decisions.')
ON CONFLICT DO NOTHING;