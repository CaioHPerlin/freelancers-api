const sharp = require('sharp');
const { connectToDatabase, toObjectId } = require('../db');
const { put, del } = require('@vercel/blob');
const Parser = require('json2csv').Parser;

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
		freelancer.emergencyPhone = freelancer.emergencyPhone.replace(
			/\D/g,
			''
		);
		freelancer.city = freelancer.city.toLowerCase();

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

		const pfpURL = `https://ub7txpxyf1bghrmk.public.blob.vercel-storage.com/${freelancer.profilePicture}`;
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

const getCSV = async (req, res) => {
	const db = await connectToDatabase();
	const client = db.client;
	try {
		const freelancersCollection = db.collection('freelancers');
		const freelancers = await freelancersCollection
			.find({}, { _id: 0 })
			.toArray();

		const fields = [
			{
				label: 'Nome Completo',
				value: 'name',
			},
			{
				label: 'CPF',
				value: 'cpf',
			},
			{
				label: 'Telefone',
				value: 'phone',
			},
			{
				label: 'E-mail',
				value: 'email',
			},
			{
				label: 'CEP',
				value: 'cep',
			},
			{
				label: 'Rua',
				value: 'street',
			},
			{
				label: 'Número Residencial',
				value: 'residentialNumber',
			},
			{
				label: 'Bairro',
				value: 'neighborhood',
			},
			{
				label: 'Altura (cm)',
				value: 'height',
			},
			{
				label: 'Peso (kg)',
				value: 'weight',
			},
			{
				label: 'Cor do Cabelo',
				value: 'hairColor',
			},
			{
				label: 'Cor dos Olhos',
				value: 'eyeColor',
			},
			{
				label: 'Cor de Pele',
				value: 'skinColor',
			},
			{
				label: 'Instagram',
				value: 'instagram',
			},
			{
				label: 'Facebook',
				value: 'facebook',
			},
			{
				label: 'Estado',
				value: 'state',
			},
			{
				label: 'Cidade',
				value: 'city',
			},
			{
				label: 'Contato Emergencial',
				value: 'emergencyName',
			},
			{
				label: 'Telefone Emergencial',
				value: 'emergencyPhone',
			},
			{
				label: 'Tamanho de Camiseta',
				value: 'shirtSize',
			},
			{
				label: 'Chave PIX',
				value: 'pixKey',
			},
			{
				label: 'Complemento',
				value: 'complement',
			},
			{
				label: 'Sonho',
				value: 'dream',
			},
		];

		const csvParser = new Parser({ fields: fields, delimiter: ';', defaultValue: '-', excelStrings: true });
		const csvData = csvParser.parse(freelancers);

		res.type('text/csv');
		res.attachment('dadosFreelancers.csv');

		res.status(200).send(csvData);
	} catch (err) {
		console.error('Error exporting to csv:', err);
		res.status(500).json({ message: 'internal server error' });
	} finally {
		await client.close();
	}
};

module.exports = {
	getAll,
	getByCity,
	getCSV,
	create,
	remove,
};
