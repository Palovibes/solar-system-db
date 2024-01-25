import express, { query } from "express";
// import fs from "fs"; no need to use this 
import pg from "pg";

// const fsPromise = fs.promises; no need to use this 

const PORT = 8001;

const pool = new pg.Pool({
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "postgres",
    database: "spaceDB"
});

const app = express();
// middleware to accept json as request body
app.use(express.json());

app.post('/planets', (req, res, next) => {
    const planet_name = req.body.name;
    const type = req.body.type;
    const atmosphere = req.body.atmosphere;
    const gravity = req.body.gravity;
    const life = req.body.life;

    // Log the received data for debugging
    console.log(`Name: ${planet_name}, Type: ${type}, Atmosphere: ${atmosphere}, Gravity: ${gravity}, Life: ${life}`);

    // Validate the data
    // Return 400 status code if name or type is absent, or gravity is not a number
    if (!planet_name || !type || Number.isNaN(gravity)) {
        // If any required data is missing or gravity is not a number, return a 400 Bad Request response
        res.sendStatus(400).json({ error: 'Invalid data in the request.' });
        return;
    }

    // attempt to insert the planet into the database
    pool.query(
        'INSERT INTO SolarSystem (planet_name, type, atmosphere, gravity, life) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [planet_name, type, atmosphere, gravity, life]
    )
        .then((data) => {
            // if insertion was hit, send a 201 Created response with the newly created planet
            console.log("Newly created planet: ", data.rows[0]);
            const newPlanet = data.rows[0];
            delete newPlanet.id;
            res.status(201).json(newPlanet);
        })
        .catch((err) => {
            // if an error occurs during the database operation, send a 500 Internal Server Error
            console.error(err);
            res.sendStatus(500).json({ error: 'Internal Server Error' });
        })
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});