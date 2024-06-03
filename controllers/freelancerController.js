const sharp = require('sharp');
const pool = require('../db');
const Parser = require('json2csv').Parser;

const getAll = async (req, res) => {
	try {
		const data = (await pool.query('SELECT * FROM freelancer')) || [];
		res.status(200).json(data.rows);
	} catch (err) {
		console.error('Error when listing freelancers:', err);
		res.status(500).json({ message: 'internal server error' });
	}
};

const create = async (req, res) => {
	try {
		const freelancer = req.body;

		freelancer.cpf = freelancer.cpf.replace(/\D/g, '');
		freelancer.phone = freelancer.phone.replace(/\D/g, '');
		freelancer.emergencyPhone = freelancer.emergencyPhone.replace(
			/\D/g,
			''
		);
		freelancer.dream = freelancer.dream.replace(/[^\x00-\xFF]/g, '');
		freelancer.city = freelancer.city.toLowerCase();

		const existingFreelancer = await pool.query(
			'SELECT * FROM freelancer WHERE cpf=$1',
			[freelancer.cpf]
		);

		if (existingFreelancer.rowCount > 0) {
			return res.status(409).json({ message: 'CPF already registered' });
		}

		const pfpFileName = `pfp_${freelancer.cpf}.jpg`;
		const fcpFileName = `fcp_${freelancer.cpf}.jpg`;

		const profilePicture = req.files['profilePicture'][0];
		const facialPicture = req.files['facialPicture'][0];

		await sharp(profilePicture.buffer)
			.resize(300, 300)
			.jpeg({ quality: 80 })
			.toFile('uploads/' + pfpFileName, (err) => {
				err ? console.error(err) : '';
			});

		await sharp(facialPicture.buffer)
			.resize(300, 300)
			.jpeg({ quality: 80 })
			.toFile('uploads/' + fcpFileName, (err) => {
				err ? console.error(err) : '';
			});

		freelancer.profilePicture = pfpFileName;
		freelancer.facialPicture = fcpFileName;

		await pool.query(
			`
			INSERT INTO freelancer (
				"name", "cpf", "phone", "email", "cep", "street", "residential_number",
				"neighborhood", "height", "weight", "hair_color", "eye_color", "birthdate",
				"skin_color", "instagram", "facebook", "state", "city", "emergency_name",
				"emergency_phone", "shirt_size", "pix_key", "complement", "dream",
				"profile_picture", "facial_picture", "education", "course"
			) VALUES (
				$1, $2, $3, $4, $5, $6, $7,
				$8, $9, $10, $11, $12, $13,
				$14, $15, $16, $17, $18, $19,
				$20, $21, $22, $23, $24,
				$25, $26, $27, $28
			);
		`,
			Object.values(freelancer)
		);

		res.status(201).json(freelancer);
	} catch (err) {
		console.error('Error when creating a freelancer:', err);
		res.status(500).json({ message: 'internal server error' });
	}
};
/*
const remove = async (req, res) => {
	const { id } = req.params;
	const db = await connectToDatabase();
	const client = db.client;
	try {
		const freelancersCollection = db.collection('freelancers');
		const freelancer = await freelancersCollection.findOne({
			_id: toObjectId(id),
		});

		const pfpURL = `uploads/${freelancer.profilePicture}`;
		const fcpURL = `uploads/${freelancer.facePicture}`;

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

		const csvParser = new Parser({
			fields: fields,
			delimiter: ';',
			defaultValue: '-',
			excelStrings: true,
		});
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
*/
module.exports = {
	getAll,
	create,
};
