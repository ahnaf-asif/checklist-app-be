## Checklist App Backend

### For database schema
`src/db/sql/schema.sql` contains the main schema. Update that whenever necessary.

### Database related commands

1. run `yarn db-init` to initialize the database based on the schema.
2. run `yarn db-clear` to clear all records from all tables.
3. run `yarn db-drop-tables` to drop all tables from the database.
4. run `yarn db-reset` which clears all data, then drops all tables, and then re-initializes the database based on the schema.

### App related commands

1. run `yarn start` to start the app, but it won't hot-reload anything.
2. run `yarn dev` which starts the app and hot-reloads every time there is a change.
