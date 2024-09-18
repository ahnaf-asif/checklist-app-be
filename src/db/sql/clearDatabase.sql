DO $$ 
DECLARE
r RECORD;
BEGIN
    -- Disable referential integrity (disable all triggers)
    PERFORM 'DISABLE TRIGGER ALL' FROM pg_trigger;

    -- Loop through all tables and truncate them
FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'TRUNCATE TABLE ' || quote_ident(r.tablename) || ' CASCADE';
END LOOP;

    -- Enable referential integrity (enable all triggers)
    PERFORM 'ENABLE TRIGGER ALL' FROM pg_trigger;
END $$;
