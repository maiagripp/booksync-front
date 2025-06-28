# 📚 BookSync

**BookSync** é uma aplicação web do tipo SPA (Single Page Application) feita com HTML, CSS e JavaScript puro. Ela permite que usuários cadastrem, façam login, pesquisem livros através da API do Google Books, avaliem livros com comentários e notas em forma de estrelas, e salvem seus livros como "lido" ou "lendo".

## 🔧 Tecnologias utilizadas

- HTML5
- CSS3
- JavaScript Vanilla (puro)
- [Google Books API](https://developers.google.com/books)
- Flask (no backend, não incluído neste repositório)

## 💡 Funcionalidades

- Registro e login de usuários
- Roteamento SPA (sem recarregar a página)
- Controle de sessão com `localStorage`
- Busca de livros pela API do Google Books
- Avaliação de livros com:
  - Nota de 1 a 5 (estrelas)
  - Comentário
  - Status: lido ou lendo
- Interface com modal de avaliação
- Dashboard com livros salvos
- Botão de deslogar
- Links da navbar atualizados de acordo com login

## 🖼️ Layout

O layout é responsivo e utiliza cores vivas com uma navegação simples e direta.

## 🚀 Como rodar o projeto

1. Clone este repositório:

```
git clone https://github.com/maiagripp/booksync-front
cd booksync
```

Certifique-se de que o backend Flask esteja rodando na porta `5000` com as rotas:

- POST /api/register
- POST /api/login
- GET /api/user/books/search?query=...
- POST /api/user/books/<google_book_id>

⚠️ O frontend foi feito para funcionar com a API rodando em http://127.0.0.1:5000/api.

Abra o arquivo index.html no navegador:

```
open index.html
```
ou apenas arraste o arquivo para o navegador.

## 📁 Estrutura

```plaintext
📦booksync/
 ┣ 📜 index.html
 ┣ 📜 styles.css
 ┣ 📜 app.js
 ┗ 📜 README.md
```

## 🔐 Autenticação

- O token JWT é salvo no localStorage do navegador.
- O botão de "Dashboard" só aparece se o usuário estiver logado.
- As rotas de busca e salvar livros exigem autenticação via token Bearer.

## 📝 Futuras melhorias
- Implementar edição e exclusão de avaliações
- Exibir lista completa de livros salvos
- Adicionar paginação na busca
- Criar filtros na dashboard



## 📧 Contato

Claudia Maia — [Email-me](mailto:maiaandradec@gmail.com)

Projeto desenvolvido como MVP para pós-graduação em Engenharia de Software - Sprint Desenvolvimento FullStack Básico na PUC-Rio.