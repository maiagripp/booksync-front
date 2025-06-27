const apiBase = 'http://127.0.0.1:5000/api';

function showMessage(msg, isError = false) {
  const msgDiv = document.getElementById('message');
  msgDiv.textContent = msg;
  msgDiv.style.color = isError ? 'red' : 'green';
}

async function login(event) {
  event.preventDefault();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!email || !password) {
    showMessage('Preencha email e senha', true);
    return;
  }

  try {
    const res = await fetch(`${apiBase}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const err = await res.json();
      showMessage(err.msg || 'Erro ao fazer login', true);
      return; }

    const data = await res.json();
    localStorage.setItem('token', data.access_token);
    showMessage('Login realizado com sucesso');
    // Aqui você pode chamar a função para mostrar a próxima tela
    // Por exemplo: showDashboard();
  } catch (error) {
    showMessage('Erro na conexão', true);
  }
}

document.getElementById('login-form').addEventListener('submit', login);
