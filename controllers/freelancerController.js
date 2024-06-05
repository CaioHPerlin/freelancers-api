const fs = require('fs/promises');
const path = require('path');
const sharp = require('sharp');
const pool = require('../db');
const Parser = require('json2csv').Parser;

const getAll = async (req, res) => {
	try {
		let query = `SELECT * FROM freelancer WHERE LOWER(name) LIKE $1`;
		let params = [`%${req.query.name || ''}%`];

		if (req.query.city) {
			query += ` AND LOWER(city) LIKE $2`;
			params = [...params, `%${req.query.city}%`];
		}

		const data = (await pool.query(query + ` ORDER BY name`, params)) || [];
		res.status(200).json(data.rows);
	} catch (err) {
		console.error('Error when listing freelancers:', err);
		res.status(500).json({ message: 'internal server error', error: err });
	}
};

const getOne = async (req, res) => {
	try {
		const { id } = req.params;

		const data = await pool.query('SELECT * FROM freelancer WHERE _id=$1', [
			id,
		]);

		res.status(200).json(data.rows[0]);
	} catch (err) {
		console.error('Error when getting one freelancer:', err);
		res.status(500).json({ message: 'internal server error', error: err });
	}
};

const orderFreelancer = (freelancer) => {
	return {
		name: freelancer.name,
		cpf: freelancer.cpf,
		phone: freelancer.phone,
		email: freelancer.email,
		cep: freelancer.cep,
		street: freelancer.street,
		residential_number: freelancer.residentialNumber,
		neighborhood: freelancer.neighborhood,
		height: freelancer.height,
		weight: freelancer.weight,
		hair_color: freelancer.hairColor,
		eye_color: freelancer.eyeColor,
		birthdate: freelancer.birthdate,
		skin_color: freelancer.skinColor,
		instagram: freelancer.instagram,
		facebook: freelancer.facebook,
		state: freelancer.state,
		city: freelancer.city,
		emergency_name: freelancer.emergencyName,
		emergency_phone: freelancer.emergencyPhone,
		shirt_size: freelancer.shirtSize,
		pix_key: freelancer.pixKey,
		complement: freelancer.complement,
		dream: freelancer.dream,
		profile_picture: freelancer.profilePicture,
		facial_picture: freelancer.facialPicture,
		education: freelancer.education,
		course: freelancer.course,
	};
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

		const data = await pool.query('SELECT * FROM freelancer WHERE cpf=$1', [
			freelancer.cpf,
		]);

		if (data.rowCount > 0) {
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

		const orderedFreelancer = orderFreelancer(freelancer);

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
			Object.values(orderedFreelancer)
		);

		res.status(201).json(orderedFreelancer);
	} catch (err) {
		console.error('Error when creating a freelancer:', err);
		res.status(500).json({ message: 'internal server error', error: err });
	}
};

const update = async (req, res) => {
	try {
		// Check if freelancer exists on database
		const { id } = req.params;

		const data = await pool.query('SELECT * FROM freelancer WHERE _id=$1', [
			id,
		]);

		if (data.rowCount < 1) {
			return res
				.status(404)
				.json({ message: `freelancer of id ${id} not found` });
		}

		//Delete old files
		const previousFreelancer = data.rows[0];
		try {
			await fs.unlink(
				path.join(
					__dirname,
					'..',
					'uploads',
					previousFreelancer.profile_picture
				)
			);
			await fs.unlink(
				path.join(
					__dirname,
					'..',
					'uploads',
					previousFreelancer.facial_picture
				)
			);
		} catch (err) {
			console.warn(
				'Unable to delete image files from previous freelancer:',
				err
			);
		}

		// Handle req data
		const freelancer = req.body;

		freelancer.cpf = freelancer.cpf.replace(/\D/g, '');
		freelancer.phone = freelancer.phone.replace(/\D/g, '');
		freelancer.emergencyPhone = freelancer.emergencyPhone.replace(
			/\D/g,
			''
		);
		freelancer.dream = freelancer.dream.replace(/[^\x00-\xFF]/g, '');
		freelancer.city = freelancer.city.toLowerCase();

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

		const orderedFreelancer = orderFreelancer(freelancer);

		await pool.query(
			`
			UPDATE freelancer
			SET "name" = $1, "cpf" = $2, "phone" = $3, "email" = $4, "cep" = $5, "street" = $6, "residential_number" = $7,
			"neighborhood" = $8, "height" = $9, "weight" = $10, "hair_color" = $11, "eye_color" = $12, "birthdate" = $13,
			"skin_color" = $14, "instagram" = $15, "facebook" = $16, "state" = $17, "city" = $18, "emergency_name" = $19,
			"emergency_phone" = $20, "shirt_size" = $21, "pix_key" = $22, "complement" = $23, "dream" = $24,
			"profile_picture" = $25, "facial_picture" = $26, "education" = $27, "course" = $28
			WHERE _id=$29
		`,
			[...Object.values(orderedFreelancer), id]
		);

		res.status(200).json(orderedFreelancer);
	} catch (err) {
		console.error('Error when updating freelancer:', err);
		res.status(500).json({ message: 'internal server error', error: err });
	}
};

