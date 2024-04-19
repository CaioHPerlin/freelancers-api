const multer = require('multer');
const fs = require('fs');

if (!fs.existsSync('./uploads')){
    fs.mkdirSync('./uploads');
}

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads');
	},
	filename: (req, file, cb) => {
		const fileName = `${req.body.cpf}_${file.fieldname}`;
		cb(null, fileName);
	},
});

const upload = multer({ storage: storage });

module.exports = upload;
