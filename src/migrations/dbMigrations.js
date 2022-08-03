const knex = require('knex');
const { configMySQL, configSQLite3 } = require('../configDB');
(async () => {
	try {
		const dbClient = knex(configSQLite3.config);
		await dbClient.schema.hasTable(configSQLite3.table).then((exists) => {
			if (!exists) {
				return dbClient.schema.createTable(configSQLite3.table, (table) => {
					table.increments('id').primary();
					table.string('email');
					table.string('message');
					table.string('date');
				});
			}
		});
		await dbClient.destroy();
		console.log('se creo la tabla');
	} catch (error) {
		console.log(error);
	}
})();
(async () => {
	try {
		const dbClient = knex(configMySQL.config);

		await dbClient.schema.hasTable(configMySQL.table).then((exists) => {
			if (!exists) {
				return dbClient.schema.createTable(configMySQL.table, (table) => {
					table.increments('id').primary();
					table.string('title');
					table.string('price');
					table.string('thumbnail');
				});
			}
		});
		
		await dbClient.destroy();
		console.log('se creo la tabla');
	} catch (error) {
		console.log(error);
	}
})();
