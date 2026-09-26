// Shared by every /api function. Uses Vercel Postgres (Neon-backed) via
// the POSTGRES_URL env var that Vercel injects automatically once you
// attach a Postgres database to this project — no connection string to
// configure by hand.
const { sql } = require('@vercel/postgres');

let schemaReady = false;
async function ensureSchema() {
  if (schemaReady) return; // cached for the lifetime of this warm function
  await sql`CREATE TABLE IF NOT EXISTS users (
    id text PRIMARY KEY,
    name text NOT NULL,
    email text UNIQUE NOT NULL,
    password_hash text NOT NULL,
    created_at timestamptz DEFAULT now()
  )`;
  await sql`CREATE TABLE IF NOT EXISTS accounts (
    id text PRIMARY KEY,
    user_id text NOT NULL,
    name text NOT NULL,
    type text,
    initial numeric DEFAULT 0,
    created_at timestamptz DEFAULT now()
  )`;
  await sql`CREATE TABLE IF NOT EXISTS people (
    id text PRIMARY KEY,
    user_id text NOT NULL,
    name text NOT NULL,
    created_at timestamptz DEFAULT now()
  )`;
  await sql`CREATE TABLE IF NOT EXISTS transactions (
    id text PRIMARY KEY,
    user_id text NOT NULL,
    type text NOT NULL,
    amount numeric NOT NULL,
    category text,
    account_id text,
    to_account_id text,
    person_id text,
    date text,
    "desc" text,
    created_at timestamptz DEFAULT now()
  )`;
  schemaReady = true;
}

module.exports = { sql, ensureSchema };
