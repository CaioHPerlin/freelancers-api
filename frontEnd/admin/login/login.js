const formAuth = document.getElementById('auth');

formAuth.addEventListener('submit', (e) => {
	e.preventDefault();
	const loaderContainer = document.getElementById('loadercont')
	loaderContainer.innerHTML = '<h1 class="loader"></h1>';

	const credentials = {
		username: formAuth.username.value,
		password: formAuth.password.value,
	};

	fetch('https://sebrae-api.vercel.app/auth', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(credentials),
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
            localStorage.setItem('token', data.token);

			window.location.href = '../dadosFreelancers/admin.html';
		})
		.catch((err) => {
			loaderContainer.innerHTML = '';
			console.error(err);
			alert(err.message);
		});
});
