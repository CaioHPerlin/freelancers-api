const checkSession = () => {
	const token = window.localStorage.getItem('token');

	if (!token) window.location.href = '/freelancers/login';
};

checkSession();
let currentName, currentCity, currentRole;

window.onload = renderFreelancers();

async function renderFreelancers(name = '', city = '', role = '') {
	currentName = name;
	currentCity = city;
	currentRole = role;

	const freelancersContainer = document.getElementById('freelancers');
	freelancersContainer.innerHTML = '<h1 class="loader"></h1>'; // Limpa o conteúdo anterior

	const data = await fetchFreelancers(name, city, role);
	const freelancers = await data.json();
	console.log(freelancers);

	if (!freelancers.length) {
		freelancersContainer.innerHTML = `<p class="full-size">0 registros encontrados. Certifique-se de que as informações inseridas estão corretas.</p>`;
		return;
	}

	freelancers.sort((a, b) => {
		// Ordena os freelancers pelo nome em ordem alfabética
		return a.name.localeCompare(b.name);
	});

	freelancersContainer.innerHTML = '';

	freelancers.forEach((freelancer) => {
		const card = createCard(freelancer);
		freelancersContainer.appendChild(card);
	});
}

async function fetchFreelancers(name, city, role) {
	const url = `https://api.nkarbits.com.br/freelancers?name=${name}&city=${city}&role=${role}`;

	try {
		const response = await fetch(url);
		const data = await response;
		return data;
	} catch (error) {
		console.error('Error fetching data:', error);
		renderFreelancers(name, city, role);
	}
}

function createCard(freelancer) {
	const card = document.createElement('div');
	card.classList.add('card');

	const name = document.createElement('h2');
	name.textContent = freelancer.name;
	name.style = 'text-transform: capitalize;';
	card.appendChild(name);

	const profilePicture = document.createElement('img');
	profilePicture.src = `https://api.nkarbits.com.br/freelancers/uploads/pfp_${freelancer.cpf}.jpeg`;
	profilePicture.alt = 'Profile Picture';
	card.appendChild(profilePicture);

	const location = document.createElement('p');
	location.textContent = `Cidade: ${freelancer.city}`;
	location.style = 'text-transform: capitalize;';
	card.appendChild(location);

	const grade = document.createElement('p');
	grade.textContent = `Nota: ${freelancer.grade}`;
	grade.style = 'text-transform: capitalize; padding:0; margin-bottom:8px';
	card.appendChild(grade);

	const verMaisButton = document.createElement('button');
	verMaisButton.textContent = 'Ver Mais';
	verMaisButton.addEventListener('click', () => showDetails(freelancer));
	card.appendChild(verMaisButton);

	return card;
}

function showDetails(freelancer) {
	window.location.href = `./detalhes/?freelancer=${encodeURIComponent(
		JSON.stringify(freelancer)
	)}`;
}

document
	.getElementById('filterForm')
	.addEventListener('submit', async function (event) {
		event.preventDefault();
		const name = document.getElementById('name').value.toLowerCase();
		const city = document.getElementById('city').value.toLowerCase();
		const role = document.getElementById('cargo').value.toLowerCase();
		await renderFreelancers(name, city, role);
	});

document.getElementById('logoff').addEventListener('click', () => {
	window.localStorage.removeItem('token');

	checkSession();
});

document.getElementById('download').addEventListener('click', () => {
	fetch(
		`https://api.nkarbits.com.br/freelancers/export?name=${currentName}&city=${currentCity}`
	)
		.then((response) => response.blob()) // Recebe a resposta como um blob
		.then((blob) => {
			const url = window.URL.createObjectURL(new Blob([blob]));

			const link = document.createElement('a');
			link.href = url;
			link.setAttribute('download', 'dadosFreelancers.csv');

			document.body.appendChild(link);
			link.click();

			document.body.removeChild(link);
		})
		.catch((error) => console.error('Error downloading CSV:', error));
});
