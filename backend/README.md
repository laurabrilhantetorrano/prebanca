# Backend - Sistema de Roupas e Autenticação (TCC Nana & Mimi)

Backend completo desenvolvido em Node.js com Express e MongoDB (Mongoose), fornecendo uma API REST robusta, segura e isolada para o projeto de TCC Nana & Mimi Moda Infantil.

---

## 📋 Requisitos

Antes de iniciar, certifique-se de ter instalado em sua máquina:
- **Node.js** (versão 18 ou superior, recomendado v20+)
- **npm** (gerenciador de pacotes)
- **MongoDB** (instância local rodando na porta 27017 ou cluster na nuvem como MongoDB Atlas)

---

## 🚀 Instalação

Abra o terminal e acesse a pasta do backend:

```bash
cd backend
npm install
```

---

## ⚙️ Configuração das Variáveis de Ambiente

Crie o arquivo `.env` na pasta `backend/` copiando o modelo de exemplo:

```bash
# No Windows PowerShell:
Copy-Item .env.example .env

# No Linux / macOS:
cp .env.example .env
```

Abra o arquivo `.env` e configure suas variáveis:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/meu_tcc
# Ou com o MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<usuario>:<senha>@cluster.mongodb.net/meu_tcc?retryWrites=true&w=majority
JWT_SECRET=sua_chave_secreta_super_segura_jwt
FRONTEND_URL=http://localhost:5173
```

> **Atenção de Segurança:** O arquivo `.env` contém credenciais e nunca deve ser enviado para o repositório Git. Ele já está devidamente listado no `.gitignore`.

---

## 🏃 Como Executar

### Modo de Desenvolvimento (com recarregamento automático via Nodemon):
```bash
npm run dev
```

### Modo de Produção:
```bash
npm start
```

### Executar a Suíte de Testes Automatizados:
```bash
npm test
```

---

## 📂 Estrutura do Backend

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js     # Conexão com o banco de dados MongoDB
│   │   └── seed.js         # Semeador de dados iniciais do catálogo
│   ├── controllers/
│   │   ├── authController.js       # Lógica de registro, login e me
│   │   └── clothingController.js   # Lógica do CRUD de roupas
│   ├── middleware/
│   │   ├── authMiddleware.js       # Validação e proteção via JWT
│   │   └── errorMiddleware.js      # Tratamento global de erros e 404
│   ├── models/
│   │   ├── User.js         # Schema de usuários com criptografia bcrypt
│   │   └── Clothing.js     # Schema de roupas associadas a usuários
│   ├── routes/
│   │   ├── authRoutes.js       # Rotas de autenticação
│   │   └── clothingRoutes.js   # Rotas de roupas
│   ├── tests/
│   │   └── api.test.js     # Suíte de testes automatizados com MongoDB Memory
│   ├── app.js              # Configuração do Express, CORS e middlewares
│   └── server.js           # Ponto de entrada do servidor HTTP
├── .env.example            # Exemplo de configuração
├── .gitignore              # Arquivos ignorados pelo Git
├── package.json            # Dependências e scripts
└── README.md               # Documentação do backend
```

---

## 📖 Documentação da API REST

Todas as rotas possuem o prefixo `/api`.

### 🔐 Autenticação (`/api/auth`)

#### 1. Cadastro de Usuário
- **Rota:** `POST /api/auth/register`
- **Acesso:** Público
- **Corpo da requisição (JSON):**
  ```json
  {
    "name": "Maria Silva",
    "email": "maria@email.com",
    "password": "senhaSegura123"
  }
  ```
  *(Também aceita os campos equivalentes do formulário: `username` e `senha`)*
- **Resposta de Sucesso (201 Created):**
  ```json
  {
    "message": "Usuário registrado com sucesso",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "65b...",
      "name": "Maria Silva",
      "email": "maria@email.com"
    }
  }
  ```

#### 2. Login
- **Rota:** `POST /api/auth/login`
- **Acesso:** Público
- **Corpo da requisição (JSON):**
  ```json
  {
    "email": "maria@email.com",
    "password": "senhaSegura123"
  }
  ```
  *(Também aceita login com `username`)*
