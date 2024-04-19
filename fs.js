const fs = require('fs');

const deleteFiles = (files, callback) => {
	let i = files.length;
	files.forEach(filepath => {
		fs.unlink(filepath, err => {
			i--;
			if (err) {
				callback(err);
				return;
			} else if (i <= 0) {
				callback(null);
			}
		});
	});
};

module.exports = {
    deleteFiles,
}