const sharp = require('sharp');
const { connectToDatabase, toObjectId } = require('../db');
const { put, del } = require('@vercel/blob');

const getAll = async (req, res) => {
	const db = await connectToDatabase();
	const client = db.client;
	try {
		const freelancersCollection = db.collection('freelancers');
		const freelancers = await freelancersCollection.find().toArray();
		res.status(200).json(freelancers);
	} catch (err) {
		console.error('Error when listing freelancers:', err);
		res.status(500).json({ message: 'internal server error' });
	} finally {
		await client.close();
	}
};

const create = async (req, res) => {
	const db = await connectToDatabase();
	const client = db.client;
	const freelancer = req.body;
	try {
		freelancer.cpf = freelancer.cpf.replace(/\D/g, '');
		freelancer.phone = freelancer.phone.replace(/\D/g, '');
		freelancer.emergencyPhone = freelancer.emergencyPhone.replace(/\D/g,'');

		const freelancersCollection = db.collection('freelancers');

		const existingFreelancer = await freelancersCollection.findOne({
			cpf: freelancer.cpf,
		});
		if (existingFreelancer) {
			return res
				.status(409)
				.json({ message: 'CPF already registered! ' });
		}

		const profilePicture = req.files['profilePicture'][0];
		const facePicture = req.files['facePicture'][0];

		const pfpFileName = `pfp_${freelancer.cpf}.jpeg`;
		const fcpFileName = `fcp_${freelancer.cpf}.jpeg`;

		const pfpFile = await sharp(profilePicture.buffer)
			.resize(300, 300)
			.jpeg({ quality: 80 });
		const fcpFile = await sharp(facePicture.buffer)
			.resize(300, 300)
			.jpeg({ quality: 80 });

		await put(pfpFileName, pfpFile, {
			access: 'public',
			addRandomSuffix: false,
		});
		await put(fcpFileName, fcpFile, {
			access: 'public',
			addRandomSuffix: false,
		});

		freelancer.profilePicture = pfpFileName;
		freelancer.facePicture = fcpFileName;

		await freelancersCollection.insertOne(req.body);
		res.status(201).json(req.body);
	} catch (err) {
		console.error('Error when creating a freelancer:', err);
		res.status(500).json({ message: 'internal server error' });
	} finally {
		await client.close();
	}
};

const remove = async (req, res) => {
	const { id } = req.params;
	const db = await connectToDatabase();
	const client = db.client;
	try {
		const freelancersCollection = db.collection('freelancers');
		const freelancer = await freelancersCollection.findOne({
			_id: toObjectId(id),
		});

		const pfpURL = `https://ub7txpxyf1bghrmk.public.blob.vercel-storage.com/${freelancer.profilePicture}`
		const fcpURL = `https://ub7txpxyf1bghrmk.public.blob.vercel-storage.com/${freelancer.facePicture}`;

		await del([pfpURL, fcpURL]);

		await freelancersCollection.deleteOne({ _id: toObjectId(id) });
		res.status(200).json({
			message: 'user successfully deleted from database',
		});
	} catch (err) {
		console.error('Error when deleting user from database:', err);
		res.status(500).json({ message: 'internal server error' });
	} finally {
		await client.close();
	}
};

const getByCity = async (req, res) => {
	const db = await connectToDatabase();
	const client = db.client;
	const { city } = req.params;
	try {
		const freelancersCollection = db.collection('freelancers');
		const freelancersFromCity = await freelancersCollection
			.find({ city: city })
			.toArray();
		res.status(200).json(freelancersFromCity);
	} catch (err) {
		console.error('Error when querying by cities:', err);
		res.status(500).json({ message: 'internal server error' });
	} finally {
		client.close();
	}
};

//ONLY FOR DEVELOPMENT
const wipe = async (req, res) => {
	const db = await connectToDatabase();
	const client = db.client;
	try {
		const freelancersCollection = db.collection('freelancers');
		await freelancersCollection.deleteMany();
		res.status(200).json({ message: 'database successfully wiped' });
	} catch (err) {
		console.error('Error when wiping database:', err);
		res.status(500).json({ message: 'internal server error' });
	} finally {
		await client.close();
	}
};

module.exports = {
	getAll,
	getByCity,
	create,
	wipe,
	remove,
};
