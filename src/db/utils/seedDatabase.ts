import { seedDb } from './utils';
const run = async () => {
  await seedDb();
};

run().catch((err) => {
  console.error('Error initializing the database:', err);
});
