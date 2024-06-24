function parseQueryString() {
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	const serializedFreelancer = urlParams.get('freelancer');
	if (!serializedFreelancer) {
		return null;
	}
	return JSON.parse(decodeURIComponent(serializedFreelancer));
}

const freelancer = parseQueryString();

const dadosfreelancers = document.getElementById('editFreelancers');

dadosfreelancers.addEventListener('submit', (evento) => {
	evento.preventDefault();

	const freelancersData = new FormData(dadosfreelancers);
	const loaderContainer = document.getElementById('loadercont');
	loaderContainer.innerHTML = '<h1 class="loader"></h1>';

	let profileBlob;
	let facialBlob;

	const getBlobFromCanvas = (image, degree) => {
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');

		const img = new Image();
		img.crossOrigin = 'anonymous';
		img.src = image.src;
		return new Promise((resolve) => {
			img.onload = () => {
				const width = img.width;
				const height = img.height;

				if (degree % 180 !== 0) {
					canvas.width = height;
					canvas.height = width;
				} else {
					canvas.width = width;
					canvas.height = height;
				}

				ctx.translate(canvas.width / 2, canvas.height / 2);
				ctx.rotate((degree * Math.PI) / 180);
				ctx.drawImage(img, -width / 2, -height / 2);

				canvas.toBlob((blob) => resolve(blob), 'image/jpeg');
			};
		});
	};

	const requests = [
		getBlobFromCanvas(profilePreview, profileRotation).then(
			(blob) => (profileBlob = blob)
		),
		getBlobFromCanvas(facialPreview, facialRotation).then(
			(blob) => (facialBlob = blob)
		),
	];

	Promise.all(requests).then(() => {
		if (profileBlob) {
			freelancersData.set('profilePicture', profileBlob, 'profile.jpg');
		}
		if (facialBlob) {
			freelancersData.set('facialPicture', facialBlob, 'facial.jpg');
		}

		fetch(`https://api.nkarbits.com.br/freelancers/${freelancer._id}`, {
			method: 'PUT',
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
				window.location.href = '../cadastro/sucesso/';
			})
			.catch((err) => {
				loaderContainer.innerHTML = '';
				console.error(err);
				alert(err);
			});
	});
});

const rotateProfileButton = document.getElementById('rotateProfileButton');
const rotateFacialButton = document.getElementById('rotateFacialButton');
const profilePreview = document.getElementById('profilePreview');
const facialPreview = document.getElementById('facialPreview');

let profileRotation = 0;
let facialRotation = 0;

rotateProfileButton.addEventListener('click', function () {
	profileRotation += 90;
	profilePreview.style.transform = `rotate(${profileRotation}deg)`;
});

rotateFacialButton.addEventListener('click', function () {
	facialRotation += 90;
	facialPreview.style.transform = `rotate(${facialRotation}deg)`;
});

profilePicture.addEventListener('change', function () {
	const file = this.files[0];
	const reader = new FileReader();

	reader.onload = function (e) {
		profilePreview.src = e.target.result;
	};

	reader.readAsDataURL(file);
});

facialPicture.addEventListener('change', function () {
	const file = this.files[0];
	const reader = new FileReader();

	reader.onload = function (e) {
		facialPreview.src = e.target.result;
	};

	reader.readAsDataURL(file);
});

async function fetchFreelancer(freelancerId) {
	try {
		const response = await fetch(
			`https://api.nkarbits.com.br/freelancers/${freelancerId}`
		);
		if (!response.ok) {
			throw new Error(
				'Não foi possível carregar os dados do freelancer.'
			);
		}
		return await response.json();
	} catch (error) {
		console.error('Erro ao buscar dados do freelancer:', error);
		alert(
			'Erro ao buscar dados do freelancer. Verifique o console para mais informações.'
		);
	}
}

