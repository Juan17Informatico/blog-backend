import express from "express";
import cors from "cors";
import morgan from "morgan";
import postRoutes from "./routes/postRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import { errorHandler } from "./utils/errorHandler.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Rutas
app.use("/api/posts", postRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);

// Error handler middleware
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
