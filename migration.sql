-- Clear the table
DROP TABLE IF EXISTS SolarSystem;

-- Create the table
CREATE TABLE solarSystem (
    id SERIAL PRIMARY KEY,
    planet_name TEXT,
    type TEXT,
    atmosphere TEXT,
    gravity FLOAT,
    life BOOLEAN
);

-- Add the unique constraint to prevent duplicate record entries via POST method
ALTER TABLE SolarSystem ADD UNIQUE (planet_name);