document.addEventListener('DOMContentLoaded', async () => {
	if (!freelancer) {
		alert('ID do freelancer não encontrado na URL.');
		return;
	}

	const freelancerDetails = await fetchFreelancer(freelancer._id);
	if (freelancerDetails) {
		document.getElementById('grade').value = freelancerDetails.grade || '';
		document.getElementById('name').value = freelancerDetails.name || '';
		document.getElementById('birthdate').value =
			freelancerDetails.birthdate.slice(0, 10) || '';
		document.getElementById('cpf').value = freelancerDetails.cpf || '';
		document.getElementById('phone').value = freelancerDetails.phone || '';
		document.getElementById('email').value = freelancerDetails.email || '';
		document.getElementById('curso').value = freelancerDetails.course || '';
		document.getElementById('cep').value = freelancerDetails.cep || '';
		document.getElementById('street').value =
			freelancerDetails.street || '';
		document.getElementById('residentialNumber').value =
			freelancerDetails.residential_number || '';
		document.getElementById('neighborhood').value =
			freelancerDetails.neighborhood || '';
		document.getElementById('height').value =
			freelancerDetails.height || '';
		document.getElementById('weight').value =
			freelancerDetails.weight || '';
		document.getElementById('hairColor').value =
			freelancerDetails.hair_color || '';
		document.getElementById('eyeColor').value =
			freelancerDetails.eye_color || '';
		document.getElementById('instagram').value =
			freelancerDetails.instagram || '';
		document.getElementById('facebook').value =
			freelancerDetails.facebook || '';
		document.getElementById('emergencyName').value =
			freelancerDetails.emergency_name || '';
		document.getElementById('emergencyPhone').value =
			freelancerDetails.emergency_phone || '';
		document.getElementById('shirtSize').value =
			freelancerDetails.shirt_size || '';
		document.getElementById('pixKey').value =
			freelancerDetails.pix_key || '';
		document.getElementById('complement').value =
			freelancerDetails.complement || '';

		const profilePreview = document.getElementById('profilePreview');
		profilePreview.src = `https://api.nkarbits.com.br/freelancers/uploads/${freelancerDetails.profile_picture}`;

		const facialPreview = document.getElementById('facialPreview');
		facialPreview.src = `https://api.nkarbits.com.br/freelancers/uploads/${freelancerDetails.facial_picture}`;

		document.getElementById('dream').value = freelancerDetails.dream || '';

		if (freelancerDetails.education) {
			document.getElementById('grauEscolaridade').value =
				freelancerDetails.education;
		}
		if (freelancerDetails.skinColor) {
			document.getElementById('skinColor').value =
				freelancerDetails.skinColor;
		}
		if (freelancerDetails.state) {
			document.getElementById('state').value = freelancerDetails.state;
		}
		if (freelancerDetails.city) {
			selectLocal(
				freelancerDetails.state,
				capitalizeFirstLetter(freelancerDetails.city)
			);
		}

		populateRoleDropdown(freelancerDetails.role);
	}
});

function capitalizeFirstLetter(string) {
	const words = string.split(' ');
	const capitalizedWords = words.map((word) => {
		return word.charAt(0).toUpperCase() + word.slice(1);
	});
	return capitalizedWords.join(' ');
}

function populateRoleDropdown(selectedRole) {
	const roleDropdown = document.getElementById('role');
	const roles = [
		'geral',
		'manobrista',
		'bombeiro civil',
		'seguranca',
		'limpeza',
		'brigadista',
		'promotor',
		'recepcionista',
	];
	roleDropdown.innerHTML = '';
	roles.forEach((role) => {
		const option = document.createElement('option');
		option.value = role;
		option.textContent = capitalizeFirstLetter(role);
		if (role === selectedRole) {
			option.selected = true;
		}
		roleDropdown.appendChild(option);
	});
}

const uf = document.querySelector('#state');
const local = document.querySelector('#city');

function selectUF() {
	fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
		.then((response) => response.json())
		.then((json) => {
			json.sort((x, y) => x.sigla.localeCompare(y.sigla));
			json.forEach((estado) => {
				const newopt = document.createElement('option');
				newopt.setAttribute('value', estado.sigla);
				newopt.setAttribute('id', estado.sigla);
				newopt.innerText = estado.sigla;
				uf.appendChild(newopt);
			});
		});
}

uf.addEventListener('change', (event) => {
	local.innerHTML = '';
	local.removeAttribute('disabled');
	selectLocal(event.target.value);
});

function selectLocal(selectedUf, defaultCity = '') {
	local.innerHTML = '<option value="" disabled selected>Selecione</option>';
	fetch(
		`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`
	)
		.then((response) => response.json())
		.then((json) => {
			json.sort((x, y) => x.nome.localeCompare(y.nome));
			json.forEach((cidade) => {
				const newopt = document.createElement('option');
				newopt.setAttribute('value', cidade.nome);
				if (defaultCity == cidade.nome) {
					newopt.selected = true;
				}
				newopt.innerText = cidade.nome;
				local.appendChild(newopt);
			});
		});
}

window.addEventListener('DOMContentLoaded', () => {
	uf.innerHTML =
		'<option id="optVoid" value="" disabled selected>Selecione</option>';
	selectUF();
});
