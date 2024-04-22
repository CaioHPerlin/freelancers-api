async function fetchFreelancers(city) {
	const url = city
		? `https://sebrae-api.vercel.app/freelancers/${city}`
		: `https://sebrae-api.vercel.app/freelancers`;

	try {
		const response = await fetch(url);
		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Error fetching data:', error);
	}
}

async function renderFreelancers(city = '') {
	const freelancersContainer = document.getElementById('freelancers');
	freelancersContainer.innerHTML = '<h1 class="loader"></h1>'; // Limpa o conteúdo anterior

	const freelancers = await fetchFreelancers(city);

	if (!freelancers.length)
		return (freelancersContainer.innerHTML = `<p><center>0 registros encontrados. Certifique-se de que o nome da cidade foi digitado corretamente.</center></p>`);

	freelancersContainer.innerHTML = '';

	freelancers.forEach((freelancer) => {
		const card = createCard(freelancer);
		freelancersContainer.appendChild(card);
	});
}

function createCard(freelancer) {
	const card = document.createElement('div');
	card.classList.add('card');

	const name = document.createElement('h2');
	name.textContent = freelancer.name;
	card.appendChild(name);

	const profilePicture = document.createElement('img');
	profilePicture.src = `https://ub7txpxyf1bghrmk.public.blob.vercel-storage.com/${freelancer.profilePicture}`;
	profilePicture.alt = 'Profile Picture';
	profilePicture.style.width = '100%';
	profilePicture.style.height = 'auto';
	card.appendChild(profilePicture);

	const location = document.createElement('p');
	location.textContent = `Cidade: ${freelancer.city}`;
	location.style = 'text-transform: capitalize;';
	card.appendChild(location);

	const verMaisButton = document.createElement('button');
	verMaisButton.textContent = 'Ver Mais';
	verMaisButton.addEventListener('click', () => showDetails(freelancer));
	card.appendChild(verMaisButton);

	return card;
}

function showDetails(freelancer) {
	window.location.href = `detalhes.html?freelancer=${encodeURIComponent(
		JSON.stringify(freelancer)
	)}`;
}

document
	.getElementById('filterForm')
	.addEventListener('submit', async function (event) {
		event.preventDefault();
		const city = document.getElementById('city').value.toLowerCase();
		await renderFreelancers(city);
	});

window.onload = renderFreelancers('');
