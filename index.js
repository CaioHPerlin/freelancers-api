const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();

const freelancerController = require('./controllers/freelancerController')
const PORT = process.env.DEV_PORT;

//Middleware
app.use(express.json());

//CRUD Routes
app.get('https://sebrae-api.onrender.com/freelancers', freelancerController.getAll);
app.post('https://sebrae-api.onrender.com/freelancers', freelancerController.create);
app.delete('https://sebrae-api.onrender.com/freelancers', freelancerController.remove)

//Filter Routes
app.get('/freelancers/:city', freelancerController.getByCity);

//DEVROUTES
app.delete('/freelancers', freelancerController.wipe);

app.listen(
    PORT,
    () => console.log(`Running on http://localhost:${PORT}`)
);