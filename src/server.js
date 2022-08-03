const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const {ContainerDB} = require('./containers/ContainerDB')
const {configMySQL, configSQLite3} = require('./configDB');


const app = express();
const server = http.createServer(app);
const io = new Server(server);


const messagesApi = new ContainerDB(configSQLite3.config, configSQLite3.table);
const productsApi = new ContainerDB(configMySQL.config, configMySQL.table);


io.on('connection', async (socket) => {
	console.log('Un cliente se ha conectado');

	const products = await productsApi.getAll()
	const chat = await messagesApi.getAll()
	socket.emit('products', products);
	socket.emit('chat', chat);

	socket.on('new-product', async (data) => {
		await productsApi.save(data)
		const products = await productsApi.getAll()
		io.sockets.emit('products', products);
	});

	socket.on('new-message', async (data) => {
		await messagesApi.save(data);
		const chat = await messagesApi.getAll();
		io.sockets.emit('chat', chat);
	});
});

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});



const PORT = process.env.PORT || 8080;

const srv = server.listen(PORT, () => {
	console.log(
		`Servidor Http con Websockets escuchando en el puerto ${srv.address().port}`
	);
});
srv.on('error', (error) => console.log(`Error en servidor ${error}`));
