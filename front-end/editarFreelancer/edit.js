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
		const grade = parseFloat(updatedData.grade);
		if (isNaN(grade)) {
			throw new Error('Nota do serviço prestado é inválida');
		}
		const role = updatedData.role;
		if (!role) {
			throw new Error('Cargo é inválido');
		}
		const response = await fetch(
			`https://api.nkarbits.com.br/freelancers/${freelancerId}`,
			{
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					grade: grade,
					role: role,
					id: freelancerId,
				}),
			}
		);
		if (response.ok) {
			alert('Freelancer atualizado com sucesso!');
			window.location.href = '../index.html';
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
		populateRoleDropdown(freelancerDetails.role);
	}
	const form = document.getElementById('editFreelancers');
	form.addEventListener('submit', async (event) => {
		event.preventDefault();
		const updatedData = {
			grade: document.getElementById('grade').value,
			role: document.getElementById('role').value,
		};
		await updateFreelancer(freelancer._id, updatedData);
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