- **Resposta de Sucesso (200 OK):**
  ```json
  {
    "message": "Login realizado com sucesso",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "65b...",
      "name": "Maria Silva",
      "email": "maria@email.com"
    }
  }
  ```

#### 3. Obter Usuário Autenticado
- **Rota:** `GET /api/auth/me`
- **Acesso:** Privado
- **Header:** `Authorization: Bearer <TOKEN_JWT>`
- **Resposta de Sucesso (200 OK):**
  ```json
  {
    "user": {
      "id": "65b...",
      "name": "Maria Silva",
      "email": "maria@email.com",
      "createdAt": "2026-09-30T10:00:00.000Z"
    }
  }
  ```

---

### 👗 Roupas (`/api/clothes`)

#### 1. Listar Roupas do Usuário Autenticado
- **Rota:** `GET /api/clothes`
- **Acesso:** Privado
- **Header:** `Authorization: Bearer <TOKEN_JWT>`
- **Parâmetros opcionais de busca:**
  - `?catalog=true`: lista peças públicas e disponíveis do catálogo geral
  - `?search=Camiseta`: busca por nome
  - `?category=Pijama`: filtra por categoria
- **Resposta de Sucesso (200 OK):**
  ```json
  [
    {
      "id": "65b...",
      "name": "Body + Corpete Bege",
      "category": "Body",
      "color": "Bege",
      "size": "M",
      "image": "/src/assets/produto1.png",
      "price": "R$ 105,00",
      "description": "Lindo body...",
      "userId": "65b...",
      "createdAt": "2026-09-30T10:00:00.000Z"
    }
  ]
  ```

#### 2. Obter Roupa por ID
- **Rota:** `GET /api/clothes/:id`
- **Acesso:** Privado (ou público se o item for do catálogo)
- **Header:** `Authorization: Bearer <TOKEN_JWT>`
- **Resposta de Sucesso (200 OK):** Dados completos da peça de roupa.

#### 3. Cadastrar Nova Roupa
- **Rota:** `POST /api/clothes`
- **Acesso:** Privado
- **Header:** `Authorization: Bearer <TOKEN_JWT>`
- **Corpo da requisição (JSON):**
  ```json
  {
    "name": "Camiseta Algodão",
    "category": "Camiseta",
    "color": "Branco",
    "size": "G",
    "image": "https://url-da-imagem.com/foto.jpg",
    "price": "R$ 49,90",
    "oldPrice": "R$ 59,90",
    "description": "Camiseta confortável para crianças."
  }
  ```
  *(Suporta aliases em português: `nome`, `categoria`, `cor`, `tamanho`, `img`, `preco`, `precoAntigo`, `desc`)*
- **Resposta de Sucesso (201 Created):** Objeto da roupa criada com `userId` associado ao usuário logado.

#### 4. Atualizar Roupa
- **Rota:** `PUT /api/clothes/:id`
- **Acesso:** Privado (somente o próprio dono pode editar)
- **Header:** `Authorization: Bearer <TOKEN_JWT>`
- **Corpo da requisição (JSON):** Campos que deseja atualizar.
- **Resposta de Sucesso (200 OK):** Objeto atualizado.

#### 5. Excluir Roupa
- **Rota:** `DELETE /api/clothes/:id`
- **Acesso:** Privado (somente o próprio dono pode excluir)
- **Header:** `Authorization: Bearer <TOKEN_JWT>`
- **Resposta de Sucesso (200 OK):**
  ```json
  {
    "message": "Roupa excluída com sucesso",
    "id": "65b..."
  }
  ```

---

## 🔒 Mecanismos de Segurança Implementados
1. **Hash de Senha com Salt (bcryptjs):** Senhas nunca são salvas ou trafegadas em texto puro.
2. **Tokens JWT com expiração:** Sessão sem estado com tempo de expiração de 7 dias.
3. **Isolamento de Dados Multiusuário:** Verificação estrita de posse em todas as operações de alteração ou exclusão (retorno 403 Forbidden para tentativas não autorizadas).
4. **Proteção contra injeções e validações do Mongoose.**
5. **CORS configurável para o Frontend.**
