import { dropAllTables } from './utils';
const run = async () => {
  await dropAllTables();
};

run().catch((err) => {
  console.error('Error initializing the database:', err);
});
