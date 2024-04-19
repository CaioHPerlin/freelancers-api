async function fetchFreelancers() {
    try {
      const response = await fetch('https://sebrae-api.onrender.com/freelancers');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  async function renderFreelancers() {
    const freelancersContainer = document.getElementById('freelancers');
    const freelancers = await fetchFreelancers();

    if (!freelancers) return;

    const cards = freelancers.map(freelancer => createCard(freelancer));
    freelancersContainer.innerHTML = cards.join('');
  }

  function createCard(freelancer) {
    return `
      <div class="card">
        <h2>${freelancer.name}</h2>
        <img src="${freelancer.profilePicture}" alt="Profile Picture" style="width: 100%; height: auto;">
        <p>Location: ${freelancer.city}, ${freelancer.estado}</p>
        <button onclick="showDetails('${encodeURIComponent(JSON.stringify(freelancer))}')">Ver Mais</button>
      </div>
    `;
  }

  function showDetails(serializedFreelancer) {
    window.location.href = `detalhes.html?freelancer=${serializedFreelancer}`;
  }

  window.onload = renderFreelancers;