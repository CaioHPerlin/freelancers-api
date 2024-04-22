const formAuth = document.getElementById('auth');

formAuth.addEventListener('submit', (e) => {
	e.preventDefault();

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
			console.log(data);
            
            localStorage.setItem('token', data.token);

			window.location.href = '../dadosFreelancers/admin.html';
		})
		.catch((err) => {
			console.error(err);
			alert(err.message);
		});
});
