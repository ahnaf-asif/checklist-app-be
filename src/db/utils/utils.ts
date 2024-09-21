import fs from 'fs';
// import { fileURLToPath } from 'url';
// import { dirname, join } from 'path';
import { pool } from '../';
import * as path from 'path';

const dirname = 'src/db/sql';

export const initDb = async () => {
  try {
    const schemaPath = path.join(dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    await pool.query(schema);
    console.log('Database schema initialized');
  } catch (error) {
    console.error('Error initializing database schema:', error);
    throw error;
  } finally {
    await pool.end();
  }
};

export const clearDb = async () => {
  try {
    const clearDbPath = path.join(dirname, 'clearDatabase.sql');

    const clearDbSQL = fs.readFileSync(clearDbPath, 'utf8');

    await pool.query(clearDbSQL);

    console.log('Database cleared successfully');
  } catch (error) {
    console.error('Error clearing database:', error);
    throw error;
  } finally {
    await pool.end();
  }
};

export const dropAllTables = async () => {
  try {
    const clearDbPath = path.join(dirname, 'dropTables.sql');

    const clearDbSQL = fs.readFileSync(clearDbPath, 'utf8');

    await pool.query(clearDbSQL);

    console.log('Database tables dropped successfully');
  } catch (error) {
    console.error('Error clearing database:', error);
    throw error;
  } finally {
    await pool.end();
  }
};

export const seedDb = async () => {
  try {
    const seedDbPath = path.join(dirname, 'dbSeeder.sql');

    const seedDbSql = fs.readFileSync(seedDbPath, 'utf8');

    await pool.query(seedDbSql);

    console.log('Database is populated with data successfully');
  } catch (error) {
    console.error('Error clearing database:', error);
    throw error;
  } finally {
    await pool.end();
  }
};
