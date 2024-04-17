const dadosfreelancers = document.getElementById('dadosFreelancers');

dadosfreelancers.addEventListener('submit', evento => {
  evento.preventDefault();
  const freelancersData = new FormData(dadosfreelancers);
  const data = Object.fromEntries(freelancersData);

  fetch('https://sebrae-api.onrender.com/freelancers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })
    .then((res) => res.json())
    .then(data => {
      console.log(data);
      alert('Cadastro realizado com sucesso!');
    })
    .catch((err) => {   
      console.error(err);
      alert('Erro ao cadastrar!');
    });
});


//(data) => {
    //console.log('Successo:', data);
    //alert('Cadastro realizado com sucesso!');
   // window.location.href = 'freelancers.html';
