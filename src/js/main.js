const statusEl = document.getElementById('status');
const dataEl = document.getElementById('data');
const headersEl = document.getElementById('headers');
const configEl = document.getElementById('config');
const baseUrl = 'https://jsonplaceholder.typicode.com';

// Adiciona um interceptador na requisição
// Exemplo, poder servir pra injetar alguma configuração, como um Authorization ou Autentication, JWT ou coisas parecidas, no header da requisição
axios.interceptors.request.use(function (config) {
	// Faz alguma coisa antes da requisição ser enviada
	// adicionndo um novo parâmetro na interceptação de uma requisição
	config.headers.MyAuthorization = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

	config.data = {
		first_name: "Bruno Silva"
	};

	//console.log(config.headers);

	return config;
}, function (error) {
	// Faz alguma coisa com o erro da requisição
	return Promise.reject(error);
});

// Adiciona um interceptador na resposta
// Exemplo, pode servir como um .catch global, aja visto que ele identifica o erro da request antes de finalizar o método .then de uma requisição
axios.interceptors.response.use(function (response) {
	// Qualquer código de status que dentro do limite de 2xx faz com que está função seja acionada
	// Faz alguma coisa com os dados de resposta
	console.log('Sucesso!');
	console.log(response);
	return response;
}, function (error) {
	// Qualquer código de status que não esteja no limite do código 2xx faz com que está função seja acionada
	// Faz alguma coisa com o erro da resposta
	console.log('Deu ruim!');
	return Promise.reject(error);
});

const get = () => {
	/*axios({
			method: 'get',
			url: 'https://jsonplaceholder.typicode.com/posts'
	})*/

	const config = {
		// https://jsonplaceholder.typicode.com/posts?_limit=5 or
		params: {
			_limit: 5
		}
	}

	axios.get(`${baseUrl}/posts`, config)
		.then((response) => {
			renderOutput(response);
		})
		.catch(
			(err) => handleError(err)
		);
}

const post = () => {
	const data = {
		title: "foo",
		body: "foo",
		userId: 1,
	};

	axios.post(`${baseUrl}/posts`, data)
		.then((response) => {
			renderOutput(response);
		})
		.catch(
			(err) => handleError(err)
		);
}

const put = () => {
	// atualiza todo um "objeto" na requisição (replace)
	const data = {
		title: "foo",
		body: "foo",
		userId: 1,
	};

	axios.put(`${baseUrl}/posts/1`, data)
		.then((response) => renderOutput(response))
}

const patch = () => {
	// atualiza parte de um "objeto" em uma requisição (correção)
	const data = {
		title: "patchaed foo",
	};

	axios.patch(`${baseUrl}/posts/1`, data)
		.then((response) => renderOutput(response))
}

const del = () => {

	axios.delete(`${baseUrl}/posts/1`)
		.then((response) => renderOutput(response))
		.catch((err) => handleError(err))
}

const multiple = () => {

	const config = { params: { _limit: 5 } };

	Promise.all([
		axios.get(`${baseUrl}/posts`, config),
		axios.get(`${baseUrl}/users`, config)
	])
		.then((response) => {
			console.table(response[0].data);
			console.table(response[1].data);
		})
}

const transform = () => {

	const config = {
		params: {
			_limit: 5
		},
		// usado que existe a necessidade de fazer alguma operação no payload da requisição
		// exemplo, adicionar um novo campo.
		transformResponse: [function (data) {
			const payload = JSON.parse(data).map(o => {
				return {
					...o, // todos os atributos que já existem +
					is_selected: false, // esse novo atributo
					title_body: o.title + ' -> ' + o.body // esse novo atributo
				}
			});

			return payload;
		}],
	}

	axios.get(`${baseUrl}/posts`, config)
		.then((response) => renderOutput(response))
}

const errorHandling = () => {
	axios.get(`${baseUrl}/postsz`, config)
		.then((response) => {
			renderOutput(response)
		})
		.catch((error) => {
			renderOutput(error.response);
			handleError(error);
			console.log(error);
			console.log(error.response);
			console.log(error.response.data);
			console.log(error.response.status);
			console.log(error.response.headers);
		});
}

// cancelamento manual de uma request
const cancel = () => {
	const controller = new AbortController();

	const config = {
		params: {
			_limit: 5
		},
		signal: controller.signal
	}

	// caso seja um post, config se torna o terceiro parâmetro
	// axios.post(`${baseUrl}/posts`, data ,config)

	axios.get(`${baseUrl}/pos_ts`, config)
		.then((response) => {
			console.log('passou');
			renderOutput(response);
		})
		.catch((error) => {
			console.log('deu errado');
			console.log(`request status: ${error.message}`);
			console.log(error);
		})

	// simulando um cancelamento manual (cliquei no botão de cancelar em uma requisição)
	console.log('cancelamento "manual"')
	controller.abort();
}

const clear = () => {
	statusEl.innerHTML = '';
	statusEl.className = '';
	dataEl.innerHTML = '';
	headersEl.innerHTML = '';
	configEl.innerHTML = '';
	console.clear();
}

const handleError = (error) => {
	const err = `${error.config.method} request got failed ❌`;
	if (error.response) {
		// erro na requisição
		console.log(`${err}\n\nDATA ERROR\n${error.response.data}\n\nSTATUS CODE\n${error.response.status}\n\nHEADERS\n${error.response.headers}`);
	} else if (error.request) {
		// requisição feita mas nenhuma resposta foi recebida
		// `error.request` é uma instancia de XMLHttpRequest no navegador e uma
		// instância de http.ClientRequest no node.js
		console.log(`${err}\n\nREQUEST ERROR\n\n${error.request}`);
	} else {
		// qualquer erro genérico
		console.log(`${err}\n\nMESSAGE ERROR\n\n${error.message}`);
	}
	console.log(error.config);
}

const renderOutput = (response) => {
	console.log(`${response.config.method} request success ✅`);
	// Status
	const status = response.status;
	statusEl.removeAttribute('class');
	let statusElClass = 'inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium';
	if (status >= 500) {
		statusElClass += ' bg-red-100 text-red-800';
	} else if (status >= 400) {
		statusElClass += ' bg-yellow-100 text-yellow-800';
	} else if (status >= 200) {
		statusElClass += ' bg-green-100 text-green-800';
	}

	statusEl.innerHTML = status;
	statusEl.className = statusElClass;

	// Data
	dataEl.innerHTML = JSON.stringify(response.data, null, 2);
	Prism.highlightElement(dataEl);

	// Headers
	headersEl.innerHTML = JSON.stringify(response.headers, null, 2);
	Prism.highlightElement(headersEl);

	// Config
	configEl.innerHTML = JSON.stringify(response.config, null, 2);
	Prism.highlightElement(configEl);
}

document.getElementById('get').addEventListener('click', get);
document.getElementById('post').addEventListener('click', post);
document.getElementById('put').addEventListener('click', put);
document.getElementById('patch').addEventListener('click', patch);
document.getElementById('delete').addEventListener('click', del);
document.getElementById('multiple').addEventListener('click', multiple);
document.getElementById('transform').addEventListener('click', transform);
document.getElementById('cancel').addEventListener('click', cancel);
document.getElementById('error').addEventListener('click', errorHandling);
document.getElementById('clear').addEventListener('click', clear);
