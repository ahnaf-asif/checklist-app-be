import * as process from 'process';
import { Pool, QueryResultRow } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME
});

// We will import this query function whenever we need to do things in the database

export const query = <R extends QueryResultRow = any>(text: string, params?: any[]) => {
  if (!params) {
    return pool.query<R>(text);
  }

  return pool.query<R>(text, params);
};
