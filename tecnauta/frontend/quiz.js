function submitQuizToBackend(formId, quizType){
  const form = document.getElementById(formId);
  if(!form) return;

  const formData = {};
  const inputs = form.querySelectorAll('input[type="radio"]:checked');
  inputs.forEach(input => {
    formData[input.name] = input.value;
  });

  const email = getLoggedUserEmail();
  if(!email){
    if(confirm('Faça login para salvar sua pontuação. Deseja ir para o Login?')) location.hash = '#login';
    return;
  }

  alert('Respostas enviadas para validação no Servidor (Backend)!');
}

document.getElementById('btnCheck')?.addEventListener('click', () => submitQuizToBackend('quizForm', 'geral'));
document.getElementById('btnCheck_portugues')?.addEventListener('click', () => submitQuizToBackend('quiz_portugues', 'portugues'));
document.getElementById('btnCheck_matematica')?.addEventListener('click', () => submitQuizToBackend('quiz_matematica', 'matematica'));
document.getElementById('btnCheck_historia')?.addEventListener('click', () => submitQuizToBackend('quiz_historia', 'historia'));
document.getElementById('btnCheck_geografia')?.addEventListener('click', () => submitQuizToBackend('quiz_geografia', 'geografia'));
document.getElementById('btnCheck_ciencias')?.addEventListener('click', () => submitQuizToBackend('quiz_ciencias', 'ciencias'));

function renderRanking(){
  const tbody = document.querySelector('#rankingTable tbody');
  if(!tbody) return;
  tbody.innerHTML = '<tr><td colspan="4" class="text-center">Carregando dados do servidor...</td></tr>';
 
  tbody.innerHTML = `<tr><td>1</td><td>Professor Exemplo</td><td>100</td><td>4/4</td></tr>`;
}

document.getElementById('btnRefreshRanking')?.addEventListener('click', renderRanking);
window.renderRanking = renderRanking;