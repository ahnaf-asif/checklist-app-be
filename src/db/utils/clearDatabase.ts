import { clearDb } from './utils';
const run = async () => {
  await clearDb();
};

run().catch((err) => {
  console.error('Error initializing the database:', err);
});
