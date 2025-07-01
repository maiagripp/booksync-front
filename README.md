# 📚 BookSync

**BookSync** é uma aplicação web do tipo SPA (Single Page Application) feita com HTML, CSS e JavaScript puro. Ela permite que usuários cadastrem, façam login, pesquisem livros através da API do Google Books, avaliem livros com comentários e notas em forma de estrelas, e salvem seus livros como "lido" ou "lendo".

## 🔧 Tecnologias utilizadas

- HTML5
- CSS3
- JavaScript Vanilla (puro)
- [Google Books API](https://developers.google.com/books)
- Flask (no backend, não incluído neste repositório)

## 💡 Funcionalidades

- Registro e login de usuários com token JWT
- SPA com roteamento baseado em `hash`
- Verificação automática de expiração de sessão (logout automático)
- Exibição condicional de elementos com base no login e na rota
- Home logada personalizada com saudação ao usuário
- Busca de livros via API do Google Books
- Avaliação de livros com:
  - Nota de 1 a 5 estrelas
  - Comentário
  - Status de leitura: **lido** ou **lendo**
- Dashboard com lista de livros avaliados
- Modal intuitivo para avaliação
- Edição, exclusão e alteração de status de livros salvos


## 🚀 Como rodar o projeto

1. Clone este repositório:

```
git clone https://github.com/maiagripp/booksync-front
cd booksync-front
```

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

## 📧 Contato

Claudia Maia — [Email-me](mailto:maiaandradec@gmail.com)

Projeto desenvolvido como MVP para pós-graduação em Engenharia de Software - Sprint Desenvolvimento FullStack Básico na PUC-Rio.