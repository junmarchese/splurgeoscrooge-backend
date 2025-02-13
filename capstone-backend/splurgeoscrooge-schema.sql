-- Create users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  email VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create budgets table
CREATE TABLE budgets (
  id SERIAL PRIMARY KEY,
  user_id INTEGER PRIMARY KEY REFERENCES users(id),
  data JSONB NOT NULL
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

