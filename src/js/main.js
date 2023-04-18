const statusEl = document.getElementById('status');
const dataEl = document.getElementById('data');
const headersEl = document.getElementById('headers');
const configEl = document.getElementById('config');
const baseUrl = 'https://jsonplaceholder.typicode.com';

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
			err => handleError(err)
		);
}

const post = () => {
	const data = {
		"title": "foo",
		"body": "foo",
		"userId": 1,
	};

	axios.post(`${baseUrl}/posts`, data)
		.then((response) => {
			renderOutput(response);
		})
		.catch
}

const put = () => {
	console.log('put');
}

const patch = () => {
	console.log('patch');
}

const del = () => {
	console.log('delete');
}

const multiple = () => {
	console.log('multiple');
}

const transform = () => {
	console.log('transform');
}

const errorHandling = () => {
	console.log('errorHandling');
}

const cancel = () => {
	console.log('cancel');
}

const clear = () => {
	statusEl.innerHTML = '';
	statusEl.className = '';
	dataEl.innerHTML = '';
	headersEl.innerHTML = '';
	configEl.innerHTML = '';
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
