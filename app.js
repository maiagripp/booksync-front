const apiBaseUrl = "http://127.0.0.1:5000/api";

let currentBookToSave = null;
let editingBookId = null;

function updateLinkVisibility() {
  const dashboardLink = document.getElementById("dashboard-link");
  const searchLink = document.getElementById("search-link");
  const logoutButton = document.getElementById("nav-logout");
  const token = localStorage.getItem("token");

  if (token) {
    dashboardLink.classList.remove("hidden");
    searchLink.classList.remove("hidden");
    logoutButton.classList.remove("hidden");
  } else {
    dashboardLink.classList.add("hidden");
    searchLink.classList.add("hidden");
    logoutButton.classList.add("hidden");
  }
}

function highlightActiveNav() {
  const path = window.location.hash.replace(/^#\/?/, "") || "home";
  document.querySelectorAll("nav a.nav-link").forEach((link) => {
    const hrefPath = link.getAttribute("href").replace(/^#\/?/, "") || "home";
    if (hrefPath === path) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

function route(path) {
  const cleanPath = path.replace(/^#\/?/, "") || "home";
  document
    .querySelectorAll(".view")
    .forEach((view) => view.classList.add("hidden"));
  const targetView = document.getElementById(cleanPath + "-view");
  if (targetView) {
    targetView.classList.remove("hidden");
    if (
      window.location.hash !== `#${cleanPath}` &&
      window.location.hash !== `#/${cleanPath}`
    ) {
      window.location.hash = cleanPath;
    }
    updateLinkVisibility();
    highlightActiveNav();

    if (cleanPath === "dashboard") {
      loadBooks();
    } else if (cleanPath === "search") {
      document.getElementById("search-query").value = "";
      document.getElementById("search-results").innerHTML = "";
    }
  } else {
    console.error(`View not found for path: ${cleanPath}`);
  }
}

window.addEventListener("load", () => {
  const hash = window.location.hash.replace(/^#\/?/, "") || "home";
  route(hash);
});

window.addEventListener("hashchange", () => {
  const path = window.location.hash.replace(/^#\/?/, "") || "home";
  route(path);
});

document.getElementById("nav-logout").addEventListener("click", () => {
  localStorage.removeItem("token");
  updateLinkVisibility();
  route("home");
});

document.getElementById("home-cta").addEventListener("click", () => {
  const token = localStorage.getItem("token");
  if (token) {
    route("dashboard");
  } else {
    route("login");
  }
});

// Cadastro
const registerForm = document.getElementById("register-form");
registerForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const body = {
    email: document.getElementById("register-email").value,
    password: document.getElementById("register-password").value,
  };

  const res = await fetch(`${apiBaseUrl}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (res.ok) {
    alert(data.message);
    route("login");
  } else {
    alert(data.message || "Erro ao registrar");
  }
});

// Login
const loginForm = document.getElementById("login-form");
loginForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const body = {
    email: document.getElementById("login-email").value,
    password: document.getElementById("login-password").value,
  };

  const res = await fetch(`${apiBaseUrl}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (res.ok) {
    localStorage.setItem("token", data.access_token);
    route("dashboard");
  } else {
    alert(data.message || "Erro ao fazer login");
  }
});

// Buscar livros
const searchForm = document.getElementById("search-form");
searchForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const query = document.getElementById("search-query").value;
  if (!query.trim()) {
    alert("Digite um termo para busca.");
    return;
  }
  const res = await fetch(
    `${apiBaseUrl}/user/books/search?query=${encodeURIComponent(query)}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
  const data = await res.json();

  const results = document.getElementById("search-results");
  results.innerHTML = "";

  if (data.items && data.items.length > 0) {
    data.items.forEach((item) => {
      const card = document.createElement("div");
      card.className = "book-card";
      card.innerHTML = `
        <h4>${item.volumeInfo.title}</h4>
        <p>${
          item.volumeInfo.authors
            ? item.volumeInfo.authors.join(", ")
            : "Autor desconhecido"
        }</p>
        <img src="${
          item.volumeInfo.imageLinks
            ? item.volumeInfo.imageLinks.thumbnail
            : "https://via.placeholder.com/100"
        }" alt="${item.volumeInfo.title}" />
        <button onclick="saveBook('${
          item.id
        }', '${item.volumeInfo.title.replace(
        /'/g,
        "\\'"
      )}')">Avaliar livro</button>
      `;
      results.appendChild(card);
    });
  } else {
    results.innerHTML = "<p>Nenhum livro encontrado.</p>";
  }
});

function saveBook(googleId, title) {
  currentBookToSave = { googleId, title };
  editingBookId = null;
  showRatingModal(title);
}

function showRatingModal(title) {
  const modal = document.getElementById("rating-modal");
  modal.classList.remove("hidden");
  modal.querySelector("h3").textContent = `Avalie o livro: "${title}"`;
  document.getElementById("rating-score").value = "";
  document.getElementById("rating-comment").value = "";
  document.getElementById("rating-status").value = "";

  document.querySelectorAll("#star-rating .star").forEach((star) => {
    star.classList.remove("selected", "hovered");
  });
}

document.getElementById("rating-cancel").addEventListener("click", () => {
  document.getElementById("rating-modal").classList.add("hidden");
  currentBookToSave = null;
  editingBookId = null;
});

// Estrelas
const stars = document.querySelectorAll("#star-rating .star");
stars.forEach((star) => {
  star.addEventListener("mouseenter", () => {
    const val = parseInt(star.dataset.value);
    stars.forEach((s) =>
      s.classList.toggle("hovered", parseInt(s.dataset.value) <= val)
    );
  });
  star.addEventListener("mouseleave", () => {
    stars.forEach((s) => s.classList.remove("hovered"));
  });
  star.addEventListener("click", () => {
    const val = parseInt(star.dataset.value);
    document.getElementById("rating-score").value = val;
    stars.forEach((s) => {
      s.classList.toggle("selected", parseInt(s.dataset.value) <= val);
    });
  });
});

document.getElementById("rating-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const rating = parseInt(document.getElementById("rating-score").value);
  const comment = document.getElementById("rating-comment").value.trim();
  const status = document.getElementById("rating-status").value;
  const token = localStorage.getItem("token");

  const googleId = currentBookToSave?.googleId || editingBookId;
  if (!googleId) {
    alert("Nenhum livro selecionado para avaliação.");
    return;
  }

  const url = `${apiBaseUrl}/user/books/${googleId}`;
  const method = currentBookToSave ? "POST" : "PUT";

  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ rating, comment, status }),
  });

  const data = await res.json();
  alert(data.message);

  document.getElementById("rating-modal").classList.add("hidden");
  currentBookToSave = null;
  editingBookId = null;
  route("dashboard");
});

async function loadBooks() {
  const res = await fetch(`${apiBaseUrl}/user/books`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const data = await res.json();
  const bookList = document.getElementById("book-list");
  bookList.innerHTML = "";

  if (data.books && data.books.length > 0) {
    data.books.forEach((book) => {
      const starsHtml = Array(5)
        .fill(0)
        .map((_, i) => {
          return i < book.rating ? "★" : "☆";
        })
        .join("");

      const card = document.createElement("div");
      card.className = "book-card";

      card.innerHTML = `
  <h4>${book.title}</h4>
  <img src="${book.image || "https://via.placeholder.com/100"}" alt="${
        book.title
      }" />
  <p>Status: <span class="status-text ${book.status}">${book.status}</span> 
    <button class="btn-change-status" data-id="${
      book.google_id
    }" data-status="${book.status}">Alterar status</button>
  </p>
  <p>Nota: <span style="color: #FFD700; font-size: 1.2rem;">${starsHtml}</span></p>
  <p>Comentário: ${book.comment}</p>
  <div class="book-card-buttons">
    <button class="btn-edit" data-id="${book.google_id}">Editar</button>
    <button class="btn-delete" data-id="${book.google_id}">Excluir</button>
  </div>
`;

      bookList.appendChild(card);
    });

    document.querySelectorAll(".btn-edit").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = e.target.dataset.id;
        editBookReview(id);
      });
    });
    document.querySelectorAll(".btn-delete").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = e.target.dataset.id;
        if (confirm("Tem certeza que quer excluir essa avaliação?")) {
          deleteBookReview(id);
        }
      });
    });
    document.querySelectorAll(".btn-change-status").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = e.target.dataset.id;
        const currentStatus = e.target.dataset.status;
        toggleBookStatus(id, currentStatus);
      });
    });
  } else {
    bookList.innerHTML = "<p>Nenhum livro salvo ainda.</p>";
  }
}

async function editBookReview(googleId) {
  editingBookId = googleId;
  const token = localStorage.getItem("token");
  const res = await fetch(`${apiBaseUrl}/user/books`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  const book = data.books.find((b) => b.google_id === googleId);

  if (!book) {
    alert("Livro não encontrado para edição");
    return;
  }

  currentBookToSave = null;

  showRatingModal(book.title);
  document.getElementById("rating-score").value = book.rating;
  document.getElementById("rating-comment").value = book.comment;
  document.getElementById("rating-status").value = book.status;

  const stars = document.querySelectorAll("#star-rating .star");
  stars.forEach((s) => {
    const val = parseInt(s.dataset.value);
    s.classList.toggle("selected", val <= book.rating);
  });
}

async function deleteBookReview(googleId) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${apiBaseUrl}/user/books/${googleId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  alert(data.message);
  loadBooks();
}

async function toggleBookStatus(googleId, currentStatus) {
  const token = localStorage.getItem("token");
  const newStatus = currentStatus === "lido" ? "lendo" : "lido";

  const res = await fetch(`${apiBaseUrl}/user/books/${googleId}/status`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status: newStatus }),
  });
  const data = await res.json();
  alert(data.message);
  loadBooks();
}

updateLinkVisibility();
highlightActiveNav();
