const multer = require('multer');

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads');
	},
	filename: (req, file, cb) => {
		const suffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
		const fileName = `${req.body.cpf}_${file.fieldname}_${suffix}.png`;
		cb(null, fileName);
	},
});

const upload = multer({ storage: storage });

module.exports = upload;
