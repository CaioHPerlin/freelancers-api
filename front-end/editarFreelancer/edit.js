function parseQueryString() {
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	const serializedFreelancer = urlParams.get('freelancer');
	return JSON.parse(decodeURIComponent(serializedFreelancer));
}

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

async function updateFreelancer(freelancerId, updatedData) {
	try {
		const formData = new FormData();
		Object.keys(updatedData).forEach((key) => {
			formData.append(key, updatedData[key]);
		});

		const response = await fetch(
			`https://api.nkarbits.com.br/freelancers/${freelancerId}`,
			{
				method: 'PUT',
				body: formData,
			}
		);

		if (response.ok) {
			alert('Freelancer atualizado com sucesso!');
			window.location.href = '../';
		} else {
			const errorMessage = await response.text();
			console.error('Erro ao atualizar o freelancer:', errorMessage);
			alert(`Erro ao atualizar o freelancer: ${errorMessage}`);
		}
	} catch (error) {
		console.error('Erro ao atualizar o freelancer:', error);
		alert(
			'Erro ao atualizar o freelancer. Verifique o console para mais informações.'
		);
	}
}

document.addEventListener('DOMContentLoaded', async () => {
	const freelancer = parseQueryString();
	if (!freelancer) {
		alert('ID do freelancer não encontrado na URL.');
		return;
	}
	console.log('Freelancer data from URL:', freelancer);
	const freelancerDetails = await fetchFreelancer(freelancer._id);
	if (freelancerDetails) {
		document.getElementById('grade').value = freelancerDetails.grade || '';
		document.getElementById('name').value = freelancerDetails.name || '';
		document.getElementById('birthData').value = freelancerDetails.birthdate || '';
		document.getElementById('cpf').value = freelancerDetails.cpf || '';
		document.getElementById('phone').value = freelancerDetails.phone || '';
		document.getElementById('email').value = freelancerDetails.email || '';
		document.getElementById('course').value = freelancerDetails.course || '';
		document.getElementById('cep').value = freelancerDetails.cep || '';
		document.getElementById('street').value = freelancerDetails.street || '';
		document.getElementById('residentialNumber').value = freelancerDetails.residentialNumber || '';
		document.getElementById('neighborhood').value = freelancerDetails.neighborhood || '';
		document.getElementById('height').value = freelancerDetails.height || '';
		document.getElementById('weight').value = freelancerDetails.weight || '';
		document.getElementById('hairColor').value = freelancerDetails.hairColor || '';
		document.getElementById('eyeColor').value = freelancerDetails.eyeColor || '';
		document.getElementById('instagram').value = freelancerDetails.instagram || '';
		document.getElementById('facebook').value = freelancerDetails.facebook || '';
		document.getElementById('emergencyName').value = freelancerDetails.emergencyName || '';
		document.getElementById('emergencyPhone').value = freelancerDetails.emergencyPhone || '';
		document.getElementById('shirtSize').value = freelancerDetails.shirtSize || '';
		document.getElementById('pixKey').value = freelancerDetails.pixKey || '';
		document.getElementById('complement').value = freelancerDetails.complement || '';
		document.getElementById('dream').value = freelancerDetails.dream || '';

		if (freelancerDetails.education) {
			document.getElementById('grauEscolaridade').value = freelancerDetails.education;
		}
		if (freelancerDetails.skinColor) {
			document.getElementById('skinColor').value = freelancerDetails.skinColor;
		}
		if (freelancerDetails.state) {
			document.getElementById('state').value = freelancerDetails.state;
		}
		if (freelancerDetails.city) {
			document.getElementById('city').value = freelancerDetails.city;
		}
		if (freelancerDetails.completo) {
			document.getElementById('completo').checked = freelancerDetails.completo;
		}
		if (freelancerDetails.incompleto) {
			document.getElementById('incompleto').checked = freelancerDetails.incompleto;
		}

		populateRoleDropdown(freelancerDetails.role);
	}

	const form = document.getElementById('editFreelancers');
	form.addEventListener('submit', async (event) => {
		event.preventDefault();
		const updatedData = {
			grade: document.getElementById('grade').value,
			role: document.getElementById('role').value,
			name: document.getElementById('name').value,
			birthData: document.getElementById('birthData').value,
			cpf: document.getElementById('cpf').value,
			phone: document.getElementById('phone').value,
			email: document.getElementById('email').value,
			course: document.getElementById('course').value,
			cep: document.getElementById('cep').value,
			street: document.getElementById('street').value,
			residentialNumber: document.getElementById('residentialNumber').value,
			neighborhood: document.getElementById('neighborhood').value,
			height: document.getElementById('height').value,
			weight: document.getElementById('weight').value,
			hairColor: document.getElementById('hairColor').value,
			eyeColor: document.getElementById('eyeColor').value,
			instagram: document.getElementById('instagram').value,
			facebook: document.getElementById('facebook').value,
			emergencyName: document.getElementById('emergencyName').value,
			emergencyPhone: document.getElementById('emergencyPhone').value,
			shirtSize: document.getElementById('shirtSize').value,
			pixKey: document.getElementById('pixKey').value,
			complement: document.getElementById('complement').value,
			dream: document.getElementById('dream').value,
			education: document.getElementById('grauEscolaridade').value,
			skinColor: document.getElementById('skinColor').value,
			state: document.getElementById('state').value,
			city: document.getElementById('city').value,
			completo: document.getElementById('completo').checked,
			incompleto: document.getElementById('incompleto').checked,
		};

		const profileInput = document.getElementById('profilePicture');
		const facialInput = document.getElementById('facialPicture');
		if (profileInput.files[0]) {
			updatedData.profilePicture = profileInput.files[0];
		}
		if (facialInput.files[0]) {
			updatedData.facialPicture = facialInput.files[0];
		}

		await updateFreelancer(freelancer._id, updatedData);
	});

	const profileInput = document.getElementById('profilePicture');
	const profilePreview = document.getElementById('profilePreview');
	const rotateProfileButton = document.getElementById('rotateProfileButton');
	const facialInput = document.getElementById('facialPicture');
	const facialPreview = document.getElementById('facialPreview');
	const rotateFacialButton = document.getElementById('rotateFacialButton');

	let profileRotation = 0;
	let facialRotation = 0;

	const rotateImage = (image, rotation) => {
		image.style.transform = `rotate(${rotation}deg)`;
	};

	rotateProfileButton.addEventListener('click', (event) => {
		event.preventDefault();
		profileRotation = (profileRotation + 90) % 360;
		rotateImage(profilePreview, profileRotation);
	});

	rotateFacialButton.addEventListener('click', (event) => {
		event.preventDefault();
		facialRotation = (facialRotation + 90) % 360;
		rotateImage(facialPreview, facialRotation);
	});

	const loadImagePreview = (input, preview) => {
		const file = input.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				preview.src = e.target.result;
			};
			reader.readAsDataURL(file);
		}
	};

	profileInput.addEventListener('change', () => {
		loadImagePreview(profileInput, profilePreview);
	});

	facialInput.addEventListener('change', () => {
		loadImagePreview(facialInput, facialPreview);
	});
});

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
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
        .then(response => response.json())
        .then(json => {
            json.sort((x, y) => x.sigla.localeCompare(y.sigla));
            json.forEach(estado => {
                const newopt = document.createElement('option');
                newopt.setAttribute('value', estado.sigla);
                newopt.setAttribute('id', estado.sigla);
                newopt.innerText = estado.sigla;
                uf.appendChild(newopt);
            });
        });
}

uf.addEventListener('change', event => {
    local.innerHTML = '';
    local.removeAttribute('disabled');
    selectLocal(event.target.value);
});

function selectLocal(selectedUf) {
    local.innerHTML = '<option value="" disabled selected>Selecione</option>';
    fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
        .then(response => response.json())
        .then(json => {
            json.sort((x, y) => x.nome.localeCompare(y.nome));
            json.forEach(cidade => {
                const newopt = document.createElement('option');
                newopt.setAttribute('value', cidade.nome);
                newopt.innerText = cidade.nome;
                local.appendChild(newopt);
            });
        });
}

window.addEventListener('DOMContentLoaded', () => {
    uf.innerHTML = '<option id="optVoid" value="" disabled selected>Selecione</option>';
    selectUF();
});
