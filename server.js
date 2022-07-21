const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
const fs = require('fs');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});

class Contenedor {
	constructor(ruta) {
		this.ruta = ruta;
	}

	async save(objeto) {
		try {
			const objetos = JSON.parse(
				await fs.promises.readFile(this.ruta, 'utf-8')
			);
			const idList = objetos.map((a) => a.id);
			const largestId = idList.reduce((a, b) => {
				return Math.max(a, b);
			}, 0);
			const newId = largestId + 1;
			objetos.push({ ...objeto, id: newId || 1 });
			await fs.promises.writeFile(this.ruta, JSON.stringify(objetos));
		} catch (error) {
			console.log(`Hubo un error al leer el archivo ${error}`);
		}
	}

	async getAll() {
		try {
			const objetos = JSON.parse(
				await fs.promises.readFile(this.ruta, 'utf-8')
			);
			return objetos;
		} catch (error) {
			console.log(`Hubo un error ${error}`);
		}
	}
}

const mensajes = new Contenedor('./chat.txt');
const products = new Contenedor('./products.txt');


io.on('connection', async (socket) => {
	console.log('Un cliente se ha conectado');

	const productos = await products.getAll()
	const chat = await mensajes.getAll()
	socket.emit('productos', productos);
	socket.emit('chat', chat);

	socket.on('new-product', async (data) => {
		await products.save(data)
		const productos = await products.getAll()
		io.sockets.emit('productos', productos);
	});

	socket.on('new-message', async (data) => {
		await mensajes.save(data);
		const chat = await mensajes.getAll();
		io.sockets.emit('chat', chat);
	});
});

const PORT = process.env.PORT || 8080;

const srv = server.listen(PORT, () => {
	console.log(
		`Servidor Http con Websockets escuchando en el puerto ${srv.address().port}`
	);
});
srv.on('error', (error) => console.log(`Error en servidor ${error}`));
