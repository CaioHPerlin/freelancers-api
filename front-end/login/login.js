const formAuth = document.getElementById('auth');
const loaderContainer = document.getElementById('loadercont');

const fetchToken = async (credentials) => {
	try {
		const response = await fetch(
			'http://api.nkarbits.com.br/freelancers/auth',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(credentials),
			}
		);

		const data = await response.json();

		loaderContainer.innerHTML = '';

		if (response.ok) {
			window.sessionStorage.setItem('token', data.token);
			window.location.href = '../'; // Redirect to the desired page
		} else {
			alert(data.message); // Display error message
		}
	} catch (err) {
		loaderContainer.innerHTML = '';
		console.error('Error when fetching token:', err);
		alert('An error occurred. Please try again.');
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
