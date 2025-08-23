import "dotenv/config";
import app from "./app.js";
import sequelize from "./config/database.js";

const PORT = process.env.PORT || 8800;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexão com o banco de dados estabelecida com sucesso.");
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Não foi possível conectar ao banco de dados:", error);
  }
};

startServer();
