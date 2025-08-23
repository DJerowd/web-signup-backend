import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api", (req, res) => {
  res.json({ message: "API está funcionando!" });
});
app.use("/api", authRoutes);
app.use(errorMiddleware);

export default app;
