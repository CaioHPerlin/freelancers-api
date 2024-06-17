const { Pool } = require('pg');

const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;

pool = new Pool({
	user: 'nkarbits_admin',
	host: '186.250.240.92',
	database: 'nkarbits_freelancer_db',
	password: DATABASE_PASSWORD,
	port: 5432,
});

const checkConnection = async () => {
	try {
		const res = await pool.query('SELECT NOW()');
		console.log('Succesfully connected to database. Rows:', res.rows);
	} catch (err) {
		console.error('Error when connecting to the database:', err.stack);
	}
};

checkConnection();

module.exports = pool;
