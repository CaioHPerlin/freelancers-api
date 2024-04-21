async function fetchFreelancers() {
	try {
		const response = await fetch(
			'https://sebrae-api.vercel.app/freelancers'
		);
		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Error fetching data:', error);
	}
}

async function renderFreelancers(city = '') {
	const freelancersContainer = document.getElementById('freelancers');
	freelancersContainer.innerHTML = ''; // Limpa o conteúdo anterior

	const freelancers = await fetchFreelancers();

	if (!freelancers) return;

	freelancers.forEach((freelancer) => {
		if (
			city &&
			freelancer.city.toLowerCase().includes(city.toLowerCase())
		) {
			const card = createCard(freelancer);
			freelancersContainer.appendChild(card);
		} else if (!city) {
			const card = createCard(freelancer);
			freelancersContainer.appendChild(card);
		}
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
		const city = document.getElementById('city').value;
		await renderFreelancers(city);
	});

window.onload = renderFreelancers;
