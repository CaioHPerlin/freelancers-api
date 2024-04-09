const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();

const PORT = process.env.DEV_PORT;

app.get('/', (req, res) => {
    res.status(200).send("the API is running nicely")   
});

app.listen(
    PORT,
    () => console.log(`Running on http://localhost:${PORT}`)
);