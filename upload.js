const multer = require('multer');

// const storage = multer.diskStorage({
// 	destination: (req, file, cb) => {
// 		cb(null, 'uploads');
// 	},
// 	filename: (req, file, cb) => {
// 		const suffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
// 		const fileName = `${req.body.cpf}_${file.fieldname}_${suffix}.png`;
// 		cb(null, fileName);
// 	},
// });

const storage = multer.memoryStorage();

const filter = (req, file, cb) => {
	if (!file.mimetype.startsWith('image/')) {
		return cb(new Error('Only image files are allowed.'), false);
	}
	return cb(null, true);
};

const upload = multer({
	storage: storage,
	fileFilter: filter,
});

module.exports = upload;
