const path = require('path');
console.log(path.resolve('DB', 'ecommerce.sqlite'))

const configSQLite3 = {
	table: 'messages',
	config: {
		client: 'sqlite3',
		connection: {
			filename: path.resolve('DB', 'ecommerce.sqlite'),
		},
		useNullAsDefault: true,
	},
};



const configMySQL = {
	table: 'products',
	config: {
		client: 'mysql',
		connection: {
			host: '127.0.0.1',
			port: 3306,
			user: 'root',
			password: '',
			database: 'ecommerce',
		},
	},
};

module.exports = { configMySQL, configSQLite3 };
