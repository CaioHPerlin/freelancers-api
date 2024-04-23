const dadosfreelancers = document.getElementById('dadosFreelancers');

dadosfreelancers.addEventListener('submit', (evento) => {
	evento.preventDefault();
	const freelancersData = new FormData(dadosfreelancers);
	const loaderContainer = document.getElementById('loadercont')
	loaderContainer.innerHTML = '<h1 class="loader"></h1>';
	fetch('https://sebrae-api.vercel.app/freelancers', {
		method: 'POST',
		body: freelancersData,
	})
		.then((res) => {
			if (!res.ok) {
				return res.json().then((body) => {
					throw new Error(body.message);
				});
			}

			return res.json();
		})
		.then((data) => {
			loaderContainer.innerHTML = '';
			console.log(data);
			window.location.href = '../sucesso/';
		})
		.catch((err) => {
			loaderContainer.innerHTML = '';
			console.error(err);
			alert(err.message);
		});
});

//select api de estados e cidades
const uf = document.querySelector('#state');
const local = document.querySelector('#city');

function selectUF() {
	fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
		.then((response) => {
			return response.json();
		})
		.then((json) => {
			json.sort(function organizar(x, y) {
				let a = x.sigla.toUpperCase(),
					b = y.sigla.toUpperCase();
				return a == b ? 0 : a > b ? 1 : -1;
			});
			for (let i = 0; i < json.length; i++) {
				let newopt = document.createElement('option');
				newopt.setAttribute('value', json[i].id);
				newopt.setAttribute('id', json[i].sigla);
				newopt.innerText = json[i].sigla;
				uf.appendChild(newopt);
			}
		});
}

uf.addEventListener('change', (element) => {
	local.innerHTML = '';
	local.removeAttribute('disabled');
	selectLocal(element.target.value);
});

function selectLocal(selectedUf) {
	local.innerHTML = '<option value="" disabled selected>Selecione</option>';
	fetch(
		`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`
	)
		.then((response) => {
			return response.json();
		})
		.then((json) => {
			json.sort(function organizar(x, y) {
				let a = x.nome.toUpperCase(),
					b = y.nome.toUpperCase();
				return a == b ? 0 : a > b ? 1 : -1;
			});
			for (let i = 0; i < json.length; i++) {
				let newopt = document.createElement('option');
				newopt.setAttribute('value', json[i].nome);
				newopt.innerText = json[i].nome;
				local.appendChild(newopt);
			}
		});
}

window.addEventListener('DOMContentLoaded', () => {
	uf.innerHTML =
		'<option id="optVoid" value="" disabled selected>Selecione</option>';
	selectUF();
});
