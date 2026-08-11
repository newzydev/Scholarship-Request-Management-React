import pg from 'pg';
import { env } from './env.js';

const isLocalHost = /localhost|127\.0\.0\.1|@db:/.test(env.databaseUrl);
const needsSsl = !isLocalHost;

export const pool = new pg.Pool({
  connectionString: env.databaseUrl,
  ssl: needsSsl ? { rejectUnauthorized: false } : false,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client', err);
});

export const query = (text, params) => pool.query(text, params);
