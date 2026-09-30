const app = require('./app');
const { connectDB } = require('./config/database');
const { seedInitialData } = require('./config/seed');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Conecta ao MongoDB
    await connectDB();

    // Semeia dados iniciais caso o banco esteja vazio
    await seedInitialData();

    app.listen(PORT, () => {
      console.log(`===============================================`);
      console.log(`🚀 Servidor Backend rodando na porta ${PORT}`);
      console.log(`🔗 URL da API: http://localhost:${PORT}/api`);
      console.log(`🛡️ Ambiente: ${process.env.NODE_ENV || 'desenvolvimento'}`);
      console.log(`===============================================`);
    });
  } catch (error) {
    console.error('Falha ao iniciar o servidor:', error.message);
    process.exit(1);
  }
};

startServer();
