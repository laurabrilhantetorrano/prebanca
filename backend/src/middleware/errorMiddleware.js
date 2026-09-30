const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    message: `Rota não encontrada: ${req.method} ${req.originalUrl}`
  });
};

const errorHandler = (err, req, res, next) => {
  console.error('[Error Middleware]:', err);

  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Erro interno do servidor';

  // Erro de ID do Mongoose inválido (CastError)
  if (err.name === 'CastError') {
    statusCode = 404;
    message = 'Recurso não encontrado com o identificador fornecido';
  }

  // Erro de chave única duplicada no MongoDB (ex: e-mail)
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue || {})[0] || 'campo';
    message = `Já existe um registro com este ${field}`;
  }

  // Erros de validação do Mongoose
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
  }

  // Erros de JWT
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Token de autenticação inválido';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token de autenticação expirado';
  }

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

module.exports = { notFoundHandler, errorHandler };
