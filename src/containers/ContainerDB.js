const knex = require('knex');

class ContainerDB {
	constructor(config, table) {
		this.knex = knex(config);
		this.table = table;
	}

	async getAll() {
		try {
			return await this.knex.select().from(this.table);
		} catch (error) {
			throw new Error(`Ocurrio un error al obtener el elemento ${error}`);
		}
	}

	async get(id) {
		try {
			return await this.knex.select().from(this.table).where('id', id).first();
		} catch (error) {
			throw new Error(`Ocurrio un error al obtener el elemento con el id ${id} ${error}`);
		}
	}

	async save(element) {
		try {
			return await this.knex(this.table).insert(element)
		} catch (error) {
			throw new Error(`Ocurrio un error al guardar ${error}`);
		}
	}

	async update(element, id) {
		try {
			return await this.knex(this.table).where('id', id).update(element)
		} catch (error) {
			throw new Error(`Ocurrio un error al guardar ${error}`);
		}
	}

	async delete(id) {
		try {
			return await this.knex(this.table).where('id', id).del()
		} catch (error) {
			throw new Error(`Ocurrio un error al borrar el elemento con el id ${id} ${error}`);
		}
	}

	async deleteAll() {
		try {
			return await this.knex(this.table).truncate()
		} catch (error) {
			throw new Error(`Ocurrio un error al borrar ${error}`);
		}
	}
}

module.exports = {ContainerDB}