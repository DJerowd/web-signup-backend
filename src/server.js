import "dotenv/config";
import app from "./app.js";
import sequelize from "./config/database.js";

import User from "./models/User.js";

const PORT = process.env.PORT || 8800;

const startServer = async () => {
  try {
    await sequelize.sync();
    console.log("✅ Tabelas sincronizadas com o banco de dados.");
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Não foi possível conectar ao banco de dados:", error);
  }
};

startServer();