const remove = async (req, res) => {
	try {
		// Check if freelancer exists on database
		const { id } = req.params;

		const data = await pool.query('SELECT * FROM freelancer WHERE _id=$1', [
			id,
		]);

		if (data.rowCount < 1) {
			return res
				.status(404)
				.json({ message: `freelancer of id ${id} not found` });
		}

		const freelancer = data.rows[0];

		// Delete freelancer from database first
		await pool.query('DELETE FROM freelancer WHERE _id = $1', [id]);
		res.status(200).json({
			message: 'user successfully deleted from database',
		});
		console.info(`Freelancer ${freelancer.name} deleted from database`);

		// Then delete their files
		try {
			await fs.unlink(
				path.join(
					__dirname,
					'..',
					'uploads',
					freelancer.profile_picture
				)
			);
			await fs.unlink(
				path.join(__dirname, '..', 'uploads', freelancer.facial_picture)
			);
		} catch (err) {
			console.warn(
				'Unable to delete image files from the above freelancer:',
				err
			);
		}
	} catch (err) {
		console.error('Error when deleting user from database:', err);
		res.status(500).json({ message: 'internal server error', error: err });
	}
};

const exportCSV = async (req, res) => {
	try {
		let query = `SELECT * FROM freelancer WHERE LOWER(name) LIKE $1`;
		let params = [`%${req.query.name || ''}%`];

		if (req.query.city) {
			query += ` AND LOWER(city) LIKE $2`;
			params = [...params, `%${req.query.city}%`];
		}

		const data = (await pool.query(query + ` ORDER BY name`, params)) || [];
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
				value: 'residential_number',
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
				label: 'Data de Nascimento',
				value: 'birthdate',
			},
			{
				label: 'Cor do Cabelo',
				value: 'hair_color',
			},
			{
				label: 'Cor dos Olhos',
				value: 'eye_color',
			},
			{
				label: 'Cor de Pele',
				value: 'skin_color',
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
				value: 'emergency_name',
			},
			{
				label: 'Telefone Emergencial',
				value: 'emergency_phone',
			},
			{
				label: 'Tamanho de Camiseta',
				value: 'shirt_size',
			},
			{
				label: 'Chave PIX',
				value: 'pix_key',
			},
			{
				label: 'Complemento',
				value: 'complement',
			},
			{
				label: 'Sonho',
				value: 'dream',
			},
			{
				label: 'Grau de Escolaridade',
				value: 'education',
			},
			{
				label: 'Curso',
				value: 'course',
			},
		];

		const csvParser = new Parser({
			fields: fields,
			delimiter: ';',
			defaultValue: '-',
			excelStrings: true,
		});
		const csvData = csvParser.parse(data.rows);

		res.type('text/csv');
		res.attachment('dadosFreelancers.csv');

		res.status(200).send(csvData);
	} catch (err) {
		console.error('Error exporting to csv:', err);
		res.status(500).json({ message: 'internal server error', error: err });
	}
};

module.exports = {
	getAll,
	getOne,
	create,
	update,
	remove,
	exportCSV,
};
