const express = require('express');
const app = express();

const freelancerController = require('./controllers/freelancerController');

require('dotenv').config();
const PORT = process.env.DEV_PORT;

const cors = require('cors');

const corsOptions = {
    origin: ["http://localhost:5500", `http://localhost:${PORT}`],
    methods: "GET,PUT,POST,DELETE",
    allowedHeaders:"Content-Type, Authorization",
    credentials: true
};

//Middleware
app.use(express.json());
app.use(cors(corsOptions));

//Freelancers
app.get('/freelancers', freelancerController.getAll);
app.post('/freelancers', freelancerController.create);
app.delete('/freelancers/:id', freelancerController.remove)
app.get('/freelancers/:city', freelancerController.getByCity);

//DEVROUTES - DELETE WHEN IN PRODUCTION
app.delete('/freelancers', freelancerController.wipe);

app.listen(
    PORT,
    () => console.log(`Running on http://localhost:${PORT}`)
);