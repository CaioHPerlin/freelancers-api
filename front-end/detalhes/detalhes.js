function parseQueryString() {
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	const serializedFreelancer = urlParams.get('freelancer');
	return JSON.parse(decodeURIComponent(serializedFreelancer));
}

function renderDetails(freelancer) {
	const detailsContainer = document.getElementById('details');
	if (freelancer.facial_picture) {
		const profilePicture = document.createElement('img');
		profilePicture.src = `https://api.nkarbits.com.br/freelancers/uploads/fcp_${freelancer.cpf}.jpeg`;
		profilePicture.alt = 'face Picture';
		profilePicture.style.width = '300px';
		profilePicture.style.height = 'auto';
		detailsContainer.appendChild(profilePicture);
	}

	if (freelancer.profile_picture) {
		const profilePicture = document.createElement('img');
		profilePicture.src = `https://api.nkarbits.com.br/freelancers/uploads/pfp_${freelancer.cpf}.jpeg`;
		profilePicture.alt = 'Profile Picture';
		profilePicture.style.width = '300px';
		profilePicture.style.height = 'auto';
		detailsContainer.appendChild(profilePicture);
	}

	const name = document.createElement('p');
	name.textContent = `Nome: ${freelancer.name}`;
	detailsContainer.appendChild(name);

	const grade = document.createElement('p');
	grade.textContent = `Nota de atuação: ${
		freelancer.grade ? freelancer.grade : 'Não especificada'
	}`;
	detailsContainer.appendChild(grade);

	const cpf = document.createElement('p');
	cpf.textContent = `CPF: ${freelancer.cpf}`;
	detailsContainer.appendChild(cpf);

	const birthData = document.createElement('p');
	birthData.textContent = `Data de Nascimento: ${getBirthDate(
		freelancer.birthdate
	)}`;
	detailsContainer.appendChild(birthData);

	const telefone = document.createElement('p');
	telefone.textContent = `Telefone: ${freelancer.phone}`;
	detailsContainer.appendChild(telefone);

	const email = document.createElement('p');
	email.textContent = `E-mail: ${freelancer.email}`;
	detailsContainer.appendChild(email);

	const cargo = document.createElement('p');
	cargo.textContent = `Cargo: ${freelancer.role}`;
	detailsContainer.appendChild(cargo);

	const cep = document.createElement('p');
	cep.textContent = `CEP: ${freelancer.cep}`;
	detailsContainer.appendChild(cep);

	const rua = document.createElement('p');
	rua.textContent = `Rua: ${freelancer.street}`;
	detailsContainer.appendChild(rua);

	const residentialNumber = document.createElement('p');
	residentialNumber.textContent = `Número residencial: ${freelancer.residential_number}`;
	detailsContainer.appendChild(residentialNumber);

	const bairro = document.createElement('p');
	bairro.textContent = `Bairro: ${freelancer.neighborhood}`;
	detailsContainer.appendChild(bairro);

	const altura = document.createElement('p');
	altura.textContent = `Altura: ${freelancer.height}`;
	detailsContainer.appendChild(altura);

	const peso = document.createElement('p');
	peso.textContent = `Peso: ${freelancer.weight}`;
	detailsContainer.appendChild(peso);

	const hairColor = document.createElement('p');
	hairColor.textContent = `Cor do cabelo: ${freelancer.hair_color}`;
	detailsContainer.appendChild(hairColor);

	const eyeColor = document.createElement('p');
	eyeColor.textContent = `Cor dos olhos: ${freelancer.eye_color}`;
	detailsContainer.appendChild(eyeColor);

	const skinColor = document.createElement('p');
	skinColor.textContent = `Cor da pele: ${freelancer.skin_color}`;
	detailsContainer.appendChild(skinColor);

	const instagram = document.createElement('p');
	instagram.textContent = `Instagram: ${freelancer.instagram}`;
	detailsContainer.appendChild(instagram);

	const facebook = document.createElement('p');
	facebook.textContent = `Facebook: ${freelancer.facebook}`;
	detailsContainer.appendChild(facebook);

	const cidade = document.createElement('p');
	cidade.textContent = `Cidade: ${freelancer.city}`;
	detailsContainer.appendChild(cidade);

	const estado = document.createElement('p');
	estado.textContent = `Estado: ${freelancer.state}`;
	detailsContainer.appendChild(estado);

	const emergencyName = document.createElement('p');
	emergencyName.textContent = `Nome de emergência: ${freelancer.emergency_name}`;
	detailsContainer.appendChild(emergencyName);

	const emergencyPhone = document.createElement('p');
	emergencyPhone.textContent = `Telefone de emergência: ${freelancer.emergency_phone}`;
	detailsContainer.appendChild(emergencyPhone);

	const shirtSize = document.createElement('p');
	shirtSize.textContent = `Tamanho da camiseta: ${freelancer.shirt_size}`;
	detailsContainer.appendChild(shirtSize);

	const pixKey = document.createElement('p');
	pixKey.textContent = `Chave Pix: ${freelancer.pix_key}`;
	detailsContainer.appendChild(pixKey);

	const complemento = document.createElement('p');
	complemento.style.textAlign = 'justify';
	complemento.style.padding = '2px 15px';
	complemento.textContent = `Complemento: ${
		freelancer.complement ? freelancer.complement : 'Nenhum'
	}`;
	detailsContainer.appendChild(complemento);

	const dream = document.createElement('p');
	dream.style.textAlign = 'justify';
	dream.style.padding = '2px 15px';
	dream.textContent = `Sonho de vida: ${freelancer.dream}`;
	detailsContainer.appendChild(dream);

	const whatsappLink = document.createElement('a');
	whatsappLink.href = `https://wa.me/${freelancer.phone.replace(/\D/g, '')}`; // Remove todos os caracteres não numéricos do número de telefone
	whatsappLink.textContent = 'Contatar via WhatsApp';
	detailsContainer.appendChild(whatsappLink);

	const deleteButton = document.getElementById('deleteButton');
	deleteButton.addEventListener('click', () => {
		alert(freelancer._id);
		deleteFreelancer(freelancer._id);
	});
	const editButton = document.getElementById('editButton');
	editButton.addEventListener('click', () => editFreelancer(freelancer));
}

