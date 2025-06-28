const apiBaseUrl = 'http://127.0.0.1:5000/api';

function updateLinkVisibility() {
  const dashboardLink = document.getElementById('dashboard-link');
  const loginLink = document.getElementById('nav-login');
  const registerLink = document.getElementById('nav-register');
  const logout = document.getElementById('nav-logout');
  const token = localStorage.getItem('token');

  if (token) {
    dashboardLink.classList.remove('hidden');
    loginLink.classList.add('hidden');
    registerLink.classList.add('hidden');
    logout.classList.remove('hidden');
  } else {
    dashboardLink.classList.add('hidden');
    loginLink.classList.remove('hidden');
    registerLink.classList.remove('hidden');
    logout.classList.add('hidden');
  }
}

document.getElementById('nav-logout').addEventListener('click', (e) => {
  e.preventDefault(); 
  localStorage.removeItem('token');
  updateLinkVisibility();
  route('home');
});

function route(path) {
  const cleanPath = path.replace(/^#\/?/, '');
  console.log(`Roteando para: ${cleanPath}`);
  document.querySelectorAll('.view').forEach(view => view.classList.add('hidden'));
  const targetView = document.getElementById(cleanPath + '-view');
  if (targetView) {
    targetView.classList.remove('hidden');
    window.location.hash = cleanPath;
    updateLinkVisibility();
  } else {
    console.error(`View not found for path: ${cleanPath}`);
  }
}

window.addEventListener('load', () => {
  const hash = window.location.hash.replace(/^#\/?/, '') || 'home';
  route(hash);
});

window.addEventListener('hashchange', () => {
  const path = window.location.hash.replace(/^#\/?/, '') || 'home';
  route(path);
});

// Cadastro
document.getElementById('register-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const body = {
    email: document.getElementById('register-email').value,
    password: document.getElementById('register-password').value,
  };

  const res = await fetch(`${apiBaseUrl}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (res.ok) {
    alert(data.message);
    route('login');
  } else {
    alert(data.message || 'Erro ao registrar');
  }
});

// Login
document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const body = {
    email: document.getElementById('login-email').value,
    password: document.getElementById('login-password').value,
  };

  const res = await fetch(`${apiBaseUrl}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (res.ok) {
    localStorage.setItem('token', data.access_token);
    route('dashboard');
    loadBooks();
  } else {
    alert(data.message || 'Erro ao fazer login');
  }
});

// Buscar livros
document.getElementById('search-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const query = document.getElementById('search-query').value;
  const res = await fetch(`${apiBaseUrl}/user/books/search?query=${encodeURIComponent(query)}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  const data = await res.json();

  const results = document.getElementById('search-results');
  results.innerHTML = '';

  if (data.items && data.items.length > 0) {
    data.items.forEach(item => {
      const card = document.createElement('div');
      card.className = 'book-card';
      card.innerHTML = `
        <h4>${item.volumeInfo.title}</h4>
        <p>${item.volumeInfo.authors ? item.volumeInfo.authors.join(', ') : 'Autor desconhecido'}</p>
        <img src="${item.volumeInfo.imageLinks ? item.volumeInfo.imageLinks.thumbnail : 'https://via.placeholder.com/128x192'}" alt="${item.volumeInfo.title}" />
        <br>
        <button onclick="saveBook('${item.id}', '${item.volumeInfo.title.replace(/'/g, "\\'")}')">Ver livro</button>
      `;
      results.appendChild(card);
    });
  } else {
    results.innerHTML = '<p>Nenhum livro encontrado.</p>';
  }
});

let currentBookToSave = null;

async function saveBook(googleId, title) {
  currentBookToSave = { googleId, title };
  showRatingModal(title);
}

function showRatingModal(title) {
  const modal = document.getElementById('rating-modal');
  modal.classList.remove('hidden');
  modal.querySelector('h3').textContent = `Avalie "${title}"`;
  ratingInput.value = '';
  updateStars(0);
  document.getElementById('rating-comment').value = '';
  document.getElementById('rating-status').value = '';
}

document.getElementById('rating-cancel').addEventListener('click', () => {
  document.getElementById('rating-modal').classList.add('hidden');
  currentBookToSave = null;
});

const stars = document.querySelectorAll('#star-rating .star');
const ratingInput = document.getElementById('rating-score');

stars.forEach(star => {
  star.addEventListener('click', () => {
    const value = parseInt(star.getAttribute('data-value'));
    ratingInput.value = value;
    updateStars(value);
  });

  star.addEventListener('mouseover', () => {
    const value = parseInt(star.getAttribute('data-value'));
    highlightStars(value);
  });

  star.addEventListener('mouseout', () => {
    highlightStars(parseInt(ratingInput.value) || 0);
  });
});

function updateStars(rating) {
  stars.forEach(star => {
    const starValue = parseInt(star.getAttribute('data-value'));
    if (starValue <= rating) {
      star.classList.add('selected');
    } else {
      star.classList.remove('selected');
    }
  });
}

function highlightStars(rating) {
  stars.forEach(star => {
    const starValue = parseInt(star.getAttribute('data-value'));
    if (starValue <= rating) {
      star.style.color = 'gold';
    } else {
      star.style.color = '#ccc';
    }
  });
}

document.getElementById('rating-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const rating = parseInt(document.getElementById('rating-score').value);
  const comment = document.getElementById('rating-comment').value.trim();
  const status = document.getElementById('rating-status').value;

  if (!currentBookToSave) {
    alert('Nenhum livro selecionado para avaliação.');
    return;
  }

  const res = await fetch(`${apiBaseUrl}/user/books/${currentBookToSave.googleId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({ rating, comment, status }),
  });

  const data = await res.json();
  alert(data.message);

  document.getElementById('rating-modal').classList.add('hidden');
  currentBookToSave = null;
  loadBooks();
});

// Carregar livros salvos (exemplo simples, você pode implementar a rota real)
async function loadBooks() {
  // TODO: implementar chamada real para backend e renderizar livros
  // Por enquanto exemplo estático para visualização:
  const bookList = document.getElementById('book-list');
  bookList.innerHTML = `
    <div class="book-card">
      <h4>Exemplo de Livro Salvo</h4>
      <p>Autor Exemplo</p>
      <p>Status: Lido</p>
      <p>Nota: 5</p>
      <p>Comentário: Excelente livro!</p>
    </div>
  `;
}

// Atualiza visibilidade do link dashboard quando a página muda, logo após carregar a página
updateLinkVisibility();
