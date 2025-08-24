import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from './routes/userRoutes.js';
import errorMiddleware from "./middlewares/errorMiddleware.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", authRoutes);
app.use('/api/users', userRoutes);

app.use(errorMiddleware);

export default app;
