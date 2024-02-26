//  this is for server side speak
import express from "express";
// import dotenv and set doten.config object 
import dotenv from "dotenv";
dotenv.config();

// this is for DB speak plus more features
import pg from "pg";

const PORT = process.env.PORT || 8001;

const pool = new pg.Pool({
    connectionString:process.env.DATABASE_URL
});

const app = express();
// middleware to accept json as request body
app.use(express.json());


// function handlePost(req, res) { ... }
// handlePost({ body: "...", params: "...", Headers: "..." }, { status: 200, data: "..."});

/*
const exampleRequest = {
    headers: {
        "Content-type":"application/json",
        ...
    },
    params: {
        "id":"1"
    },
    body: {
        "name": "Aalderan",
        "type": "Asteroid Belt",
        "atmosphere": "none"
    }
}
*/

// Add planet
app.post('/planets', (req, res, next) => {
    const planet_name = req.body.name;
    const type = req.body.type;
    const atmosphere = req.body.atmosphere;
    const gravity = req.body.gravity;
    const life = req.body.life;

    // const { planet_name, type, atmosphere, gravity, life } = req.body;

    console.log(`Planet: ${planet_name}, Type: ${type}, Atmosphere: ${atmosphere}, Gravity: ${gravity}, Life: ${life}`);

    // if planet name is falsy OR type is falsy OR gravity is not a number
    if (!planet_name || !type || Number.isNaN(gravity)) {
        res.status(400).send({ error: 'Invalid data in the request.' });
        return; // This return statement ensures no further code in this route is executed after sending the response
    }

    pool.query(
        'INSERT INTO solarSystem (planet_name, type, atmosphere, gravity, life) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [planet_name, type, atmosphere, gravity, life]
    )
        .then((data) => {
            const newPlanet = data.rows[0];
            res.status(201).json(newPlanet);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        });
});

// Get all planets
app.get('/planets', (req, res, next) => {
    pool.query('SELECT * FROM SolarSystem')
    .then((data) => {
        console.log("All planets: ", JSON.stringify(data.rows, null, 2));
        res.json(data.rows);
    })
    .catch((err) => {
        console.error("Error querying from SolarSystem", err);
        res.sendStatus(500);
    });
});

// Get planet at specified index
app.get('/planets/:planetId', (req, res, next) => {
    const planetId = Number.parseInt(req.params.planetId);
    console.log("Using planet id ", planetId);
    pool.query(`SELECT planet_name, type, atmosphere, gravity, life FROM SolarSystem WHERE id = $1`, [planetId])
        .then((data) => {
            if (data.rows.length == 0) {
                res.sendStatus(404);
                return
            }
            console.log(data.rows[0]);
            res.json(data.rows[0]);
        })
        .catch((err) => {
            console.log(err);
            res.sendStatus(500);
        });
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});