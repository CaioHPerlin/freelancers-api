const completoCheckbox = document.getElementById('completo');
const incompletoCheckbox = document.getElementById('incompleto');

completoCheckbox.addEventListener('change', function () {
    if (this.checked) {
        incompletoCheckbox.checked = false;
    }
});

incompletoCheckbox.addEventListener('change', function () {
    if (this.checked) {
        completoCheckbox.checked = false;
    }
});

const dadosfreelancers = document.getElementById('dadosFreelancers');
const profilePicture = document.getElementById('profilePicture');
const facialPicture = document.getElementById('facialPicture');

dadosfreelancers.addEventListener('submit', (evento) => {
    evento.preventDefault();

    if (!completoCheckbox.checked && !incompletoCheckbox.checked) {
        alert('Por favor, selecione se o curso está completo ou incompleto.');
        return;
    }

    const freelancersData = new FormData(dadosfreelancers);
    const loaderContainer = document.getElementById('loadercont');
    loaderContainer.innerHTML = '<h1 class="loader"></h1>';

    let profileBlob;
    let facialBlob;

    const getBlobFromCanvas = (image, degree) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const img = new Image();
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

                canvas.toBlob(blob => resolve(blob), 'image/jpeg');
            };
        });
    };

    const requests = [
        getBlobFromCanvas(profilePreview, profileRotation).then(blob => profileBlob = blob),
        getBlobFromCanvas(facialPreview, facialRotation).then(blob => facialBlob = blob),
    ];

    Promise.all(requests).then(() => {
        if (profileBlob) freelancersData.set('profilePicture', profileBlob, 'profile.jpg');
        if (facialBlob) freelancersData.set('facialPicture', facialBlob, 'facial.jpg');

        dadosfreelancers.course.value += completoCheckbox.checked ? ' (Completo)' : ' (Incompleto)';

        fetch('https://api.nkarbits.com.br/freelancers', {
            method: 'POST',
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
            window.location.href = '../sucesso/';
        })
        .catch((err) => {
            loaderContainer.innerHTML = '';
            console.error(err);
            alert(err);
        });
    });
});

// select api de estados e cidades
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

const rotateProfileButton = document.getElementById('rotateProfileButton');
const rotateFacialButton = document.getElementById('rotateFacialButton');
const profilePreview = document.getElementById('profilePreview');
const facialPreview = document.getElementById('facialPreview');

let profileRotation = 0;
let facialRotation = 0;

rotateProfileButton.addEventListener('click', function() {
    profileRotation += 90;
    profilePreview.style.transform = `rotate(${profileRotation}deg)`;
});

rotateFacialButton.addEventListener('click', function() {
    facialRotation += 90;
    facialPreview.style.transform = `rotate(${facialRotation}deg)`;
});

profilePicture.addEventListener('change', function() {
    const file = this.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        profilePreview.src = e.target.result;
    };

    reader.readAsDataURL(file);
});

facialPicture.addEventListener('change', function() {
    const file = this.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        facialPreview.src = e.target.result;
    };

    reader.readAsDataURL(file);
});
