const formAuth = document.getElementById('auth');
const loaderContainer = document.getElementById('loadercont');

const fetchToken = async (credentials) => {
	try {
		const response = await fetch('https://sebrae-api.vercel.app/auth', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(credentials),
		});
		const data = await response.json();
		localStorage.setItem('token', data.token);
		loaderContainer.innerHTML = '';
		return (window.location.href = '../');
	} catch (err) {
		loaderContainer.innerHTML = '';
		console.error(err);
		fetchToken(credentials);
	}
};

formAuth.addEventListener('submit', (e) => {
	e.preventDefault();

	const credentials = {
		username: formAuth.username.value,
		password: formAuth.password.value,
	};
	
	loaderContainer.innerHTML = '<h1 class="loader"></h1>';

	fetchToken(credentials);
});
