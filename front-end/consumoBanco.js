const ENV = 'DEV';
let currentName, currentCity, currentRole;

window.onload = setup;

function setup() {
	checkSession();
	renderFreelancers();
}

function checkSession() {
	if (ENV != 'DEV') {
		const token = window.sessionStorage.getItem('token');
		if (!token) {
			window.location.href = './login/';
		}
	}
}

async function renderFreelancers(name = '', city = '', role = '') {
	currentName = name;
	currentCity = city;
	currentRole = role;

	const freelancersContainer = document.getElementById('freelancers');
	freelancersContainer.innerHTML = '<h1 class="loader"></h1>'; // Clear previous content

	const data = await fetchFreelancers(name, city, role);
	const freelancers = await data.json();
	console.log(freelancers);

	if (!freelancers.length) {
		freelancersContainer.innerHTML = `<p class="full-size">0 registros encontrados. Certifique-se de que as informações inseridas estão corretas.</p>`;
		return;
	}

	freelancers.sort((a, b) => {
		// Order freelancers by name alphabetically
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

	const checkbox = document.createElement('input');
	checkbox.type = 'checkbox';
	checkbox.classList.add('freelancer-checkbox');
	checkbox.style.display = 'none';
	card.appendChild(checkbox);

	const name = document.createElement('h2');
	name.textContent = freelancer.name;
	name.style = 'text-transform: capitalize;';
	card.appendChild(name);

	const profilePictureUrl = `https://api.nkarbits.com.br/freelancers/uploads/pfp_${freelancer.cpf}.jpeg`;
	const facePictureUrl = `https://api.nkarbits.com.br/freelancers/uploads/fcp_${freelancer.cpf}.jpeg`;

	const profilePicture = document.createElement('img');
	profilePicture.src = profilePictureUrl;
	profilePicture.alt = 'Profile Picture';
	profilePicture.classList.add('freelancer-profile-picture');
	card.appendChild(profilePicture);

	const role = document.createElement('p');
	role.textContent = `${freelancer.role}`;
	role.style = 'text-transform: capitalize;';
	card.appendChild(role);

	const location = document.createElement('p');
	location.textContent = `Cidade: ${freelancer.city}`;
	location.style = 'text-transform: capitalize; padding:0; margin-bottom:8px';
	card.appendChild(location);

	const grade = document.createElement('p');
	grade.textContent = `Nota: ${freelancer.grade}`;
	grade.style = 'text-transform: capitalize; padding:0; margin-bottom:8px';
	card.appendChild(grade);

	const verMaisButton = document.createElement('button');
	verMaisButton.textContent = 'Ver Mais';
	verMaisButton.addEventListener('click', () => showDetails(freelancer));
	card.appendChild(verMaisButton);

	// Store URLs in attributes for later use
	card.dataset.profilePictureUrl = profilePictureUrl;
	card.dataset.facePictureUrl = facePictureUrl;
	card.dataset.freelancerName = freelancer.name;

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
	window.sessionStorage.removeItem('token');
	checkSession();
});

document.getElementById('download').addEventListener('click', () => {
	fetch(
		`https://api.nkarbits.com.br/freelancers/export?name=${currentName}&city=${currentCity}&role=${currentRole}`
	)
		.then((response) => response.blob()) // Receive response as a blob
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

// DownloadImages
document.getElementById('downloadImagens').textContent = 'Baixar Imagens';
document
	.getElementById('downloadImagens')
	.addEventListener('click', async () => {
		const checkboxes = document.querySelectorAll('.freelancer-checkbox');
		const buttonText =
			document.getElementById('downloadImagens').textContent;
		const isSelecting = buttonText === 'Baixar Imagens';

		const selectAllButton = document.getElementById('selectAllButton');

		if (isSelecting) {
			checkboxes.forEach(
				(checkbox) => (checkbox.style.display = 'inline-block')
			);
			document.getElementById('downloadImagens').textContent =
				'Baixar selecionados';
			selectAllButton.style.display = 'inline-block';
		} else {
			const selectedFreelancers = [...checkboxes]
				.filter((checkbox) => checkbox.checked)
				.map((checkbox) => {
					const card = checkbox.parentElement;
					return {
						profilePictureUrl: card.dataset.profilePictureUrl,
						facePictureUrl: card.dataset.facePictureUrl,
						freelancerName: card.dataset.freelancerName,
					};
				});

			// 2 images
			selectedFreelancers.forEach(async (freelancer) => {
				await downloadFile(
					freelancer.profilePictureUrl,
					`${freelancer.freelancerName}_perfil.jpeg`
				);
				await downloadFile(
					freelancer.facePictureUrl,
					`${freelancer.freelancerName}_rosto.jpeg`
				);
			});

			document.getElementById('downloadImagens').textContent =
				'Baixar Imagens';
			selectAllButton.style.display = 'none';
			checkboxes.forEach((checkbox) => {
				checkbox.style.display = 'none';
				checkbox.checked = false;
			});
		}
	});

async function downloadFile(url, fileName) {
	try {
		const response = await fetch(url);
		const blob = await response.blob();
		const link = document.createElement('a');
		link.href = window.URL.createObjectURL(blob);
		link.download = fileName;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	} catch (error) {
		console.error(`Error downloading file ${fileName}:`, error);
	}
}

document.getElementById('selectAllButton').addEventListener('click', () => {
	const checkboxes = document.querySelectorAll('.freelancer-checkbox');
	const isAnyCheckboxChecked = Array.from(checkboxes).some(
		(checkbox) => checkbox.checked
	);
	checkboxes.forEach(
		(checkbox) => (checkbox.checked = !isAnyCheckboxChecked)
	);
});

document.getElementById('selectAllButton').style.display = 'none';
