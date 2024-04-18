function parseQueryString() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const serializedFreelancer = urlParams.get('freelancer');
    return JSON.parse(decodeURIComponent(serializedFreelancer));
  }

  function renderDetails(freelancer) {
    const detailsContainer = document.getElementById('details');

    for (const [key, value] of Object.entries(freelancer)) {
      const detail = document.createElement('p');
      detail.textContent = `${key}: ${value}`;
      detailsContainer.appendChild(detail);
    }

    if (freelancer.profilePicture) {
      const profilePicture = document.createElement('img');
      profilePicture.src = freelancer.profilePicture;
      profilePicture.alt = "Profile Picture";
      profilePicture.style.width = "300px";
      profilePicture.style.height = "auto";
      detailsContainer.appendChild(profilePicture);
    }
  }

  window.onload = function() {
    const freelancer = parseQueryString();
    renderDetails(freelancer);
  };