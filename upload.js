const multer = require('multer');

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads');
	},
	filename: (req, file, cb) => {
		const fileName = `${req.body.cpf}_${file.fieldname}.png`;
		cb(null, fileName);
	},
});

const upload = multer({ storage: storage });

module.exports = upload;
