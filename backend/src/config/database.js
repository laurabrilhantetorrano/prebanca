const mongoose = require('mongoose');

const connectDB = async (customUri) => {
  try {
    const mongoUri = customUri || process.env.MONGODB_URI || 'mongodb://localhost:27017/meu_tcc';
    const conn = await mongoose.connect(mongoUri);
    console.log(`[MongoDB] Conectado com sucesso: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB] Erro ao conectar ao banco de dados: ${error.message}`);
    if (process.env.NODE_ENV !== 'test') {
      // Em produção/desenvolvimento, falha de conexão avisa no console
      console.warn('[MongoDB] Verifique se a variável MONGODB_URI está configurada corretamente no arquivo .env.');
    }
    throw error;
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('[MongoDB] Conexão encerrada com sucesso.');
  } catch (error) {
    console.error(`[MongoDB] Erro ao desconectar: ${error.message}`);
  }
};

module.exports = { connectDB, disconnectDB };
