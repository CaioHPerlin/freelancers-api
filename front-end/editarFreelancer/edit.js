function parseQueryString() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const serializedFreelancer = urlParams.get('freelancer');
    if (!serializedFreelancer) {
        return null;
    }
    return JSON.parse(decodeURIComponent(serializedFreelancer));
}

async function fetchFreelancer(freelancerId) {
    try {
        const response = await fetch(`https://api.nkarbits.com.br/freelancers/${freelancerId}`);
        if (!response.ok) {
            throw new Error('Não foi possível carregar os dados do freelancer.');
        }
        return await response.json();
    } catch (error) {
        console.error('Erro ao buscar dados do freelancer:', error);
        alert('Erro ao buscar dados do freelancer. Verifique o console para mais informações.');
    }
}

async function updateFreelancer(freelancerId, updatedData) {
    try {
        const formData = new FormData();
        for (const key in updatedData) {
            if (updatedData[key] !== '') {
                formData.append(key, updatedData[key]);
            }
        }

        const response = await fetch(`http://localhost:3000/freelancers/${freelancerId}`, {
            method: 'PUT',
            body: formData,
        });

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
        alert('Erro ao atualizar o freelancer. Verifique o console para mais informações.');
    }
}

async function rotateImage(imageFile, rotation) {
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        const reader = new FileReader();

        reader.onload = (e) => {
            img.onload = () => {
                canvas.width = rotation % 180 === 0 ? img.width : img.height;
                canvas.height = rotation % 180 === 0 ? img.height : img.width;
                ctx.translate(canvas.width / 2, canvas.height / 2);
                ctx.rotate((rotation * Math.PI) / 180);
                ctx.drawImage(img, -img.width / 2, -img.height / 2);
                canvas.toBlob((blob) => resolve(blob), 'image/jpeg');
            };
            img.src = e.target.result;
        };

        reader.readAsDataURL(imageFile);
    });
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
        const formattedDate = freelancerDetails.birthdate.slice(0, 10);
        document.getElementById('birthdate').value = formattedDate || '';
        document.getElementById('cpf').value = freelancerDetails.cpf || '';
        document.getElementById('phone').value = freelancerDetails.phone || '';
        document.getElementById('email').value = freelancerDetails.email || '';
        document.getElementById('curso').value = freelancerDetails.course || '';
        document.getElementById('cep').value = freelancerDetails.cep || '';
        document.getElementById('street').value = freelancerDetails.street || '';
        document.getElementById('residentialNumber').value = freelancerDetails.residential_number || '';
        document.getElementById('neighborhood').value = freelancerDetails.neighborhood || '';
        document.getElementById('height').value = freelancerDetails.height || '';
        document.getElementById('weight').value = freelancerDetails.weight || '';
        document.getElementById('hairColor').value = freelancerDetails.hair_color || '';
        document.getElementById('eyeColor').value = freelancerDetails.eye_color || '';
        document.getElementById('instagram').value = freelancerDetails.instagram || '';
        document.getElementById('facebook').value = freelancerDetails.facebook || '';
        document.getElementById('emergencyName').value = freelancerDetails.emergency_name || '';
        document.getElementById('emergencyPhone').value = freelancerDetails.emergency_phone || '';
        document.getElementById('shirtSize').value = freelancerDetails.shirt_size || '';
        document.getElementById('pixKey').value = freelancerDetails.pix_key || '';
        document.getElementById('complement').value = freelancerDetails.complement || '';

        const profilePreview = document.getElementById('profilePreview');
        profilePreview.src = `https://api.nkarbits.com.br/freelancers/uploads/${freelancerDetails.profile_picture}`;

        const facialPreview = document.getElementById('facialPreview');
        facialPreview.src = `https://api.nkarbits.com.br/freelancers/uploads/${freelancerDetails.facial_picture}`;

        document.getElementById('dream').value = freelancerDetails.dream || '';

        if (freelancerDetails.education) {
            document.getElementById('grauEscolaridade').value = freelancerDetails.education;
        }
        if (freelancerDetails.skinColor) {
            document.getElementById('skinColor').value = freelancerDetails.skinColor;
        }
        if (freelancerDetails.state) {
            console.log(freelancerDetails.state);
            document.getElementById('state').value = freelancerDetails.state;
        }
        if (freelancerDetails.city) {
            selectLocal(freelancerDetails.state, capitalizeFirstLetter(freelancerDetails.city));
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
            birthdate: document.getElementById('birthdate').value,
            cpf: document.getElementById('cpf').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            course: document.getElementById('curso').value,
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

        if (profileRotation !== 0 && updatedData.profilePicture) {
            updatedData.profilePicture = await rotateImage(updatedData.profilePicture, profileRotation);
        }
        if (facialRotation !== 0 && updatedData.facialPicture) {
            updatedData.facialPicture = await rotateImage(updatedData.facialPicture, facialRotation);
        }

        await updateFreelancer(freelancer._id, updatedData);
    });

    const profileInput = document.getElementById('profilePicture');
    const profilePreview = document.getElementById('profilePreview');
    profileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                profilePreview.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    const facialInput = document.getElementById('facialPicture');
    const facialPreview = document.getElementById('facialPreview');
    facialInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                facialPreview.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    const rotateProfileButton = document.getElementById('rotateProfileButton');
    let profileRotation = 0;
    rotateProfileButton.addEventListener('click', (event) => {
        event.preventDefault();
        profileRotation = (profileRotation + 90) % 360;
        profilePreview.style.transform = `rotate(${profileRotation}deg)`;
    });

    const rotateFacialButton = document.getElementById('rotateFacialButton');
    let facialRotation = 0;
    rotateFacialButton.addEventListener('click', (event) => {
        event.preventDefault();
        facialRotation = (facialRotation + 90) % 360;
        facialPreview.style.transform = `rotate(${facialRotation}deg)`;
    });
});

function capitalizeFirstLetter(string) {
    const words = string.split(' ');
    const capitalizedWords = words.map(word => {
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

function selectLocal(selectedUf, defaultCity = '') {
    local.innerHTML = '<option value="" disabled selected>Selecione</option>';
    fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
        .then(response => response.json())
        .then(json => {
            json.sort((x, y) => x.nome.localeCompare(y.nome));
            json.forEach(cidade => {
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
    uf.innerHTML = '<option id="optVoid" value="" disabled selected>Selecione</option>';
    selectUF();
});
