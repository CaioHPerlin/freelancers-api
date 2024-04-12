const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();

const freelancerController = require('./controllers/freelancerController')
const PORT = process.env.DEV_PORT;

//Middleware
app.use(express.json());

//Routes
app.get('/freelancers/:city', freelancerController.getByCity);
app.get('/freelancers', freelancerController.getAll);
app.post('/freelancers', freelancerController.create);
//DEVROUTES
app.delete('/freelancers', freelancerController.wipe);

app.listen(
    PORT,
    () => console.log(`Running on http://localhost:${PORT}`)
);