function getBirthDate(dataString) {
	// Check for default values
	if (dataString.includes('1000-01-01')) {
		return 'Não especificada';
	}

	const date = new Date(dataString);
	const day = `0${date.getUTCDate()}`.slice(-2); // Add 0 if day < 10
	const month = `0${date.getUTCMonth() + 1}`.slice(-2); // Add 0 if month < 10
	const year = date.getUTCFullYear();

	return `${day}/${month}/${year}`;
}

async function deleteFreelancer(freelancerId) {
	try {
		const response = await fetch(
			`http://api.nkarbits.com.br/freelancers/${freelancerId}`,
			{
				method: 'DELETE',
			}
		);

		if (response.ok) {
			alert('Freelancer deletado com sucesso!');
			window.location.href = '../'; // Redireciona de volta para a página inicial após a exclusão
		} else {
			const errorMessage = await response.text();
			alert(`Erro ao deletar o freelancer: ${errorMessage}`);
		}
	} catch (error) {
		console.error('Erro ao deletar o freelancer:', error);
		alert(
			'Erro ao deletar o freelancer. Verifique o console para mais informações.'
		);
	}
}

window.onload = function () {
	const freelancer = parseQueryString();
	renderDetails(freelancer);
};

function editFreelancer(freelancer) {
	const serializedFreelancer = encodeURIComponent(JSON.stringify(freelancer));
	window.location.href = `../editarFreelancer/index.html?freelancer=${serializedFreelancer}`;
}

window.onload = function () {
	const freelancer = parseQueryString();
	renderDetails(freelancer);
};
