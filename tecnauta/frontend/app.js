// Configurações Globais de Navegação e Telas (Frontend)
const SCREENS = ['login','signup','home','subjects','biology','materia-portugues','materia-matematica','materia-historia','materia-geografia','materia-ciencias','quiz','ranking','profile'];
const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=400';

// API URL fictícia para quando conectar a um backend real (ex: Node.js/Python)
const API_BASE_URL = 'http://localhost:3000/api'; 

function showScreenById(id){
  SCREENS.forEach(s => {
    const el = document.getElementById(s);
    if(el) el.classList.toggle('hidden-screen', s !== id);
  });
  
  const navbar = document.getElementById('navbar');
  if(id === 'login' || id === 'signup') {
    navbar.classList.add('hidden-screen');
  } else {
    navbar.classList.remove('hidden-screen');
  }
  
  updateNavUser();
  if(id === 'ranking' && typeof renderRanking === 'function') renderRanking();
  window.scrollTo({top: 0, behavior: 'smooth'});
}

function routeToHash(){
  let h = location.hash.replace('#','') || 'login';
  if(!SCREENS.includes(h)) h = 'login';
  showScreenById(h);
}

window.addEventListener('hashchange', routeToHash);

// Auxiliares do LocalStorage (Simulando chamadas que iriam para o backend)
function getUserKey(email){ return `user_${email.toLowerCase()}`; }
function getLoggedUserEmail(){ return localStorage.getItem('loggedUser') || null; }
function setLoggedUser(email){ 
  if(email) localStorage.setItem('loggedUser', email.toLowerCase()); 
  else localStorage.removeItem('loggedUser'); 
}

// Cadastro -> No futuro, fará um fetch(API_BASE_URL + '/auth/signup')
document.getElementById('btnSignup').addEventListener('click', ()=>{
  const name = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim().toLowerCase();
  const pass = document.getElementById('signupPass').value;
  if(!name || !email || !pass){ alert('Preencha todos os campos.'); return; }
  if(localStorage.getItem(getUserKey(email))){ alert('E-mail já cadastrado. Faça login.'); location.hash = '#login'; return; }
  
  const user = { name, email, pass, avatar: null };
  localStorage.setItem(getUserKey(email), JSON.stringify(user));
  localStorage.setItem(`points_${email}`, '0');
  alert('Conta criada com sucesso! Faça login.');
  location.hash = '#login';
});

// Login -> No futuro, fará um fetch(API_BASE_URL + '/auth/login')
document.getElementById('btnLogin').addEventListener('click', ()=>{
  const email = document.getElementById('loginEmail').value.trim().toLowerCase();
  const pass = document.getElementById('loginPass').value;
  if(!email || !pass){ alert('Preencha e-mail e senha.'); return; }
  const raw = localStorage.getItem(getUserKey(email));
  if(!raw){ alert('Usuário não encontrado. Cadastre-se.'); location.hash = '#signup'; return; }
  const user = JSON.parse(raw);
  if(user.pass !== pass){ alert('Senha incorreta.'); return; }
  
  setLoggedUser(email);
  loadLoggedUserToUI();
  location.hash = '#home';
});

// Logout
document.getElementById('btnLogout')?.addEventListener('click', ()=>{
  setLoggedUser(null);
  document.getElementById('userNameDisplay').textContent = 'Usuário';
  document.getElementById('userEmailDisplay').textContent = '—';
  document.getElementById('profileAvatar').src = document.getElementById('navAvatar').src = DEFAULT_AVATAR;
  location.hash = '#login';
});

// Upload de Foto de Perfil -> No futuro, enviará multipart/form-data para o servidor
document.getElementById('btnUpload')?.addEventListener('click', ()=>{
  const input = document.getElementById('avatarInput');
  if(!input || !input.files || !input.files[0]){ alert('Escolha uma imagem primeiro.'); return; }
  const file = input.files[0];
  const reader = new FileReader();
  reader.onload = function(e){
    const data = e.target.result;
    const email = getLoggedUserEmail();
    if(!email){ alert('Faça login para enviar a foto.'); return; }
    const key = getUserKey(email);
    const raw = localStorage.getItem(key);
    if(!raw) return;
    const user = JSON.parse(raw);
    user.avatar = data;
    localStorage.setItem(key, JSON.stringify(user));
  
    document.getElementById('profileAvatar').src = data;
    document.getElementById('navAvatar').src = data;
    document.getElementById('homeAvatar').src = data;
    document.getElementById('greetName').textContent = user.name;
    document.getElementById('greet').classList.remove('hidden');
    alert('Foto atualizada!');
  };
  reader.readAsDataURL(file);
});

// Sincronizações de UI
function loadLoggedUserToUI(){
  const email = getLoggedUserEmail();
  if(!email) return;
  const raw = localStorage.getItem(getUserKey(email));
  if(!raw) return;
  const user = JSON.parse(raw);
  document.getElementById('userNameDisplay').textContent = user.name;
  document.getElementById('userEmailDisplay').textContent = user.email;
  
  const imgUrl = user.avatar || DEFAULT_AVATAR;
  document.getElementById('profileAvatar').src = imgUrl;
  document.getElementById('navAvatar').src = imgUrl;
  document.getElementById('homeAvatar').src = imgUrl;
  
  document.getElementById('greetName').textContent = user.name;
  document.getElementById('greet').classList.remove('hidden');
  
  const score = localStorage.getItem(`score_${email}`);
  if(score){ 
    document.getElementById('lastScoreValue').textContent = score; 
    document.getElementById('lastScore').classList.remove('hidden-screen'); 
  }
  const pts = Number(localStorage.getItem(`points_${email}`) || 0);
  document.getElementById('userPointsDisplay').textContent = `Pontos: ${pts}`;
}

function updateNavUser(){
  const email = getLoggedUserEmail();
  if(!email){ document.getElementById('greet').classList.add('hidden'); return; }
  const raw = localStorage.getItem(getUserKey(email));
  if(!raw) return;
  const user = JSON.parse(raw);
  document.getElementById('greetName').textContent = user.name;
  document.getElementById('greet').classList.remove('hidden');
  if(user.avatar) document.getElementById('navAvatar').src = user.avatar;
}

// Inicializador Automático
(function init(){
  document.getElementById('navAvatar').src = DEFAULT_AVATAR;
  document.getElementById('profileAvatar').src = DEFAULT_AVATAR;
  document.getElementById('homeAvatar').src = DEFAULT_AVATAR;

  const hash = location.hash.replace('#','');
  if(hash && SCREENS.includes(hash)) {
    routeToHash();
  } else {
    const logged = getLoggedUserEmail();
    if(logged){
      loadLoggedUserToUI();
      location.hash = '#home';
    } else {
      location.hash = '#login';
    }
  }
  routeToHash();
})();