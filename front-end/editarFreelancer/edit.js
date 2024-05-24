function parseQueryString() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const serializedFreelancer = urlParams.get('freelancer');
    return JSON.parse(decodeURIComponent(serializedFreelancer));
}

async function fetchFreelancer(freelancerId) {
    try {
        const response = await fetch(`https://sebrae-api.vercel.app/freelancers/${freelancerId}`);
        if (!response.ok) throw new Error('Não foi possível carregar os dados do freelancer.');
        return await response.json();
    } catch (error) {
        console.error('Erro ao buscar dados do freelancer:', error);
        alert('Erro ao buscar dados do freelancer. Verifique o console para mais informações.');
    }
}

async function updateFreelancer(freelancerId, updatedData) {
    try {
        const response = await fetch(
            `https://sebrae-api.vercel.app/freelancers/${freelancerId}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            }
        );

        if (response.ok) {
            alert('Freelancer atualizado com sucesso!');
            window.location.href = '../detalhes/index.html'; // Redireciona de volta para a página inicial após a atualização
        } else {
            const errorMessage = await response.text();
            alert(`Erro ao atualizar o freelancer: ${errorMessage}`);
        }
    } catch (error) {
        console.error('Erro ao atualizar o freelancer:', error);
        alert('Erro ao atualizar o freelancer. Verifique o console para mais informações.');
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const freelancer = parseQueryString();

    if (!freelancer) {
        alert('ID do freelancer não encontrado na URL.');
        return;
    }

    const freelancerDetails = await fetchFreelancer(freelancer._id);

    if (freelancerDetails) {
        document.getElementById('notaServico').value = freelancerDetails.notaServico || '';
        // Presumindo que você tem uma função para preencher os cargos
        populateCargoDropdown(freelancerDetails.cargo);
    }

    const form = document.getElementById('dadosFreelancers');
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const updatedData = {
            notaServico: document.getElementById('notaServico').value,
            cargo: document.getElementById('cargo').value,
            // Adicione outros campos conforme necessário
        };

        await updateFreelancer(freelancer._id, updatedData);
    });
});

function populateCargoDropdown(selectedCargo) {
    const cargoDropdown = document.getElementById('cargo');
    const cargos = ['Cargo 1', 'Cargo 2', 'Cargo 3']; // Exemplo de cargos. Substitua pelos cargos reais.

    cargos.forEach((cargo) => {
        const option = document.createElement('option');
        option.value = cargo;
        option.textContent = cargo;
        if (cargo === selectedCargo) option.selected = true;
        cargoDropdown.appendChild(option);
    });
}
