document.getElementById('completo').addEventListener('change', function () {
	if (this.checked) {
		document.getElementById('incompleto').checked = false;
	}
});

document.getElementById('incompleto').addEventListener('change', function () {
	if (this.checked) {
		document.getElementById('completo').checked = false;
	}
});

const dadosfreelancers = document.getElementById('dadosFreelancers');
const rotateProfileButton = document.getElementById('rotateProfileButton');
const rotateFacialButton = document.getElementById('rotateFacialButton');
const profilePreview = document.getElementById('profilePreview');
const facialPreview = document.getElementById('facialPreview');

let profileRotation = 0;
let facialRotation = 0;

rotateProfileButton.addEventListener('click', function() {
	profileRotation = (profileRotation + 90) % 360;
	profilePreview.style.transform = `rotate(${profileRotation}deg)`;
});

rotateFacialButton.addEventListener('click', function() {
	facialRotation = (facialRotation + 90) % 360;
	facialPreview.style.transform = `rotate(${facialRotation}deg)`;
});

document.getElementById('profilePicture').addEventListener('change', function() {
	const file = this.files[0];
	const reader = new FileReader();

	reader.onload = function(e) {
		profilePreview.style.display = 'block';
		profilePreview.src = e.target.result;
	};

	reader.readAsDataURL(file);
});

document.getElementById('facialPicture').addEventListener('change', function() {
	const file = this.files[0];
	const reader = new FileReader();

	reader.onload = function(e) {
		facialPreview.style.display = 'block';
		facialPreview.src = e.target.result;
	};

	reader.readAsDataURL(file);
});

dadosfreelancers.addEventListener('submit', (evento) => {
	evento.preventDefault();

	if (!document.getElementById('completo').checked && !document.getElementById('incompleto').checked) {
		alert('Por favor, selecione se o curso está completo ou incompleto.');
		return;
	}

	const formData = new FormData(dadosfreelancers);
	formData.append('profileRotation', profileRotation);
	formData.append('facialRotation', facialRotation);

	const profileBlob = dataURLtoBlob(profilePreview.src);
	const facialBlob = dataURLtoBlob(facialPreview.src);

	formData.append('profilePicture', profileBlob, 'profilePicture.jpg');
	formData.append('facialPicture', facialBlob, 'facialPicture.jpg');

	const loaderContainer = document.getElementById('loadercont');
	loaderContainer.innerHTML = '<h1 class="loader"></h1>';

	fetch('https://api.nkarbits.com.br/freelancers', {
		method: 'POST',
		body: formData,
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

function dataURLtoBlob(dataurl) {
	const arr = dataurl.split(',');
	const mime = arr[0].match(/:(.*?);/)[1];
	const bstr = atob(arr[1]);
	let n = bstr.length;
	const u8arr = new Uint8Array(n);
	while (n--) {
		u8arr[n] = bstr.charCodeAt(n);
	}
	return new Blob([u8arr], { type: mime });
}