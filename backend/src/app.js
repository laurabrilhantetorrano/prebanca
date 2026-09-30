require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const clothingRoutes = require('./routes/clothingRoutes');
const { notFoundHandler, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// Configuração do CORS flexível e segura
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000'
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Permite requisições sem origin (como Postman, mobile ou testes internos)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // Permissivo para desenvolvimento do TCC
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Middleware para processar JSON e URL encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rota de status / verificação da API
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'API do TCC em execução',
    timestamp: new Date().toISOString()
  });
});

// Rotas principais
app.use('/api/auth', authRoutes);
app.use('/api/clothes', clothingRoutes);

// Middlewares para tratamento de erros
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
