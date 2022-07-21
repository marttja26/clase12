let socket = io.connect();

socket.on('productos', (data) => {
	if (data.length > 0 ) {
		const productsList  = data.map(function (product) {
			return `<thead>
		<tr>
			<td class="align-middle" scope="row">${product.id}</td>
			<td class="align-middle">${product.title}</td>
			<td class="align-middle">${product.price}$</td>
			<td class="align-middle">
				<img
					src=${product.thumbnail}
					alt="imagen del producto"
					style="width: 100px"
				/>
			</td>
		</tr>
	</thead>`;
		})
		.join(' ');
		const table = `<table class="table mt-3" id="productList">
		<thead>
			<tr>
				<th class="align-middle" scope="col">#</th>
				<th class="align-middle" scope="col">Nombre</th>
				<th class="align-middle" scope="col">Precio</th>
				<th class="align-middle" scope="col">Imagen</th>
			</tr>
		</thead>
		${productsList}
	</table>`
	document.getElementById('productList').innerHTML = table;
	}	else {
		document.getElementById('productList').innerHTML = `<h2>No se encontraron productos.</h2>`;
	}
	
});

socket.on('chat', (data) => {
	const chat = data.map(function (elem) {
		return `<div>
            <strong style="color: blue">${elem.email} - <span style="color: brown">${elem.date}</span></strong>: 
            <em style="color: green">${elem.message}</em> </div>
    `;
	})
	.join(' ');
document.getElementById('chatBox').innerHTML = chat;
})

const addProduct = (e) => {
	e.preventDefault
	const product = {
		title: e.title.value,
		price: e.price.value,
		thumbnail: e.thumbnail.value,
	};


	socket.emit('new-product', product);

	const inputs = document.querySelectorAll('.form-control')
	inputs.forEach(input => {
		input.value = ''
	});
	return false;
};

const addMessage = (e) => {
	e.preventDefault
	const mensaje = {
		email: e.email.value,
		message: e.message.value,
		date : new Date().toLocaleString('es-AR')
	};

	socket.emit('new-message', mensaje);


	document.getElementById('email').value = '';
	document.getElementById('message').value = '';
	document.getElementById('message').focus();

	return false;
};
