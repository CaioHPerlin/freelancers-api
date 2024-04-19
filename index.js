const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const upload = require('./upload');

dotenv.config();

const PORT = process.env.DEV_PORT || 8080;

const freelancerController = require('./controllers/freelancerController');

// const corsOptions = {
//     origin: ["http://localhost:5500", `http://localhost:${PORT}`],
//     methods: "GET,PUT,POST,DELETE",
//     allowedHeaders:"Content-Type, Authorization",
//     credentials: true
// };

//Middleware
app.use(cors());
app.use('/uploads', express.static('uploads'));

//Freelancers
app.get('/freelancers', freelancerController.getAll);
app.post(
	'/freelancers',
    upload.fields([{ name: 'profilePicture', maxCount: 1 }, { name: 'facePicture', maxCount: 1 }]), //Handle file upload through multer middleware
	freelancerController.create
);
app.delete('/freelancers/:id', freelancerController.remove);
app.get('/freelancers/:city', freelancerController.getByCity);

//DEVROUTES - DELETE WHEN IN PRODUCTION
app.delete('/freelancers', freelancerController.wipe);

app.listen(PORT, () => console.log(`Running on http://localhost:${PORT}`));
