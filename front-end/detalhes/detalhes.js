function parseQueryString() {
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	const serializedFreelancer = urlParams.get('freelancer');
	return JSON.parse(decodeURIComponent(serializedFreelancer));
}



function renderDetails(freelancer) {
	const detailsContainer = document.getElementById('details');
	if (freelancer.facePicture) {
		const profilePicture = document.createElement('img');
		profilePicture.src = `https://ub7txpxyf1bghrmk.public.blob.vercel-storage.com/${freelancer.facePicture}`;
		profilePicture.alt = 'face Picture';
		profilePicture.style.width = '300px';
		profilePicture.style.height = 'auto';
		detailsContainer.appendChild(profilePicture);
	}

	if (freelancer.profilePicture) {
		const profilePicture = document.createElement('img');
		profilePicture.src = `https://ub7txpxyf1bghrmk.public.blob.vercel-storage.com/${freelancer.profilePicture}`;
		profilePicture.alt = 'Profile Picture';
		profilePicture.style.width = '300px';
		profilePicture.style.height = 'auto';
		detailsContainer.appendChild(profilePicture);
	}

	const name = document.createElement('p');
	name.textContent = `Nome: ${freelancer.name}`;
	detailsContainer.appendChild(name);

	const notaFreelancer = document.createElement('p');
	notaFreelancer.textContent = `Nota de atuação: ${freelancer.notaFreelancer}`;
	detailsContainer.appendChild(notaFreelancer);

	const cpf = document.createElement('p');
	cpf.textContent = `CPF: ${freelancer.cpf}`;
	detailsContainer.appendChild(cpf);

	const birthData = document.createElement('p');
	birthData.textContent = `Data de Nascimento: ${freelancer.birthData}`;
	detailsContainer.appendChild(birthData);

	const telefone = document.createElement('p');
	telefone.textContent = `Telefone: ${freelancer.phone}`;
	detailsContainer.appendChild(telefone);

	const email = document.createElement('p');
	email.textContent = `E-mail: ${freelancer.email}`;
	detailsContainer.appendChild(email);

	const cargo = document.createElement('p');
	cargo.textContent = `Cargo: ${freelancer.cargo}`;
	detailsContainer.appendChild(cargo);

	const cep = document.createElement('p');
	cep.textContent = `CEP: ${freelancer.cep}`;
	detailsContainer.appendChild(cep);

	const rua = document.createElement('p');
	rua.textContent = `Rua: ${freelancer.street}`;
	detailsContainer.appendChild(rua);

	const residentialNumber = document.createElement('p');
	residentialNumber.textContent = `Número residencial: ${freelancer.residentialNumber}`;
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
	hairColor.textContent = `Cor do cabelo: ${freelancer.hairColor}`;
	detailsContainer.appendChild(hairColor);

	const eyeColor = document.createElement('p');
	eyeColor.textContent = `Cor dos olhos: ${freelancer.eyeColor}`;
	detailsContainer.appendChild(eyeColor);

	const skinColor = document.createElement('p');
	skinColor.textContent = `Cor da pele: ${freelancer.skinColor}`;
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
	emergencyName.textContent = `Nome de emergência: ${freelancer.emergencyName}`;
	detailsContainer.appendChild(emergencyName);

	const emergencyPhone = document.createElement('p');
	emergencyPhone.textContent = `Telefone de emergência: ${freelancer.emergencyPhone}`;
	detailsContainer.appendChild(emergencyPhone);

	const shirtSize = document.createElement('p');
	shirtSize.textContent = `Tamanho da camiseta: ${freelancer.shirtSize}`;
	detailsContainer.appendChild(shirtSize);

	const pixKey = document.createElement('p');
	pixKey.textContent = `Chave Pix: ${freelancer.pixKey}`;
	detailsContainer.appendChild(pixKey);

	const complemento = document.createElement('p');
	complemento.style.textAlign='justify'
	complemento.style.padding= '2px 15px'
	complemento.textContent = `Complemento: ${freelancer.complement}`;
	detailsContainer.appendChild(complemento);

	const dream = document.createElement('p');
	dream.style.textAlign='justify'
	dream.style.padding= '2px 15px'
	dream.textContent = `Sonho de vida: ${freelancer.dream}`;
	detailsContainer.appendChild(dream);

	const whatsappLink = document.createElement('a');
	whatsappLink.href = `https://wa.me/${freelancer.phone.replace(/\D/g, '')}`; // Remove todos os caracteres não numéricos do número de telefone
	whatsappLink.textContent = 'Contatar via WhatsApp';
	detailsContainer.appendChild(whatsappLink);

	const deleteButton = document.getElementById('deleteButton');
	deleteButton.addEventListener('click', () =>
		deleteFreelancer(freelancer._id)
	);
	const editButton = document.getElementById('editButton');
    editButton.addEventListener('click', () => editFreelancer(freelancer))
}


async function deleteFreelancer(freelancerId) {
	try {
		const response = await fetch(
			`https://sebrae-api.vercel.app/freelancers/${freelancerId}`,
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