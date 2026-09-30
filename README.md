# TCC - Sistema E-Commerce e Gerenciamento de Roupas (Nana & Mimi)

Projeto de Trabalho de Conclusão de Curso (TCC) desenvolvido para o e-commerce de moda infantil **Nana & Mimi**.

**Autores:**
Ana Clara Kajita, Ellen Lopes, Laura Brilhante, Miriana Martins, Victor Gabriel, Vinicius Matos

---

## 🏗️ Estrutura do Projeto

O projeto é estruturado de forma desacoplada e modular, com projetos independentes para frontend e backend:

```
prebanca/
│
├── frontend/                     # Interface do usuário (React 19 + Vite)
│   ├── public/                   # Recursos estáticos públicos
│   ├── src/                      # Componentes, telas, estilos e serviços
│   │   ├── assets/               # Imagens e logotipos da marca
│   │   ├── services/api.js       # Conector HTTP com a API REST
│   │   ├── AuthContext.jsx       # Gerenciamento de estado de autenticação
│   │   ├── CarrinhoContext.jsx   # Gerenciamento do carrinho de compras
│   │   ├── Inicio.jsx            # Vitrine e catálogo de roupas
│   │   ├── Produto.jsx           # Detalhes da peça selecionada
│   │   ├── Carrinho.jsx          # Tela do carrinho de compras
│   │   ├── Login.jsx             # Autenticação de usuários
│   │   ├── Cadastro.jsx          # Registro de novos usuários
│   │   ├── GerenciarRoupas.jsx   # Gestão completa (CRUD) de roupas
│   │   ├── SobreNos.jsx          # História e apresentação da marca
│   │   └── Contato.jsx           # Canais de atendimento
│   ├── package.json
│   └── vite.config.js
│
├── backend/                      # API REST (Node.js + Express + MongoDB + JWT)
│   ├── src/
│   │   ├── config/database.js    # Conexão e inicialização com o MongoDB
│   │   ├── config/seed.js        # Carga inicial de peças do catálogo
│   │   ├── controllers/          # Controladores (auth e clothing)
│   │   ├── middleware/           # Middlewares de autenticação JWT e erros
│   │   ├── models/               # Modelos Mongoose (User e Clothing)
│   │   ├── routes/               # Rotas REST (/api/auth e /api/clothes)
│   │   ├── tests/                # Testes automatizados (18 testes integrados)
│   │   ├── app.js                # Configuração do Express e CORS
│   │   └── server.js             # Inicialização do servidor HTTP
│   ├── .env.example              # Modelo de variáveis de ambiente
│   ├── .gitignore                # Arquivos ignorados pelo Git no backend
│   ├── package.json
│   └── README.md
│
├── .gitignore                    # Regras globais de exclusão do Git
└── README.md                     # Documentação geral do projeto
```

---

## 🗄️ Configuração do Banco de Dados (MongoDB)

O backend utiliza o **MongoDB** através do **Mongoose**.

Você pode utilizar tanto uma instância local do MongoDB quanto um cluster gratuito na nuvem via **MongoDB Atlas**:

### Opção 1: MongoDB Atlas (Nuvem - Recomendado)
1. Crie uma conta gratuita em [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. Crie um cluster gratuito (M0 Sandbox).
3. Em **Database Access**, crie um usuário com senha.
4. Em **Network Access**, adicione seu IP atual (ou `0.0.0.0/0` para desenvolvimento).
5. Clique em **Connect** -> **Drivers** -> **Node.js** e copie sua connection string.
6. Cole na variável `MONGODB_URI` no arquivo `backend/.env`.

### Opção 2: MongoDB Local
- Inicie seu serviço local do MongoDB (porta padrão `27017`).
- A connection string padrão será `mongodb://localhost:27017/meu_tcc`.

---

## 🚀 Como Executar o Projeto Completo

Para executar o sistema completo, você precisará de 2 terminais abertos:

### Terminal 1: Backend (API REST)
```bash
cd backend
npm install
# Crie o .env a partir do .env.example se ainda não o fez
npm run dev
```
O servidor backend iniciará em `http://localhost:5000` (com a API disponível em `http://localhost:5000/api`).

### Terminal 2: Frontend (Interface React)
```bash
cd frontend
npm install
npm run dev
```
O frontend iniciará no Vite em `http://localhost:5173`.

---

## 🧪 Testes Automatizados

O backend conta com uma suíte completa de testes automatizados com banco de dados em memória isolado:

```bash
cd backend
npm test
```

Os testes cobrem:
- Registro de usuários válidos
- Bloqueio de e-mails duplicados
- Validação de campos de formulário
- Login com credenciais válidas e geração de JWT
- Bloqueio de login com senha incorreta ou usuário inexistente
- Consulta do usuário logado via `/api/auth/me`
- Bloqueio de requisições sem token ou com token inválido
- Criação de roupas associadas ao `userId`
- Listagem restrita às roupas do usuário autenticado (isolamento multiusuário)
- Consulta de roupa por identificador único (ID)
- Edição de roupas próprias
- Bloqueio contra edição ou exclusão de roupas de outros usuários (segurança 403 Forbidden)
- Exclusão com sucesso de roupas próprias