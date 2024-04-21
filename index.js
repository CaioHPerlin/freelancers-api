const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const upload = require('./upload');

dotenv.config();

const freelancerController = require('./controllers/freelancerController');

//Middleware
app.use(cors());

//Freelancers
app.get('/freelancers', freelancerController.getAll);
app.get('/freelancers/:city', freelancerController.getByCity);
app.post(
	'/freelancers',
    upload.fields([{ name: 'profilePicture', maxCount: 1 }, { name: 'facePicture', maxCount: 1 }]), //Handle file upload through multer middleware
	freelancerController.create
);
app.delete('/freelancers/:id', freelancerController.remove);

//DEVROUTES - DELETE WHEN IN PRODUCTION
app.delete('/freelancers', freelancerController.wipe);

export default app;