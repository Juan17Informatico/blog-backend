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

app.use("/api/users", (req, res) => {
    res.send("User routes will be here");
});

app.use("/api/categories", (req, res) => {
    res.send("Category routes will be here");
});

app.use("/api/auth", (req, res) => {
    res.send("Auth routes will be here");
});


app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
