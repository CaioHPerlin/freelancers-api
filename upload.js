const multer = require('multer');

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
