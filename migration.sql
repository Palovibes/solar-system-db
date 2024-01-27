-- Clear the table
DROP TABLE IF EXISTS SolarSystem;

-- Create the table
CREATE TABLE SolarSystem (
    id SERIAL PRIMARY KEY,
    planet_name TEXT,
    type TEXT,
    atmosphere TEXT,
    gravity FLOAT,
    life BOOLEAN
);

-- Add the unique constraint
ALTER TABLE SolarSystem ADD UNIQUE (planet_name);
