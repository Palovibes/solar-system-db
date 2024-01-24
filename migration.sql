-- Clear the table
DROP TABLE IF EXISTS SolarSystem;

-- text is "undefined" length
-- varchar(255) is "255" length

-- Create the table
CREATE table SolarSystem (
    id serial,
    planet_name text,
    type text,
    atmosphere text,
    gravity float,
    life boolean
);