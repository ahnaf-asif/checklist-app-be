import { initDb } from './utils';

const run = async () => {
  await initDb();
};

run().catch((err) => {
  console.error('Error initializing the database:', err);
});
