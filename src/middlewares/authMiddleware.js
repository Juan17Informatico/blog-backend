import AuthService from "../services/authService.js";

export const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = await AuthService.verifyToken(token);
        req.user = decoded;

        next();
    } catch (err) {
        return res.status(401).json({ error: "Unauthorized" });
    }

}