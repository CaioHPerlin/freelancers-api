require('dotenv').config();

const express = require('express');
const app = express();

const path = require('path');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const upload = require('./upload');

const freelancerController = require('./controllers/freelancerController');

// Middleware
app.use(cors());
app.use(express.json());

app.get('/freelancers/helloworld', (req, res) => {
	res.status(200).json({ message: 'hello world' });
});

// Static file serving
app.use(
	'/freelancers/uploads',
	express.static(path.join(__dirname, 'uploads'))
);

//Freelancers
app.get('/freelancers', freelancerController.getAll);
app.get('/freelancers/export', freelancerController.exportCSV);
app.get('/freelancers/:id', freelancerController.getOne);
app.post(
	'/freelancers',
	upload.fields([
		{ name: 'profilePicture', maxCount: 1 },
		{ name: 'facialPicture', maxCount: 1 },
	]), // Handle file upload through multer
	freelancerController.create
);
app.put(
	'/freelancers/:id',
	upload.fields([
		{ name: 'profilePicture', maxCount: 1 },
		{ name: 'facialPicture', maxCount: 1 },
	]), // Handle file upload through multer
	freelancerController.update
);
app.delete('/freelancers/:id', freelancerController.remove);

// Auth
const adminUser = {
	username: process.env.ADMIN_USERNAME,
	password: process.env.ADMIN_PASSWORD,
};

app.post('/auth', async (req, res) => {
	try {
		console.log(req.body);
		const { username, password } = req.body;

		if (adminUser.username == username) {
			console.log('username!');
			const match = await bcrypt.compare(password, adminUser.password);
			if (match) {
				console.log('password!');
				const token = jwt.sign(
					{ username: username },
					process.env.SECRET,
					{
						expiresIn: '1h',
					}
				);
				return res.status(200).json({
					message: 'Authentication successfull',
					token: token,
				});
			}
		}

		console.error('Bad credentials', req.body);
		res.status(401).json({ message: 'Incorrect credentials.' });
	} catch (err) {
		console.error('Error when authenticating:', err);
		res.status(500).json({ message: 'Internal server error.' });
	}
});

const listener = app.listen(() => {
	console.log(`http://localhost:${listener.address().port}`);
});
