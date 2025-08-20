import express from "express";
import cors from "cors";
import morgan from "morgan";
import postRoutes from "./routes/postRoutes.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Rutas
app.use("/api/posts", postRoutes);

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
